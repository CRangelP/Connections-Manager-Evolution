'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Clock, QrCode } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

async function fetchInstanceDetails(instanceName: string) {
  const res = await fetch(`/api/evolution/instances/${instanceName}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao carregar detalhes da instância')
  }
  return res.json()
}

async function fetchQRCode(instanceName: string) {
  const res = await fetch(`/api/evolution/instances/${instanceName}/qrcode`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao carregar QR Code')
  }
  return res.json()
}

export default function InstanceDetailsPage({
  params,
}: {
  params: Promise<{ instanceName: string }>
}) {
  const { instanceName } = use(params)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['instance', instanceName],
    queryFn: () => fetchInstanceDetails(instanceName),
    refetchInterval: 10000,
  })

  const {
    data: qrData,
    isLoading: qrLoading,
    error: qrError,
    refetch: refetchQR,
  } = useQuery({
    queryKey: ['qrcode', instanceName],
    queryFn: () => fetchQRCode(instanceName),
    enabled: data?.data?.state === 'close' || data?.data?.state === 'connecting',
    refetchInterval: 5000,
  })

  const instance = data?.data
  const qrCode = qrData?.data

  const getStatusBadge = (state: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: 'default' | 'destructive' | 'secondary'; icon: any }
    > = {
      open: { label: 'Conectada', variant: 'default', icon: CheckCircle2 },
      close: { label: 'Desconectada', variant: 'destructive', icon: XCircle },
      connecting: { label: 'Conectando', variant: 'secondary', icon: Clock },
    }

    const status = statusMap[state] || { label: state, variant: 'secondary', icon: Clock }
    const Icon = status.icon

    return (
      <Badge id={`instance-detail-status-badge`} variant={status.variant as any} className="flex items-center gap-1 w-fit">
        <Icon id={`instance-detail-status-icon`} className="h-3 w-3" />
        {status.label}
      </Badge>
    )
  }

  return (
    <div id="instance-detail-page" className="space-y-8">
      <div id="instance-detail-header" className="flex items-center gap-4">
        <Link id="instance-detail-back-link" href="/instances">
          <Button id="instance-detail-back-button" variant="outline" size="icon">
            <ArrowLeft id="instance-detail-back-icon" className="h-4 w-4" />
          </Button>
        </Link>
        <div id="instance-detail-header-text" className="flex-1">
          <h1 id="instance-detail-title" className="text-3xl font-bold text-slate-900">
            {isLoading ? <Skeleton id="instance-detail-title-skeleton" className="h-9 w-64" /> : instanceName}
          </h1>
          <p id="instance-detail-description" className="text-slate-600 mt-2">
            Detalhes e configurações da instância
          </p>
        </div>
        <Button id="instance-detail-refresh-button" variant="outline" onClick={() => refetch()}>
          <RefreshCw id="instance-detail-refresh-icon" className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {error && (
        <Alert id="instance-detail-error-alert" variant="destructive">
          <AlertDescription id="instance-detail-error-message">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </AlertDescription>
        </Alert>
      )}

      <div id="instance-detail-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card id="instance-detail-info-card">
          <CardHeader id="instance-detail-info-header">
            <CardTitle id="instance-detail-info-title">Informações da Instância</CardTitle>
            <CardDescription id="instance-detail-info-description">
              Dados gerais da instância WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent id="instance-detail-info-content" className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton id="instance-detail-info-skeleton-1" className="h-16 w-full" />
                <Skeleton id="instance-detail-info-skeleton-2" className="h-16 w-full" />
                <Skeleton id="instance-detail-info-skeleton-3" className="h-16 w-full" />
              </>
            ) : (
              <>
                <div id="instance-detail-status-section" className="flex items-center justify-between py-3 border-b">
                  <span id="instance-detail-status-label" className="text-sm font-medium text-slate-700">
                    Status
                  </span>
                  {getStatusBadge(instance?.state || 'close')}
                </div>

                <div id="instance-detail-id-section" className="flex items-center justify-between py-3 border-b">
                  <span id="instance-detail-id-label" className="text-sm font-medium text-slate-700">
                    ID da Instância
                  </span>
                  <span id="instance-detail-id-value" className="text-sm text-slate-600">
                    {instance?.instanceId || 'N/A'}
                  </span>
                </div>

                <div id="instance-detail-owner-section" className="flex items-center justify-between py-3 border-b">
                  <span id="instance-detail-owner-label" className="text-sm font-medium text-slate-700">
                    Owner
                  </span>
                  <span id="instance-detail-owner-value" className="text-sm text-slate-600">
                    {instance?.owner || 'N/A'}
                  </span>
                </div>

                <div id="instance-detail-profile-section" className="flex items-center justify-between py-3">
                  <span id="instance-detail-profile-label" className="text-sm font-medium text-slate-700">
                    Profile Name
                  </span>
                  <span id="instance-detail-profile-value" className="text-sm text-slate-600">
                    {instance?.profileName || 'N/A'}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card id="instance-detail-qr-card">
          <CardHeader id="instance-detail-qr-header">
            <CardTitle id="instance-detail-qr-title" className="flex items-center gap-2">
              <QrCode id="instance-detail-qr-icon" className="h-5 w-5" />
              QR Code de Conexão
            </CardTitle>
            <CardDescription id="instance-detail-qr-description">
              {instance?.state === 'open'
                ? 'Instância já conectada'
                : 'Escaneie o QR Code com o WhatsApp'}
            </CardDescription>
          </CardHeader>
          <CardContent id="instance-detail-qr-content" className="flex items-center justify-center">
            {instance?.state === 'open' ? (
              <div id="instance-detail-qr-connected" className="text-center py-12">
                <CheckCircle2 id="instance-detail-qr-connected-icon" className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <p id="instance-detail-qr-connected-text" className="text-slate-600">Instância conectada com sucesso!</p>
              </div>
            ) : qrLoading ? (
              <Skeleton id="instance-detail-qr-skeleton" className="h-64 w-64" />
            ) : qrError ? (
              <Alert id="instance-detail-qr-error-alert" variant="destructive">
                <AlertDescription id="instance-detail-qr-error-message">
                  {qrError instanceof Error ? qrError.message : 'Erro ao carregar QR Code'}
                </AlertDescription>
              </Alert>
            ) : qrCode?.code ? (
              <div id="instance-detail-qr-image-container" className="space-y-4">
                <div id="instance-detail-qr-image-wrapper" className="bg-white p-4 rounded-lg border-2 border-slate-200">
                  <Image
                    id="instance-detail-qr-image"
                    src={qrCode.code}
                    alt="QR Code"
                    width={256}
                    height={256}
                    className="w-64 h-64"
                  />
                </div>
                <Button
                  id="instance-detail-qr-refresh-button"
                  variant="outline"
                  onClick={() => refetchQR()}
                  className="w-full"
                >
                  <RefreshCw id="instance-detail-qr-refresh-icon" className="mr-2 h-4 w-4" />
                  Atualizar QR Code
                </Button>
              </div>
            ) : (
              <div id="instance-detail-qr-unavailable" className="text-center py-12">
                <p id="instance-detail-qr-unavailable-text" className="text-slate-600">QR Code não disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
