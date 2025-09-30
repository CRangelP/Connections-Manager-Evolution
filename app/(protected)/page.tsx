'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreateInstanceDialog } from '@/components/forms/create-instance-dialog'
import { DeleteInstanceDialog } from '@/components/forms/delete-instance-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, CheckCircle2, XCircle, Clock, RefreshCw, type LucideIcon } from 'lucide-react'
import { formatPhoneBrazil } from '@/lib/format-phone'
import { toast } from 'sonner'

interface Instance {
  name: string
  connectionStatus: string
  profileName?: string
  ownerJid?: string
}

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
  const [reconnectQRCode, setReconnectQRCode] = useState<string | null>(null)
  const [reconnectDialogOpen, setReconnectDialogOpen] = useState(false)

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

  const handleReconnect = async (instanceName: string) => {
    try {
      toast.info('Desconectando instância...')
      
      const res = await fetch(`/api/evolution/instances/${instanceName}/restart`, {
        method: 'POST',
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Erro ao reconectar')
      }
      
      const response = await res.json()
      console.log('[Reconnect] Response:', response)
      console.log('[Reconnect] Response.data:', response.data)
      
      // A resposta do /instance/connect retorna array direto
      if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].base64) {
        console.log('[Reconnect] QR Code encontrado!')
        setReconnectQRCode(response.data[0].base64)
        setReconnectDialogOpen(true)
        toast.success('QR Code gerado! Escaneie para reconectar.')
      } else {
        console.log('[Reconnect] QR Code NÃO encontrado, estrutura:', response)
        toast.success('Reconexão iniciada com sucesso!')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      console.error('[Reconnect] Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao reconectar')
    }
  }

  const getStatusBadge = (state: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary'; icon: LucideIcon; className?: string }> = {
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
          <h1 id="instances-title" className="text-3xl font-bold text-slate-900 dark:text-white">
            Conexões WhatsApp
          </h1>
          <p id="instances-description" className="text-slate-600 dark:text-slate-400 mt-2">
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
          {instances.map((instance: Instance) => {
            const instanceName = instance.name || 'Sem nome'
            const connectionStatus = instance.connectionStatus || 'close'
            const owner = instance.profileName || 'N/A'
            const phoneRaw = instance.ownerJid ? instance.ownerJid.replace('@s.whatsapp.net', '') : ''
            const phone = formatPhoneBrazil(phoneRaw)
            
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
                  <div id={`instance-details-${instanceName}`} className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <div id={`instance-owner-${instanceName}`}>
                      <strong>Owner:</strong> {owner}
                    </div>
                    <div id={`instance-phone-${instanceName}`}>
                      <strong>Phone:</strong> {phone}
                    </div>
                  </div>

                  <div id={`instance-actions-${instanceName}`} className="flex gap-2">
                    <Button
                      id={`instance-reconnect-button-${instanceName}`}
                      variant="outline"
                      className="flex-1 bg-green-700 hover:bg-green-800 text-white border-green-700 dark:bg-green-700 dark:hover:bg-green-800 dark:border-green-700"
                      onClick={() => handleReconnect(instanceName)}
                    >
                      <RefreshCw id={`instance-reconnect-icon-${instanceName}`} className="mr-2 h-4 w-4" />
                      Reconectar
                    </Button>
                    <Button
                      id={`instance-delete-button-${instanceName}`}
                      variant="destructive"
                      className="flex-1"
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

      {/* Dialog de QR Code de Reconexão */}
      <Dialog open={reconnectDialogOpen} onOpenChange={setReconnectDialogOpen}>
        <DialogContent id="reconnect-qr-dialog" className="max-w-md">
          <DialogHeader id="reconnect-qr-header">
            <DialogTitle id="reconnect-qr-title">Escaneie o QR Code</DialogTitle>
            <DialogDescription id="reconnect-qr-description">
              Abra o WhatsApp e escaneie o código abaixo para reconectar
            </DialogDescription>
          </DialogHeader>
          
          {reconnectQRCode && (
            <div id="reconnect-qr-container" className="flex flex-col items-center justify-center gap-4 py-4">
              <img 
                id="reconnect-qr-image"
                src={reconnectQRCode} 
                alt="QR Code Reconexão" 
                className="w-64 h-64 border-4 border-slate-200 rounded-lg"
              />
              <Button
                id="reconnect-qr-close"
                onClick={() => {
                  setReconnectDialogOpen(false)
                  setReconnectQRCode(null)
                  window.location.reload()
                }}
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
