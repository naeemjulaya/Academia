import React from 'react'

export default function MateriaisPage() {
  return (
    <div className="max-w-[1280px] mx-auto p-lg h-full">
      <div className="mb-xl flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Biblioteca de Materiais</h2>
          <p className="font-body-lg text-on-surface-variant">Acesse apresentações, exercícios e documentos de apoio.</p>
        </div>
        <div className="flex gap-sm">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input className="pl-9 pr-4 py-2 bg-surface-container-low border-none rounded focus:ring-1 focus:ring-primary text-body-md w-64 outline-none" placeholder="Procurar material..." type="text"/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-md mt-lg">
        {/* Placeholder folders */}
        {[
          { title: "Direito Constitucional I", items: 12 },
          { title: "Cálculo Diferencial", items: 8 },
          { title: "Anatomia Humana", items: 24 },
          { title: "Sistemas Distribuídos", items: 5 }
        ].map((folder, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant p-md rounded hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-secondary text-[40px] group-hover:scale-110 transition-transform">folder_open</span>
              <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <h4 className="font-title-lg text-primary font-bold truncate">{folder.title}</h4>
            <p className="text-caption text-on-surface-variant mt-1">{folder.items} arquivos</p>
          </div>
        ))}
      </div>

      <div className="mt-xl">
        <h3 className="font-title-lg text-primary mb-md">Arquivos Recentes</h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-bright border-b border-outline-variant">
              <tr>
                <th className="px-md py-sm font-label-md text-on-surface-variant uppercase text-[11px]">Nome do Arquivo</th>
                <th className="px-md py-sm font-label-md text-on-surface-variant uppercase text-[11px]">Disciplina</th>
                <th className="px-md py-sm font-label-md text-on-surface-variant uppercase text-[11px]">Data</th>
                <th className="px-md py-sm font-label-md text-on-surface-variant uppercase text-[11px] text-right">Tamanho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-body-md">
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-md py-md flex items-center gap-xs">
                  <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                  <span className="text-primary font-semibold hover:underline cursor-pointer">Apontamentos_Semana1.pdf</span>
                </td>
                <td className="px-md py-md text-on-surface-variant">Direito Constitucional I</td>
                <td className="px-md py-md text-on-surface-variant">Hoje</td>
                <td className="px-md py-md text-on-surface-variant text-right">2.4 MB</td>
              </tr>
              <tr className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-md py-md flex items-center gap-xs">
                  <span className="material-symbols-outlined text-blue-500">description</span>
                  <span className="text-primary font-semibold hover:underline cursor-pointer">Lista_Exercicios_1.docx</span>
                </td>
                <td className="px-md py-md text-on-surface-variant">Cálculo Diferencial</td>
                <td className="px-md py-md text-on-surface-variant">Ontem</td>
                <td className="px-md py-md text-on-surface-variant text-right">1.1 MB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
