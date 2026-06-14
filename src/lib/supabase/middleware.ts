import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Parameters<NonNullable<CookieMethodsServer['setAll']>>[0]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Handle protected routes based on URL paths
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (!user && isDashboardPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Handle Role-based routing
  if (user && isDashboardPage) {
    // Fetch user profile to get role
    const { data: profile } = await supabase
      .from('users')
      .select('papel')
      .eq('id', user.id)
      .single()

    const role = profile?.papel

    // If user hits /dashboard exactly, redirect to their role-specific portal
    if (request.nextUrl.pathname === '/dashboard' || request.nextUrl.pathname === '/dashboard/') {
      const roleRedirects: Record<string, string> = {
        ADMINISTRADOR: '/dashboard/admin',
        COORDENADOR:   '/dashboard/coordenador',
        EXPLICADOR:    '/dashboard/explicador',
        ESTUDANTE:     '/dashboard/estudante',
      }
      const destination = roleRedirects[role] ?? '/dashboard/estudante'
      return NextResponse.redirect(new URL(destination, request.url))
    }

    // Guard: /dashboard/admin → only ADMINISTRADOR
    if (request.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'ADMINISTRADOR') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Guard: /dashboard/coordenador → only COORDENADOR or ADMINISTRADOR
    if (request.nextUrl.pathname.startsWith('/dashboard/coordenador') && !['ADMINISTRADOR', 'COORDENADOR'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Guard: /dashboard/explicador → only EXPLICADOR or ADMINISTRADOR
    if (request.nextUrl.pathname.startsWith('/dashboard/explicador') && !['ADMINISTRADOR', 'EXPLICADOR'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}
