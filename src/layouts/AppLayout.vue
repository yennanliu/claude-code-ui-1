<template>
  <div class="flex h-screen bg-gray-50 dark:bg-[#0f172a]">
    <!-- Sidebar -->
    <div class="w-1/4 border-r border-gray-200 dark:border-[#334155] overflow-y-auto dark-scrollbar">
      <AppSidebar :active-session-id="currentSessionId" />
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto dark-scrollbar">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'

const route = useRoute()

const currentSessionId = computed(() => {
  return route.params.sessionId || null
})
</script>
