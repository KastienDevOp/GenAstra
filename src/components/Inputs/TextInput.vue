<script setup lang="ts">
type Props = {
  id?: string
  label?: string
  type?: string
  placeholder?: string
  modelValue: string
  small?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'blur'): void
}>()
</script>

<template>
  <div>
    <label :for="id" class="mt-4 mb-2 block px-2 text-sm font-medium text-dark-roast dark:text-milky-latte" v-if="label">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
      :id="id"
      :type="type"
      :class="small ? 'text-xs' : 'text-sm'"
      class="block w-full rounded-lg text-dark-roast dark:text-milky-latte bg-light-latte-foam p-2.5 focus:outline-none focus:ring-2 focus:ring-brewed-coffee dark:bg-dark-mocha dark:placeholder-gray-300 dark:focus:ring-brewed-coffee"
      :placeholder="placeholder"
    />
  </div>
</template>
