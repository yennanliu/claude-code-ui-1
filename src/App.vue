<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar: Session List -->
    <div class="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
      <SessionList
        :sessions="sessions"
        :selected-session="selectedSession"
        @select="selectSession"
        @refresh="refreshSessions"
      />
    </div>

    <!-- Main: Dialogue Viewer -->
    <div class="flex-1 flex flex-col bg-white">
      <div class="flex-1 overflow-y-auto">
        <DialogueViewer
          v-if="selectedSession"
          :session-id="selectedSession"
          :messages="messages"
        />
        <div v-else class="flex items-center justify-center h-full text-gray-500">
          <p>Select a session to view messages</p>
        </div>
      </div>
    </div>

    <!-- Right Panel: Token Statistics -->
    <div class="w-1/4 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <StatsOverview :stats="stats" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import SessionList from './components/SessionList.vue'
import DialogueViewer from './components/DialogueViewer.vue'
import StatsOverview from './components/StatsOverview.vue'

const sessions = ref([])
const selectedSession = ref(null)
const messages = ref([])
const stats = ref({})

const API_BASE = '/api'

onMounted(async () => {
  await refreshSessions()
  await loadStats()
})

const refreshSessions = async () => {
  try {
    const response = await axios.get(`${API_BASE}/sessions`)
    sessions.value = response.data.sessions || []
  } catch (error) {
    console.error('Error loading sessions:', error)
  }
}

const selectSession = async (sessionId) => {
  selectedSession.value = sessionId
  try {
    const response = await axios.get(`${API_BASE}/sessions/${sessionId}`)
    messages.value = response.data.messages || []
  } catch (error) {
    console.error('Error loading session messages:', error)
    messages.value = []
  }
}

const loadStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/stats`)
    stats.value = response.data || {}
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}
</script>
