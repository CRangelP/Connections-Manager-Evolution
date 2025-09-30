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
import { Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react'

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
    const statusMap: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary'; icon: any; className?: string }> = {
      open: { label: 'Conectada', variant: 'default', icon: CheckCircle2, className: 'bg-green-500 hover:bg-green-600 text-white' },
      connected: { label: 'Conectada', variant: 'default', icon: CheckCircle2, className: 'bg-green-500 hover:bg-green-600 text-white' },
      close: { label: 'Desconectada', variant: 'destructive', icon: XCircle },
      connecting: { label: 'Conectando', variant: 'secondary', icon: Clock },
    }

    const status = statusMap[state] || statusMap.close

    return (
      <Badge id={`instance-badge-${state}`} variant={status.variant} className={`flex items-center gap-1 ${status.className || ''}`}>
        <status.icon className="h-3 w-3" />
        {status.label}
      </Badge>
    )
  }

  return (
    <div id="instances-page" className="space-y-8">
      <div id="instances-header" className="flex items-center justify-between">
        <div id="instances-header-text">
          <h1 id="instances-title" className="text-3xl font-bold text-slate-900">
            Conexões WhatsApp
          </h1>
          <p id="instances-description" className="text-slate-600 mt-2">
            Gerencie suas instâncias
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
            const instanceName = instance.name || 'Sem nome'
            const connectionStatus = instance.connectionStatus || 'close'
            const owner = instance.profileName || 'N/A'
            const phone = instance.ownerJid ? instance.ownerJid.replace('@s.whatsapp.net', '') : 'N/A'
            
            return (
              <Card key={instanceName} id={`instance-card-${instanceName}`}>
                <CardHeader id={`instance-header-${instanceName}`}>
                  <div id={`instance-header-content-${instanceName}`} className="flex items-start justify-between">
                    <div id={`instance-header-info-${instanceName}`}>
                      <CardTitle id={`instance-title-${instanceName}`} className="text-lg">
                        {instanceName}
                      </CardTitle>
                    </div>
                    {getStatusBadge(connectionStatus)}
                  </div>
                </CardHeader>
                <CardContent id={`instance-content-${instanceName}`}>
                  <div id={`instance-details-${instanceName}`} className="space-y-2 text-sm text-slate-600 mb-4">
                    <div id={`instance-owner-${instanceName}`}>
                      <strong>Owner:</strong> {owner}
                    </div>
                    <div id={`instance-phone-${instanceName}`}>
                      <strong>Phone:</strong> {phone}
                    </div>
                  </div>

                  <div id={`instance-actions-${instanceName}`} className="flex gap-2">
                    <Button
                      id={`instance-delete-button-${instanceName}`}
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleDeleteClick(instanceName)}
                    >
                      <Trash2 id={`instance-delete-icon-${instanceName}`} className="mr-2 h-4 w-4" />
                      Deletar
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
