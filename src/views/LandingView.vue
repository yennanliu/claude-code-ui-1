<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-[#334155]">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-[#f1f5f9] mb-4">
          Claude Code Session Visualizer
        </h1>
        <p class="text-lg text-gray-600 dark:text-[#cbd5e1]">
          Explore and analyze your Claude Code sessions in an intuitive interface
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-6 mb-12">
        <div class="bg-white dark:bg-[#1e293b] rounded-lg p-6 border border-gray-200 dark:border-[#334155]">
          <div class="text-sm font-medium text-gray-600 dark:text-[#cbd5e1]">Total Sessions</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-[#f1f5f9] mt-2">{{ sessions.length }}</div>
        </div>
        <div class="bg-white dark:bg-[#1e293b] rounded-lg p-6 border border-gray-200 dark:border-[#334155]">
          <div class="text-sm font-medium text-gray-600 dark:text-[#cbd5e1]">Total Messages</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-[#f1f5f9] mt-2">{{ totalMessages }}</div>
        </div>
        <div class="bg-white dark:bg-[#1e293b] rounded-lg p-6 border border-gray-200 dark:border-[#334155]">
          <div class="text-sm font-medium text-gray-600 dark:text-[#cbd5e1]">Active Projects</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-[#f1f5f9] mt-2">{{ activeProjects }}</div>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="grid grid-cols-2 gap-6 mb-12">
        <router-link
          to="/projects"
          class="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-center"
        >
          📁 Browse Projects
        </router-link>
        <router-link
          to="/stats"
          class="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-center"
        >
          📊 View Statistics
        </router-link>
      </div>

      <!-- Recent Sessions -->
      <div class="bg-white dark:bg-[#1e293b] rounded-lg border border-gray-200 dark:border-[#334155]">
        <div class="p-6 border-b border-gray-200 dark:border-[#334155]">
          <h2 class="text-xl font-bold text-gray-900 dark:text-[#f1f5f9]">Recent Sessions</h2>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-[#334155]">
          <div
            v-for="session in recentSessions"
            :key="session.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-[#334155] cursor-pointer transition-colors"
            @click="goToSession(session.id)"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-[#f1f5f9]">{{ session.name }}</p>
                <p class="text-sm text-gray-600 dark:text-[#cbd5e1] mt-1">{{ session.project || 'Uncategorized' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500 dark:text-[#94a3b8]">{{ formatDate(session.date) }}</p>
                <p class="text-xs text-gray-500 dark:text-[#94a3b8]">{{ session.messageCount || 0 }} messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../composables/useSession.js'

const router = useRouter()
const { sessions, fetchSessions } = useSession()

onMounted(() => {
  fetchSessions()
})

const totalMessages = computed(() => {
  return sessions.value.reduce((sum, s) => sum + (s.messageCount || 0), 0)
})

const activeProjects = computed(() => {
  const projects = new Set(sessions.value.map(s => s.project || 'Uncategorized'))
  return projects.size
})

const recentSessions = computed(() => {
  return sessions.value.slice(0, 5)
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const goToSession = (sessionId) => {
  router.push(`/sessions/${sessionId}`)
}
</script>
