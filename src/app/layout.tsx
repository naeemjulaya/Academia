import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { AlertMessage } from '@/components/ui/AlertMessage'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Academia Keven',
  description: 'Plataforma de explicações e ensino',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <QueryProvider>
          <Suspense fallback={null}>
            <AlertMessage />
          </Suspense>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
