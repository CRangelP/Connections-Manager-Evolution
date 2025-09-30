'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInInput } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciais inválidas')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Ocorreu um erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div id="login-page-container" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-neutral-950 p-4">
      <Card id="login-card" className="w-full max-w-md">
        <CardHeader id="login-card-header" className="space-y-1">
          <CardTitle id="login-title" className="text-2xl font-bold text-center">
            Painel Principal
          </CardTitle>
          <CardDescription id="login-description" className="text-center">
            Gerenciamento de instâncias WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent id="login-card-content">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert id="login-error-alert" variant="destructive">
                <AlertDescription id="login-error-message">{error}</AlertDescription>
              </Alert>
            )}

            <div id="login-email-field" className="space-y-2">
              <Label id="login-email-label" htmlFor="email">
                Email
              </Label>
              <Input
                id="login-email-input"
                type="email"
                placeholder="admin@evolutiondash.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p id="login-email-error" className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div id="login-password-field" className="space-y-2">
              <Label id="login-password-label" htmlFor="password">
                Senha
              </Label>
              <Input
                id="login-password-input"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p id="login-password-error" className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button id="login-submit-button" type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 id="login-loading-icon" className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
