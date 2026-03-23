<template>
  <div
    :class="[
      'rounded-lg border overflow-hidden',
      typeClass,
      selectedSession === message.uuid ? 'ring-2 ring-indigo-500' : ''
    ]"
  >
    <!-- Header with role, model, and timestamp -->
    <div :class="['px-4 py-3 flex items-center justify-between', headerBgClass]">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span :class="['px-2 py-1 rounded text-xs font-semibold whitespace-nowrap', typeBadgeClass]">
          {{ message.type }}
        </span>
        <span v-if="message.model" class="px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-700">
          🤖 {{ formatModel(message.model) }}
        </span>
        <span v-if="message.gitBranch" class="px-2 py-1 rounded text-xs bg-green-100 text-green-700 whitespace-nowrap">
          🔀 {{ message.gitBranch }}
        </span>
        <span class="text-xs text-gray-500 whitespace-nowrap">{{ formatTime(message.timestamp) }}</span>
      </div>
      <div class="text-xs text-gray-600 whitespace-nowrap ml-2">
        <span v-if="message.tokens?.input">{{ message.tokens.input }} in</span>
        <span v-else-if="message.inputTokens">{{ message.inputTokens }} in</span>
        <span v-if="message.tokens?.output" class="ml-1">{{ message.tokens.output }} out</span>
        <span v-else-if="message.outputTokens" class="ml-1">{{ message.outputTokens }} out</span>
      </div>
    </div>

    <!-- Message content -->
    <div class="px-4 py-3">
      <div class="text-sm text-gray-900 whitespace-pre-wrap break-words">
        <template v-if="shouldTruncate && !isExpanded">
          {{ truncateContent(message.content) }}
          <button
            @click="isExpanded = true"
            class="text-indigo-600 hover:text-indigo-700 font-semibold ml-1"
          >
            Show more
          </button>
        </template>
        <template v-else>
          {{ message.content }}
        </template>
        <button
          v-if="shouldTruncate && isExpanded"
          @click="isExpanded = false"
          class="text-indigo-600 hover:text-indigo-700 font-semibold ml-1"
        >
          Show less
        </button>
      </div>
    </div>

    <!-- Token breakdown (if cache tokens present) -->
    <div
      v-if="message.tokens?.cacheRead || message.tokens?.cacheCreation"
      class="px-4 py-2 text-xs text-gray-600 bg-yellow-50 border-t border-yellow-200"
    >
      <span v-if="message.tokens?.cacheRead">⚡ {{ message.tokens.cacheRead }} cache read</span>
      <span v-if="message.tokens?.cacheCreation" class="ml-2">✨ {{ message.tokens.cacheCreation }} cache created</span>
    </div>

    <!-- Tool info if present -->
    <div v-if="message.toolName" class="px-4 py-3 border-t border-gray-300 bg-gray-50">
      <p class="text-xs font-semibold text-gray-600 mb-2">🔧 Tool: {{ message.toolName }}</p>
      <div v-if="message.toolInput" class="text-xs text-gray-600 bg-white p-2 rounded border border-gray-300 overflow-x-auto">
        <pre class="whitespace-pre-wrap break-words">{{ JSON.stringify(message.toolInput, null, 2) }}</pre>
      </div>
    </div>

    <!-- Additional metadata -->
    <div
      v-if="showMetadata && (message.cwd || message.version || message.parentUuid)"
      class="px-4 py-3 text-xs text-gray-600 bg-gray-50 border-t border-gray-200 space-y-1"
    >
      <div v-if="message.cwd">📁 {{ message.cwd }}</div>
      <div v-if="message.version">📌 v{{ message.version }}</div>
      <div v-if="message.uuid" class="font-mono break-all text-gray-500">ID: {{ message.uuid }}</div>
    </div>

    <!-- Toggle metadata button -->
    <button
      v-if="hasMetadata"
      @click="showMetadata = !showMetadata"
      class="w-full px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 border-t border-gray-200 transition"
    >
      {{ showMetadata ? '▲' : '▼' }} {{ showMetadata ? 'Hide' : 'Show' }} metadata
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  selectedSession: {
    type: String,
    default: null
  }
})

const isExpanded = ref(false)
const showMetadata = ref(false)

const isUser = computed(() => props.message.type === 'user')
const isAssistant = computed(() => props.message.type === 'assistant')

const shouldTruncate = computed(() => {
  if (!props.message.content) return false
  return props.message.content.length > 500
})

const hasMetadata = computed(() => {
  return props.message.cwd || props.message.version || props.message.uuid
})

const typeClass = computed(() => {
  if (isUser.value) return 'bg-blue-50 border-blue-200 ml-12 p-4'
  if (isAssistant.value) return 'bg-gray-50 border-gray-200 mr-12 p-4'
  if (props.message.type === 'tool_use') return 'bg-purple-50 border-purple-200 ml-8 p-4'
  if (props.message.type === 'tool_result') return 'bg-green-50 border-green-200 mr-8 p-4'
  return 'bg-yellow-50 border-yellow-200 p-4'
})

const headerBgClass = computed(() => {
  if (isUser.value) return 'bg-blue-100'
  if (isAssistant.value) return 'bg-gray-100'
  if (props.message.type === 'tool_use') return 'bg-purple-100'
  if (props.message.type === 'tool_result') return 'bg-green-100'
  return 'bg-yellow-100'
})

const typeBadgeClass = computed(() => {
  if (isUser.value) return 'bg-blue-200 text-blue-900'
  if (isAssistant.value) return 'bg-gray-200 text-gray-900'
  if (props.message.type === 'tool_use') return 'bg-purple-200 text-purple-900'
  if (props.message.type === 'tool_result') return 'bg-green-200 text-green-900'
  return 'bg-yellow-200 text-yellow-900'
})

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

const formatModel = (model) => {
  if (!model) return 'Unknown'
  if (model.includes('opus')) return 'Opus 4.5'
  if (model.includes('sonnet')) return 'Sonnet 4.5'
  if (model.includes('haiku')) return 'Haiku 4.5'
  return model
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
