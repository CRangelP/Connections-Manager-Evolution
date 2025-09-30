import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { evolutionAPI } from '@/lib/evolution-client'

const CHATWOOT_ACCOUNT_ID = process.env.CHATWOOT_ACCOUNT_ID || '1'
const CHATWOOT_TOKEN = process.env.CHATWOOT_TOKEN || ''
const CHATWOOT_URL = process.env.CHATWOOT_URL || ''

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ instanceName: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { instanceName } = await params
    
    // Configura Chatwoot usando o nome da instância como nameInbox
    const data = await evolutionAPI.setChatwoot(instanceName, {
      accountId: CHATWOOT_ACCOUNT_ID,
      token: CHATWOOT_TOKEN,
      url: CHATWOOT_URL,
      nameInbox: instanceName
    })
    
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[POST /api/chatwoot/set/[instanceName]]', error)
    
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message)
        return NextResponse.json(
          { 
            message: parsedError.message || 'Erro ao configurar Chatwoot',
            details: parsedError.details
          },
          { status: parsedError.status || 500 }
        )
      } catch {
        return NextResponse.json(
          { message: error.message || 'Erro ao configurar Chatwoot' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
