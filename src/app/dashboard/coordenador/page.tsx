import React from 'react'
import { createClient } from '@/lib/supabase/server'

export default async function CoordenadorDashboardPage() {
  const supabase = await createClient()

  const { data: disciplinas } = await supabase
    .from('disciplinas')
    .select('id, nome, ativa, created_at, users!explicador_id(nome)')

  const { data: inscricoes } = await supabase.from('inscricoes').select('id, estado')
  
  const { data: explicadores } = await supabase.from('users').select('id').eq('papel', 'EXPLICADOR')

  const totalDisciplinas = disciplinas?.length || 0
  const totalInscricoes = inscricoes?.length || 0
  const totalExplicadores = explicadores?.length || 0

  return (
    <div className="max-w-[1280px] mx-auto p-lg space-y-lg">
      {/* Header & Key Growth Indicator */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Monitorização Acadêmica</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mt-2">Visualização analítica do desempenho pedagógico e taxas de adesão institucional para o período letivo.</p>
        </div>
        <div className="bg-secondary-container/30 px-lg py-md rounded-xl border border-secondary/20">
          <span className="text-label-md font-bold text-secondary uppercase tracking-wider block mb-1">Crescimento Global</span>
          <div className="flex items-baseline gap-xs">
            <span className="text-display-lg font-display-lg text-primary">+12.4%</span>
            <span className="material-symbols-outlined text-secondary">trending_up</span>
          </div>
        </div>
      </section>

      {/* Key Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="bg-surface/85 backdrop-blur-md border border-outline-variant p-md rounded-xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
          <div>
            <div className="flex justify-between items-start mb-md">
              <div className="bg-primary/5 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">person_add</span>
              </div>
              <span className="text-caption font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">Ativo</span>
            </div>
            <h3 className="font-label-md text-on-surface-variant">Novas Inscrições</h3>
            <p className="font-headline-md text-headline-md text-primary mt-1">{totalInscricoes}</p>
          </div>
          <div className="mt-md pt-md border-t border-outline-variant/30 flex items-center gap-xs">
            <span className="text-secondary font-bold">+8%</span>
            <span className="text-caption text-on-surface-variant">vs. último mês</span>
          </div>
        </div>
        <div className="bg-surface/85 backdrop-blur-md border border-outline-variant p-md rounded-xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
          <div>
            <div className="flex justify-between items-start mb-md">
              <div className="bg-secondary/5 p-2 rounded-lg">
                <span className="material-symbols-outlined text-secondary">auto_stories</span>
              </div>
              <span className="text-caption font-bold text-secondary bg-secondary-container/50 px-2 py-0.5 rounded">Em Revisão</span>
            </div>
            <h3 className="font-label-md text-on-surface-variant">Cursos Monitorados</h3>
            <p className="font-headline-md text-headline-md text-primary mt-1">{totalDisciplinas}</p>
          </div>
          <div className="mt-md pt-md border-t border-outline-variant/30 flex items-center gap-xs">
            <span className="text-on-surface-variant font-bold">100%</span>
            <span className="text-caption text-on-surface-variant">cobertura total</span>
          </div>
        </div>
        <div className="bg-surface/85 backdrop-blur-md border border-outline-variant p-md rounded-xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
          <div>
            <div className="flex justify-between items-start mb-md">
              <div className="bg-tertiary-container/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-on-tertiary-container">group</span>
              </div>
            </div>
            <h3 className="font-label-md text-on-surface-variant">Corpo Docente</h3>
            <p className="font-headline-md text-headline-md text-primary mt-1">{totalExplicadores}</p>
          </div>
          <div className="mt-md pt-md border-t border-outline-variant/30 flex items-center gap-xs">
            <span className="text-secondary font-bold">98.2%</span>
            <span className="text-caption text-on-surface-variant">taxa de retenção</span>
          </div>
        </div>
        <div className="bg-surface/85 backdrop-blur-md border border-outline-variant p-md rounded-xl flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
          <div>
            <div className="flex justify-between items-start mb-md">
              <div className="bg-error-container/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-error">assignment_late</span>
              </div>
            </div>
            <h3 className="font-label-md text-on-surface-variant">Pendências Acadêmicas</h3>
            <p className="font-headline-md text-headline-md text-primary mt-1">14</p>
          </div>
          <div className="mt-md pt-md border-t border-outline-variant/30 flex items-center gap-xs">
            <span className="text-error font-bold">-4%</span>
            <span className="text-caption text-on-surface-variant">redução mensal</span>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
        {/* Enrollment Growth Chart (Bento Large) */}
        <div className="xl:col-span-2 bg-surface/85 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col h-full relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-center mb-xl relative">
            <div>
              <h3 className="font-title-lg text-title-lg text-primary">Inscrições por Área de Estudo</h3>
              <p className="text-caption text-on-surface-variant">Distribuição quantitativa do semestre corrente</p>
            </div>
            <div className="flex gap-xs">
              <button className="px-3 py-1 bg-surface-container text-label-md rounded border border-outline-variant">Semanal</button>
              <button className="px-3 py-1 bg-primary text-on-primary text-label-md rounded shadow-md">Mensal</button>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-md relative min-h-[300px]">
            {/* Simple Pure CSS Bar Chart */}
            <div className="flex-1 flex flex-col items-center gap-sm">
              <div className="w-full bg-primary-container/20 rounded-t-lg relative group h-full">
                <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg transition-all duration-1000 group-hover:brightness-125" style={{height: '85%'}}></div>
              </div>
              <span className="text-caption text-on-surface-variant text-center leading-tight">Engenharia</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-sm">
              <div className="w-full bg-secondary-container/20 rounded-t-lg relative group h-full">
                <div className="absolute bottom-0 w-full bg-secondary-container rounded-t-lg transition-all duration-1000 group-hover:brightness-125" style={{height: '65%'}}></div>
              </div>
              <span className="text-caption text-on-surface-variant text-center leading-tight">Biomedicina</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-sm">
              <div className="w-full bg-primary-container/20 rounded-t-lg relative group h-full">
                <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg transition-all duration-1000 group-hover:brightness-125" style={{height: '95%'}}></div>
              </div>
              <span className="text-caption text-on-surface-variant text-center leading-tight">Direito</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-sm">
              <div className="w-full bg-secondary-container/20 rounded-t-lg relative group h-full">
                <div className="absolute bottom-0 w-full bg-secondary-container rounded-t-lg transition-all duration-1000 group-hover:brightness-125" style={{height: '45%'}}></div>
              </div>
              <span className="text-caption text-on-surface-variant text-center leading-tight">Artes</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-sm">
              <div className="w-full bg-primary-container/20 rounded-t-lg relative group h-full">
                <div className="absolute bottom-0 w-full bg-primary-container rounded-t-lg transition-all duration-1000 group-hover:brightness-125" style={{height: '72%'}}></div>
              </div>
              <span className="text-caption text-on-surface-variant text-center leading-tight">Gestão</span>
            </div>
          </div>
        </div>
        
        {/* Academic Integrity Status */}
        <div className="bg-surface/85 backdrop-blur-md border border-outline-variant p-lg rounded-xl flex flex-col">
          <h3 className="font-title-lg text-title-lg text-primary mb-md">Índice de Qualidade</h3>
          <div className="space-y-lg flex-1">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-label-md text-on-surface-variant">Taxa de Aprovação</span>
                <span className="text-label-md font-bold text-primary">94.2%</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{width: '94.2%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-label-md text-on-surface-variant">Satisfação Discente</span>
                <span className="text-label-md font-bold text-primary">4.8/5.0</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary-container rounded-full" style={{width: '96%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-label-md text-on-surface-variant">Aderência ao Currículo</span>
                <span className="text-label-md font-bold text-primary">89%</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-on-tertiary-container rounded-full" style={{width: '89%'}}></div>
              </div>
            </div>
          </div>
          {/* Visual Highlight Card */}
          <div className="mt-auto bg-primary-container p-md rounded-xl text-on-primary relative overflow-hidden mt-8">
            <div className="relative z-10">
              <p className="text-caption opacity-80 uppercase tracking-widest mb-1">Destaque do Mês</p>
              <p className="font-headline-md text-headline-md leading-tight">Faculdade de Direito</p>
              <p className="text-caption mt-2">Maior crescimento orgânico em inscrições (+18.4%) desde a abertura do portal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Monitoring Table */}
      <section className="bg-surface/85 backdrop-blur-md border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center">
          <div>
            <h3 className="font-title-lg text-title-lg text-primary">Status das Disciplinas Ativas</h3>
            <p className="text-caption text-on-surface-variant">Monitoramento de engajamento e cumprimento de prazos pedagógicos</p>
          </div>
          <div className="flex gap-sm">
            <button className="p-2 hover:bg-surface-container rounded-lg transition-colors border border-outline-variant">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="px-md py-2 bg-primary text-on-primary text-label-md rounded flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">download</span>
              Relatório Completo
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-lg py-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Cód / Disciplina</th>
                <th className="px-lg py-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Docente Responsável</th>
                <th className="px-lg py-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-center">Matriculados</th>
                <th className="px-lg py-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Status Pedagógico</th>
                <th className="px-lg py-md"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {disciplinas?.map(d => {
                // @ts-ignore
                const explicadorName = Array.isArray(d.users) ? d.users[0]?.nome : d.users?.nome

                return (
                  <tr key={d.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex flex-col">
                        <span className="text-body-md font-bold text-primary">#{d.id.slice(0, 8).toUpperCase()}</span>
                        <span className="text-caption text-on-surface-variant">{d.nome}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-xs">
                          {explicadorName ? explicadorName.slice(0,2).toUpperCase() : 'PR'}
                        </div>
                        <span className="text-body-md">{explicadorName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md text-center">
                      <span className="text-body-md">-</span>
                    </td>
                    <td className="px-lg py-md">
                      {d.ativa ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A7EBF2] text-[#023859]">
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant">
                          Em Revisão
                        </span>
                      )}
                    </td>
                    <td className="px-lg py-md text-right">
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
                    </td>
                  </tr>
                )
              })}
              {(!disciplinas || disciplinas.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-lg py-md text-center text-on-surface-variant">Nenhuma disciplina cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
