import React from 'react'
import { createClient } from '@/lib/supabase/server'

function getStatusBadge(estado: string) {
  switch (estado) {
    case 'APROVADO':
    case 'ATIVA':
      return <span className="inline-flex items-center px-2.5 py-0.5 bg-[#A7EBF2] text-[#023859] text-xs font-medium rounded-full">Aprovado</span>
    case 'PENDENTE':
      return <span className="inline-flex items-center px-2.5 py-0.5 bg-surface-container text-[#26658C] text-xs font-medium rounded-full">Pendente</span>
    case 'REJEITADO':
    case 'CANCELADA':
      return <span className="inline-flex items-center px-2.5 py-0.5 bg-error-container text-on-error-container text-xs font-medium rounded-full">Rejeitado</span>
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 bg-surface-container text-[#26658C] text-xs font-medium rounded-full">{estado}</span>
  }
}

function getPagamentoBadge(estado: string) {
  if (estado === 'PAGO') {
    return <span className="text-[10px] px-2 py-0.5 bg-[#A7EBF2] text-[#023859] rounded uppercase font-bold">Liquidado</span>
  }
  if (estado === 'PENDENTE' || estado === 'ATRASADO') {
    return <span className="text-[10px] px-2 py-0.5 bg-error-container text-on-error-container rounded uppercase font-bold">Em Atraso</span>
  }
  return <span className="text-[10px] px-2 py-0.5 bg-surface-container text-on-surface-variant rounded uppercase font-bold">{estado}</span>
}

export default async function InscricoesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: inscricoes } = await supabase
    .from('inscricoes')
    .select('id, estado, created_at, disciplinas(nome)')
    .eq('estudante_id', user?.id)
    .order('created_at', { ascending: false })

  const { data: pagamentos } = await supabase
    .from('pagamentos')
    .select('id, valor, estado, created_at, inscricoes(disciplinas(nome))')
    .in('inscricao_id', (inscricoes ?? []).map(i => i.id))
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-[1280px] mx-auto p-lg">
      <div className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Central do Aluno</h2>
        <p className="font-body-lg text-on-surface-variant">Gerencie seu percurso acadêmico, financeiro e comunicações institucionais.</p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Section: Inscrições */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-lg shadow-[0_8px_24px_rgba(1,28,64,0.04)]">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary mb-1">Inscrições Acadêmicas</h3>
              <p className="font-caption text-on-surface-variant">Últimas solicitações de matrícula e disciplinas isoladas.</p>
            </div>
            <button className="bg-primary-container text-on-primary px-md py-2 font-label-md text-label-md flex items-center hover:opacity-90 transition-opacity rounded">
              <span className="material-symbols-outlined mr-xs">add</span> Nova Inscrição
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Disciplina</th>
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Data</th>
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Tipo</th>
                  <th className="py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[11px]">Estado</th>
                </tr>
              </thead>
              <tbody className="text-body-md divide-y divide-outline-variant/30">
                {inscricoes?.map(i => {
                  const date = new Date(i.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
                  // @ts-ignore
                  const nome = i.disciplinas?.[0]?.nome ?? 'Desconhecida'
                  return (
                    <tr key={i.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-md font-semibold text-primary">{nome}</td>
                      <td className="py-md text-on-surface-variant">{date}</td>
                      <td className="py-md"><span className="text-xs px-2 py-0.5 bg-surface-container-high rounded text-secondary">Isolada</span></td>
                      <td className="py-md">{getStatusBadge(i.estado)}</td>
                    </tr>
                  )
                })}
                {(!inscricoes || inscricoes.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-md text-center text-on-surface-variant">Sem inscrições.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Pagamentos */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant p-lg h-full">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-title-lg text-title-lg text-primary">Pagamentos</h3>
              <span className="material-symbols-outlined text-secondary">payments</span>
            </div>
            <div className="space-y-4">
              {pagamentos?.map(p => {
                const date = new Date(p.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
                // @ts-ignore
                const nomeDisciplina = p.inscricoes?.[0]?.disciplinas?.[0]?.nome ?? 'Pagamento'
                return (
                  <div key={p.id} className="p-sm border border-outline-variant bg-surface rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-label-md text-primary">{nomeDisciplina}</p>
                        <p className="text-caption text-on-surface-variant">Data: {date}</p>
                      </div>
                      <p className="font-bold text-primary">€ {p.valor}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      {getPagamentoBadge(p.estado)}
                      <button className="text-label-md text-secondary border border-secondary px-3 py-1 rounded hover:bg-secondary hover:text-white transition-all flex items-center">
                        <span className="material-symbols-outlined text-[18px] mr-1">upload_file</span> Recibo
                      </button>
                    </div>
                  </div>
                )
              })}
              {(!pagamentos || pagamentos.length === 0) && (
                <div className="text-center text-on-surface-variant text-sm py-4">Sem pagamentos registados.</div>
              )}
            </div>
          </div>
        </div>

        {/* Section: Chat / Mensagens */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant overflow-hidden flex h-[600px] mt-gutter">
          <div className="w-80 border-r border-outline-variant flex flex-col">
            <div className="p-md border-b border-outline-variant bg-surface">
              <h3 className="font-title-lg text-title-lg text-primary">Mensagens</h3>
              <p className="text-caption text-on-surface-variant">Comunicações Diretas</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-md bg-surface-container-low border-l-4 border-primary cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-on-primary font-bold">PH</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-label-md text-primary truncate">Prof. Henrique Mendes</p>
                      <span className="text-[10px] text-on-surface-variant">14:20</span>
                    </div>
                    <p className="text-caption text-on-surface-variant truncate">O material de apoio já está...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-surface/30">
            <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-on-primary">PH</div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-label-md text-primary">Prof. Henrique Mendes</h4>
                  <p className="text-caption text-teal-600 font-medium">Online Agora</p>
                </div>
              </div>
              <div className="flex space-x-sm">
                <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all">videocam</button>
                <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all">info</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-lg space-y-md flex flex-col justify-end">
              <div className="flex items-end justify-end space-x-2 ml-auto max-w-[70%] mb-4">
                <div className="flex-1 bg-primary text-white p-md text-body-md rounded-t-xl rounded-l-xl">
                  Boa tarde, Professor. Com certeza. Vou verificar se houve algum conflito nas definições do ProtoBuf e farei o upload da correção até o final do dia. Obrigado pelo feedback!
                  <p className="text-[10px] mt-1 text-right text-white/70">14:20 • Lida</p>
                </div>
              </div>
              <div className="flex items-end space-x-2 max-w-[70%]">
                <div className="flex-1 bg-surface-container-high p-md text-body-md text-primary border border-outline-variant/20 rounded-t-xl rounded-r-xl">
                  Perfeito. O material de apoio já está disponível na aba de materiais. Bom trabalho.
                  <p className="text-[10px] mt-1 text-right text-on-surface-variant">14:22</p>
                </div>
              </div>
            </div>
            <div className="p-md bg-surface-container-lowest border-t border-outline-variant">
              <div className="flex items-center space-x-md bg-surface border border-outline-variant px-md py-sm rounded-lg focus-within:border-secondary transition-all">
                <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">attach_file</button>
                <input className="flex-1 bg-transparent border-none focus:ring-0 text-body-md py-1 outline-none" placeholder="Escreva sua mensagem aqui..." type="text"/>
                <button className="bg-primary-container text-on-primary w-10 h-10 rounded flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
