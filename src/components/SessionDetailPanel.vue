<template>
  <div class="border-b border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1e293b]">
    <button
      @click="isExpanded = !isExpanded"
      class="w-full px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#334155] transition flex items-center justify-between"
    >
      <div class="flex items-center gap-3 flex-1">
        <span class="text-xl text-gray-900 dark:text-[#f1f5f9]">{{ isExpanded ? '▼' : '▶' }}</span>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">Session Details</h3>
      </div>
      <span class="text-xs text-gray-500 dark:text-[#94a3b8]">{{ messages.length }} messages</span>
    </button>

    <!-- Expanded Content -->
    <div v-if="isExpanded" class="px-6 py-4 space-y-4 border-t border-gray-100 dark:border-[#334155] bg-gray-50 dark:bg-[#334155]">
      <!-- Session Info Section -->
      <div class="space-y-2">
        <h4 class="text-xs font-semibold text-gray-700 dark:text-[#cbd5e1] uppercase">Session Info</h4>
        <div class="space-y-1 text-xs text-gray-600 dark:text-[#cbd5e1]">
          <div class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Session ID:</span>
            <div class="flex items-center gap-2">
              <code class="bg-white dark:bg-[#1e293b] px-2 py-1 rounded border border-gray-200 dark:border-[#334155] font-mono text-gray-700 dark:text-[#cbd5e1]">
                {{ sessionId.substring(0, 12) }}...
              </code>
              <button
                @click="copySessionId"
                class="text-gray-400 dark:text-[#94a3b8] hover:text-gray-600 dark:hover:text-[#cbd5e1] transition text-lg"
                title="Copy full session ID"
              >
                📋
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Project:</span>
            <span class="text-gray-700 dark:text-[#cbd5e1]">{{ sessionData.project || 'N/A' }}</span>
          </div>
          <div v-if="sessionData.firstTimestamp" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Started:</span>
            <span class="text-gray-700 dark:text-[#cbd5e1]">{{ formatDate(sessionData.firstTimestamp) }}</span>
          </div>
          <div v-if="sessionData.lastTimestamp" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Ended:</span>
            <span class="text-gray-700 dark:text-[#cbd5e1]">{{ formatDate(sessionData.lastTimestamp) }}</span>
          </div>
          <div v-if="sessionData.duration" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Duration:</span>
            <span class="text-gray-700 dark:text-[#cbd5e1]">{{ formatDuration(sessionData.duration) }}</span>
          </div>
        </div>
      </div>

      <!-- Context Section -->
      <div class="space-y-2 pt-2">
        <h4 class="text-xs font-semibold text-gray-700 dark:text-[#cbd5e1] uppercase">Context</h4>
        <div class="space-y-1 text-xs text-gray-600 dark:text-[#cbd5e1]">
          <div v-if="sessionData.gitBranch" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">🔀 Git Branch:</span>
            <span class="text-gray-700 dark:text-[#cbd5e1] font-mono">{{ sessionData.gitBranch }}</span>
          </div>
          <div v-if="sessionData.cwd" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">📁 Working Dir:</span>
            <span class="text-gray-700 dark:text-[#cbd5e1] font-mono truncate">{{ sessionData.cwd }}</span>
          </div>
          <div v-if="sessionData.version" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Version:</span>
            <span class="text-gray-700 dark:text-[#cbd5e1] font-mono">{{ sessionData.version }}</span>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="space-y-2 pt-2">
        <h4 class="text-xs font-semibold text-gray-700 dark:text-[#cbd5e1] uppercase">Statistics</h4>
        <div class="space-y-1 text-xs text-gray-600 dark:text-[#cbd5e1]">
          <div class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Messages:</span>
            <div class="flex gap-3 text-gray-700 dark:text-[#cbd5e1]">
              <span>👤 {{ userMessages }}</span>
              <span>🤖 {{ assistantMessages }}</span>
              <span>🔧 {{ toolMessages }}</span>
            </div>
          </div>
          <div v-if="sessionData.models && sessionData.models.length > 0" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Models Used:</span>
            <div class="flex flex-wrap gap-1 justify-end">
              <span v-for="model in sessionData.models" :key="model" class="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-2 py-0.5 rounded">
                {{ formatModel(model) }}
              </span>
            </div>
          </div>
          <div v-if="totalTokens > 0" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-[#94a3b8]">Tokens:</span>
            <div class="flex gap-2 text-gray-700 dark:text-[#cbd5e1] flex-wrap justify-end">
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
