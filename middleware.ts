import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname === '/login'
  const isOnProtectedRoute = req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/(protected)')

  if (!isLoggedIn && isOnProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
