<template>
  <div :class="['bg-white dark:bg-[#1e293b] p-3 rounded border', borderColor]">
    <p class="text-xs text-gray-600 dark:text-[#cbd5e1]">{{ label }}</p>
    <p :class="['text-lg font-bold mt-1', textColor]">{{ value }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: String,
  color: {
    type: String,
    default: 'gray'
  }
})

const colorMap = {
  gray: { border: 'border-gray-200 dark:border-[#334155]', text: 'text-gray-900 dark:text-[#f1f5f9]' },
  green: { border: 'border-green-200 dark:border-green-900', text: 'text-green-700 dark:text-green-200' },
  blue: { border: 'border-blue-200 dark:border-blue-900', text: 'text-blue-700 dark:text-blue-200' },
  amber: { border: 'border-amber-200 dark:border-amber-900', text: 'text-amber-700 dark:text-amber-200' }
}

const borderColor = computed(() => colorMap[props.color].border)
const textColor = computed(() => colorMap[props.color].text)
</script>
