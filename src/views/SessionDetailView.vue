<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6">
    <div v-if="messages.length > 0" class="max-w-4xl mx-auto">
      <!-- Session Header -->
      <div class="bg-white dark:bg-[#1e293b] rounded-lg border border-gray-200 dark:border-[#334155] p-6 mb-6">
        <SessionDetailPanel
          v-if="sessionData"
          :session-id="sessionId"
          :session-data="sessionData"
          :messages="messages"
        />
      </div>

      <!-- Message Filter -->
      <div class="bg-white dark:bg-[#1e293b] rounded-lg border border-gray-200 dark:border-[#334155] p-6 mb-6">
        <MessageFilter :messages="messages" @filter-change="handleFilter" />
      </div>

      <!-- Messages -->
      <div class="space-y-4">
        <MessageCard
          v-for="message in filteredMessages"
          :key="message.id"
          :message="message"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex items-center justify-center h-96">
      <div class="text-center">
        <p class="text-gray-500 dark:text-[#94a3b8] mb-4">No messages found for this session</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSession } from '../composables/useSession.js'
import SessionDetailPanel from '../components/SessionDetailPanel.vue'
import MessageFilter from '../components/MessageFilter.vue'
import MessageCard from '../components/MessageCard.vue'

const route = useRoute()
const { sessions, messages, fetchSessionMessages, fetchSessions } = useSession()

const sessionId = computed(() => {
  return route.params.sessionId || null
})

const sessionData = computed(() => {
  return sessions.value.find(s => s.id === sessionId.value) || {}
})

const filters = ref({
  type: null,
  model: null,
  search: ''
})

const filteredMessages = computed(() => {
  return messages.value.filter(msg => {
    // Filter by types array if present
    if (filters.value.types && filters.value.types.length > 0) {
      if (!filters.value.types.includes(msg.type)) return false
    }
    // Filter by model if selected
    if (filters.value.model && msg.model !== filters.value.model) return false
    // Filter by search text
    if (filters.value.search && !msg.content?.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    return true
  })
})

onMounted(async () => {
  await fetchSessions()
  if (sessionId.value) {
    await fetchSessionMessages(sessionId.value)
  }
})

watch(() => sessionId.value, async (newSessionId) => {
  if (newSessionId) {
    await fetchSessionMessages(newSessionId)
  }
})

const handleFilter = (filterData) => {
  filters.value = {
    type: null, // Reset type filter since we're using types array
    model: filterData.model,
    search: filterData.searchText,
    types: filterData.types
  }
}
</script>
