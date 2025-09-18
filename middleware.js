import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const method = request.method
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

  // RiverGuard-specific logging
  if (pathname.startsWith('/api/streams')) {
    console.log(`[RiverGuard API] ${new Date().toISOString()}] ${method} ${pathname} - IP: ${ip}`)
  } else if (pathname.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] API ${method} ${pathname} - IP: ${ip}`)
  }

  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // RiverGuard-specific middleware logic
  if (pathname.startsWith('/api/streams')) {
    // Log stream-related requests with more detail
    const streamId = pathname.split('/').pop()
    if (streamId && streamId !== 'streams') {
      console.log(`[RiverGuard] Stream operation: ${method} on stream ${streamId}`)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}