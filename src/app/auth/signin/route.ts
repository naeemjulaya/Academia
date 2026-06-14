import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // You could redirect to a login page with an error query param
    // return NextResponse.redirect(new URL('/login?error=Invalid credentials', request.url))
    return NextResponse.redirect(new URL('/login?error=' + encodeURIComponent(error.message), request.url), {
      status: 301,
    })
  }

  return NextResponse.redirect(new URL('/dashboard?success=Sessão%20iniciada%20com%20sucesso!', request.url), {
    status: 301,
  })
}
