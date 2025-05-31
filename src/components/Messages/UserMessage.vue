<script setup lang="ts">
import { Message } from '../../services/database.ts'
import { avatarUrl, enableMarkdown } from '../../services/appConfig.ts'
import Markdown from '../Markdown.ts'

type Props = {
  message: Message
}

const { message } = defineProps<Props>()
</script>

<template>
  <div class="flex flex-row px-2 py-4 sm:px-4">
    <img v-if="avatarUrl" class="mr-2 flex size-10 rounded-full sm:mr-4" :src="avatarUrl" />
    <div
      v-else
      class="mr-2 flex size-10 aspect-square items-center justify-center rounded-full bg-cream text-center text-2xl dark:bg-dark-roast sm:mr-4"
    >
      🧑
    </div>

    <div class="flex max-w-3xl items-center">
      <code v-if="!enableMarkdown" class="whitespace-pre-line text-dark-roast dark:text-milky-latte">
        {{ message.content }}
      </code>
      <div
        v-else
        class="prose prose-base max-w-full dark:prose-invert prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-p:text-dark-roast prose-p:first:mt-0 prose-a:text-warm-coffee-brown prose-code:text-sm prose-code:text-dark-roast prose-pre:p-2 dark:prose-p:text-milky-latte dark:prose-code:text-milky-latte"
      >
        <Markdown :source="message.content" />
      </div>
    </div>
  </div>
</template>
