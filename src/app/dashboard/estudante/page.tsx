import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type Inscricao = {
  id: string
  estado: string
  created_at: string
  disciplinas: { nome: string }[] | null
}

type Pagamento = {
  id: string
  valor: number
  estado: string
  created_at: string
  inscricoes: {
    disciplinas: { nome: string }[] | null
  }[] | null
}

export default async function EstudanteDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('nome, curso, universidade')
    .eq('id', user.id)
    .single()

  const { data: inscricoes } = await supabase
    .from('inscricoes')
    .select('id, estado, created_at, disciplinas(nome)')
    .eq('estudante_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: pagamentos } = await supabase
    .from('pagamentos')
    .select('id, valor, estado, created_at, inscricoes(disciplinas(nome))')
    .in(
      'inscricao_id',
      (inscricoes ?? []).map((i) => i.id)
    )
    .order('created_at', { ascending: false })
    .limit(5)

  const userName = profile?.nome || user.email?.split('@')[0] || 'Aluno'
  const curso = profile?.curso || 'Curso não definido'

  const estadoBadge = (estado: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      ATIVA:     { bg: 'bg-[#A7EBF2]', text: 'text-[#023859]', label: 'Ativa' },
      PENDENTE:  { bg: 'bg-surface-container', text: 'text-[#26658C]', label: 'Pendente' },
      REJEITADA: { bg: 'bg-error-container', text: 'text-on-error-container', label: 'Rejeitada' },
      CANCELADA: { bg: 'bg-surface-container-high', text: 'text-on-surface-variant', label: 'Cancelada' },
    }
    return map[estado] ?? { bg: 'bg-surface-container', text: 'text-on-surface-variant', label: estado }
  }

  const pagamentoBadge = (estado: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      APROVADO:  { bg: 'bg-[#A7EBF2]', text: 'text-[#023859]', label: 'Liquidado' },
      PENDENTE:  { bg: 'bg-error-container', text: 'text-on-error-container', label: 'Pendente' },
      REJEITADO: { bg: 'bg-error-container', text: 'text-on-error-container', label: 'Rejeitado' },
    }
    return map[estado] ?? { bg: 'bg-surface-container', text: 'text-on-surface-variant', label: estado }
  }

  return (
    <div className="max-w-container-max mx-auto p-lg">
      {/* Page Header */}
      <div className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
          Bem-vindo, {userName.split(' ')[0]}
        </h2>
        <p className="font-body-lg text-on-surface-variant">
          {curso} · Gerencie o seu percurso académico, financeiro e comunicações institucionais.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">

        {/* Section: Inscrições (Wide Table) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-lg shadow-[0_8px_24px_rgba(1,28,64,0.04)] rounded-lg">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary mb-1">Inscrições Acadêmicas</h3>
              <p className="font-caption text-on-surface-variant">As suas solicitações de matrícula e disciplinas.</p>
            </div>
            <button className="bg-primary-container text-on-primary px-md py-2 font-label-md text-label-md flex items-center hover:opacity-90 transition-opacity rounded">
              <span className="material-symbols-outlined mr-xs">add</span> Nova Inscrição
            </button>
          </div>

          <div className="overflow-x-auto">
            {(!inscricoes || inscricoes.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-2xl text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] mb-md opacity-40">school</span>
                <p className="font-body-lg">Ainda não tem inscrições.</p>
                <p className="text-caption mt-1">Clique em "Nova Inscrição" para começar.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Disciplina</th>
                    <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Data</th>
                    <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-body-md divide-y divide-outline-variant/30">
                  {(inscricoes as Inscricao[]).map((i) => {
                    const badge = estadoBadge(i.estado)
                    const date = new Date(i.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
                    return (
                      <tr key={i.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="py-md font-semibold text-primary">{i.disciplinas?.[0]?.nome ?? '—'}</td>
                        <td className="py-md text-on-surface-variant">{date}</td>
                        <td className="py-md">
                          <span className={`inline-flex items-center px-2.5 py-0.5 ${badge.bg} ${badge.text} text-xs font-medium rounded-full`}>
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Section: Pagamentos */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg h-full">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-title-lg text-title-lg text-primary">Pagamentos</h3>
              <span className="material-symbols-outlined text-secondary">payments</span>
            </div>

            {(!pagamentos || pagamentos.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-[40px] mb-sm opacity-40">receipt_long</span>
                <p className="text-body-md">Nenhum pagamento registado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(pagamentos as unknown as Pagamento[]).map((p) => {
                  const badge = pagamentoBadge(p.estado)
                  const date = new Date(p.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  const nomeDisciplina = p.inscricoes?.[0]?.disciplinas?.[0]?.nome ?? 'Pagamento'
                  return (
                    <div key={p.id} className="p-sm border border-outline-variant bg-surface rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-label-md text-primary">{nomeDisciplina}</p>
                          <p className="text-caption text-on-surface-variant">{date}</p>
                        </div>
                        <p className="font-bold text-primary">{p.valor.toFixed(2)}€</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-[10px] px-2 py-0.5 ${badge.bg} ${badge.text} rounded uppercase font-bold`}>
                          {badge.label}
                        </span>
                        {p.estado === 'PENDENTE' && (
                          <button className="text-label-md text-secondary border border-secondary px-3 py-1 hover:bg-secondary hover:text-white transition-all flex items-center rounded text-xs">
                            <span className="material-symbols-outlined text-[16px] mr-1">upload_file</span> Comprovativo
                          </button>
                        )}
                        {p.estado === 'APROVADO' && (
                          <button className="text-label-md text-on-surface-variant border border-outline-variant px-3 py-1 hover:bg-surface-container transition-all flex items-center rounded text-xs">
                            <span className="material-symbols-outlined text-[16px] mr-1">download</span> Recibo
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section: Chat / Mensagens placeholder */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant overflow-hidden flex h-[420px] rounded-lg">
          <div className="flex flex-col items-center justify-center w-full text-on-surface-variant">
            <span className="material-symbols-outlined text-[56px] mb-md opacity-30">chat</span>
            <p className="font-title-lg text-on-surface-variant">Sistema de Mensagens</p>
            <p className="text-caption mt-1">Em breve — comunicação direta com professores e coordenadores.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
