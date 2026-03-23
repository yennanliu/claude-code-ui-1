<template>
  <div class="h-full flex flex-col">
    <!-- Session Detail Panel -->
    <SessionDetailPanel
      :session-id="sessionId"
      :session-data="sessionData"
      :messages="messages"
    />

    <!-- Message Filter -->
    <MessageFilter
      :messages="messages"
      @filter-change="handleFilterChange"
    />

    <!-- Messages Container -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4">
      <div v-if="filteredMessages.length === 0" class="flex items-center justify-center h-full text-gray-500">
        <div class="text-center">
          <p class="text-lg font-semibold">No messages match the current filter</p>
          <p class="text-sm mt-2">Try adjusting your filters or search criteria</p>
        </div>
      </div>
      <MessageCard
        v-for="(message, index) in filteredMessages"
        :key="index"
        :message="message"
        :selected-session="selectedMessageId"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import MessageCard from './MessageCard.vue'
import SessionDetailPanel from './SessionDetailPanel.vue'
import MessageFilter from './MessageFilter.vue'

const props = defineProps({
  sessionId: String,
  sessionData: {
    type: Object,
    default: () => ({})
  },
  messages: {
    type: Array,
    default: () => []
  }
})

const filters = ref({
  types: [],
  model: '',
  searchText: ''
})

const selectedMessageId = ref(null)

const filteredMessages = computed(() => {
  // If no filters are set, show all messages
  if (filters.value.types.length === 0 && !filters.value.model && !filters.value.searchText) {
    return props.messages
  }

  return props.messages.filter(msg => {
    // Type filter
    if (filters.value.types.length > 0 && !filters.value.types.includes(msg.type)) {
      return false
    }

    // Model filter
    if (filters.value.model && msg.model !== filters.value.model) {
      return false
    }

    // Search filter
    if (filters.value.searchText) {
      const searchLower = filters.value.searchText.toLowerCase()
      const contentMatch = msg.content && msg.content.toLowerCase().includes(searchLower)
      const toolMatch = msg.toolName && msg.toolName.toLowerCase().includes(searchLower)
      if (!contentMatch && !toolMatch) {
        return false
      }
    }

    return true
  })
})

const handleFilterChange = (newFilters) => {
  filters.value = newFilters
}
</script>
