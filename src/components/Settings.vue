<script setup lang="ts">
import { IconFileExport, IconUpload, IconLayoutSidebarRightCollapse, IconTrashX } from '@tabler/icons-vue'
import ToggleInput from './Inputs/ToggleInput.vue'
import TextInput from './Inputs/TextInput.vue'
import ExportButton from './History/ExportButton.vue'
import ImportButton from './History/ImportButton.vue'
import QdrantSettings from './settings/QdrantSettings.vue'
import {
  baseUrl,
  historyMessageLength,
  enableMarkdown,
  showSystem,
  toggleSettingsPanel,
} from '../services/appConfig.ts'
import { useChats } from '../services/chat.ts'

const { wipeDatabase } =
  useChats()

const confirmWipe = () => {
  if (confirm('Delete all chat history?')) {
    wipeDatabase()
  }
}
</script>

<template>
  <aside>
    <div
      class="relative h-screen w-60 flex flex-col overflow-y-auto border-l border-light-coffee-stain bg-cream py-4 dark:border-dark-chocolate dark:bg-dark-roast sm:w-64"
    >
      <div class="mb-4 flex items-center gap-x-2 px-2 text-dark-roast dark:text-milky-latte">
        <button
          @click="toggleSettingsPanel()"
          class="inline-flex rounded-lg p-1 hover:bg-light-latte-foam hover:dark:bg-dark-mocha"
        >
          <IconLayoutSidebarRightCollapse class="h-6 w-6" />

          <span class="sr-only">Close settings sidebar</span>
        </button>
        <h2 class="text-lg font-medium">Settings</h2>
      </div>

      <!-- More Settings -->
      <div
        class="mb-4 border-t border-light-coffee-stain px-2 py-4 text-dark-roast dark:border-dark-chocolate dark:text-milky-latte"
      >
        <div class="space-y-4">
          <div>
            <ToggleInput label="Enable Markdown" v-model="enableMarkdown" />
            <ToggleInput label="Show System messages" v-model="showSystem" />
          </div>
          
          <!-- Qdrant Vector Database Settings -->
          <QdrantSettings />
        </div>

        <div>
          <label for="chat-history-length" class="mb-2 mt-4 block px-2 text-sm font-medium">
            Conversation History Size
          </label>
          <input
            type="number"
            min="0"
            max="100"
            id="chat-history-length"
            v-model="historyMessageLength"
            class="block w-full rounded-lg bg-light-latte-foam p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brewed-coffee dark:bg-dark-mocha dark:placeholder-gray-300 dark:focus:ring-brewed-coffee"
            placeholder="2048"
          />
        </div>

        <div v-if="false">
          <div>
            <label for="max-tokens" class="mb-2 mt-4 block px-2 text-sm font-medium">
              Max tokens
            </label>
            <input
              type="number"
              disabled
              id="max-tokens"
              class="block w-full rounded-lg bg-light-latte-foam p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brewed-coffee dark:bg-dark-mocha dark:placeholder-gray-300 dark:focus:ring-brewed-coffee"
              placeholder="2048"
            />
          </div>

          <div>
            <label for="temperature" class="mb-2 mt-4 block px-2 text-sm font-medium">
              Temperature
            </label>
            <input
              type="number"
              disabled
              id="temperature"
              class="block w-full rounded-lg bg-light-latte-foam p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brewed-coffee dark:bg-dark-mocha dark:placeholder-gray-300 dark:focus:ring-brewed-coffee"
              placeholder="0.7"
            />
          </div>

          <div>
            <label for="top-p" class="mb-2 mt-4 block px-2 text-sm font-medium">
              Top P
            </label>
            <input
              type="number"
              disabled
              id="top-p"
              class="block w-full rounded-lg bg-light-latte-foam p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brewed-coffee dark:bg-dark-mocha dark:placeholder-gray-300 dark:focus:ring-brewed-coffee"
              placeholder="1"
            />
          </div>
        </div>
      </div>

      <div
        class="mt-auto px-2 space-y-2 text-dark-roast dark:text-milky-latte"
      >
        <ImportButton
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-dark-roast transition-colors duration-100 ease-in-out hover:bg-light-latte-foam focus:outline-none focus:ring-2 focus:ring-mocha dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:hover:bg-dark-chocolate dark:focus:ring-mocha"
        >
          <IconUpload class="size-4 opacity-50 group-hover:opacity-80" />

          Import chats
        </ImportButton>
        <ExportButton
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-dark-roast transition-colors duration-100 ease-in-out hover:bg-light-latte-foam focus:outline-none focus:ring-2 focus:ring-mocha dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:hover:bg-dark-chocolate dark:focus:ring-mocha"
        >
          <IconFileExport class="size-4 opacity-50 group-hover:opacity-80" />

          Export chats
        </ExportButton>
        <button
          @click="confirmWipe"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-dark-roast transition-colors duration-100 ease-in-out hover:bg-light-latte-foam focus:outline-none focus:ring-2 focus:ring-mocha dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:hover:bg-dark-chocolate dark:focus:ring-mocha"
        >
          <IconTrashX class="size-4 opacity-50 group-hover:opacity-80" />

          Delete all chats
        </button>
      </div>
    </div>
  </aside>
</template>
