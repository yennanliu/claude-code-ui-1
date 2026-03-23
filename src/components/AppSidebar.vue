<template>
  <div class="flex flex-col h-full bg-white dark:bg-[#1e293b]">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-[#334155]">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-lg font-bold text-gray-900 dark:text-[#f1f5f9]">Claude Code</h1>
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <span v-if="isDark" class="text-lg">☀️</span>
          <span v-else class="text-lg">🌙</span>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-2">
        <router-link
          to="/projects"
          class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-[#cbd5e1] hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
          :class="{ 'bg-gray-100 dark:bg-[#334155] text-gray-900 dark:text-[#f1f5f9]': isActive('/projects') }"
        >
          📁 All Projects
        </router-link>
        <router-link
          to="/stats"
          class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-[#cbd5e1] hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
          :class="{ 'bg-gray-100 dark:bg-[#334155] text-gray-900 dark:text-[#f1f5f9]': isActive('/stats') }"
        >
          📊 Statistics
        </router-link>
      </nav>
    </div>

    <!-- Sessions List -->
    <div class="flex-1 overflow-y-auto">
      <SessionList
        :sessions="sessions"
        :selected-session="activeSessionId"
        @select="handleSessionSelect"
        @refresh="refreshSessions"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'
import { useSession } from '../composables/useSession.js'
import SessionList from './SessionList.vue'

const router = useRouter()
const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const { sessions, fetchSessions } = useSession()

const props = defineProps({
  activeSessionId: {
    type: String,
    default: null
  }
})

onMounted(() => {
  fetchSessions()
})

const refreshSessions = () => {
  fetchSessions()
}

const handleSessionSelect = (sessionId) => {
  // Navigate to the session detail page
  router.push(`/sessions/${sessionId}`)
}

const isActive = (path) => {
  return route.path.startsWith(path)
}
</script>
