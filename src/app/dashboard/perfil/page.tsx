import React from 'react'
import { createClient } from '@/lib/supabase/server'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  let dbUser = null;
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    dbUser = data
  }

  return (
    <div className="max-w-screen-container-max mx-auto p-lg">
      {/* Header Section */}
      <div className="mb-xl flex justify-between items-end">
        <div>
          <nav className="flex gap-xs text-caption font-caption text-on-surface-variant mb-xs">
            <span>Portal</span>
            <span>/</span>
            <span className="text-primary font-medium">Perfil</span>
          </nav>
          <h2 className="font-display-lg text-display-lg text-primary">Meu Perfil</h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant mt-xs">Gerencie suas informações pessoais e configurações de conta.</p>
        </div>
        <div className="flex gap-md">
          <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md flex items-center gap-sm hover:opacity-90 transition-all">
            <span className="material-symbols-outlined">edit</span>
            Editar Perfil
          </button>
          <button className="border border-primary text-primary px-lg py-sm rounded-lg font-label-md text-label-md flex items-center gap-sm hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined">lock_reset</span>
            Alterar Palavra-passe
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Main Info Card */}
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          <section className="bg-surface/85 backdrop-blur-md border border-[#D8EAF0] p-lg rounded-xl">
            <div className="flex items-center gap-lg mb-lg border-b border-outline-variant pb-lg">
              <div className="relative group">
                <img alt="Perfil" className="w-32 h-32 object-cover rounded-full border-4 border-surface-container-highest shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPkpHOdcH5HR0GG1tADtnQ2EktcZf3j0_itMPpbAo1zjmUwmoqb9KVYLJ5a2wQxhgi6Us6kVtXqfC9R-jbcEJNf5wMNNOXv5taZ_2h-sZuI_aHcLe_jTp73QTlvm9GC-kUFgLssHbNXlX6VFRVnc_Hyi0UmgU_cB41l69eqJDD6UGAQiWoo4CNDVFJLjGgbAyXAuGsN8orYp0phqXvU9pmB1kW2NkI4xjYs2Tt4lSmHk8iHIkQ_eVXggPUm3xDlzYhjgwteotMUxgu"/>
                <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-headline-lg text-headline-lg text-primary">{dbUser?.nome || user?.email}</h3>
                <div className="flex gap-md mt-sm">
                  <span className="bg-[#A7EBF2] text-[#023859] px-sm py-1 rounded-full text-caption font-label-md">Ativo</span>
                  <span className="text-on-surface-variant text-body-md font-body-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    Academia Keven
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-lg gap-x-xl">
              <div>
                <label className="text-label-md font-label-md text-on-surface-variant block mb-unit uppercase tracking-wider">Papel no Sistema</label>
                <p className="text-body-lg font-body-lg text-primary font-medium">{dbUser?.papel || 'ESTUDANTE'}</p>
              </div>
              <div>
                <label className="text-label-md font-label-md text-on-surface-variant block mb-unit uppercase tracking-wider">Email Institucional</label>
                <p className="text-body-lg font-body-lg text-primary font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-label-md font-label-md text-on-surface-variant block mb-unit uppercase tracking-wider">Membro Desde</label>
                <p className="text-body-lg font-body-lg text-primary font-medium">{new Date(user?.created_at || '').toLocaleDateString('pt-PT')}</p>
              </div>
              <div>
                <label className="text-label-md font-label-md text-on-surface-variant block mb-unit uppercase tracking-wider">Último Login</label>
                <p className="text-body-lg font-body-lg text-primary font-medium">{new Date(user?.last_sign_in_at || '').toLocaleDateString('pt-PT')}</p>
              </div>
            </div>
          </section>

          <section className="bg-surface/85 backdrop-blur-md border border-[#D8EAF0] p-lg rounded-xl">
            <h4 className="font-title-lg text-title-lg text-primary mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined">account_balance</span>
              Informação Adicional
            </h4>
            <div className="grid grid-cols-1 gap-lg">
              <div className="flex justify-between items-center py-sm border-b border-outline-variant">
                <span className="text-body-md font-label-md text-on-surface-variant">Instituição</span>
                <span className="text-body-md font-body-md text-primary font-semibold">Academia Keven</span>
              </div>
              <div className="flex justify-between items-center py-sm border-b border-outline-variant">
                <span className="text-body-md font-label-md text-on-surface-variant">Departamento</span>
                <span className="text-body-md font-body-md text-primary font-semibold">Educação e Tecnologia</span>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          {/* Status Card */}
          <div className="bg-primary-container text-on-primary-container p-lg rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-title-lg text-title-lg text-on-primary mb-md">Resumo Académico</h4>
              <div className="space-y-md">
                <div className="bg-white/10 p-md rounded-lg backdrop-blur-sm">
                  <p className="text-caption font-label-md text-on-primary-container uppercase tracking-widest opacity-80">Média Geral</p>
                  <p className="text-display-lg font-display-lg text-on-primary">17.4</p>
                </div>
                <div className="bg-white/10 p-md rounded-lg backdrop-blur-sm">
                  <p className="text-caption font-label-md text-on-primary-container uppercase tracking-widest opacity-80">Créditos ECTS</p>
                  <p className="text-headline-lg font-headline-lg text-on-primary">210 <span className="text-body-md opacity-60">/ 300</span></p>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 scale-150">
              <span className="material-symbols-outlined text-[120px]">workspace_premium</span>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-surface/85 backdrop-blur-md border border-[#D8EAF0] p-lg rounded-xl">
            <h4 className="font-title-lg text-title-lg text-primary mb-md">Documentação</h4>
            <div className="space-y-sm">
              <button className="w-full flex items-center justify-between p-sm hover:bg-surface-container rounded-lg transition-colors group">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary">verified_user</span>
                  <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-primary">Certificado de Matrícula</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant">download</span>
              </button>
              <button className="w-full flex items-center justify-between p-sm hover:bg-surface-container rounded-lg transition-colors group">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary">description</span>
                  <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-primary">Histórico Escolar</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant">download</span>
              </button>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-surface/85 backdrop-blur-md border border-[#D8EAF0] border-dashed p-lg rounded-xl">
            <h4 className="font-title-lg text-title-lg text-primary mb-md">Preferências do Sistema</h4>
            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <span className="text-body-md font-body-md text-on-surface-variant">Notificações por Email</span>
                <div className="w-10 h-5 bg-primary rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md font-body-md text-on-surface-variant">Modo Escuro Automático</span>
                <div className="w-10 h-5 bg-outline-variant rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
