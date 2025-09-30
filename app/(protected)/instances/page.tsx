'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreateInstanceDialog } from '@/components/forms/create-instance-dialog'
import { DeleteInstanceDialog } from '@/components/forms/delete-instance-dialog'
import { Eye, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

async function fetchInstances() {
  const res = await fetch('/api/evolution/instances')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao carregar instâncias')
  }
  return res.json()
}

export default function InstancesPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['instances'],
    queryFn: fetchInstances,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  })

  const instances = data?.data || []
  
  // Log para debug - remover depois
  if (instances.length > 0) {
    console.log('Estrutura da primeira instância:', instances[0])
  }

  const handleDeleteClick = (instanceName: string) => {
    setSelectedInstance(instanceName)
    setDeleteDialogOpen(true)
  }

  const getStatusBadge = (state: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary'; icon: any }> = {
      open: { label: 'Conectada', variant: 'default', icon: CheckCircle2 },
      connected: { label: 'Conectada', variant: 'default', icon: CheckCircle2 },
      close: { label: 'Desconectada', variant: 'destructive', icon: XCircle },
      closed: { label: 'Desconectada', variant: 'destructive', icon: XCircle },
      disconnected: { label: 'Desconectada', variant: 'destructive', icon: XCircle },
      connecting: { label: 'Conectando', variant: 'secondary', icon: Clock },
    }

    const status = statusMap[state?.toLowerCase()] || { label: state || 'Desconhecido', variant: 'secondary', icon: Clock }
    const Icon = status.icon

    return (
      <Badge id={`instance-status-badge-${state}`} variant={status.variant as any} className="flex items-center gap-1 w-fit">
        <Icon id={`instance-status-icon-${state}`} className="h-3 w-3" />
        {status.label}
      </Badge>
    )
  }

  return (
    <div id="instances-page" className="space-y-8">
      <div id="instances-header" className="flex items-center justify-between">
        <div id="instances-header-text">
          <h1 id="instances-title" className="text-3xl font-bold text-slate-900">
            Instâncias WhatsApp
          </h1>
          <p id="instances-description" className="text-slate-600 mt-2">
            Gerencie todas as suas instâncias da Evolution API
          </p>
        </div>
        <CreateInstanceDialog />
      </div>

      {error && (
        <Alert id="instances-error-alert" variant="destructive">
          <AlertDescription id="instances-error-message">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div id="instances-loading" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} id={`instance-skeleton-${i}`}>
              <CardHeader id={`instance-skeleton-header-${i}`}>
                <Skeleton id={`instance-skeleton-title-${i}`} className="h-6 w-3/4" />
                <Skeleton id={`instance-skeleton-desc-${i}`} className="h-4 w-1/2" />
              </CardHeader>
              <CardContent id={`instance-skeleton-content-${i}`}>
                <Skeleton id={`instance-skeleton-body-${i}`} className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : instances.length === 0 ? (
        <Card id="instances-empty-state">
          <CardContent id="instances-empty-content" className="flex flex-col items-center justify-center py-16">
            <p id="instances-empty-message" className="text-slate-600 text-center mb-4">
              Nenhuma instância encontrada. Crie sua primeira instância para começar!
            </p>
            <CreateInstanceDialog />
          </CardContent>
        </Card>
      ) : (
        <div id="instances-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instances.map((instance: any) => {
            // Adapta estrutura da API - pode ser instance.instance ou diretamente instance
            const inst = instance.instance || instance
            const instanceName = inst.instanceName || inst.name || 'unknown'
            
            // Pega o estado de conexão
            const connectionState = instance.connectionState || {}
            const state = connectionState.state || inst.state || inst.status || 'close'
            
            return (
              <Card key={instanceName} id={`instance-card-${instanceName}`}>
                <CardHeader id={`instance-header-${instanceName}`}>
                  <div id={`instance-header-content-${instanceName}`} className="flex items-start justify-between">
                    <div id={`instance-header-info-${instanceName}`}>
                      <CardTitle id={`instance-title-${instanceName}`} className="text-lg">
                        {instanceName}
                      </CardTitle>
                      <CardDescription id={`instance-desc-${instanceName}`} className="mt-1 text-xs">
                        {inst.serverUrl || 'Evolution API'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(state)}
                  </div>
                </CardHeader>
                <CardContent id={`instance-content-${instanceName}`}>
                  <div id={`instance-details-${instanceName}`} className="space-y-2 text-sm text-slate-600 mb-4">
                    <div id={`instance-owner-${instanceName}`}>
                      <strong>Owner:</strong> {inst.owner || inst.profileName || 'N/A'}
                    </div>
                    {inst.profilePictureUrl && (
                      <div id={`instance-picture-${instanceName}`}>
                        <strong>Profile:</strong> Configurado
                      </div>
                    )}
                  </div>

                  <div id={`instance-actions-${instanceName}`} className="flex gap-2">
                    <Link
                      id={`instance-view-link-${instanceName}`}
                      href={`/instances/${instanceName}`}
                      className="flex-1"
                    >
                      <Button id={`instance-view-button-${instanceName}`} variant="outline" className="w-full">
                        <Eye id={`instance-view-icon-${instanceName}`} className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Button
                      id={`instance-delete-button-${instanceName}`}
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(instanceName)}
                    >
                      <Trash2 id={`instance-delete-icon-${instanceName}`} className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {selectedInstance && (
        <DeleteInstanceDialog
          instanceName={selectedInstance}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </div>
  )
}
