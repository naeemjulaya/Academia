import React from 'react'
import { createClient } from '@/lib/supabase/server'

export default async function MensagensPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-[1280px] mx-auto p-lg h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-md">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Mensagens</h2>
        <p className="font-body-lg text-on-surface-variant">Central de comunicações diretas com professores e secretaria.</p>
      </div>

      {/* Section: Chat / Mensagens */}
      <div className="flex-1 bg-surface-container-lowest border border-outline-variant overflow-hidden flex rounded shadow-sm">
        <div className="w-80 border-r border-outline-variant flex flex-col hidden md:flex">
          <div className="p-md border-b border-outline-variant bg-surface">
            <h3 className="font-title-lg text-title-lg text-primary">Conversas</h3>
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
            {/* Chat 2 */}
            <div className="p-md hover:bg-surface-container transition-colors cursor-pointer border-b border-outline-variant/30">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-primary font-bold">AS</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-label-md text-on-surface truncate">Apoio Social</p>
                    <span className="text-[10px] text-on-surface-variant">Ontem</span>
                  </div>
                  <p className="text-caption text-on-surface-variant truncate">Sua bolsa foi processada.</p>
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
            <div className="flex justify-center mb-auto">
              <span className="text-[11px] px-3 py-1 bg-surface-container text-on-surface-variant rounded-full uppercase tracking-tighter">Hoje</span>
            </div>
            <div className="flex items-end space-x-2 max-w-[70%]">
              <div className="flex-1 bg-surface-container-high p-md text-body-md text-primary border border-outline-variant/20 rounded-t-xl rounded-r-xl">
                Olá {user?.email?.split('@')[0] || 'Estudante'}, verifiquei que submeteu o trabalho. Poderia rever a camada de serialização?
                <p className="text-[10px] mt-1 text-right text-on-surface-variant">14:15</p>
              </div>
            </div>
            <div className="flex items-end justify-end space-x-2 ml-auto max-w-[70%]">
              <div className="flex-1 bg-primary text-white p-md text-body-md rounded-t-xl rounded-l-xl">
                Boa tarde, Professor. Com certeza. Vou verificar se houve algum conflito e farei o upload da correção até o final do dia. Obrigado!
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
  )
}
