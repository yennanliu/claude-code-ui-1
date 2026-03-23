# Claude Code Session Visualizer - Setup Guide

## Overview
This is a Vue 3 + Tailwind CSS application that visualizes Claude Code session data, including dialogue history, message content, timestamps, and token usage statistics.

## Project Structure

```
.
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── src/
│   ├── main.js             # Vue app entry point
│   ├── style.css           # Global styles (Tailwind imports)
│   ├── App.vue             # Root component (layout)
│   └── components/
│       ├── SessionList.vue       # Sidebar with session listing
│       ├── DialogueViewer.vue    # Main message display area
│       ├── MessageCard.vue       # Individual message component
│       ├── StatsOverview.vue     # Right panel statistics
│       └── StatCard.vue          # Stat display card
├── server/
│   ├── index.js            # Express server
│   └── claudeDataReader.js # Data reading utilities
└── dist/                   # Build output (generated)
```

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

The application requires two terminals:

### Terminal 1: Start the Backend Server
```bash
npm run server
```
This starts the Express server on `http://localhost:3001`, which serves data from your `~/.claude` directory.

### Terminal 2: Start the Frontend Dev Server
```bash
npm run dev
```
This starts the Vite dev server on `http://localhost:5173` with hot module reloading.

Then open your browser to: **http://localhost:5173**

## Features

### Session List (Left Sidebar)
- View all Claude Code sessions from your `~/.claude/projects/` directory
- Sessions grouped by project
- Shows session date and message count
- Click to select a session for detailed view
- Refresh button to reload session list

### Dialogue Viewer (Main Area)
- Displays all messages in selected session
- Message cards show:
  - Role (user/assistant/tool_use/tool_result/thinking)
  - Timestamp
  - Message content (truncated at 500 characters)
  - Token counts (input/output)
  - Tool usage details (when applicable)

### Statistics Panel (Right Sidebar)
- **Overall Statistics**:
  - Total, input, and output tokens
  - Cache read and created tokens
- **By Model**: Token usage breakdown by AI model
- **Session Statistics**:
  - Total sessions
  - Total messages
  - Average messages per session

## Data Sources

The application reads data from your Claude Code installation:

1. **Sessions**: `~/.claude/projects/{project-path}/{sessionId}.jsonl`
   - JSONL format (one JSON object per line)
   - Contains messages with type, content, timestamp, and token info

2. **Token Statistics**: `~/.claude/stats-cache.json`
   - Aggregated token usage by model and date

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## Technology Stack

- **Frontend**: Vue 3 (Composition API)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Express.js
- **HTTP Client**: Axios

## Browser Support

Modern browsers with ES2020+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### "No sessions found"
- Ensure your `~/.claude/projects/` directory contains session files
- Check that the backend server is running on port 3001
- Verify API is accessible at `http://localhost:3001/api/sessions`

### "Failed to read stats"
- Check that `~/.claude/stats-cache.json` exists
- Backend server should log any file read errors to console

### Port conflicts
- Change the backend port in `server/index.js`: `const PORT = process.env.PORT || 3001`
- Change the frontend port in `vite.config.js`: `port: 5173`
- Update the proxy target if changing backend port

### CORS errors
- The backend includes CORS headers. Ensure your browser allows requests.
- Check that backend and frontend are both running.

## Environment Variables

`.env` file:
```
VITE_API_BASE=/api    # API base URL (used for proxy)
PORT=3001             # Backend server port
```

## Development Notes

- Hot module replacement enabled for Vue components
- Tailwind CSS purges unused styles in production
- Components use Vue 3 Composition API with `<script setup>` syntax
- Backend uses ES modules (CommonJS not supported)

## Future Enhancements

- Live updates (watch files for changes)
- Export session as markdown/HTML
- Token usage trends over time (charts)
- Message search functionality
- Filter by message type
- Dark mode toggle
- Real-time session monitoring
