import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('nome, papel')
    .eq('id', user.id)
    .single()

  if (profile?.papel !== 'ADMINISTRADOR') redirect('/dashboard')

  // Real stats from DB
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: totalDisciplinas } = await supabase.from('disciplinas').select('*', { count: 'exact', head: true })
  const { count: totalInscricoes } = await supabase.from('inscricoes').select('*', { count: 'exact', head: true })
  const { count: pagamentosPendentes } = await supabase
    .from('pagamentos')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'PENDENTE')

  // Recent users
  const { data: recentUsers } = await supabase
    .from('users')
    .select('id, nome, email, papel, created_at, ativo')
    .order('created_at', { ascending: false })
    .limit(8)

  const roleBadge = (papel: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      ADMINISTRADOR: { bg: 'bg-primary', text: 'text-on-primary' },
      COORDENADOR:   { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
      EXPLICADOR:    { bg: 'bg-tertiary-fixed-dim', text: 'text-on-tertiary-fixed' },
      ESTUDANTE:     { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
    }
    return map[papel] ?? { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' }
  }

  const stats = [
    { label: 'Total de Utilizadores', value: totalUsers ?? 0, icon: 'group', color: 'text-primary' },
    { label: 'Disciplinas Ativas', value: totalDisciplinas ?? 0, icon: 'school', color: 'text-secondary' },
    { label: 'Inscrições', value: totalInscricoes ?? 0, icon: 'assignment_turned_in', color: 'text-tertiary' },
    { label: 'Pagamentos Pendentes', value: pagamentosPendentes ?? 0, icon: 'pending_actions', color: 'text-error' },
  ]

  return (
    <div className="max-w-container-max mx-auto p-lg">
      {/* Header */}
      <div className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Painel de Administração</h2>
        <p className="font-body-lg text-on-surface-variant">
          Visão geral do sistema — Bem-vindo, {profile?.nome?.split(' ')[0]}.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg shadow-sm flex items-start gap-md">
            <span className={`material-symbols-outlined text-[36px] ${stat.color} opacity-80`}>{stat.icon}</span>
            <div>
              <p className="font-display-sm text-display-sm text-primary font-bold leading-none">{stat.value}</p>
              <p className="text-caption text-on-surface-variant mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h3 className="font-title-lg text-title-lg text-primary">Utilizadores Recentes</h3>
            <p className="font-caption text-on-surface-variant">Últimos registos no sistema.</p>
          </div>
          <a href="/dashboard/admin/utilizadores" className="bg-primary-container text-on-primary px-md py-2 font-label-md text-label-md flex items-center hover:opacity-90 transition-opacity rounded">
            <span className="material-symbols-outlined mr-xs text-[18px]">manage_accounts</span> Gerir todos
          </a>
        </div>

        <div className="overflow-x-auto">
          {(!recentUsers || recentUsers.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-md opacity-40">group</span>
              <p className="font-body-lg">Nenhum utilizador registado ainda.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Nome</th>
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Email</th>
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Papel</th>
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Estado</th>
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Registado</th>
                </tr>
              </thead>
              <tbody className="text-body-md divide-y divide-outline-variant/30">
                {recentUsers.map((u) => {
                  const badge = roleBadge(u.papel)
                  const date = new Date(u.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
                  return (
                    <tr key={u.id} className="hover:bg-surface-container transition-colors">
                      <td className="py-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-sm">
                            {u.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-primary">{u.nome}</span>
                        </div>
                      </td>
                      <td className="py-md text-on-surface-variant">{u.email}</td>
                      <td className="py-md">
                        <span className={`text-[10px] px-2 py-0.5 ${badge.bg} ${badge.text} rounded-full uppercase font-bold tracking-wider`}>
                          {u.papel}
                        </span>
                      </td>
                      <td className="py-md">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${u.ativo ? 'bg-[#A7EBF2] text-[#023859]' : 'bg-error-container text-on-error-container'}`}>
                          {u.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-md text-on-surface-variant">{date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
