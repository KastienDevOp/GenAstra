import { QdrantClient } from '@qdrant/js-client-rest';
import { Chat, Message } from './database';

// Configuration for Qdrant
const QDRANT_URL = import.meta.env.VITE_QDRANT_URL || 'http://localhost:6333';
const CHAT_COLLECTION = 'chats';
const MESSAGE_COLLECTION = 'messages';

// Initialize Qdrant client
const qdrant = new QdrantClient({
  url: QDRANT_URL,
  // Add API key if required
  // apiKey: process.env.VITE_QDRANT_API_KEY,
});

// Initialize collections if they don't exist
async function initializeCollections() {
  try {
    console.log('Initializing Qdrant collections...');
    
    // Check if collections exist
    const collections = await qdrant.getCollections();
    console.log('Existing collections:', collections.collections.map(c => c.name));
    
    const collectionNames = collections.collections.map(c => c.name);

    // Create chats collection if it doesn't exist
    if (!collectionNames.includes(CHAT_COLLECTION)) {
      console.log(`Creating collection: ${CHAT_COLLECTION}`);
      await qdrant.createCollection(CHAT_COLLECTION, {
        // Make vectors optional since we might not always have them
        vectors: {
          size: 384,
          distance: 'Cosine',
          on_disk: true,
        },
        // Add HNSW index for better search performance
        hnsw_config: {
          payload_m: 16,
          m: 0,
        },
        // Add optimizers configuration
        optimizers_config: {
          default_segment_number: 2,
          indexing_threshold: 20000,
        },
      });
      console.log(`Created collection: ${CHAT_COLLECTION}`);
    } else {
      console.log(`Collection already exists: ${CHAT_COLLECTION}`);
    }

    // Create messages collection if it doesn't exist
    if (!collectionNames.includes(MESSAGE_COLLECTION)) {
      console.log(`Creating collection: ${MESSAGE_COLLECTION}`);
      await qdrant.createCollection(MESSAGE_COLLECTION, {
        // Make vectors optional since we might not always have them
        vectors: {
          size: 384,
          distance: 'Cosine',
          on_disk: true,
        },
        // Add HNSW index for better search performance
        hnsw_config: {
          payload_m: 16,
          m: 0,
        },
        // Add optimizers configuration
        optimizers_config: {
          default_segment_number: 2,
          indexing_threshold: 20000,
        },
      });
      console.log(`Created collection: ${MESSAGE_COLLECTION}`);
    } else {
      console.log(`Collection already exists: ${MESSAGE_COLLECTION}`);
    }
  } catch (error) {
    console.error('Failed to initialize Qdrant collections:', error);
    throw error;
  }
}

// Helper function to generate a dummy vector of the correct size
function generateDummyVector(size: number): number[] {
  return Array(size).fill(0);
}

// Chat operations
export const qdrantService = {
  // Initialize the service
  async init() {
    try {
      console.log('Initializing Qdrant service...');
      console.log('Qdrant URL:', QDRANT_URL);
      
      // Test connection first
      await qdrant.getCollections();
      console.log('Successfully connected to Qdrant');
      
      // Initialize collections
      await initializeCollections();
      console.log('Qdrant service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Qdrant service:', error);
      return false;
    }
  },

  // Add or update a chat
  async upsertChat(chat: Chat) {
    if (!chat.id) throw new Error('Chat ID is required');
    
    const point = {
      id: chat.id,
      // Generate a dummy vector for now
      // In production, replace this with actual embeddings:
      // vector: await generateEmbedding(chat.name + ' ' + chat.messages?.map(m => m.content).join(' ')),
      vector: generateDummyVector(384), // Match the vector size defined in collection
      payload: {
        name: chat.name,
        model: chat.model,
        createdAt: chat.createdAt.toISOString(),
        // Store the raw data for easy retrieval
        _data: JSON.stringify(chat),
      },
    };

    try {
      await qdrant.upsert(CHAT_COLLECTION, {
        wait: true,
        points: [point],
      });
      return chat.id;
    } catch (error) {
      console.error('Failed to upsert chat:', error);
      throw error;
    }
  },

  // Get a chat by ID
  async getChat(chatId: number): Promise<Chat | null> {
    const result = await qdrant.retrieve(CHAT_COLLECTION, {
      ids: [chatId],
      with_payload: true,
    });

    if (!result.length) return null;

    const chatData = result[0];
    return {
      id: chatData.id as number,
      name: (chatData.payload as any)?.name || '',
      model: (chatData.payload as any)?.model || '',
      createdAt: new Date((chatData.payload as any)?.createdAt || Date.now()),
    };
  },

  // Get all chats
  async getAllChats(): Promise<Chat[]> {
    const result = await qdrant.scroll(CHAT_COLLECTION, {
      limit: 100, // Adjust based on your needs
      with_payload: true,
    });


    return result.points.map((point: any) => ({
      id: point.id as number,
      name: (point.payload as any)?.name || '',
      model: (point.payload as any)?.model || '',
      createdAt: new Date((point.payload as any)?.createdAt || Date.now()),
    }));
  },

  // Delete a chat
  async deleteChat(chatId: number): Promise<boolean> {
    try {
      // Delete the chat
      await qdrant.delete(CHAT_COLLECTION, {
        points: [chatId],
      });

      // Delete all messages for this chat
      await qdrant.delete(MESSAGE_COLLECTION, {
        filter: {
          must: [
            {
              key: 'chatId',
              match: { value: chatId },
            },
          ],
        },
      });

      return true;
    } catch (error) {
      console.error(`Failed to delete chat ${chatId}:`, error);
      return false;
    }
  },

  // Add or update a message
  async upsertMessage(message: Message) {
    if (!message.id) throw new Error('Message ID is required');
    
    const point = {
      id: message.id,
      // Generate a dummy vector for now
      // In production, replace this with actual embeddings:
      // vector: await generateEmbedding(message.content),
      vector: generateDummyVector(384), // Match the vector size defined in collection
      payload: {
        chatId: message.chatId,
        role: message.role,
        content: message.content,
        meta: message.meta ? JSON.stringify(message.meta) : undefined,
        context: message.context,
        createdAt: message.createdAt.toISOString(),
        // Store the raw data for easy retrieval
        _data: JSON.stringify(message),
      },
    };

    try {
      await qdrant.upsert(MESSAGE_COLLECTION, {
        wait: true,
        points: [point],
      });
      return message.id;
    } catch (error) {
      console.error('Failed to upsert message:', error);
      throw error;
    }
  },

  // Get messages for a chat
  async getMessages(chatId: number): Promise<Message[]> {
    const result = await qdrant.scroll(MESSAGE_COLLECTION, {
      filter: {
        must: [
          {
            key: 'chatId',
            match: { value: chatId },
          },
        ],
      },
      limit: 1000, // Adjust based on your needs
      with_payload: true,
    });

    return result.points.map((point: any) => ({
      id: point.id as number,
      chatId: (point.payload as any)?.chatId,
      role: ((point.payload as any)?.role as 'user' | 'assistant' | 'system') || 'user',
      content: (point.payload as any)?.content || '',
      meta: (point.payload as any)?.meta ? JSON.parse((point.payload as any).meta) : undefined,
      context: (point.payload as any)?.context,
      createdAt: new Date((point.payload as any)?.createdAt || Date.now()),
    }));
  },

  // Delete a message
  async deleteMessage(messageId: number): Promise<boolean> {
    try {
      await qdrant.delete(MESSAGE_COLLECTION, {
        points: [messageId],
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete message ${messageId}:`, error);
      return false;
    }
  },

  // Search for similar messages (useful for semantic search)
  async searchSimilarMessages(
    query: string,
    chatId?: number,
    limit: number = 5
  ): Promise<Message[]> {
    const filter: any = {};
    
    if (chatId) {
      filter.must = [
        {
          key: 'chatId',
          match: { value: chatId },
        },
      ];
    }

    // In a real implementation, you would generate embeddings for the query
    // For now, we'll just search by text content
    const result = await qdrant.scroll(MESSAGE_COLLECTION, {
      filter,
      limit,
      with_payload: true,
    });

    return result.points
      .filter((point: any) => 
        (point.payload as any)?.content && 
        (point.payload as any).content.toLowerCase().includes(query.toLowerCase())
      )
      .map((point: any) => ({
        id: point.id as number,
        chatId: (point.payload as any)?.chatId,
        role: ((point.payload as any)?.role as 'user' | 'assistant' | 'system') || 'user',
        content: (point.payload as any)?.content || '',
        meta: (point.payload as any)?.meta ? JSON.parse((point.payload as any).meta) : undefined,
        context: (point.payload as any)?.context,
        createdAt: new Date((point.payload as any)?.createdAt || Date.now()),
      }));
  },

  // Clear all data from Qdrant
  async clearAllData() {
    try {
      // Delete both collections
      console.log('Clearing all Qdrant data...');
      await Promise.all([
        qdrant.deleteCollection(CHAT_COLLECTION).catch(e => 
          console.warn('Could not delete chat collection:', e.message)
        ),
        qdrant.deleteCollection(MESSAGE_COLLECTION).catch(e => 
          console.warn('Could not delete message collection:', e.message)
        )
      ]);
      
      // Recreate the collections
      console.log('Recreating Qdrant collections...');
      await initializeCollections();
      console.log('Successfully recreated Qdrant collections');
      return true;
    } catch (error) {
      console.error('Failed to clear Qdrant data:', error);
      return false;
    }
  },
};

export default qdrantService;
