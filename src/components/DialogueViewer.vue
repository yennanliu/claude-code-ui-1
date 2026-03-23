<template>
  <div class="h-full flex flex-col">
    <!-- Session Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <h2 class="text-lg font-bold text-gray-900">{{ sessionId }}</h2>
      <p class="text-sm text-gray-500">{{ messages.length }} messages</p>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4">
      <MessageCard
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
      />
    </div>
  </div>
</template>

<script setup>
import MessageCard from './MessageCard.vue'

defineProps({
  sessionId: String,
  messages: {
    type: Array,
    default: () => []
  }
})
</script>
