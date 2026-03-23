export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'claude-blue': '#4f46e5',
        'claude-indigo': '#6366f1',
        'claude-slate': '#64748b',
        dark: {
          'bg-primary': '#0f172a',
          'bg-secondary': '#1e293b',
          'bg-tertiary': '#334155',
          'surface-primary': '#1e293b',
          'surface-secondary': '#334155',
          'border-primary': '#334155',
          'border-secondary': '#475569',
          'text-primary': '#f1f5f9',
          'text-secondary': '#cbd5e1',
          'text-tertiary': '#94a3b8',
        }
      }
    },
  },
  plugins: [],
}
