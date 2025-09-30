'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryProvider } from '@/lib/query-provider'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </SessionProvider>
  )
}
