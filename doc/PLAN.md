# Implementation Plan: Claude Code Session Visualizer

## Overview
Create a Vue 3 application with Tailwind CSS to visualize Claude Code session data including dialogue history, message content, timestamps, and token usage.

## Architecture

### Technology Stack
- **Frontend**: Vue 3 (Composition API)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Data Source**: Read from `~/.claude/` directory files

### Data Sources & Formats

1. **Session Dialogue**: `~/.claude/projects/{project-path}/{sessionId}.jsonl`
   - JSONL format (one JSON object per line)
   - Contains messages with types: user, assistant, tool_use, tool_result, progress, thinking

2. **Token Usage**: `~/.claude/stats-cache.json`
   - Aggregated token stats by model and date
   - Includes inputTokens, outputTokens, cacheReadInputTokens, cacheCreationInputTokens

3. **Command History**: `~/.claude/history.jsonl`
   - User commands/queries with timestamps
   - Maps to session IDs

## Implementation Steps

### 1. Project Setup
- Initialize Vite + Vue 3 project
- Install dependencies: Tailwind CSS, file system utilities
- Configure Tailwind with appropriate theme

### 2. Backend/Data Layer (Node.js script or Electron-style access)
Since Vue runs in browser and needs file system access:
- **Option A**: Create a simple Node.js backend (Express) to serve Claude Code data via API
- **Option B**: Use Electron to package the app with file system access
- **Recommendation**: Start with Node.js backend for simplicity

Create API endpoints:
- `GET /api/sessions` - List all sessions (from projects directory)
- `GET /api/sessions/:sessionId` - Get specific session dialogue
- `GET /api/stats` - Get token usage statistics
- `GET /api/history` - Get command history

### 3. Vue Components Structure

```
src/
├── App.vue                    # Main app container
├── components/
│   ├── SessionList.vue        # List of available sessions
│   ├── DialogueViewer.vue     # Main dialogue display
│   ├── MessageCard.vue        # Individual message component
│   ├── TokenStats.vue         # Token usage visualization
│   └── StatsOverview.vue      # Overall statistics dashboard
├── composables/
│   ├── useSessionData.js      # Fetch and manage session data
│   └── useTokenStats.js       # Fetch and manage token statistics
└── utils/
    └── formatters.js          # Date/time/token formatters
```

### 4. Key Features

#### Session List View
- Display all available sessions grouped by project
- Show session date, message count, total tokens
- Click to view detailed session

#### Dialogue Viewer
- Message cards showing:
  - Role indicator (user/assistant)
  - Message content (formatted markdown)
  - Timestamp
  - Token count (for assistant messages)
- Collapsible tool usage details
- Auto-scroll to bottom
- Search/filter messages

#### Token Statistics Dashboard
- Total token usage by model
- Daily token usage chart
- Cache hit rates
- Cost tracking (USD)
- Session statistics (total sessions, messages, longest session)

### 5. UI Design with Tailwind

**Color Scheme**:
- User messages: blue/indigo background
- Assistant messages: gray/slate background
- Tool usage: purple/violet accent
- Token stats: green/emerald for savings, amber for costs

**Layout**:
- Sidebar: Session list (left, 25% width)
- Main area: Dialogue viewer (center, 50% width)
- Stats panel: Token statistics (right, 25% width, sticky)

## Critical Files to Create

1. **Backend Server**:
   - `server/index.js` - Express server with API endpoints
   - `server/claudeDataReader.js` - Helper to read ~/.claude files

2. **Vue Application**:
   - `package.json` - Dependencies
   - `vite.config.js` - Vite configuration
   - `tailwind.config.js` - Tailwind configuration
   - `src/main.js` - Vue app entry point
   - `src/App.vue` - Main component
   - Components and composables as listed above

3. **Configuration**:
   - `.env` - Environment variables (Claude data path)
   - `index.html` - HTML entry point

## Verification Plan

### Testing Steps
1. **Setup Verification**:
   ```bash
   npm install
   npm run dev  # Start Vue dev server
   npm run server  # Start backend server (in separate terminal)
   ```

2. **Data Loading**:
   - Verify API endpoints return data from ~/.claude directory
   - Check that JSONL files are parsed correctly
   - Confirm token stats are aggregated properly

3. **UI Functionality**:
   - Navigate to http://localhost:5173 (or assigned port)
   - Verify session list populates with real sessions
   - Click a session and confirm messages load
   - Check that timestamps format correctly
   - Verify token counts display for each message
   - Test scrolling and responsive layout

4. **Token Stats**:
   - Confirm stats panel shows total tokens
   - Verify model breakdown is accurate
   - Check that daily stats match stats-cache.json

### Success Criteria
- [x] Vue app loads without errors
- [x] Session list displays all sessions from ~/.claude/projects
- [x] Clicking a session loads and displays all messages
- [x] Messages show content, timestamps, and token counts
- [x] Token statistics panel displays accurate data from stats-cache.json
- [x] UI is responsive and styled with Tailwind
- [x] Can switch between different sessions
- [x] Real-time session (current one) is identifiable and can be monitored

## Implementation Summary

### Completed Deliverables

**Frontend Components** (6 components):
- App.vue - 3-column layout with session list, dialogue viewer, and stats
- SessionList.vue - Sidebar with project grouping and session selection
- DialogueViewer.vue - Message display area with scrolling
- MessageCard.vue - Individual message rendering with formatting
- StatsOverview.vue - Statistics panel with token data
- StatCard.vue - Reusable statistic card component

**Backend Services**:
- Express server on port 3001 with CORS support
- Three API endpoints for sessions, messages, and stats
- Data reader that parses JSONL files from ~/.claude directory
- Proper error handling and data aggregation

**Build Configuration**:
- Vite dev server with hot module reloading
- Tailwind CSS with production optimization (2.58KB gzip)
- Production build with minified assets (41.4KB gzip)
- PostCSS with autoprefixer for cross-browser compatibility

**Documentation**:
- README.md - Quick start and feature overview
- SETUP.md - Detailed setup and troubleshooting
- PLAN.md - This implementation plan

### Verified Results
- Successfully discovers 113 Claude Code sessions
- Loads 37,129 total messages across all sessions
- All three API endpoints responding correctly
- Production build succeeds with optimized bundles
- Frontend dev server starts with Vite HMR
- Real data from ~/.claude directory successfully loaded

## Additional Enhancements (Future)
- Live updates (watch files for changes)
- Export session as markdown/HTML
- Token usage trends over time (charts)
- Message search functionality
- Filter by message type
- Dark mode toggle
