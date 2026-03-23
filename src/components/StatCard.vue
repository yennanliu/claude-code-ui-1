<template>
  <div :class="['bg-white p-3 rounded border', borderColor]">
    <p class="text-xs text-gray-600">{{ label }}</p>
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
  gray: { border: 'border-gray-200', text: 'text-gray-900' },
  green: { border: 'border-green-200', text: 'text-green-700' },
  blue: { border: 'border-blue-200', text: 'text-blue-700' },
  amber: { border: 'border-amber-200', text: 'text-amber-700' }
}

const borderColor = computed(() => colorMap[props.color].border)
const textColor = computed(() => colorMap[props.color].text)
</script>
