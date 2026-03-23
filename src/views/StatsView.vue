<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-[#f1f5f9]">Statistics</h1>
        <p class="text-gray-600 dark:text-[#cbd5e1] mt-2">Overview of your Claude Code sessions</p>
      </div>

      <!-- Stats Overview -->
      <div v-if="stats && Object.keys(stats).length > 0">
        <StatsOverview :stats="stats" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-[#94a3b8] mb-4">No statistics available yet</p>
        <router-link
          to="/projects"
          class="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Browse projects to get started
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStats } from '../composables/useStats.js'
import StatsOverview from '../components/StatsOverview.vue'

const { stats, fetchStats } = useStats()

onMounted(async () => {
  await fetchStats()
})
</script>
