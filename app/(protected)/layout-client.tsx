'use client'

import { Header } from '@/components/layout/header'

export function ProtectedLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div id="protected-layout" className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main id="protected-main" className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
