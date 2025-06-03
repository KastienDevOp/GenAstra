import { db } from '../services/database';
import { qdrantService } from '../services/qdrant';

/**
 * Migrates all data from IndexedDB to Qdrant
 * @returns Promise<boolean> - True if migration was successful, false otherwise
 */
export async function migrateToQdrant(): Promise<boolean> {
  try {
    // Initialize Qdrant client
    const qdrantAvailable = await qdrantService.init();
    if (!qdrantAvailable) {
      console.error('Failed to connect to Qdrant. Please make sure it is running.');
      return false;
    }

    // Start migration
    console.log('Starting migration to Qdrant...');
    
    // Get all chats from IndexedDB
    const chats = await db.chats.toArray();
    console.log(`Migrating ${chats.length} chats...`);
    
    // Migrate chats
    for (const chat of chats) {
      try {
        await qdrantService.upsertChat(chat);
      } catch (error) {
        console.error(`Failed to migrate chat ${chat.id}:`, error);
      }
    }
    
    // Get all messages from IndexedDB
    const messages = await db.messages.toArray();
    console.log(`Migrating ${messages.length} messages...`);
    
    // Migrate messages
    for (const message of messages) {
      try {
        await qdrantService.upsertMessage(message);
      } catch (error) {
        console.error(`Failed to migrate message ${message.id}:`, error);
      }
    }
    
    console.log('Migration to Qdrant completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

/**
 * Checks if Qdrant is available
 * @returns Promise<boolean> - True if Qdrant is available, false otherwise
 */
export async function isQdrantAvailable(): Promise<boolean> {
  try {
    return await qdrantService.init();
  } catch (error) {
    console.error('Qdrant is not available:', error);
    return false;
  }
}

export default {
  migrateToQdrant,
  isQdrantAvailable,
};
