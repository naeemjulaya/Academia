'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ userName, userRole }: { userName: string, userRole: string }) {
  const pathname = usePathname()

  const roleTitle = userRole === 'ESTUDANTE' ? 'Portal do Aluno' : 'Portal Institucional'
  const roleSubtitle = userRole === 'ESTUDANTE' ? 'Engenharia de Software' : userRole

  let dashboardPath = '/dashboard/estudante'
  if (userRole === 'ADMINISTRADOR') dashboardPath = '/dashboard/admin'
  else if (userRole === 'COORDENADOR') dashboardPath = '/dashboard/coordenador'
  else if (userRole === 'EXPLICADOR') dashboardPath = '/dashboard/explicador'

  const links = [
    { href: dashboardPath, icon: 'dashboard', label: 'Painel' },
    { href: '/dashboard/disciplinas', icon: 'school', label: 'Disciplinas' },
    { href: '/dashboard/inscricoes', icon: 'assignment_turned_in', label: 'Inscrições' },
    { href: '/dashboard/pagamentos', icon: 'payments', label: 'Pagamentos' },
    { href: '/dashboard/materiais', icon: 'description', label: 'Materiais' },
    { href: '/dashboard/mensagens', icon: 'chat', label: 'Mensagens' },
    { href: '/dashboard/perfil', icon: 'person', label: 'Perfil' },
  ]

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-md z-50 hidden md:flex">
      <div className="px-md mb-xl">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">Acadêmico</h1>
        <p className="font-label-md text-label-md text-on-surface-variant">{roleTitle}</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== dashboardPath)
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`flex items-center px-md py-sm transition-colors group ${
                isActive 
                  ? 'text-primary border-l-[3px] border-primary bg-surface-container-low' 
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined mr-sm">{link.icon}</span>
              <span className="font-label-md text-label-md">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-md mt-auto pt-md border-t border-outline-variant">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden text-primary font-bold">
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-label-md text-label-md text-primary font-bold truncate">{userName}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider truncate">{roleSubtitle}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
