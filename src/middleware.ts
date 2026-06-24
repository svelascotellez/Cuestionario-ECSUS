import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session_user_id')?.value
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/cuestionario') || pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect root to cuestionario or login
  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/cuestionario', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/cuestionario/:path*', '/admin/:path*'],
}
