<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-[#f1f5f9]">Projects</h1>
      <p class="text-gray-600 dark:text-[#cbd5e1] mt-2">{{ groupedByProject.length }} projects, {{ sessions.length }} total sessions</p>
    </div>

    <!-- Projects Grid -->
    <div v-if="groupedByProject.length > 0" class="grid grid-cols-3 gap-6">
      <router-link
        v-for="group in groupedByProject"
        :key="group.project"
        :to="`/projects/${encodeURIComponent(group.project)}`"
        class="bg-white dark:bg-[#1e293b] rounded-lg border border-gray-200 dark:border-[#334155] p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500 transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-[#f1f5f9]">{{ group.project }}</h3>
          <span class="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full">
            {{ group.sessions.length }}
          </span>
        </div>
        <p class="text-sm text-gray-600 dark:text-[#cbd5e1] mb-4">
          {{ group.sessions.length }} {{ group.sessions.length === 1 ? 'session' : 'sessions' }}
        </p>
        <div class="text-xs text-gray-500 dark:text-[#94a3b8]">
          <p v-if="getLastActivity(group.sessions)">Last: {{ formatDate(getLastActivity(group.sessions).timestamp) }}</p>
        </div>
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 dark:text-[#94a3b8] mb-4">No projects found</p>
      <router-link
        to="/"
        class="text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Go to home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSession } from '../composables/useSession.js'

const { sessions, groupedByProject, fetchSessions } = useSession()

onMounted(() => {
  fetchSessions()
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getLastActivity = (sessionList) => {
  if (sessionList.length === 0) return null
  return sessionList.reduce((latest, session) => {
    const sessionTime = new Date(session.timestamp || 0).getTime()
    const latestTime = new Date(latest.timestamp || 0).getTime()
    return sessionTime > latestTime ? session : latest
  })
}
</script>
