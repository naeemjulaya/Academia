import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Sidebar from './Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch actual profile data
  const { data: profile } = await supabase
    .from('users')
    .select('nome, papel')
    .eq('id', user.id)
    .single();

  const userName = profile?.nome || 'Utilizador'
  const userRole = profile?.papel || 'ESTUDANTE'

  let dashboardPath = '/dashboard/estudante'
  if (userRole === 'ADMINISTRADOR') dashboardPath = '/dashboard/admin'
  else if (userRole === 'COORDENADOR') dashboardPath = '/dashboard/coordenador'
  else if (userRole === 'EXPLICADOR') dashboardPath = '/dashboard/explicador'

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen flex flex-col">
      {/* Dynamic Client Sidebar */}
      <Sidebar userName={userName} userRole={userRole} />

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 glass-panel border-b border-outline-variant flex justify-between items-center px-lg z-40">
        <div className="flex items-center space-x-lg">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-1 focus:ring-secondary w-80" 
              placeholder="Procurar em inscrições ou pagamentos..." 
              type="text"
            />
          </div>
          <nav className="hidden md:flex space-x-md">
            <Link href={dashboardPath} className="font-body-md text-on-surface-variant hover:text-primary transition-all">Início</Link>
            <Link href="/dashboard/materiais" className="font-body-md text-on-surface-variant hover:text-primary transition-all">Biblioteca</Link>
            <Link href="/dashboard/mensagens" className="font-body-md text-on-surface-variant hover:text-primary transition-all">Suporte</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-md">
          <form action="/auth/signout" method="POST">
            <button type="submit" className="flex items-center text-on-surface-variant hover:bg-surface-container-low px-sm py-1 rounded transition-all active:scale-95">
              <span className="material-symbols-outlined mr-xs">sync_alt</span>
              <span className="font-body-md hidden sm:block">Sair</span>
            </button>
          </form>
          <div className="w-px h-6 bg-outline-variant hidden sm:block"></div>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 min-h-screen">
        {children}
      </main>

      {/* FAB */}
      <Link href="/dashboard/mensagens" className="fixed bottom-lg right-lg w-14 h-14 bg-primary-container text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 group">
        <span className="material-symbols-outlined text-[28px]">help_outline</span>
        <span className="absolute right-16 bg-primary px-3 py-1 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Dúvidas? Fale Conosco</span>
      </Link>
    </div>
  )
}
