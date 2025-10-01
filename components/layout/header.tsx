'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  const { data: session } = useSession()

  return (
    <header id="app-header" className="border-b bg-white dark:bg-neutral-950 dark:border-neutral-800">
      <div id="header-container" className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div id="header-logo" className="flex items-center gap-6">
          <Link id="header-logo-link" href="/" className="text-xl font-bold text-slate-900 dark:text-white">
            Painel Principal
          </Link>
        </div>

        <div id="header-user-section" className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user && (
            <div id="header-user-info" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <User id="header-user-icon" className="h-4 w-4" />
              <span id="header-user-email">{session.user.email}</span>
            </div>
          )}
          <Button
            id="header-logout-button"
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login', redirect: true })}
          >
            <LogOut id="header-logout-icon" className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
