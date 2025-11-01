import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { put } from '@vercel/blob'
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

// Upload route (moved from app/api/upload/route.ts)
app.post('/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    // Check file type
    if (!file.type?.startsWith('image/')) {
      return c.json({ error: 'File must be an image' }, 400)
    }

    // Check file size (max 5MB)
    if ((file as any).size > 5 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 5MB' }, 400)
    }

    const blob = await put((file as any).name, file as any, {
      access: 'public',
    })

    return c.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Failed to upload image' }, 500)
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
