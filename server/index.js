import express from 'express'
import cors from 'cors'
import { readSessions, readSessionMessages, readStats } from './claudeDataReader.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// API Routes
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await readSessions()
    res.json({ sessions })
  } catch (error) {
    console.error('Error reading sessions:', error)
    res.status(500).json({ error: 'Failed to read sessions' })
  }
})

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const messages = await readSessionMessages(req.params.sessionId)
    console.log(`[DEBUG] Session ${req.params.sessionId}: ${messages.length} messages loaded`)
    if (messages.length > 0) {
      const types = {}
      messages.forEach(m => {
        types[m.type] = (types[m.type] || 0) + 1
      })
      console.log(`[DEBUG] Message types:`, types)
      console.log(`[DEBUG] First message:`, JSON.stringify(messages[0], null, 2))
    }
    res.json({ messages })
  } catch (error) {
    console.error('Error reading session messages:', error)
    res.status(500).json({ error: 'Failed to read session messages' })
  }
})

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await readStats()
    res.json(stats)
  } catch (error) {
    console.error('Error reading stats:', error)
    res.status(500).json({ error: 'Failed to read stats' })
  }
})

app.listen(PORT, () => {
  console.log(`Claude Code Session Visualizer server running on port ${PORT}`)
})
