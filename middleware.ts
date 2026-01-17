import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Initialize database on first request
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Database will be initialized in each API route
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
