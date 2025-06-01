<script setup lang="ts">
import { currentModel, useConfig } from '../services/appConfig'
import { useTextareaAutosize } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import ModelSelector from './ModelSelector.vue'

const { setConfig, initializeConfig } = useConfig()
const { textarea } = useTextareaAutosize()
const configInput = ref('')
const defaultConfigInput = ref('')
import { IconWritingSign } from '@tabler/icons-vue'

onMounted(() => {
  initialize()
})

const initialize = () => {
  initializeConfig(currentModel.value).then(function (configs) {
    configInput.value = configs?.modelConfig?.systemPrompt ?? ''
    defaultConfigInput.value = configs?.defaultConfig?.systemPrompt ?? ''
  }).catch(function (error) {
    console.error('Failed to initialize system prompt:', error)
    // Set default values in case of error
    configInput.value = ''
    defaultConfigInput.value = ''
  })
}

const onSubmit = () => {
  const model = currentModel.value
  setConfig({
    model: 'default',
    systemPrompt: defaultConfigInput.value.trim(),
    createdAt: new Date(),
  })
  if (model) {
    setConfig({
      model: model,
      systemPrompt: configInput.value.trim(),
      createdAt: new Date(),
    })
  }
  alert('Saved !')
}

const shouldSubmit = ({ key, shiftKey }: KeyboardEvent): boolean => {
  return key === 'Enter' && !shiftKey
}

const onKeydown = (event: KeyboardEvent) => {
  if (shouldSubmit(event)) {
    event.preventDefault()
    onSubmit()
  }
}
</script>

<template>
  <aside class="flex flex-col gap-6">
    <div
      class="flex w-full flex-row items-center justify-center gap-4 rounded-b-xl bg-light-latte-foam px-4 py-2 dark:bg-dark-mocha"
    >
      <div class="mr-auto flex h-full items-center">
        <div>
          <span
            class="block h-full rounded border-none p-2 text-lg font-medium text-dark-roast dark:text-milky-latte"
          >
            System Prompts
          </span>
        </div>
      </div>
      <ModelSelector :disabled="false" @change="initialize" />
    </div>

    <div class="flex flex-col overflow-y-auto space-y-6 px-4">
      <!-- Custom Instructions Section -->
      <div class="rounded-xl bg-light-latte-foam p-6 shadow-sm dark:bg-dark-mocha">
        <h2 class="mb-4 text-lg font-semibold text-dark-roast dark:text-milky-latte">
          Custom Instructions
        </h2>
        <p class="mb-4 text-sm text-muted-cocoa dark:text-gray-300">
          What would you like the current model to know about you to provide better
          responses?
        </p>
        <form @submit.prevent="onSubmit">
          <textarea
            ref="textarea"
            v-model="configInput"
            class="block min-h-[150px] w-full resize-none rounded-lg border-none bg-cream p-4 text-sm text-dark-roast shadow-sm focus:outline-none focus:ring-2 focus:ring-brewed-coffee dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:focus:ring-brewed-coffee sm:text-base"
            @keydown="onKeydown"
          ></textarea>
        </form>
      </div>

      <!-- Default Instructions Section -->
      <div class="rounded-xl bg-light-latte-foam p-6 shadow-sm dark:bg-dark-mocha">
        <h2 class="mb-4 text-lg font-semibold text-dark-roast dark:text-milky-latte">
          Default Instructions
        </h2>
        <p class="mb-4 text-sm text-muted-cocoa dark:text-gray-300">
          What would you like all models to know about you to provide better responses?
          This prompt will be applied for all models by default even if you configure
          custom prompt for a model.
        </p>
        <form @submit.prevent="onSubmit">
          <textarea
            ref="textarea"
            v-model="defaultConfigInput"
            class="block min-h-[150px] w-full resize-none rounded-lg border-none bg-cream p-4 text-sm text-dark-roast shadow-sm focus:outline-none focus:ring-2 focus:ring-brewed-coffee dark:bg-dark-mocha dark:text-milky-latte dark:placeholder-gray-300 dark:focus:ring-brewed-coffee sm:text-base"
          ></textarea>
        </form>
      </div>

      <div>
        <button
          type="button"
          @click="onSubmit"
          class="inline-flex items-center gap-2 rounded-lg bg-brewed-coffee px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-dark-mocha focus:outline-none focus:ring-2 focus:ring-brewed-coffee focus:ring-offset-2 dark:bg-dark-chocolate dark:hover:bg-espresso dark:focus:ring-offset-dark-roast"
        >
          <IconWritingSign class="h-5 w-5" />
          Save Changes
        </button>
      </div>
    </div>
  </aside>
</template>
