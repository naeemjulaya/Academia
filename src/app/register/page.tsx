import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen w-full bg-background">
      {/* Left Pane - Branding & Quote */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-between p-12 text-primary-foreground relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-primary-foreground/5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Académico</h1>
          <p className="mt-2 text-primary-foreground/80 font-medium">Portal de Excelência</p>
        </div>
        
        <div className="relative z-10 max-w-md">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed">
              "A busca pelo conhecimento é a única fronteira que se expande à medida que a atravessamos."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right Pane - Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 relative overflow-y-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Criar Conta Académica
            </h1>
            <p className="text-sm text-muted-foreground">
              Junte-se à nossa comunidade de excelência intelectual.
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">Nome Completo</label>
                <input id="name" type="text" placeholder="Nome Completo" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">Email Institucional ou Pessoal</label>
                <input id="email" type="email" placeholder="nome@exemplo.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">Senha</label>
                <input id="password" type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
              </div>
            </div>
            <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
              Registar
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <div className="text-center text-sm">
            Já possui uma conta?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Iniciar Sessão
            </Link>
          </div>
        </div>

        {/* Footer links mapping */}
        <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:underline">Termos de Utilização</Link>
          <Link href="#" className="hover:underline">Política de Privacidade</Link>
        </div>
      </div>
    </main>
  )
}
