<template>
  <div class="space-y-4 p-4">
    <h2 class="text-lg font-semibold">Vector Database (Qdrant)</h2>
    
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span>Qdrant Status:</span>
        <span :class="{
          'text-green-500': qdrantAvailable,
          'text-red-500': !qdrantAvailable && !loading,
          'text-yellow-500': loading
        }">
          {{ statusText }}
        </span>
      </div>
      
      <div v-if="!qdrantAvailable && !loading" class="text-sm text-gray-500">
        Make sure Qdrant is running at {{ qdrantUrl }}
      </div>
      
      <div v-if="migrationStatus" class="text-sm" :class="{
        'text-green-500': migrationStatus.success,
        'text-red-500': !migrationStatus.success
      }">
        {{ migrationStatus.message }}
      </div>
      
      <div class="flex space-x-2 pt-2">
        <button
          @click="checkQdrantStatus"
          :disabled="loading"
          class="px-3 py-1.5 text-sm rounded-md"
          :class="{
            'bg-blue-500 text-white hover:bg-blue-600': !loading,
            'bg-gray-300 text-gray-500 cursor-not-allowed': loading
          }"
        >
          Check Status
        </button>
        
        <button
          @click="startMigration"
          :disabled="!qdrantAvailable || loading"
          class="px-3 py-1.5 text-sm rounded-md"
          :class="{
            'bg-green-500 text-white hover:bg-green-600': qdrantAvailable && !loading,
            'bg-gray-300 text-gray-500 cursor-not-allowed': !qdrantAvailable || loading
          }"
        >
          Migrate to Qdrant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { migrateToQdrant, isQdrantAvailable } from '../../utils/migrateToQdrant';

const qdrantAvailable = ref<boolean | null>(null);
const loading = ref(false);
const qdrantUrl = import.meta.env.VITE_QDRANT_URL || 'http://localhost:6333';

interface MigrationStatus {
  success: boolean;
  message: string;
}

const migrationStatus = ref<MigrationStatus | null>(null);

const statusText = computed(() => {
  if (loading.value) return 'Checking...';
  return qdrantAvailable.value ? 'Connected' : 'Not Connected';
});

async function checkQdrantStatus() {
  loading.value = true;
  try {
    qdrantAvailable.value = await isQdrantAvailable();
    migrationStatus.value = null;
  } catch (error) {
    console.error('Failed to check Qdrant status:', error);
    qdrantAvailable.value = false;
  } finally {
    loading.value = false;
  }
}

async function startMigration() {
  if (!qdrantAvailable.value) return;
  
  loading.value = true;
  migrationStatus.value = null;
  
  try {
    const success = await migrateToQdrant();
    migrationStatus.value = {
      success,
      message: success 
        ? 'Migration completed successfully!'
        : 'Migration failed. Check console for details.'
    };
  } catch (error) {
    console.error('Migration error:', error);
    migrationStatus.value = {
      success: false,
      message: 'Migration error. Check console for details.'
    };
  } finally {
    loading.value = false;
  }
}

// Check status when component mounts
onMounted(() => {
  checkQdrantStatus();
});
</script>
