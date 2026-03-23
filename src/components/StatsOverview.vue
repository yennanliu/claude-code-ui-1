<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1e293b]">
      <h2 class="text-lg font-bold text-gray-900 dark:text-[#f1f5f9]">Statistics</h2>
    </div>

    <!-- Stats Content -->
    <div class="flex-1 overflow-y-auto dark-scrollbar p-4 space-y-4">
      <!-- Overall Stats -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-[#cbd5e1]">Overall</h3>
        <StatCard label="Total Tokens" :value="formatNumber(stats.totalTokens)" />
        <StatCard label="Input Tokens" :value="formatNumber(stats.inputTokens)" />
        <StatCard label="Output Tokens" :value="formatNumber(stats.outputTokens)" />
        <StatCard label="Cache Read" :value="formatNumber(stats.cacheReadTokens)" color="green" />
        <StatCard label="Cache Created" :value="formatNumber(stats.cacheCreatedTokens)" color="blue" />
      </div>

      <!-- By Model -->
      <div class="space-y-3" v-if="stats.byModel && Object.keys(stats.byModel).length > 0">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-[#cbd5e1]">By Model</h3>
        <div v-for="(modelStats, model) in stats.byModel" :key="model" class="bg-white dark:bg-[#1e293b] p-3 rounded border border-gray-200 dark:border-[#334155]">
          <p class="text-xs font-medium text-gray-900 dark:text-[#f1f5f9] truncate">{{ model }}</p>
          <p class="text-xs text-gray-600 dark:text-[#cbd5e1] mt-1">{{ formatNumber(modelStats.total) }} tokens</p>
        </div>
      </div>

      <!-- Session Stats -->
      <div class="space-y-3" v-if="stats.sessions">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-[#cbd5e1]">Sessions</h3>
        <StatCard label="Total Sessions" :value="stats.sessions.total" />
        <StatCard label="Total Messages" :value="stats.sessions.totalMessages" />
        <StatCard label="Avg Messages/Session" :value="stats.sessions.avgMessages" />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatCard from './StatCard.vue'

defineProps({
  stats: {
    type: Object,
    default: () => ({})
  }
})

const formatNumber = (num) => {
  if (!num) return '0'
  return Number(num).toLocaleString('en-US')
}
</script>
