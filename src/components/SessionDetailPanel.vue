<template>
  <div class="border-b border-gray-200 bg-white">
    <button
      @click="isExpanded = !isExpanded"
      class="w-full px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between"
    >
      <div class="flex items-center gap-3 flex-1">
        <span class="text-xl">{{ isExpanded ? '▼' : '▶' }}</span>
        <h3 class="text-sm font-semibold text-gray-900">Session Details</h3>
      </div>
      <span class="text-xs text-gray-500">{{ messages.length }} messages</span>
    </button>

    <!-- Expanded Content -->
    <div v-if="isExpanded" class="px-6 py-4 space-y-4 border-t border-gray-100 bg-gray-50">
      <!-- Session Info Section -->
      <div class="space-y-2">
        <h4 class="text-xs font-semibold text-gray-700 uppercase">Session Info</h4>
        <div class="space-y-1 text-xs text-gray-600">
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Session ID:</span>
            <div class="flex items-center gap-2">
              <code class="bg-white px-2 py-1 rounded border border-gray-200 font-mono text-gray-700">
                {{ sessionId.substring(0, 12) }}...
              </code>
              <button
                @click="copySessionId"
                class="text-gray-400 hover:text-gray-600 transition text-lg"
                title="Copy full session ID"
              >
                📋
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Project:</span>
            <span class="text-gray-700">{{ sessionData.project || 'N/A' }}</span>
          </div>
          <div v-if="sessionData.firstTimestamp" class="flex items-center justify-between">
            <span class="text-gray-500">Started:</span>
            <span class="text-gray-700">{{ formatDate(sessionData.firstTimestamp) }}</span>
          </div>
          <div v-if="sessionData.lastTimestamp" class="flex items-center justify-between">
            <span class="text-gray-500">Ended:</span>
            <span class="text-gray-700">{{ formatDate(sessionData.lastTimestamp) }}</span>
          </div>
          <div v-if="sessionData.duration" class="flex items-center justify-between">
            <span class="text-gray-500">Duration:</span>
            <span class="text-gray-700">{{ formatDuration(sessionData.duration) }}</span>
          </div>
        </div>
      </div>

      <!-- Context Section -->
      <div class="space-y-2 pt-2">
        <h4 class="text-xs font-semibold text-gray-700 uppercase">Context</h4>
        <div class="space-y-1 text-xs text-gray-600">
          <div v-if="sessionData.gitBranch" class="flex items-center justify-between">
            <span class="text-gray-500">🔀 Git Branch:</span>
            <span class="text-gray-700 font-mono">{{ sessionData.gitBranch }}</span>
          </div>
          <div v-if="sessionData.cwd" class="flex items-center justify-between">
            <span class="text-gray-500">📁 Working Dir:</span>
            <span class="text-gray-700 font-mono truncate">{{ sessionData.cwd }}</span>
          </div>
          <div v-if="sessionData.version" class="flex items-center justify-between">
            <span class="text-gray-500">Version:</span>
            <span class="text-gray-700 font-mono">{{ sessionData.version }}</span>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="space-y-2 pt-2">
        <h4 class="text-xs font-semibold text-gray-700 uppercase">Statistics</h4>
        <div class="space-y-1 text-xs text-gray-600">
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Messages:</span>
            <div class="flex gap-3 text-gray-700">
              <span>👤 {{ userMessages }}</span>
              <span>🤖 {{ assistantMessages }}</span>
              <span>🔧 {{ toolMessages }}</span>
            </div>
          </div>
          <div v-if="sessionData.models && sessionData.models.length > 0" class="flex items-center justify-between">
            <span class="text-gray-500">Models Used:</span>
            <div class="flex flex-wrap gap-1 justify-end">
              <span v-for="model in sessionData.models" :key="model" class="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                {{ formatModel(model) }}
              </span>
            </div>
          </div>
          <div v-if="totalTokens > 0" class="flex items-center justify-between">
            <span class="text-gray-500">Tokens:</span>
            <div class="flex gap-2 text-gray-700 flex-wrap justify-end">
              <span v-if="tokenBreakdown.input">💬 {{ formatNumber(tokenBreakdown.input) }} in</span>
              <span v-if="tokenBreakdown.output">📤 {{ formatNumber(tokenBreakdown.output) }} out</span>
              <span v-if="tokenBreakdown.cacheRead">⚡ {{ formatNumber(tokenBreakdown.cacheRead) }} cache</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  sessionId: String,
  sessionData: {
    type: Object,
    default: () => ({})
  },
  messages: {
    type: Array,
    default: () => []
  }
})

const isExpanded = ref(false)

const userMessages = computed(() => props.messages.filter(m => m.type === 'user').length)
const assistantMessages = computed(() => props.messages.filter(m => m.type === 'assistant').length)
const toolMessages = computed(() => props.messages.filter(m => m.type === 'tool_use').length)

const tokenBreakdown = computed(() => ({
  input: props.messages.reduce((sum, m) => sum + (m.tokens?.input || m.inputTokens || 0), 0),
  output: props.messages.reduce((sum, m) => sum + (m.tokens?.output || m.outputTokens || 0), 0),
  cacheRead: props.messages.reduce((sum, m) => sum + (m.tokens?.cacheRead || 0), 0),
  cacheCreation: props.messages.reduce((sum, m) => sum + (m.tokens?.cacheCreation || 0), 0)
}))

const totalTokens = computed(() => tokenBreakdown.value.input + tokenBreakdown.value.output)

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatDuration = (minutes) => {
  if (minutes === null) return 'N/A'
  if (minutes < 1) return '< 1 min'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatModel = (model) => {
  // Extract readable model name (e.g., "claude-haiku-4-5-20251001" → "Haiku 4.5")
  if (model.includes('opus')) return 'Opus'
  if (model.includes('sonnet')) return 'Sonnet'
  if (model.includes('haiku')) return 'Haiku'
  return model
}

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const copySessionId = async () => {
  try {
    await navigator.clipboard.writeText(props.sessionId)
    alert('Session ID copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
