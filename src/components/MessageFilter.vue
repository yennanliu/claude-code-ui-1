<template>
  <div class="border-b border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#334155] p-4 space-y-3">
    <!-- Type Filters -->
    <div class="space-y-2">
      <label class="text-xs font-semibold text-gray-700 dark:text-[#cbd5e1] uppercase">Message Types</label>
      <div class="flex flex-wrap gap-2">
        <label v-for="type in messageTypes" :key="type" class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            :value="type"
            v-model="selectedTypes"
            @change="emitFilterChange"
            class="w-4 h-4 rounded border-gray-300 dark:border-[#334155] text-indigo-600"
          />
          <span class="text-sm text-gray-700 dark:text-[#cbd5e1]">{{ formatType(type) }}</span>
        </label>
      </div>
    </div>

    <!-- Model Filter -->
    <div class="space-y-2">
      <label class="text-xs font-semibold text-gray-700 dark:text-[#cbd5e1] uppercase">Model</label>
      <select
        v-model="selectedModel"
        @change="emitFilterChange"
        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#334155] rounded-md bg-white dark:bg-[#1e293b] text-gray-900 dark:text-[#f1f5f9] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">All Models</option>
        <option v-for="model in availableModels" :key="model" :value="model">
          {{ formatModel(model) }}
        </option>
      </select>
    </div>

    <!-- Search -->
    <div class="space-y-2">
      <label class="text-xs font-semibold text-gray-700 dark:text-[#cbd5e1] uppercase">Search Content</label>
      <input
        v-model="searchText"
        @input="emitFilterChange"
        type="text"
        placeholder="Search message content..."
        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#334155] rounded-md bg-white dark:bg-[#1e293b] text-gray-900 dark:text-[#f1f5f9] placeholder-gray-400 dark:placeholder-[#94a3b8] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>

    <!-- Clear Filters Button -->
    <button
      @click="clearFilters"
      v-if="hasActiveFilters"
      class="w-full px-3 py-2 text-sm bg-white dark:bg-[#1e293b] text-gray-700 dark:text-[#cbd5e1] border border-gray-300 dark:border-[#334155] rounded-md hover:bg-gray-100 dark:hover:bg-[#334155] transition"
    >
      Clear Filters
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter-change'])

const selectedModel = ref('')
const searchText = ref('')

// Get all unique message types from the messages
const messageTypes = computed(() => {
  const types = new Set()
  props.messages.forEach(msg => {
    types.add(msg.type)
  })
  return Array.from(types).sort()
})

// Select all message types by default
const selectedTypes = ref([])

// Initialize with all types when messages are available
const initializeTypes = () => {
  selectedTypes.value = [...messageTypes.value]
  emitFilterChange()
}

// Emit initial state so DialogueViewer shows all messages by default
onMounted(() => {
  if (props.messages.length > 0) {
    initializeTypes()
  }
})

// Watch for message changes and update available types
watch(() => props.messages.length, () => {
  if (props.messages.length > 0 && selectedTypes.value.length === 0) {
    initializeTypes()
  }
})

const availableModels = computed(() => {
  const models = new Set()
  props.messages.forEach(msg => {
    if (msg.model) models.add(msg.model)
  })
  return Array.from(models).sort()
})

const hasActiveFilters = computed(() => {
  return selectedTypes.value.length !== messageTypes.value.length || selectedModel.value || searchText.value
})

const formatType = (type) => {
  const typeMap = {
    'user': '👤 User',
    'assistant': '🤖 Assistant',
    'tool_use': '🔧 Tool Use',
    'tool_result': '📦 Tool Result',
    'system': '⚙️ System',
    'file-history-snapshot': '📸 Snapshot',
    'hook_progress': '🪝 Hook Progress',
    'create': '✨ Create'
  }
  return typeMap[type] || `${type}`
}

const formatModel = (model) => {
  if (model.includes('opus')) return 'Opus 4.5'
  if (model.includes('sonnet')) return 'Sonnet 4.5'
  if (model.includes('haiku')) return 'Haiku 4.5'
  return model
}

const emitFilterChange = () => {
  emit('filter-change', {
    types: selectedTypes.value,
    model: selectedModel.value,
    searchText: searchText.value
  })
}

const clearFilters = () => {
  selectedTypes.value = [...messageTypes]
  selectedModel.value = ''
  searchText.value = ''
  emitFilterChange()
}
</script>
