<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-[#334155] p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-[#f1f5f9]">{{ projectId }}</h1>
      <p class="text-gray-600 dark:text-[#cbd5e1] mt-2">{{ projectSessions.length }} sessions</p>
    </div>

    <!-- Sessions List -->
    <div class="p-6">
      <div v-if="projectSessions.length > 0" class="space-y-4">
        <div
          v-for="session in projectSessions"
          :key="session.id"
          class="bg-white dark:bg-[#1e293b] rounded-lg border border-gray-200 dark:border-[#334155] p-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer"
          @click="goToSession(session.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 dark:text-[#f1f5f9]">{{ session.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-[#cbd5e1] mt-1">{{ session.messageCount || 0 }} messages</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 dark:text-[#94a3b8]">{{ formatDate(session.date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 dark:text-[#94a3b8] mb-4">No sessions found for this project</p>
        <router-link
          to="/projects"
          class="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Back to projects
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSession } from '../composables/useSession.js'

const router = useRouter()
const route = useRoute()
const { sessions, fetchSessions } = useSession()

const projectId = computed(() => {
  return decodeURIComponent(route.params.projectId || '')
})

const projectSessions = computed(() => {
  return sessions.value.filter(s => (s.project || 'Uncategorized') === projectId.value)
})

onMounted(() => {
  fetchSessions()
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
