import { Chat, Message, db } from './database';
import qdrantService, { qdrantService as qdrant } from './qdrant';

// Flag to enable/disable Qdrant (useful for debugging)
const USE_QDRANT = true;

// Track if Qdrant is available
let isQdrantAvailable = false;

// Initialize the database adapter
export async function initDbAdapter() {
  try {
    if (USE_QDRANT) {
      isQdrantAvailable = await qdrantService.init();
      console.log('Database adapter initialized with Qdrant:', isQdrantAvailable);
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize database adapter:', error);
    isQdrantAvailable = false;
    return false;
  }
}

// Chat operations
export const dbAdapter = {
  // Chat operations
  async addChat(chat: Chat): Promise<number> {
    // Always write to IndexedDB
    const id = await db.chats.add(chat);
    
    // If Qdrant is available, write there as well
    if (isQdrantAvailable) {
      try {
        await qdrant.upsertChat({ ...chat, id });
      } catch (error) {
        console.error('Failed to add chat to Qdrant:', error);
      }
    }
    
    return id;
  },

  async getChat(chatId: number): Promise<Chat | undefined> {
    // Try Qdrant first if available
    if (isQdrantAvailable) {
      try {
        const chat = await qdrant.getChat(chatId);
        if (chat) return chat;
      } catch (error) {
        console.error('Failed to get chat from Qdrant, falling back to IndexedDB:', error);
      }
    }
    
    // Fall back to IndexedDB
    return db.chats.get(chatId);
  },

  async getAllChats(): Promise<Chat[]> {
    // Try Qdrant first if available
    if (isQdrantAvailable) {
      try {
        return await qdrant.getAllChats();
      } catch (error) {
        console.error('Failed to get chats from Qdrant, falling back to IndexedDB:', error);
      }
    }
    
    // Fall back to IndexedDB
    return db.chats.toArray();
  },

  async updateChat(chatId: number, updates: Partial<Chat>): Promise<number> {
    // Update IndexedDB
    await db.chats.update(chatId, updates);
    
    // If Qdrant is available, update there as well
    if (isQdrantAvailable) {
      try {
        const chat = await db.chats.get(chatId);
        if (chat) {
          await qdrant.upsertChat({ ...chat, ...updates });
        }
      } catch (error) {
        console.error('Failed to update chat in Qdrant:', error);
      }
    }
    
    return chatId;
  },

  async deleteChat(chatId: number): Promise<void> {
    // Delete from IndexedDB
    await db.chats.delete(chatId);
    
    // If Qdrant is available, delete from there as well
    if (isQdrantAvailable) {
      try {
        await qdrant.deleteChat(chatId);
      } catch (error) {
        console.error('Failed to delete chat from Qdrant:', error);
      }
    }
    
    // Delete all messages for this chat
    await this.deleteMessagesOfChat(chatId);
  },

  // Message operations
  async addMessage(message: Message): Promise<number> {
    // Always write to IndexedDB
    const id = await db.messages.add(message);
    
    // If Qdrant is available, write there as well
    if (isQdrantAvailable) {
      try {
        await qdrant.upsertMessage({ ...message, id });
      } catch (error) {
        console.error('Failed to add message to Qdrant:', error);
      }
    }
    
    return id;
  },

  async getMessages(chatId: number): Promise<Message[]> {
    // Try Qdrant first if available
    if (isQdrantAvailable) {
      try {
        return await qdrant.getMessages(chatId);
      } catch (error) {
        console.error('Failed to get messages from Qdrant, falling back to IndexedDB:', error);
      }
    }
    
    // Fall back to IndexedDB
    return db.messages.where('chatId').equals(chatId).toArray();
  },

  async updateMessage(messageId: number, updates: Partial<Message>): Promise<number> {
    // Update IndexedDB
    await db.messages.update(messageId, updates);
    
    // If Qdrant is available, update there as well
    if (isQdrantAvailable) {
      try {
        const message = await db.messages.get(messageId);
        if (message) {
          await qdrant.upsertMessage({ ...message, ...updates });
        }
      } catch (error) {
        console.error('Failed to update message in Qdrant:', error);
      }
    }
    
    return messageId;
  },

  async deleteMessage(messageId: number): Promise<void> {
    // Delete from IndexedDB
    await db.messages.delete(messageId);
    
    // If Qdrant is available, delete from there as well
    if (isQdrantAvailable) {
      try {
        await qdrant.deleteMessage(messageId);
      } catch (error) {
        console.error('Failed to delete message from Qdrant:', error);
      }
    }
  },

  async deleteMessagesOfChat(chatId: number): Promise<void> {
    // Delete from IndexedDB
    await db.messages.where('chatId').equals(chatId).delete();
    
    // If Qdrant is available, delete from there as well
    if (isQdrantAvailable) {
      try {
        // Qdrant handles this in the deleteChat method
        // No need to do anything here as Qdrant will clean up messages
        // when the chat is deleted
      } catch (error) {
        console.error('Failed to delete messages from Qdrant:', error);
      }
    }
  },

  // Utility methods
  async clearAllData(): Promise<void> {
    // Clear IndexedDB
    await Promise.all([
      db.chats.clear(),
      db.messages.clear(),
    ]);
    
    // If Qdrant is available, clear collections
    if (isQdrantAvailable) {
      try {
        // Note: In a production app, you might want to be more selective
        // about what gets cleared. This is a simple implementation.
        await qdrant.clearAllData?.();
      } catch (error) {
        console.error('Failed to clear Qdrant data:', error);
      }
    }
  },

  // Migration utilities
  async migrateToQdrant(): Promise<void> {
    if (!isQdrantAvailable) {
      throw new Error('Qdrant is not available');
    }
    
    console.log('Starting migration to Qdrant...');
    
    // Migrate chats
    const chats = await db.chats.toArray();
    console.log(`Migrating ${chats.length} chats...`);
    
    for (const chat of chats) {
      try {
        await qdrant.upsertChat(chat);
      } catch (error) {
        console.error(`Failed to migrate chat ${chat.id}:`, error);
      }
    }
    
    // Migrate messages
    const messages = await db.messages.toArray();
    console.log(`Migrating ${messages.length} messages...`);
    
    for (const message of messages) {
      try {
        await qdrant.upsertMessage(message);
      } catch (error) {
        console.error(`Failed to migrate message ${message.id}:`, error);
      }
    }
    
    console.log('Migration to Qdrant completed');
  },
};

export default dbAdapter;
