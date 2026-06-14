import React from 'react'
import { createClient } from '@/lib/supabase/server'

export default async function ExplicadorDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Minhas Disciplinas
  const { data: disciplinas } = await supabase
    .from('disciplinas')
    .select('id, nome, ativa, created_at')
    .eq('explicador_id', user?.id)

  // We could fetch students by getting inscricoes for these disciplinas
  const { data: inscricoes } = await supabase
    .from('inscricoes')
    .select('id, estudante_id, estado, disciplinas(nome), users!estudante_id(nome)')
    .in('disciplina_id', (disciplinas ?? []).map(d => d.id))

  const totalAlunos = inscricoes?.length || 0

  return (
    <div className="max-w-[1200px] mx-auto p-lg">
      {/* Welcome Header */}
      <section className="mb-xl flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Painel do Explicador</h2>
          <p className="text-on-surface-variant font-body-lg">Gerencie suas disciplinas, acompanhe o progresso dos alunos e publique novos conteúdos.</p>
        </div>
        <button className="bg-primary-container text-on-primary px-md py-sm rounded-lg flex items-center gap-xs hover:opacity-90 transition-all font-label-md">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          Novo Material
        </button>
      </section>

      {/* Key Metrics Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
        <div className="md:col-span-2 bg-surface p-lg border border-outline-variant rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="material-symbols-outlined text-primary mb-sm">group</span>
            <h3 className="text-on-surface-variant font-label-md uppercase tracking-widest">Total de Estudantes</h3>
          </div>
          <div className="flex items-end gap-md mt-md">
            <p className="text-display-lg font-display-lg text-primary">{totalAlunos}</p>
            <span className="text-secondary bg-secondary-container px-xs py-[2px] rounded font-label-md mb-xs">Alunos Ativos</span>
          </div>
        </div>
        <div className="bg-surface p-lg border border-outline-variant rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="material-symbols-outlined text-secondary mb-sm">book</span>
            <h3 className="text-on-surface-variant font-label-md uppercase tracking-widest">Disciplinas</h3>
          </div>
          <p className="text-headline-lg font-headline-lg text-primary mt-md">{disciplinas?.length || 0}</p>
        </div>
        <div className="bg-surface p-lg border border-outline-variant rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="material-symbols-outlined text-tertiary mb-sm">download</span>
            <h3 className="text-on-surface-variant font-label-md uppercase tracking-widest">Downloads</h3>
          </div>
          <p className="text-headline-lg font-headline-lg text-primary mt-md">1.2k</p>
        </div>
      </section>

      {/* Main Interactive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Discipline Management & Uploads */}
        <div className="lg:col-span-2 space-y-gutter">
          {/* Assigned Disciplines */}
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-title-lg text-title-lg text-primary">Minhas Disciplinas</h3>
              <button className="text-secondary font-label-md hover:underline">Ver todas</button>
            </div>
            <div className="divide-y divide-outline-variant">
              {disciplinas?.map(d => (
                <div key={d.id} className="p-md flex items-center hover:bg-surface-container-low transition-colors group">
                  <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-on-primary mr-md">
                    <span className="material-symbols-outlined">functions</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-title-lg text-title-lg text-primary">{d.nome}</h4>
                    <p className="text-caption font-caption text-on-surface-variant">
                      Status: {d.ativa ? 'Ativa' : 'Inativa'} • Desde {new Date(d.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="flex gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-xs text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                    <button className="p-xs text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">upload_file</span></button>
                  </div>
                </div>
              ))}
              {(!disciplinas || disciplinas.length === 0) && (
                <div className="p-md text-center text-on-surface-variant">Nenhuma disciplina atribuída.</div>
              )}
            </div>
          </div>
          
          {/* Content Upload Area */}
          <div className="bg-surface border-2 border-dashed border-outline-variant rounded-xl p-xl text-center hover:border-primary transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-outline group-hover:text-primary text-4xl mb-md transition-colors">cloud_upload</span>
            <h4 className="font-title-lg text-title-lg text-primary mb-xs">Carregar Novos Conteúdos</h4>
            <p className="text-on-surface-variant font-body-md max-w-md mx-auto">Arraste seus arquivos PDF, vídeos ou planilhas para disponibilizar aos seus alunos instantaneamente.</p>
            <div className="mt-md flex justify-center gap-sm">
              <span className="px-sm py-xs bg-surface-container rounded text-caption font-caption">PDF até 50MB</span>
              <span className="px-sm py-xs bg-surface-container rounded text-caption font-caption">MP4 até 1GB</span>
            </div>
          </div>
        </div>

        {/* Messages & Stats */}
        <div className="space-y-gutter">
          <div className="bg-surface border border-outline-variant rounded-xl flex flex-col h-[400px]">
            <div className="p-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-xs">
                <span className="material-symbols-outlined">chat_bubble</span> Mensagens
              </h3>
              <span className="bg-error text-on-error rounded-full px-xs py-[2px] text-caption font-caption">3 Novas</span>
            </div>
            <div className="flex-1 overflow-y-auto p-md space-y-md">
              <div className="flex gap-sm items-start hover:bg-surface-container-low p-xs rounded transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">MC</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-label-md text-label-md text-primary truncate">Mariana Costa</span>
                    <span className="text-caption font-caption text-outline">10:24</span>
                  </div>
                  <p className="text-caption font-caption text-on-surface-variant truncate">Professor, tenho uma dúvida no exercício 4 da lista de Cálculo...</p>
                </div>
              </div>
              <div className="flex gap-sm items-start hover:bg-surface-container-low p-xs rounded transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-xs">RM</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-label-md text-label-md text-primary truncate">Ricardo Mendes</span>
                    <span className="text-caption font-caption text-outline">Ontem</span>
                  </div>
                  <p className="text-caption font-caption text-on-surface-variant truncate">O material de revisão ficou excelente, muito obrigado!</p>
                </div>
              </div>
            </div>
            <div className="p-md border-t border-outline-variant">
              <button className="w-full text-center text-primary font-label-md py-xs hover:bg-surface-container rounded transition-all">Ver todas as conversas</button>
            </div>
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <section className="mt-xl bg-surface border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-lg border-b border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="font-title-lg text-title-lg text-primary">Acompanhamento de Alunos</h3>
            <p className="text-caption font-caption text-on-surface-variant">Desempenho e acesso recente por disciplina</p>
          </div>
          <div className="flex gap-sm">
            <select className="bg-surface-container-low border-outline-variant rounded-lg text-label-md focus:ring-primary focus:border-primary outline-none">
              <option>Todas as Disciplinas</option>
              {disciplinas?.map(d => (
                <option key={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase">Estudante</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase">Disciplina</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase">Status</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {inscricoes?.map(i => {
                // @ts-ignore
                const studentName = Array.isArray(i.users) ? i.users[0]?.nome : i.users?.nome
                // @ts-ignore
                const discName = Array.isArray(i.disciplinas) ? i.disciplinas[0]?.nome : i.disciplinas?.nome

                return (
                  <tr key={i.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">
                          {studentName ? studentName.slice(0, 2).toUpperCase() : 'AL'}
                        </div>
                        <span className="font-body-md text-body-md text-primary">{studentName || 'Estudante'}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md text-on-surface-variant font-body-md">{discName}</td>
                    <td className="px-lg py-md">
                      {i.estado === 'ATIVA' ? (
                        <span className="bg-[#A7EBF2] text-primary-container px-sm py-[2px] rounded-full text-caption font-label-md">Ativo</span>
                      ) : (
                        <span className="bg-surface-container-highest text-secondary px-sm py-[2px] rounded-full text-caption font-label-md">{i.estado}</span>
                      )}
                    </td>
                    <td className="px-lg py-md">
                      <button className="text-primary hover:underline font-label-md">Relatório</button>
                    </td>
                  </tr>
                )
              })}
              {(!inscricoes || inscricoes.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-lg py-md text-center text-on-surface-variant">Nenhum estudante inscrito.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
