<script setup lang="ts">
import { Message } from '../../services/database.ts'

type Props = {
  message: Message
}
const { message } = defineProps<Props>()
</script>

<template>
  <div class="mb-4 flex rounded-xl bg-cream px-2 py-6 dark:bg-dark-roast sm:px-4">
    <div
      class="mr-1 flex size-10 aspect-square items-center justify-center rounded-full bg-light-latte-foam text-center text-2xl dark:bg-espresso sm:mr-3"
    >
      🧠
    </div>

    <div class="flex max-w-3xl items-center">
      <pre
        class="whitespace-pre-wrap rounded-md border border-light-coffee-stain bg-cream p-4 text-sm leading-tight text-dark-roast dark:border-dark-chocolate dark:bg-espresso dark:text-milky-latte"
        >{{ message.content }}</pre
      >
    </div>
  </div>
</template>
