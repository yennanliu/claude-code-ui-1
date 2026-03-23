import { ref, watch, onMounted } from 'vue'

// Initialize theme synchronously at module load time
const initializeTheme = () => {
  const stored = localStorage.getItem('theme')
  const isDarkMode = stored === 'light' ? false : true
  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  return isDarkMode
}

// Apply theme immediately on module load
initializeTheme()

const isDark = ref(true) // default to dark

export function useTheme() {
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  onMounted(() => {
    const stored = localStorage.getItem('theme')
    isDark.value = stored === 'light' ? false : true
    applyTheme()
  })

  watch(isDark, applyTheme)

  return { isDark, toggleTheme, applyTheme }
}
