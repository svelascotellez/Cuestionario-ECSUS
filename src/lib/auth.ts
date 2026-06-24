import { cookies } from 'next/headers'
import prisma from './db'

// Very simple custom session handling for MVP
// In a real production app, use NextAuth.js or iron-session
export async function getSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_user_id')?.value

  if (!userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true }
    })
    return user
  } catch (error) {
    return null
  }
}

export async function login(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('session_user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session_user_id')
}
