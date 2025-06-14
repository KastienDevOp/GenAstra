<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import ChatInput from './components/ChatInput.vue'
import ChatMessages from './components/ChatMessages.vue'
import SystemPrompt from './components/SystemPrompt.vue'
import ModelSelector from './components/ModelSelector.vue'
import {
  currentModel,
  isDarkMode,
  isSettingsOpen,
  isSystemPromptOpen,
} from './services/appConfig.ts'
import { nextTick, onMounted, ref } from 'vue'
import { useAI } from './services/useAI.ts'
import { useChats } from './services/chat.ts'
import TextInput from './components/Inputs/TextInput.vue'
import Settings from './components/Settings.vue'

const { refreshModels, availableModels } = useAI()
const { activeChat, renameChat, switchModel, initialize } = useChats()
const isEditingChatName = ref(false)
const editedChatName = ref('')
const chatNameInput = ref()

const startEditing = () => {
  isEditingChatName.value = true
  editedChatName.value = activeChat.value?.name || ''
  nextTick(() => {
    if (!chatNameInput.value) return
    const input = chatNameInput.value.$el.querySelector('input')
    input.focus()
    input.select()
  })
}

const cancelEditing = () => {
  isEditingChatName.value = false
  editedChatName.value = ''
}

const confirmRename = () => {
  if (activeChat.value && editedChatName.value) {
    renameChat(editedChatName.value)
    isEditingChatName.value = false
  }
}

onMounted(() => {
  refreshModels().then(async () => {
    await initialize()
    await switchModel(currentModel.value ?? availableModels.value[0].name)
  })
})
</script>

<template>
  <div :class="{ dark: isDarkMode }">
    <main
      class="flex h-full w-full flex-1 flex-row items-stretch bg-cream dark:bg-dark-roast"
    >
      <Sidebar />

      <div class="mx-auto flex h-screen w-full flex-col">
        <div
          v-if="isSystemPromptOpen"
          class="mx-auto flex h-screen w-full max-w-7xl flex-col gap-4 px-4 pb-4"
        >
          <SystemPrompt />
        </div>

        <div
          v-if="!isSystemPromptOpen"
          class="mx-auto flex h-screen w-full max-w-7xl flex-col gap-4 px-4 pb-4"
        >
          <div
            class="flex w-full flex-row items-center justify-center gap-4 rounded-b-xl bg-light-latte-foam px-4 py-2 dark:bg-dark-mocha"
          >
            <div class="mr-auto flex h-full items-center" v-if="activeChat">
              <div>
                <div v-if="isEditingChatName">
                  <TextInput
                    id="chat-name"
                    v-model="editedChatName"
                    ref="chatNameInput"
                    @keyup.enter="confirmRename"
                    @keyup.esc="cancelEditing"
                    @blur="cancelEditing"
                  />
                </div>

                <button
                  type="button"
                  class="block h-full rounded border-none p-2 text-dark-roast decoration-gray-400 decoration-dashed outline-none hover:underline focus:ring-2 focus:ring-brewed-coffee dark:text-milky-latte dark:focus:ring-brewed-coffee"
                  v-else
                  @click.prevent="startEditing"
                >
                  {{ activeChat.name }}
                </button>
              </div>
            </div>

            <ModelSelector />
          </div>

          <ChatMessages />
          <ChatInput />
        </div>
      </div>

      <transition name="slide">
        <Settings v-if="isSettingsOpen" />
      </transition>
    </main>
  </div>
</template>
