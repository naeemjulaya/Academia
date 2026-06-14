import React from 'react'
import { createClient } from '@/lib/supabase/server'

export default async function PagamentosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: dbUser } = await supabase.from('users').select('papel').eq('id', user?.id).single()

  const isAdmin = dbUser?.papel === 'ADMINISTRADOR'

  if (isAdmin) {
    // ADMIN VIEW: Gestão de Pagamentos
    const { data: pagamentos } = await supabase
      .from('pagamentos')
      .select('id, valor, estado, created_at, inscricoes(estudante_id, disciplinas(nome))')
      .order('created_at', { ascending: false })

    // Simulate sum
    const totalReceita = pagamentos?.filter(p => p.estado === 'PAGO').reduce((acc, p) => acc + Number(p.valor), 0) || 0

    return (
      <div className="pt-8 px-lg pb-xl max-w-container-max mx-auto">
        <section className="mb-xl flex justify-between items-end">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-primary mb-xs">Gestão de Pagamentos</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Valide comprovantes de depósito, gere relatórios financeiros e acompanhe a receita institucional em tempo real.</p>
          </div>
          <div className="flex gap-sm">
            <button className="flex items-center gap-xs px-md py-sm bg-surface border border-outline-variant text-primary rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined">download</span> Exportar Excel
            </button>
            <button className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg font-label-md text-label-md hover:opacity-90 transition-all shadow-sm">
              <span className="material-symbols-outlined">picture_as_pdf</span> Relatório PDF
            </button>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-gutter mb-xl">
          {/* Main Chart */}
          <div className="col-span-8 bg-surface/85 backdrop-blur-md border border-[#D8EAF0] rounded-xl p-lg h-80 relative overflow-hidden">
            <div className="flex justify-between items-start mb-lg">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Fluxo de Receita (Mensal)</p>
                <p className="font-headline-md text-headline-md text-primary">€ {totalReceita.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-xs text-secondary bg-secondary-container px-sm py-1 rounded-full font-label-md">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                <span>+12.5%</span>
              </div>
            </div>
            {/* Mock Graphic Visual */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-primary-container/10 to-transparent flex items-end">
              <div className="flex items-end justify-between w-full h-full px-lg gap-sm">
                <div className="w-full bg-primary-container h-1/4 rounded-t-sm opacity-20"></div>
                <div className="w-full bg-primary-container h-1/2 rounded-t-sm opacity-40"></div>
                <div className="w-full bg-primary-container h-2/3 rounded-t-sm opacity-60"></div>
                <div className="w-full bg-primary-container h-3/4 rounded-t-sm opacity-80"></div>
                <div className="w-full bg-primary h-full rounded-t-sm"></div>
                <div className="w-full bg-secondary h-5/6 rounded-t-sm"></div>
                <div className="w-full bg-primary-container h-1/2 rounded-t-sm opacity-50"></div>
              </div>
            </div>
          </div>
          {/* Secondary Stats */}
          <div className="col-span-4 space-y-gutter">
            <div className="bg-surface/85 backdrop-blur-md border border-[#D8EAF0] rounded-xl p-md flex flex-col justify-center h-[calc(50%-12px)]">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Transações Registadas</p>
              <div className="flex items-baseline gap-sm">
                <h4 className="font-headline-md text-headline-md text-primary">{pagamentos?.length || 0}</h4>
              </div>
              <div className="mt-md w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary w-[78%] h-full rounded-full"></div>
              </div>
            </div>
            <div className="bg-primary text-white rounded-xl p-md flex flex-col justify-center h-[calc(50%-12px)]">
              <p className="font-label-md text-label-md text-on-primary-container uppercase tracking-wider">Pendências de Validação</p>
              <div className="flex items-center justify-between">
                <h4 className="font-headline-md text-headline-md">{pagamentos?.filter(p => p.estado === 'PENDENTE').length || 0}</h4>
                <span className="material-symbols-outlined text-[32px] opacity-40">pending_actions</span>
              </div>
              <p className="font-caption text-caption text-on-primary-container mt-xs italic">Ações urgentes requeridas</p>
            </div>
          </div>
        </section>

        <section className="bg-surface/85 backdrop-blur-md border border-[#D8EAF0] rounded-xl overflow-hidden">
          <div className="p-md bg-surface-container-low border-b border-[#D8EAF0] flex justify-between items-center">
            <h5 className="font-title-lg text-title-lg text-primary">Fila de Revisão</h5>
            <div className="flex gap-sm">
              <select className="bg-white border border-outline-variant rounded-lg text-label-md py-1 px-3 focus:ring-primary outline-none">
                <option>Todas as Disciplinas</option>
              </select>
              <select className="bg-white border border-outline-variant rounded-lg text-label-md py-1 px-3 focus:ring-primary outline-none">
                <option>Mais Recentes</option>
                <option>Valor (Decrescente)</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/30 border-b border-outline-variant">
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase">Estudante ID</th>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase">Disciplina</th>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase">Valor</th>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase">Estado</th>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md divide-y divide-outline-variant/30">
                {pagamentos?.map(p => {
                  // @ts-ignore
                  const disciplina = p.inscricoes?.[0]?.disciplinas?.[0]?.nome ?? 'Desconhecida'
                  // @ts-ignore
                  const estId = p.inscricoes?.[0]?.estudante_id ?? 'Desconhecido'

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-md">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold text-xs">
                            ES
                          </div>
                          <div>
                            <p className="font-semibold text-primary">ID: {estId.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-md py-md text-on-surface-variant">{disciplina}</td>
                      <td className="px-md py-md font-semibold">€ {p.valor}</td>
                      <td className="px-md py-md">
                        {p.estado === 'PENDENTE' && <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-xs uppercase font-bold">Pendente</span>}
                        {p.estado === 'PAGO' && <span className="bg-[#A7EBF2] text-[#023859] px-2 py-0.5 rounded text-xs uppercase font-bold">Pago</span>}
                      </td>
                      <td className="px-md py-md text-right">
                        <div className="flex justify-end gap-sm">
                          <button className="p-1.5 rounded-lg text-error hover:bg-error-container transition-all" title="Rejeitar">
                            <span className="material-symbols-outlined">close</span>
                          </button>
                          <button className="p-1.5 rounded-lg text-primary bg-secondary-container hover:bg-secondary-fixed transition-all" title="Aprovar">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }

  // STUDENT VIEW
  const { data: inscricoes } = await supabase.from('inscricoes').select('id').eq('estudante_id', user?.id)
  const { data: pagamentos } = await supabase
    .from('pagamentos')
    .select('id, valor, estado, created_at, inscricoes(disciplinas(nome))')
    .in('inscricao_id', (inscricoes ?? []).map(i => i.id))
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-[1280px] mx-auto p-lg">
      <div className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Meus Pagamentos</h2>
        <p className="font-body-lg text-on-surface-variant">Acompanhe seu histórico financeiro, recibos e mensalidades.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-lg shadow-[0_8px_24px_rgba(1,28,64,0.04)] rounded">
        <h3 className="font-title-lg text-title-lg text-primary mb-md">Histórico Financeiro</h3>
        <div className="space-y-4">
          {pagamentos?.map(p => {
            const date = new Date(p.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
            // @ts-ignore
            const nomeDisciplina = p.inscricoes?.[0]?.disciplinas?.[0]?.nome ?? 'Pagamento'
            
            return (
              <div key={p.id} className="p-sm border border-outline-variant bg-surface rounded flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-2 md:mb-0">
                  <p className="font-label-md text-primary font-bold text-lg">{nomeDisciplina}</p>
                  <p className="text-caption text-on-surface-variant mt-1">Data: {date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-primary text-xl">€ {p.valor}</p>
                  <div className="flex items-center gap-3">
                    {p.estado === 'PAGO' ? (
                      <span className="text-[10px] px-3 py-1 bg-[#A7EBF2] text-[#023859] rounded uppercase font-bold">Liquidado</span>
                    ) : (
                      <span className="text-[10px] px-3 py-1 bg-error-container text-on-error-container rounded uppercase font-bold">Em Atraso / Pendente</span>
                    )}
                    <button className="text-label-md text-secondary border border-secondary px-3 py-1.5 rounded hover:bg-secondary hover:text-white transition-all flex items-center">
                      <span className="material-symbols-outlined text-[18px] mr-1">upload_file</span> Comprovativo
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {(!pagamentos || pagamentos.length === 0) && (
            <div className="text-center text-on-surface-variant py-8">Não há registo de pagamentos.</div>
          )}
        </div>
      </div>
    </div>
  )
}
