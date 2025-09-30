import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { evolutionAPI } from '@/lib/evolution-client'

export async function POST(
  request: NextRequest,
  { params }: { params: { instanceName: string } }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { instanceName } = params
    const data = await evolutionAPI.restartInstance(instanceName)
    
    console.log('[POST /restart] Data recebida:', data)
    console.log('[POST /restart] Estrutura:', JSON.stringify(data).substring(0, 200))
    
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[POST /api/evolution/instances/[instanceName]/restart]', error)
    
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message)
        return NextResponse.json(
          { 
            message: parsedError.message || 'Erro ao reconectar instância',
            details: parsedError.details
          },
          { status: parsedError.status || 500 }
        )
      } catch {
        return NextResponse.json(
          { message: error.message || 'Erro ao reconectar instância' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
