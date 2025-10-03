import { serve } from '@hono/node-server'
import { connectToDb } from './db'
import { createAuth } from './lib/auth'
import { createApp } from './app'

// Initialize database and authentication -- ORDER MATTERS
connectToDb()
createAuth()

const PORT = 3000

// Create app and start server
const server = serve({
  fetch: createApp().fetch,
  port: PORT,
})

server.on('listening', () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
