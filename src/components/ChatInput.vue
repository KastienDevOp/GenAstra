<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTextareaAutosize } from '@vueuse/core'
import { useChats } from '../services/chat.ts'
import { showSystem } from '../services/appConfig.ts'
import { IconPlayerStopFilled, IconSend, IconWhirl } from '@tabler/icons-vue'

const { textarea, input: userInput } = useTextareaAutosize({ input: '' })
const { addSystemMessage, addUserMessage, abort, hasActiveChat, hasMessages, regenerateResponse } = useChats()

const isSystemMessage = ref(false)
const isInputValid = computed<boolean>(() => !!userInput.value.trim())
const isAiResponding = ref(false)
const flag = ref(true)

const onSubmit = () => {
  if (isAiResponding.value) {
    abort()
    isAiResponding.value = false
    return
  }

  if (isInputValid.value) {
    if (isSystemMessage.value) {
      addSystemMessage(userInput.value.trim())
    } else {
      addUserMessage(userInput.value.trim()).then(() => {
        isAiResponding.value = false
      })
    }
    userInput.value = ''
    if (!isSystemMessage.value) {
      isAiResponding.value = true
    }
  }
}

const shouldSubmit = ({ key, shiftKey }: KeyboardEvent): boolean => {
  return key === 'Enter' && !shiftKey
}

const onKeydown = (event: KeyboardEvent) => {
  if (shouldSubmit(event) && flag.value) {
    // Pressing enter while the ai is responding should not abort the request
    if (isAiResponding.value) {
      return
    }

    event.preventDefault()
    onSubmit()
  }
}

const handleCompositionStart = () => {
  flag.value = false
}

const handleCompositionEnd = () => {
  flag.value = true
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="flex px-2 flex-col sm:flex-row items-center">
      <div class="text-dark-roast dark:text-milky-latte space-x-2 text-sm font-medium mb-2" v-if="showSystem">
        <label>
          <input type="radio" :value="false" v-model="isSystemMessage">
          User
        </label>
        <label>
          <input type="radio" :value="true" v-model="isSystemMessage">
          System
        </label>
      </div>
      <div class="ml-auto" v-if="hasMessages">
        <button
          type="button"
          @click="regenerateResponse"
          class="rounded-lg text-brewed-coffee text-sm font-medium transition duration-200 ease-in-out hover:text-dark-mocha focus:outline-none focus:ring-4 focus:ring-brewed-coffee disabled:text-gray-400 disabled:opacity-50 dark:text-brewed-coffee dark:hover:text-dark-mocha dark:focus:ring-brewed-coffee dark:disabled:text-gray-600"
        >
          Regenerate response
        </button>
      </div>
    </div>
    <div class="relative">
      <textarea
        ref="textarea"
        v-model="userInput"
        class="block max-h-[500px] w-full resize-none rounded-xl border-none bg-light-latte-foam p-4 pl-4 pr-20 text-sm text-dark-roast focus:outline-none focus:ring-2 focus:ring-brewed-coffee dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:focus:ring-brewed-coffee sm:text-base"
        placeholder="Enter your prompt"
        @keydown="onKeydown"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      ></textarea>
      <button
        type="submit"
        :disabled="isInputValid == false && isAiResponding == false"
        class="group absolute bottom-2 right-2.5 flex size-10 items-center justify-center rounded-lg bg-brewed-coffee text-sm font-medium text-white transition duration-200 ease-in-out hover:bg-dark-mocha focus:outline-none focus:ring-4 focus:ring-brewed-coffee disabled:bg-gray-400 disabled:opacity-50 dark:bg-dark-chocolate dark:hover:bg-espresso dark:focus:ring-brewed-coffee dark:disabled:bg-gray-600 sm:text-base"
      >
        <IconPlayerStopFilled
          v-if="isAiResponding"
          class="absolute opacity-0 transition duration-200 ease-in-out group-hover:opacity-100"
          :size="20"
        />
        <IconWhirl
          class="absolute animate-spin opacity-50 transition duration-200 ease-in-out group-hover:opacity-0"
          v-if="isAiResponding"
          :size="20"
        />

        <IconSend v-else :size="20" />
      </button>
    </div>
  </form>
</template>
