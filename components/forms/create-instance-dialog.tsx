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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] })
      toast.success('Instância criada com sucesso!')
      reset()
      setOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar instância')
    },
  })

  const onSubmit = (data: CreateInstanceInput) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="create-instance-trigger-button">
          <Plus id="create-instance-trigger-icon" className="mr-2 h-4 w-4" />
          Nova Instância
        </Button>
      </DialogTrigger>
      <DialogContent id="create-instance-dialog">
        <DialogHeader id="create-instance-dialog-header">
          <DialogTitle id="create-instance-dialog-title">Criar Nova Instância</DialogTitle>
          <DialogDescription id="create-instance-dialog-description">
            Informe o nome da instância que deseja criar
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}
