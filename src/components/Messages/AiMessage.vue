<script setup lang="ts">
import { Message } from '../../services/database.ts'
import { enableMarkdown } from '../../services/appConfig.ts'
import Markdown from '../Markdown.ts'
import 'highlight.js/styles/github-dark.css'
import logo from '/logo.png'
import { computed } from 'vue'

type Props = {
  message: Message
}

const { message } = defineProps<Props>()
const thought = computed(() => {
  const end = message.content.indexOf('</think>')
  if (end != -1) {
    return [
      message.content.substring('<think>'.length, end),
      message.content.substring(end + '</think>'.length),
    ]
  } else {
    return [null, message.content]
  }
})
</script>

<template>
  <div class="flex rounded-xl bg-cream px-2 py-6 dark:bg-dark-roast sm:px-4">
    <img
      class="mr-2 flex size-10 aspect-square rounded-full border border-light-coffee-stain bg-white object-contain sm:mr-4"
      :src="logo"
      alt="Ollama"
    />

    <div class="flex max-w-3xl items-center rounded-xl">
      <code v-if="!enableMarkdown" class="whitespace-pre-line text-dark-roast dark:text-milky-latte">{{ message.content }}</code>
      <div
        v-else
        class="prose prose-base max-w-full dark:prose-invert prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-p:first:mt-0 prose-a:text-warm-coffee-brown prose-code:text-sm prose-code:text-dark-roast prose-pre:p-2 dark:prose-p:text-milky-latte dark:prose-code:text-milky-latte"
      >
        <details
          v-if="thought[0]"
          class="whitespace-pre-wrap rounded-md mb-4 border border-light-coffee-stain bg-cream p-4 text-sm leading-tight text-dark-roast dark:border-dark-chocolate dark:bg-espresso dark:text-milky-latte"
        >
          <summary>Thought</summary>
          {{ thought[0] }}
        </details>
        <Markdown :source="thought[1]" />
      </div>
    </div>
  </div>
</template>
