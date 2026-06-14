import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const email = 'admin@academiakeven.com'
  const password = 'AcademiaKeven@2024!'

  try {
    // Check if user already exists in auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingAuthUser = existingUsers?.users?.find(u => u.email === email)

    let userId = existingAuthUser?.id

    if (!existingAuthUser) {
      // Create in auth.users with email pre-confirmed
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome: 'Administrador Master' }
      })
      if (authError) return NextResponse.json({ error: `Auth error: ${authError.message}` }, { status: 500 })
      userId = authData.user?.id
    }

    if (!userId) return NextResponse.json({ error: 'Could not get user ID' }, { status: 500 })

    // Check if already in public.users
    const { data: existingProfile } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingProfile) {
      // Insert into public.users
      const { error: dbError } = await supabaseAdmin.from('users').insert({
        id: userId,
        nome: 'Administrador Master',
        email,
        papel: 'ADMINISTRADOR',
        ativo: true
      })
      if (dbError) return NextResponse.json({ error: `DB error: ${dbError.message}` }, { status: 500 })
    } else {
      // Update role to ADMINISTRADOR just in case
      await supabaseAdmin.from('users').update({ papel: 'ADMINISTRADOR' }).eq('id', userId)
    }

    return NextResponse.json({
      success: true,
      message: 'Admin criado com sucesso!',
      credentials: { email, password }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
