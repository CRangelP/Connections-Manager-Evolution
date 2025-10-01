import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth(async (req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  
  // Páginas públicas (API routes exceto auth check já está no matcher)
  const isPublicRoute = pathname === '/login'
  
  // Rotas protegidas (todas menos login)
  const isProtectedRoute = !isPublicRoute

  // Se não está logado e tenta acessar rota protegida
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se está logado e tenta acessar login, redireciona para home
  if (isLoggedIn && isPublicRoute) {
    const homeUrl = new URL('/', req.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
