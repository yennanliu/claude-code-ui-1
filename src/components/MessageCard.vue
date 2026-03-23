<template>
  <div
    :class="[
      'rounded-lg p-4 border',
      isUser ? 'bg-blue-50 border-blue-200 ml-12' : 'bg-gray-50 border-gray-200 mr-12'
    ]"
  >
    <!-- Header with role and timestamp -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span
          :class="[
            'px-2 py-1 rounded text-xs font-semibold',
            isUser ? 'bg-blue-200 text-blue-900' : 'bg-gray-200 text-gray-900'
          ]"
        >
          {{ message.type }}
        </span>
        <span class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</span>
      </div>
      <div v-if="message.inputTokens || message.outputTokens" class="text-xs text-gray-600">
        <span v-if="message.inputTokens">{{ message.inputTokens }} in</span>
        <span v-if="message.outputTokens" class="ml-1">{{ message.outputTokens }} out</span>
      </div>
    </div>

    <!-- Message content -->
    <div class="text-sm text-gray-900 whitespace-pre-wrap break-words">
      {{ truncateContent(message.content) }}
    </div>

    <!-- Tool info if present -->
    <div v-if="message.toolName" class="mt-3 pt-3 border-t border-gray-300">
      <p class="text-xs font-semibold text-gray-600">Tool: {{ message.toolName }}</p>
      <div v-if="message.toolInput" class="mt-1 text-xs text-gray-600 bg-white p-2 rounded border border-gray-300 overflow-x-auto">
        <pre>{{ JSON.stringify(message.toolInput, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const isUser = computed(() => props.message.type === 'user')

const formatTime = (timestamp) => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp).toLocaleTimeString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const truncateContent = (content) => {
  if (!content) return ''
  const maxLength = 500
  if (content.length > maxLength) {
    return content.substring(0, maxLength) + '...'
  }
  return content
}
</script>
