import React from 'react'
import { createClient } from '@/lib/supabase/server'

export default async function DisciplinasPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: dbUser } = await supabase.from('users').select('papel').eq('id', user?.id).single()
  const isAdmin = dbUser?.papel === 'ADMINISTRADOR'

  type DisciplinaRow = {
    id: string
    nome: string
    preco: number
    ativa: boolean
    descricao: string | null
    users: { nome: string } | { nome: string }[] | null
  }

  const { data: rawDisciplinas } = await supabase
    .from('disciplinas')
    .select('id, nome, preco, ativa, descricao, users!explicador_id(nome)')
    .order('created_at', { ascending: false })

  const disciplinas = rawDisciplinas as DisciplinaRow[] | null

  if (isAdmin) {
    return (
      <div className="pt-8 p-lg flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
          <div>
            <h1 className="font-display-lg text-display-lg text-primary">Gestão de Disciplinas</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mt-2">Administre o catálogo acadêmico, atribua explicadores especializados e organize os conteúdos programáticos com rigor técnico.</p>
          </div>
          <div className="flex gap-sm">
            <button className="flex items-center gap-xs px-md py-2 border border-primary text-primary hover:bg-primary-container/5 transition-all font-label-md rounded">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filtrar
            </button>
            <button className="flex items-center gap-xs px-md py-2 bg-primary-container text-on-primary hover:opacity-90 transition-all font-label-md rounded">
              <span className="material-symbols-outlined text-sm">add</span> Nova Disciplina
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
          <div className="bg-white p-md border border-outline-variant rounded">
            <p className="text-on-surface-variant font-label-md uppercase tracking-wider mb-xs">Disciplinas Ativas</p>
            <h3 className="font-headline-lg text-headline-lg text-primary">{disciplinas?.filter(d => d.ativa).length || 0}</h3>
            <div className="flex items-center gap-1 text-green-700 font-label-md mt-sm">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> Atualizado
            </div>
          </div>
          <div className="bg-white p-md border border-outline-variant rounded">
            <p className="text-on-surface-variant font-label-md uppercase tracking-wider mb-xs">Total Estudantes</p>
            <h3 className="font-headline-lg text-headline-lg text-primary">1.284</h3>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-md mt-sm">Média 30.5 por turma</div>
          </div>
          <div className="bg-white p-md border border-outline-variant rounded">
            <p className="text-on-surface-variant font-label-md uppercase tracking-wider mb-xs">Aulas Ministradas</p>
            <h3 className="font-headline-lg text-headline-lg text-primary">856</h3>
            <div className="flex items-center gap-1 text-secondary font-label-md mt-sm">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span> Ver cronograma
            </div>
          </div>
          <div className="bg-white p-md border border-outline-variant rounded">
            <p className="text-on-surface-variant font-label-md uppercase tracking-wider mb-xs">Taxa de Conclusão</p>
            <h3 className="font-headline-lg text-headline-lg text-primary">94%</h3>
            <div className="flex items-center gap-1 text-secondary font-label-md mt-sm">Meta institucional: 92%</div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant overflow-hidden rounded">
          <div className="p-md flex items-center justify-between border-b border-outline-variant bg-surface-container-low">
            <div className="flex items-center gap-md">
              <label className="flex items-center gap-xs cursor-pointer">
                <input className="rounded-sm border-outline text-primary focus:ring-primary" type="checkbox"/>
                <span className="text-label-md text-on-surface-variant">Selecionar Todos</span>
              </label>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-bright border-b border-outline-variant">
                <tr>
                  <th className="w-12 px-md py-sm"></th>
                  <th className="px-md py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[10px]">Identificador</th>
                  <th className="px-md py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[10px]">Disciplina & Categoria</th>
                  <th className="px-md py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[10px]">Explicador Responsável</th>
                  <th className="px-md py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-md py-sm font-label-md text-on-surface-variant uppercase tracking-widest text-[10px]">Ações</th>
                </tr>
              </thead>
              <tbody className="text-body-md divide-y divide-outline-variant/30">
                {disciplinas?.map(d => {
                  const explicadorName = Array.isArray(d.users)
                    ? (d.users as { nome: string }[])[0]?.nome
                    : (d.users as { nome: string } | null)?.nome
                  return (
                    <tr key={d.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-md py-md"><input className="rounded-sm border-outline text-primary focus:ring-primary ml-4" type="checkbox"/></td>
                      <td className="px-md py-md font-mono text-secondary text-sm">#{d.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-md py-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{d.nome}</span>
                          <span className="text-caption text-on-surface-variant truncate w-48">{d.descricao || 'Sem descrição'}</span>
                        </div>
                      </td>
                      <td className="px-md py-md text-on-surface-variant">{explicadorName || 'N/A'}</td>
                      <td className="px-md py-md">
                        {d.ativa ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#A7EBF2] text-[#023859] text-[10px] font-bold uppercase">Ativa</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-highest text-on-secondary-fixed-variant text-[10px] font-bold uppercase">Inativa</span>
                        )}
                      </td>
                      <td className="px-md py-md">
                        <button className="text-on-surface-variant hover:text-primary p-1"><span className="material-symbols-outlined">edit</span></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // STUDENT VIEW
  const studentDisciplinas = disciplinas?.filter(d => d.ativa).slice(0, 3)

  return (
    <div className="max-w-[1280px] mx-auto p-lg">
      <nav className="mb-lg flex items-center gap-xs text-on-surface-variant font-label-md text-label-md">
        <a className="hover:text-primary" href="#">Disciplinas</a>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary font-semibold">Catálogo</span>
      </nav>

      {/* Discipline Catalog (Horizontal Bento Style) */}
      <section className="mt-xl">
        <h3 className="font-headline-md text-headline-md text-primary mb-lg">Disciplinas Recomendadas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {studentDisciplinas?.map((disciplina, index) => {
            const images = [
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAhzUe9MZJzwj8ShMowtrwcETy7Sg26a6FaVxf-jMswBckJgxkjzRQj5nVDh1TCZwpo22yOwaPv6dl2fSQiDZ6VwWl7wF_fC6JLHLbGGtTsvD7EKXP6OywbMGtLiEfUDKSQ2UvAYacSs18-95uMC3M2KNqW9GQ67fuDwxbsJ-jW45500X5bNqHm9j0UreWUewsJx500lm9d2IshNVtdvRGvonf57hEdNA32Kb8A0OPIZMaSLg4gyvy3Bj21ktEpNF2roxe2EEHNKTv9",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCEP3b1kEt3huGVnXW1cDBG8dJUwEpFxbvtxrnq3FLuDp8I7bA_pfJmuMlsTo87tv4uUxs6bKFYvRZVQWH7_QulcNOr__wB8yvEM7tMNLvuO6cpNDn3D3bmtC17KVAk4kG9xQQpUKb-QlLfgpFJhoiXC2TbSguTzYS_h6JFvSb0ZDk3WEFv2DG432IMe87Nuuzwu7Cget7tnUrmU26EdYTpWaVH-aaOp2_1_uu_p74hmsx3uyAOutqq-cKA1EPhG2OLe-ElqEiIBehX",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBpZfMGTeK03rsawFBNIcTcjsjaHJKioNEVZ-KBhmLj80PJdMCm2GOpGcoePH9gAVtRQCJI_NmwbQseUjmfHv_TFT25hO5WgEp5n2-n6JffaMVkenYfJ3ZDkOl5_4i10PxJdFwTfZNiyh7w8aUum2ouZ_tpTe4-kCTTYq6UleL0Q7km-hbuFoAipgNO856ZmuuSqA_3DQCDd87bUkBfj1Z980G_E8EIrFeuGwehpV6zMvThkb5hVRyYiEJA_yDM6ZSCR3iHpMNH246A"
            ]
            const imgUrl = images[index % images.length]
            
            // Handle array or object from Supabase users join
            const explicadorName = Array.isArray(disciplina.users) ? disciplina.users[0]?.nome : disciplina.users?.nome

            return (
              <div key={disciplina.id} className="bg-surface border border-outline-variant group hover:shadow-xl transition-all duration-300 flex flex-col rounded overflow-hidden">
                <div className="h-40 bg-surface-container overflow-hidden">
                  <img src={imgUrl} alt={disciplina.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-md flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-xs">
                      <h5 className="text-primary font-bold text-title-lg">{disciplina.nome}</h5>
                      <span className="text-secondary font-bold">€ {disciplina.preco}</span>
                    </div>
                    <p className="text-on-surface-variant text-label-md mb-md flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      {explicadorName || 'Professor'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="bg-surface-container-high text-on-surface-variant px-xs py-unit font-label-md text-caption uppercase rounded">Inscrições Abertas</span>
                    <button className="text-primary flex items-center gap-xs font-semibold group-hover:gap-md transition-all">
                      Ver Detalhes <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          
          {(!studentDisciplinas || studentDisciplinas.length === 0) && (
             <div className="col-span-3 text-center py-xl text-on-surface-variant border border-dashed border-outline-variant rounded bg-surface">
               Não há disciplinas ativas no momento.
             </div>
          )}
        </div>
      </section>
    </div>
  )
}
