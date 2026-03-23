import { ref } from 'vue'
import axios from 'axios'

const stats = ref({})
const loading = ref(false)
const error = ref(null)

const API_BASE = '/api'

export function useStats() {
  const fetchStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/stats`)
      stats.value = response.data || {}
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats
  }
}
