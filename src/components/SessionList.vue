<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h1 class="text-lg font-bold text-gray-900 mb-3">Sessions</h1>
      <div class="flex gap-2">
        <button
          @click="$emit('refresh')"
          class="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600 transition"
        >
          Refresh
        </button>
        <button
          @click="toggleAllExpanded"
          class="flex-1 px-3 py-2 bg-gray-200 text-gray-900 rounded-md text-sm hover:bg-gray-300 transition"
          title="Expand/Collapse all projects"
        >
          {{ allExpanded ? '▼' : '▶' }}
        </button>
      </div>
    </div>

    <!-- Sessions List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="sessions.length === 0" class="p-4 text-gray-500 text-sm">
        No sessions found
      </div>

      <div v-for="group in groupedSessions" :key="group.project" class="border-t border-gray-100 first:border-t-0">
        <!-- Project Header (Expandable) -->
        <button
          @click="toggleProjectExpanded(group.project)"
          class="w-full px-4 py-3 bg-gray-100 hover:bg-gray-150 transition flex items-center justify-between sticky top-0 z-20"
        >
          <div class="flex items-center gap-2 flex-1">
            <span class="text-sm font-semibold text-gray-900">{{ isProjectExpanded(group.project) ? '▼' : '▶' }}</span>
            <span class="text-sm font-bold text-gray-900">📁 {{ group.project }}</span>
            <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{{ group.sessions.length }}</span>
          </div>
        </button>

        <!-- Sessions (Collapsible) -->
        <div v-if="isProjectExpanded(group.project)">
          <button
            v-for="session in group.sessions"
            :key="session.id"
            @click="$emit('select', session.id)"
            :class="[
              'w-full text-left px-6 py-3 border-b border-gray-100 hover:bg-indigo-50 transition',
              selectedSession === session.id ? 'bg-indigo-100 border-l-4 border-l-indigo-500' : ''
            ]"
          >
            <div class="text-sm font-medium text-gray-900 truncate">💬 {{ session.name }}</div>
            <div class="flex justify-between items-center mt-1">
              <div class="text-xs text-gray-500">{{ formatDate(session.date) }}</div>
              <div class="text-xs text-gray-400">{{ session.messageCount }} msgs</div>
            </div>
            <div v-if="session.duration" class="text-xs text-gray-400 mt-0.5">⏱️ {{ session.duration }} min</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
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

const expandedProjects = ref({})

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

const allExpanded = computed(() => {
  if (groupedSessions.value.length === 0) return false
  return groupedSessions.value.every(group => expandedProjects.value[group.project] !== false)
})

const isProjectExpanded = (project) => {
  return expandedProjects.value[project] !== false
}

const toggleProjectExpanded = (project) => {
  expandedProjects.value[project] = !isProjectExpanded(project)
}

const toggleAllExpanded = () => {
  const newState = !allExpanded.value
  groupedSessions.value.forEach(group => {
    expandedProjects.value[group.project] = newState
  })
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  const d = new Date(date)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()

  if (isToday) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
}
</script>
