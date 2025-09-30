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

  const handleDeleteClick = (instanceName: string) => {
    setSelectedInstance(instanceName)
    setDeleteDialogOpen(true)
  }

  const getStatusBadge = (state: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary'; icon: any }> = {
      open: { label: 'Conectada', variant: 'default', icon: CheckCircle2 },
      close: { label: 'Desconectada', variant: 'destructive', icon: XCircle },
      connecting: { label: 'Conectando', variant: 'secondary', icon: Clock },
    }

    const status = statusMap[state] || { label: state, variant: 'secondary', icon: Clock }
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
          {instances.map((instance: any) => (
            <Card key={instance.instance.instanceName} id={`instance-card-${instance.instance.instanceName}`}>
              <CardHeader id={`instance-header-${instance.instance.instanceName}`}>
                <div id={`instance-header-content-${instance.instance.instanceName}`} className="flex items-start justify-between">
                  <div id={`instance-header-info-${instance.instance.instanceName}`}>
                    <CardTitle id={`instance-title-${instance.instance.instanceName}`} className="text-lg">
                      {instance.instance.instanceName}
                    </CardTitle>
                    <CardDescription id={`instance-desc-${instance.instance.instanceName}`} className="mt-1">
                      {instance.instance.instanceId || 'N/A'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(instance.instance.state)}
                </div>
              </CardHeader>
              <CardContent id={`instance-content-${instance.instance.instanceName}`}>
                <div id={`instance-details-${instance.instance.instanceName}`} className="space-y-2 text-sm text-slate-600 mb-4">
                  <div id={`instance-owner-${instance.instance.instanceName}`}>
                    <strong>Owner:</strong> {instance.instance.owner || 'N/A'}
                  </div>
                  <div id={`instance-number-${instance.instance.instanceName}`}>
                    <strong>Número:</strong> {instance.instance.profilePictureUrl || 'N/A'}
                  </div>
                </div>

                <div id={`instance-actions-${instance.instance.instanceName}`} className="flex gap-2">
                  <Link
                    id={`instance-view-link-${instance.instance.instanceName}`}
                    href={`/instances/${instance.instance.instanceName}`}
                    className="flex-1"
                  >
                    <Button id={`instance-view-button-${instance.instance.instanceName}`} variant="outline" className="w-full">
                      <Eye id={`instance-view-icon-${instance.instance.instanceName}`} className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Button
                    id={`instance-delete-button-${instance.instance.instanceName}`}
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteClick(instance.instance.instanceName)}
                  >
                    <Trash2 id={`instance-delete-icon-${instance.instance.instanceName}`} className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
