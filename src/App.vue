<template>
  <div class="h-screen">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme.js'

const { applyTheme } = useTheme()

onMounted(() => {
  // Ensure theme is applied immediately on app load
  applyTheme()
})
</script>
