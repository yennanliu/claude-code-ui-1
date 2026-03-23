<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h1 class="text-xl font-bold text-gray-900 mb-2">Sessions</h1>
      <button
        @click="$emit('refresh')"
        class="w-full px-3 py-2 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600 transition"
      >
        Refresh
      </button>
    </div>

    <!-- Sessions List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="sessions.length === 0" class="p-4 text-gray-500 text-sm">
        No sessions found
      </div>

      <div v-for="group in groupedSessions" :key="group.project" class="border-t border-gray-100 first:border-t-0">
        <div class="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 sticky top-0">
          {{ group.project }}
        </div>
        <button
          v-for="session in group.sessions"
          :key="session.id"
          @click="$emit('select', session.id)"
          :class="[
            'w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-indigo-50 transition',
            selectedSession === session.id ? 'bg-indigo-100' : ''
          ]"
        >
          <div class="text-sm font-medium text-gray-900 truncate">{{ session.name }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ formatDate(session.date) }}</div>
          <div class="text-xs text-gray-400 mt-0.5">{{ session.messageCount }} messages</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  sessions: {
    type: Array,
    default: () => []
  },
  selectedSession: {
    type: String,
    default: null
  }
})

defineEmits(['select', 'refresh'])

const groupedSessions = computed(() => {
  const groups = {}

  props.sessions.forEach(session => {
    const project = session.project || 'Uncategorized'
    if (!groups[project]) {
      groups[project] = { project, sessions: [] }
    }
    groups[project].sessions.push(session)
  })

  return Object.values(groups).sort((a, b) => a.project.localeCompare(b.project))
})

const formatDate = (date) => {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
