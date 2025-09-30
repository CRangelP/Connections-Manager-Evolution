'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2, Trash2 } from 'lucide-react'

async function deleteInstance(instanceName: string) {
  const res = await fetch(`/api/evolution/instances/${instanceName}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao deletar instância')
  }

  return res.json()
}

interface DeleteInstanceDialogProps {
  instanceName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteInstanceDialog({
  instanceName,
  open,
  onOpenChange,
}: DeleteInstanceDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteInstance(instanceName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] })
      toast.success('Instância deletada com sucesso!')
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao deletar instância')
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="delete-instance-dialog">
        <DialogHeader id="delete-instance-dialog-header">
          <DialogTitle id="delete-instance-dialog-title">Deletar Instância</DialogTitle>
          <DialogDescription id="delete-instance-dialog-description">
            Tem certeza que deseja deletar a instância <strong>{instanceName}</strong>? Esta ação
            não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div id="delete-instance-actions" className="flex justify-end gap-2">
          <Button
            id="delete-instance-cancel-button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            id="delete-instance-confirm-button"
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 id="delete-instance-loading-icon" className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Trash2 id="delete-instance-confirm-icon" className="mr-2 h-4 w-4" />
            Deletar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
