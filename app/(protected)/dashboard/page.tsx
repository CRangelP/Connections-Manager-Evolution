'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Activity, Server, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function fetchInstances() {
  const res = await fetch('/api/evolution/instances')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao carregar instâncias')
  }
  return res.json()
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['instances'],
    queryFn: fetchInstances,
  })

  const instances = data?.data || []
  const totalInstances = instances.length
  
  // Log para debug
  if (instances.length > 0) {
    console.log('Dashboard - Total de instâncias:', totalInstances)
    instances.forEach((i: any) => {
      const inst = i.instance || i
      console.log(`Instância: ${inst.instanceName || inst.name}, State: ${inst.state}, Status: ${inst.status}`)
    })
  }
  
  const connectedInstances = instances.filter((i: any) => {
    const connectionState = i.connectionState || {}
    const inst = i.instance || i
    const state = (connectionState.state || inst.state || inst.status || '').toLowerCase()
    return state === 'open' || state === 'connected'
  }).length
  const disconnectedInstances = totalInstances - connectedInstances

  return (
    <div id="dashboard-page" className="space-y-8">
      <div id="dashboard-header">
        <h1 id="dashboard-title" className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p id="dashboard-description" className="text-slate-600 mt-2">
          Visão geral das suas instâncias WhatsApp
        </p>
      </div>

      {error && (
        <Alert id="dashboard-error-alert" variant="destructive">
          <AlertDescription id="dashboard-error-message">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </AlertDescription>
        </Alert>
      )}

      <div id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card id="dashboard-total-card">
          <CardHeader id="dashboard-total-header" className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle id="dashboard-total-title" className="text-sm font-medium">
              Total de Instâncias
            </CardTitle>
            <Server id="dashboard-total-icon" className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent id="dashboard-total-content">
            {isLoading ? (
              <Skeleton id="dashboard-total-skeleton" className="h-8 w-16" />
            ) : (
              <div id="dashboard-total-value" className="text-2xl font-bold">
                {totalInstances}
              </div>
            )}
            <p id="dashboard-total-label" className="text-xs text-slate-600 mt-1">
              Instâncias cadastradas
            </p>
          </CardContent>
        </Card>

        <Card id="dashboard-connected-card">
          <CardHeader id="dashboard-connected-header" className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle id="dashboard-connected-title" className="text-sm font-medium">
              Conectadas
            </CardTitle>
            <CheckCircle2 id="dashboard-connected-icon" className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent id="dashboard-connected-content">
            {isLoading ? (
              <Skeleton id="dashboard-connected-skeleton" className="h-8 w-16" />
            ) : (
              <div id="dashboard-connected-value" className="text-2xl font-bold text-green-600">
                {connectedInstances}
              </div>
            )}
            <p id="dashboard-connected-label" className="text-xs text-slate-600 mt-1">
              Instâncias ativas
            </p>
          </CardContent>
        </Card>

        <Card id="dashboard-disconnected-card">
          <CardHeader id="dashboard-disconnected-header" className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle id="dashboard-disconnected-title" className="text-sm font-medium">
              Desconectadas
            </CardTitle>
            <XCircle id="dashboard-disconnected-icon" className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent id="dashboard-disconnected-content">
            {isLoading ? (
              <Skeleton id="dashboard-disconnected-skeleton" className="h-8 w-16" />
            ) : (
              <div id="dashboard-disconnected-value" className="text-2xl font-bold text-red-600">
                {disconnectedInstances}
              </div>
            )}
            <p id="dashboard-disconnected-label" className="text-xs text-slate-600 mt-1">
              Necessitam atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <Card id="dashboard-quick-actions">
        <CardHeader id="dashboard-quick-actions-header">
          <CardTitle id="dashboard-quick-actions-title">Ações Rápidas</CardTitle>
          <CardDescription id="dashboard-quick-actions-description">
            Gerencie suas instâncias de forma eficiente
          </CardDescription>
        </CardHeader>
        <CardContent id="dashboard-quick-actions-content" className="flex gap-4">
          <Link id="dashboard-link-instances" href="/instances">
            <Button id="dashboard-button-instances">
              <Activity id="dashboard-button-instances-icon" className="mr-2 h-4 w-4" />
              Ver Todas as Instâncias
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
