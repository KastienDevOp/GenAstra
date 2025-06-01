<script setup lang="ts">
import {
  IconMoon,
  IconPlus,
  IconSettings2,
  IconSun,
  IconTrashX,
  IconUserCircle,
  IconMessageCode,
} from '@tabler/icons-vue'

import {
  isDarkMode,
  isSystemPromptOpen,
  toggleSettingsPanel,
  toggleSystemPromptPanel,
} from '../services/appConfig.ts'
import { useChats } from '../services/chat.ts'
import { ref } from 'vue'

const { sortedChats, activeChat, switchChat, deleteChat, startNewChat } =
  useChats()

const chatToDelete = ref<number | null>(null)

const onNewChat = () => {
  checkSystemPromptPanel()
  return startNewChat('New chat')
}

const onSwitchChat = (chatId: number) => {
  checkSystemPromptPanel()
  return switchChat(chatId)
}

const checkSystemPromptPanel = () => {
  isSystemPromptOpen.value = false
}

const confirmDelete = (chatId: number) => {
  chatToDelete.value = chatId
}

const cancelDelete = () => {
  chatToDelete.value = null
}

const performDelete = () => {
  if (chatToDelete.value !== null) {
    deleteChat(chatToDelete.value)
    chatToDelete.value = null
  }
}

const lang = navigator.language
</script>

<template>
  <aside class="flex">
    <div
      class="flex h-screen w-60 flex-col overflow-y-auto border-r border-light-coffee-stain bg-cream pt-2 dark:border-dark-chocolate dark:bg-dark-roast sm:h-screen sm:w-64"
    >
      <div class="mx-2 mb-2">
        <button
          @click="onNewChat"
          class="flex w-full items-center justify-center gap-x-2 rounded-md bg-brewed-coffee px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-dark-mocha focus:outline-none focus:ring-2 focus:ring-mocha focus:ring-offset-2 dark:bg-dark-chocolate dark:hover:bg-espresso dark:focus:ring-offset-dark-roast"
        >
          <IconPlus class="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>

      <div
        class="h-full space-y-4 overflow-y-auto border-b border-light-coffee-stain px-2 py-4 dark:border-dark-chocolate"
      >
        <div v-for="chat in sortedChats" :key="chat.id" class="relative">
          <button
            @click="onSwitchChat(chat.id!)"
            :class="{
              'bg-light-latte-foam dark:bg-dark-mocha': activeChat?.id == chat.id,
            }"
            class="flex w-full flex-col gap-y-1 rounded-md px-3 py-2 text-left transition-colors duration-100 ease-in-out hover:bg-light-latte-foam focus:outline-none focus:ring-2 focus:ring-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:hover:bg-dark-chocolate dark:focus:ring-mocha"
          >
            <span class="text-sm font-medium leading-none text-dark-roast dark:text-milky-latte">
              {{ chat.name }}
            </span>
            <span class="text-xs leading-none text-muted-cocoa dark:text-gray-300">
              {{ chat.model }}
            </span>
            <span class="text-xs leading-none text-muted-cocoa dark:text-gray-300">
              {{
                chat.createdAt.toLocaleDateString(lang, {
                  day: '2-digit',
                  month: 'short',
                  weekday: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              }}
            </span>
          </button>
          <button
            @click="confirmDelete(chat.id!)"
            class="absolute right-2 top-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            title="Delete chat"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="mt-auto w-full space-y-2 px-2 py-4">
        <button
          @click="isDarkMode = !isDarkMode"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-dark-roast transition-colors duration-100 ease-in-out hover:bg-light-latte-foam focus:outline-none focus:ring-2 focus:ring-mocha dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:hover:bg-dark-chocolate dark:focus:ring-mocha"
        >
          <IconSun v-if="isDarkMode" class="size-4 opacity-50 group-hover:opacity-80" />
          <IconMoon v-else class="size-4 opacity-50 group-hover:opacity-80" />

          Toggle dark mode
        </button>
        <button
          v-if="false"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-dark-roast transition-colors duration-100 ease-in-out hover:bg-light-latte-foam focus:outline-none focus:ring-2 focus:ring-mocha dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:hover:bg-dark-chocolate dark:focus:ring-mocha"
        >
          <IconUserCircle class="size-4 opacity-50 group-hover:opacity-80" />
          User
        </button>
        <button
          @click="toggleSystemPromptPanel"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-dark-roast transition-colors duration-100 ease-in-out hover:bg-light-latte-foam focus:outline-none focus:ring-2 focus:ring-mocha dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:hover:bg-dark-chocolate dark:focus:ring-mocha"
        >
          <IconMessageCode class="size-4 opacity-50 group-hover:opacity-80" />

          System prompt
        </button>
        <button
          @click="toggleSettingsPanel"
          class="group flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-left text-sm font-medium text-dark-roast transition-colors duration-100 ease-in-out hover:bg-light-latte-foam focus:outline-none focus:ring-2 focus:ring-mocha dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:hover:bg-dark-chocolate dark:focus:ring-mocha"
        >
          <IconSettings2 class="size-4 opacity-50 group-hover:opacity-80" />

          Settings
        </button>
      </div>
    </div>

    <!-- Delete confirmation dialog -->
    <div
      v-if="chatToDelete !== null"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white dark:bg-dark-roast rounded-lg p-6 max-w-sm w-full">
        <h2 class="text-lg font-semibold text-dark-roast dark:text-milky-latte mb-4">
          Confirm Deletion
        </h2>
        <p class="text-sm text-dark-roast dark:text-milky-latte mb-6">
          Are you sure you want to delete this chat? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-dark-roast dark:text-milky-latte rounded"
          >
            Cancel
          </button>
          <button
            @click="performDelete"
            class="px-4 py-2 bg-red-500 dark:bg-red-700 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
