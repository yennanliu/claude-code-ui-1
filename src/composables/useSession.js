import { ref, computed } from 'vue'
import axios from 'axios'

const sessions = ref([])
const messages = ref([])
const loading = ref(false)
const error = ref(null)

const API_BASE = '/api'

export function useSession() {
  const fetchSessions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/sessions`)
      sessions.value = response.data.sessions || []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const fetchSessionMessages = async (sessionId) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/sessions/${sessionId}`)
      messages.value = response.data.messages || []
    } catch (e) {
      error.value = e.message
      messages.value = []
    } finally {
      loading.value = false
    }
  }

  const groupedByProject = computed(() => {
    const groups = {}
    sessions.value.forEach(session => {
      const project = session.project || 'Uncategorized'
      if (!groups[project]) {
        groups[project] = { project, sessions: [] }
      }
      groups[project].sessions.push(session)
    })
    return Object.values(groups)
  })

  return {
    sessions,
    messages,
    loading,
    error,
    groupedByProject,
    fetchSessions,
    fetchSessionMessages
  }
}
