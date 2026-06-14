import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Academia Keven</h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl">
          Plataforma de explicações e ensino em Moçambique.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Entrar
          </Link>
          <Link 
            href="/register" 
            className="rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80"
          >
            Registar
          </Link>
        </div>
      </div>
    </main>
  )
}
