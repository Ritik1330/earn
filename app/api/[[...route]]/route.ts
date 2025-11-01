import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import connectDB from '@/lib/mongoose'
import { Game } from '@/lib/models/Game'
import { Click } from '@/lib/models/Click'

const app = new Hono().basePath('/api')

// Auth middleware for admin routes
const authMiddleware = async (c: any, next: any) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  await next()
}

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from EarnWale!',
  })
})

app.get('/games', async (c) => {
  try {
    await connectDB()
    const games = await Game.find().sort({ rating: -1 })
    return c.json(games)
  } catch (error) {
    return c.json({ error: 'Failed to fetch games' }, 500)
  }
})

app.get('/games/:id', async (c) => {
  try {
    await connectDB()
    const id = c.req.param('id')
    const game = await Game.findById(id)
    if (!game) {
      return c.json({ error: 'Game not found' }, 404)
    }
    return c.json(game)
  } catch (error) {
    return c.json({ error: 'Failed to fetch game' }, 500)
  }
})

app.post('/clicks', async (c) => {
  try {
    await connectDB()
    const { gameId } = await c.req.json()
    const click = await Click.create({ gameId })
    return c.json(click)
  } catch (error) {
    return c.json({ error: 'Failed to record click' }, 500)
  }
})

// Admin routes with auth middleware
app.post('/admin/games', authMiddleware, async (c) => {
  try {
    await connectDB()
    const body = await c.req.json()
    const game = await Game.create(body)
    return c.json(game, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create game' }, 500)
  }
})

app.put('/admin/games/:id', authMiddleware, async (c) => {
  try {
    await connectDB()
    const id = c.req.param('id')
    const body = await c.req.json()
    const game = await Game.findByIdAndUpdate(id, body, { new: true })
    if (!game) {
      return c.json({ error: 'Game not found' }, 404)
    }
    return c.json(game)
  } catch (error) {
    return c.json({ error: 'Failed to update game' }, 500)
  }
})

app.delete('/admin/games/:id', authMiddleware, async (c) => {
  try {
    await connectDB()
    const id = c.req.param('id')
    const game = await Game.findByIdAndDelete(id)
    if (!game) {
      return c.json({ error: 'Game not found' }, 404)
    }
    return c.json({ message: 'Game deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to delete game' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
