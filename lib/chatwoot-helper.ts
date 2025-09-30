import { toast } from 'sonner'

export async function configureChatwoot(instanceName: string): Promise<boolean> {
  try {
    toast.info('Configurando Chatwoot...')
    
    const response = await fetch(`/api/chatwoot/set/${instanceName}`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Erro ao configurar Chatwoot')
    }
    
    toast.success('Chatwoot configurado com sucesso!')
    return true
  } catch (error) {
    console.error('Erro ao configurar Chatwoot:', error)
    toast.error('Erro ao configurar Chatwoot')
    return false
  }
}
