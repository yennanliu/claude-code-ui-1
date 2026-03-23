import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { homedir } from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLAUDE_DIR = path.join(homedir(), '.claude')
const PROJECTS_DIR = path.join(CLAUDE_DIR, 'projects')

export async function readSessions() {
  try {
    if (!fs.existsSync(PROJECTS_DIR)) {
      return []
    }

    const sessions = []
    const projectDirs = fs.readdirSync(PROJECTS_DIR)

    for (const projectDir of projectDirs) {
      const projectPath = path.join(PROJECTS_DIR, projectDir)
      const stat = fs.statSync(projectPath)

      if (!stat.isDirectory()) continue

      // Read all .jsonl files in the project directory
      const files = fs.readdirSync(projectPath)
      for (const file of files) {
        if (file.endsWith('.jsonl')) {
          const sessionId = file.replace('.jsonl', '')
          const filePath = path.join(projectPath, file)

          // Count messages in session
          const content = fs.readFileSync(filePath, 'utf-8')
          const lines = content.trim().split('\n').filter(l => l.length > 0)
          const messageCount = lines.length

          // Get file modification time
          const stats = fs.statSync(filePath)
          const date = stats.mtime

          sessions.push({
            id: sessionId,
            project: decodeURIComponent(projectDir),
            name: sessionId.substring(0, 8) + '...',
            date,
            messageCount,
            path: filePath
          })
        }
      }
    }

    // Sort by date descending
    sessions.sort((a, b) => b.date - a.date)
    return sessions
  } catch (error) {
    console.error('Error reading sessions:', error)
    return []
  }
}

export async function readSessionMessages(sessionId) {
  try {
    // Search for the session file in all project directories
    const projectDirs = fs.readdirSync(PROJECTS_DIR)

    for (const projectDir of projectDirs) {
      const sessionPath = path.join(PROJECTS_DIR, projectDir, `${sessionId}.jsonl`)

      if (fs.existsSync(sessionPath)) {
        const content = fs.readFileSync(sessionPath, 'utf-8')
        const lines = content.trim().split('\n').filter(l => l.length > 0)

        const messages = []
        for (const line of lines) {
          try {
            const message = JSON.parse(line)
            messages.push({
              type: message.type || 'unknown',
              content: message.content || '',
              timestamp: message.timestamp || new Date().toISOString(),
              inputTokens: message.inputTokens || null,
              outputTokens: message.outputTokens || null,
              toolName: message.toolName || null,
              toolInput: message.toolInput || null
            })
          } catch (parseError) {
            console.error('Error parsing message:', parseError)
          }
        }

        return messages
      }
    }

    return []
  } catch (error) {
    console.error('Error reading session messages:', error)
    return []
  }
}

export async function readStats() {
  try {
    const statsPath = path.join(CLAUDE_DIR, 'stats-cache.json')

    if (!fs.existsSync(statsPath)) {
      return {
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheCreatedTokens: 0,
        byModel: {},
        sessions: {
          total: 0,
          totalMessages: 0,
          avgMessages: 0
        }
      }
    }

    const statsContent = fs.readFileSync(statsPath, 'utf-8')
    const statsData = JSON.parse(statsContent)

    // Process stats
    let totalTokens = 0
    let totalInputTokens = 0
    let totalOutputTokens = 0
    let totalCacheRead = 0
    let totalCacheCreated = 0
    const byModel = {}

    // If stats is organized by date, aggregate them
    if (statsData.byDate) {
      for (const [date, dateStats] of Object.entries(statsData.byDate)) {
        for (const [model, modelStats] of Object.entries(dateStats)) {
          totalInputTokens += modelStats.inputTokens || 0
          totalOutputTokens += modelStats.outputTokens || 0
          totalCacheRead += modelStats.cacheReadInputTokens || 0
          totalCacheCreated += modelStats.cacheCreationInputTokens || 0

          if (!byModel[model]) {
            byModel[model] = { total: 0, input: 0, output: 0 }
          }
          byModel[model].total += (modelStats.inputTokens || 0) + (modelStats.outputTokens || 0)
          byModel[model].input += modelStats.inputTokens || 0
          byModel[model].output += modelStats.outputTokens || 0
        }
      }
    }

    totalTokens = totalInputTokens + totalOutputTokens

    // Get session stats
    const sessions = await readSessions()
    const totalMessages = sessions.reduce((sum, s) => sum + s.messageCount, 0)

    return {
      totalTokens,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      cacheReadTokens: totalCacheRead,
      cacheCreatedTokens: totalCacheCreated,
      byModel,
      sessions: {
        total: sessions.length,
        totalMessages,
        avgMessages: sessions.length > 0 ? Math.round(totalMessages / sessions.length) : 0
      }
    }
  } catch (error) {
    console.error('Error reading stats:', error)
    return {
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheCreatedTokens: 0,
      byModel: {},
      sessions: {
        total: 0,
        totalMessages: 0,
        avgMessages: 0
      }
    }
  }
}
