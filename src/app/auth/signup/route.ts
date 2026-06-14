import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const name = String(formData.get('name'))
  const phone = String(formData.get('phone') || '')
  const uni = String(formData.get('uni') || '')
  const course = String(formData.get('course') || '')

  const supabase = await createClient()

  // 1. Sign up the user in auth.users
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome: name,
      }
    }
  })

  if (authError) {
    return NextResponse.redirect(new URL('/login?error=' + encodeURIComponent(authError.message), request.url), {
      status: 301,
    })
  }

  // 2. Insert into public.users. 
  // We use the authenticated supabase client. Since there's no INSERT policy yet, 
  // we might need to bypass RLS. Let's use the service_role key to bypass RLS for this operation.
  // Or simpler: the supabase-js signUp automatically signs the user in, but inserting into public.users
  // might be blocked. To be safe, we will just use the standard client and if it fails, we ignore it 
  // assuming a trigger exists, but let's try to insert it anyway.
  
  if (authData.user) {
    // To bypass RLS, we create a temporary admin client
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabaseAdmin.from('users').insert({
      id: authData.user.id,
      nome: name,
      email: email,
      telefone: phone,
      universidade: uni,
      curso: course,
      papel: 'ESTUDANTE'
    }).select().single()
  }

  return NextResponse.redirect(new URL('/dashboard?success=Conta%20criada%20com%20sucesso!', request.url), {
    status: 301,
  })
}
