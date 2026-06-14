"use client"

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AuthForms() {
  const [isLogin, setIsLogin] = useState(true)
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get('error')

  const toggleAuth = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="bg-subtle-pattern font-body-md text-on-surface min-h-screen flex items-center justify-center p-md">
      <main className="w-full max-w-[1100px] grid md:grid-cols-12 glass-panel shadow-2xl rounded-xl overflow-hidden min-h-[700px] relative">
        
        {/* Left Side: Branding / Editorial Image */}
        <section className="hidden md:flex md:col-span-5 relative bg-primary-container overflow-hidden items-center justify-center p-xl">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Biblioteca Académica" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYViO37ayXiKzHkJbmHvVaap3G9Lag5-W5L8Bi6m1kQqESacLWFX6HkK_znmHULFYLciY-wSusB5QsVDEr7M266o5tSb73aPsL_-pSSYnPg8iMxwsVJ9CGqU0QGkxJsfPjQkzxXde8tL2Jq8tZAHsE-2Z4EdHsmHpfq22p11cdLGjVS3vR6XadHa2gAICa0BtMYfVMRVzcbAbBsIC8V1RNdC1M39S8XT9neN2RFp2NIyUTx6dUzw0_Ut7hAy3-uyTaa23X9nm0x3Vh"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="mb-lg">
              <span className="material-symbols-outlined text-[64px] text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-primary mb-md">Académico</h1>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-xs mx-auto opacity-90 italic">
              "A busca pelo conhecimento é a única fronteira que se expande à medida que a atravessamos."
            </p>
            <div className="mt-xl h-[1px] w-12 bg-on-tertiary-container opacity-50"></div>
            <p className="mt-md font-label-md text-label-md tracking-widest text-on-tertiary uppercase">Portal de Excelência</p>
          </div>
        </section>

        {/* Right Side: Forms */}
        <section className="md:col-span-7 bg-surface p-lg md:p-xl flex flex-col justify-center relative">
          
          {errorMsg && (
            <div className="absolute top-4 left-4 right-4 bg-error-container text-on-error-container p-3 rounded text-sm font-medium z-50 shadow-sm border border-error/20 flex items-center justify-center">
              {errorMsg}
            </div>
          )}
          
          {/* Login Form */}
          <div className={`auth-transition ${isLogin ? '' : 'hidden-auth'}`}>
            <header className="mb-xl text-center md:text-left">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Bem-vindo de volta</h2>
              <p className="font-body-md text-on-surface-variant">Introduza as suas credenciais para aceder ao portal.</p>
            </header>
            
            <form className="space-y-md" action="/auth/signin" method="POST">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="login-email">Email Académico</label>
                <input 
                  name="email"
                  className="w-full px-md py-sm border border-outline-variant rounded bg-surface focus:ring-0 transition-all text-body-md" 
                  id="login-email" 
                  placeholder="exemplo@universidade.pt" 
                  type="email"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-xs">
                  <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="login-password">Palavra-passe</label>
                  <a className="text-caption text-secondary hover:underline" href="#">Esqueceu-se da senha?</a>
                </div>
                <input 
                  name="password"
                  className="w-full px-md py-sm border border-outline-variant rounded bg-surface focus:ring-0 transition-all text-body-md" 
                  id="login-password" 
                  placeholder="••••••••" 
                  type="password"
                  required
                />
              </div>
              <div className="flex items-center space-x-xs py-xs">
                <input className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary" id="remember" type="checkbox" />
                <label className="text-caption text-on-surface-variant" htmlFor="remember">Manter sessão iniciada</label>
              </div>
              <button className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded hover:bg-primary transition-all shadow-sm active:scale-[0.98] mt-sm" type="submit">
                Entrar no Portal
              </button>
            </form>
            
            <footer className="mt-xl text-center">
              <p className="text-body-md text-on-surface-variant">
                Não possui uma conta? {' '}
                <button type="button" className="text-secondary font-semibold hover:underline" onClick={toggleAuth}>Registe-se agora</button>
              </p>
            </footer>
          </div>

          {/* Signup Form */}
          <div className={`auth-transition ${!isLogin ? '' : 'hidden-auth'}`}>
            <header className="mb-lg text-center md:text-left">
              <button type="button" className="flex items-center text-secondary mb-md group" onClick={toggleAuth}>
                <span className="material-symbols-outlined text-[18px] mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="text-caption font-semibold">Voltar ao Login</span>
              </button>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Criar Conta Académica</h2>
              <p className="font-body-md text-on-surface-variant">Junte-se à nossa comunidade de excelência intelectual.</p>
            </header>
            
            <form className="space-y-sm" action="/auth/signup" method="POST">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="name">Nome completo</label>
                  <input className="w-full px-md py-sm border border-outline-variant rounded bg-surface text-body-md" id="name" name="name" placeholder="Nome Próprio e Apelido" type="text" required />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email</label>
                  <input className="w-full px-md py-sm border border-outline-variant rounded bg-surface text-body-md" id="email" name="email" placeholder="email@exemplo.pt" type="email" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="phone">Telefone</label>
                  <input className="w-full px-md py-sm border border-outline-variant rounded bg-surface text-body-md" id="phone" placeholder="+351 900 000 000" type="tel" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="uni">Universidade</label>
                  <input className="w-full px-md py-sm border border-outline-variant rounded bg-surface text-body-md" id="uni" placeholder="Instituição de Ensino" type="text" />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="course">Curso</label>
                <input className="w-full px-md py-sm border border-outline-variant rounded bg-surface text-body-md" id="course" placeholder="Licenciatura / Mestrado em..." type="text" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="signup-password">Palavra-passe</label>
                <input className="w-full px-md py-sm border border-outline-variant rounded bg-surface text-body-md" id="signup-password" name="password" placeholder="Mínimo 8 caracteres" type="password" required />
              </div>
              <div className="flex items-start space-x-xs py-xs">
                <input className="mt-1 w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary" id="terms" type="checkbox" required />
                <label className="text-caption text-on-surface-variant" htmlFor="terms">
                  Li e aceito os <a className="text-secondary hover:underline" href="#">Termos de Utilização</a> e a <a className="text-secondary hover:underline" href="#">Política de Privacidade</a> institucional.
                </label>
              </div>
              <button className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-md rounded hover:bg-primary transition-all shadow-sm active:scale-[0.98]" type="submit">
                Finalizar Registo
              </button>
            </form>
          </div>

        </section>
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-gutter w-full text-center px-md pointer-events-none">
        <div className="flex items-center justify-center space-x-md text-on-surface-variant opacity-60">
          <span className="text-caption">© 2024 Portal de Excelência Académica</span>
          <span className="h-1 w-1 bg-outline rounded-full"></span>
          <span className="text-caption">Suporte Técnico</span>
          <span className="h-1 w-1 bg-outline rounded-full"></span>
          <span className="text-caption">Privacidade</span>
        </div>
      </footer>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-subtle-pattern flex items-center justify-center text-primary font-body-md">A carregar portal...</div>}>
      <AuthForms />
    </Suspense>
  )
}
