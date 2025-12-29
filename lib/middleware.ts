import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getCurrentUser } from './auth'

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      user: null,
    }
  }

  const user = await getCurrentUser(token)
  if (!user) {
    return {
      error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }),
      user: null,
    }
  }

  return { error: null, user }
}

export async function requireAdmin(request: NextRequest) {
  const { error, user } = await requireAuth(request)
  
  if (error) return { error, user: null }

  if (!user || !('role' in user)) {
    return {
      error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
      user: null,
    }
  }

  return { error: null, user }
}



