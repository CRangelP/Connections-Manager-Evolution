'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInstanceSchema, type CreateInstanceInput } from '@/lib/zod-schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Loader2 } from 'lucide-react'
import { configureChatwoot } from '@/lib/chatwoot-helper'

async function createInstance(data: CreateInstanceInput) {
  const res = await fetch('/api/evolution/instances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao criar instância')
  }

  return res.json()
}

export function CreateInstanceDialog() {
  const [open, setOpen] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [instanceName, setInstanceName] = useState<string | null>(null)
  const queryClient = useQueryClient()


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInstanceInput>({
    resolver: zodResolver(createInstanceSchema),
  })

  const mutation = useMutation({
    mutationFn: createInstance,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['instances'] })
      
      // Armazena o nome da instância criada
      const createdInstanceName = response?.data?.instance?.instanceName
      
      // Se tiver QR code, exibe
      if (response?.qrcode && response.qrcode.length > 0 && response.qrcode[0].base64) {
        setQrCode(response.qrcode[0].base64)
        setInstanceName(createdInstanceName)
        toast.success('Instância criada! Escaneie o QR Code')
      } else {
        toast.success('Instância criada com sucesso!')
        reset()
        setOpen(false)
      }
    },
    onError: (error: Error) => {
      try {
        const errorData = JSON.parse(error.message)
        const details = errorData.details
        const errorMsg = details?.message || errorData.message || 'Erro ao criar instância'
        toast.error(errorMsg)
      } catch {
        toast.error(error.message || 'Erro ao criar instância')
      }
    },
  })

  const onSubmit = (data: CreateInstanceInput) => {
    setQrCode(null) // Limpa QR code anterior
    mutation.mutate(data)
  }

  const handleClose = async () => {
    // Se houver instância criada, configura o Chatwoot
    if (instanceName) {
      await configureChatwoot(instanceName)
    }
    
    setOpen(false)
    setQrCode(null)
    setInstanceName(null)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="create-instance-trigger-button">
          <Plus id="create-instance-trigger-icon" className="mr-2 h-4 w-4" />
          Nova Instância
        </Button>
      </DialogTrigger>
      <DialogContent id="create-instance-dialog" className="max-w-md">
        <DialogHeader id="create-instance-dialog-header">
          <DialogTitle id="create-instance-dialog-title">
            {qrCode ? 'Escaneie o QR Code' : 'Criar Nova Instância'}
          </DialogTitle>
          <DialogDescription id="create-instance-dialog-description">
            {qrCode 
              ? 'Abra o WhatsApp e escaneie o código abaixo para conectar'
              : 'Informe o nome da instância que deseja criar'}
          </DialogDescription>
        </DialogHeader>

        {qrCode ? (
          <div id="qrcode-container" className="flex flex-col items-center justify-center gap-4 py-4">
            <img 
              id="qrcode-image"
              src={qrCode} 
              alt="QR Code" 
              className="w-64 h-64 border-4 border-slate-200 rounded-lg"
            />
            <Button
              id="qrcode-close-button"
              onClick={handleClose}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        ) : (
          <form id="create-instance-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div id="create-instance-name-field" className="space-y-2">
            <Label id="create-instance-name-label" htmlFor="instanceName">
              Nome da Instância
            </Label>
            <Input
              id="create-instance-name-input"
              placeholder="minha-instancia"
              {...register('instanceName')}
              disabled={mutation.isPending}
            />
            {errors.instanceName && (
              <p id="create-instance-name-error" className="text-sm text-red-500">
                {errors.instanceName.message}
              </p>
            )}
          </div>

          <div id="create-instance-actions" className="flex justify-end gap-2">
            <Button
              id="create-instance-cancel-button"
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
            <Button id="create-instance-submit-button" type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 id="create-instance-loading-icon" className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
