import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { evolutionAPI } from '@/lib/evolution-client'
import { createInstanceSchema } from '@/lib/zod-schemas'
import { ZodError } from 'zod'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const data = await evolutionAPI.listInstances()
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[GET /api/evolution/instances]', error)
    
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message)
        return NextResponse.json(
          { message: parsedError.message || 'Erro ao listar instâncias' },
          { status: parsedError.status || 500 }
        )
      } catch {
        return NextResponse.json(
          { message: error.message || 'Erro ao listar instâncias' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createInstanceSchema.parse(body)

    // Cria a instância
    const instanceData = await evolutionAPI.createInstance(validatedData.instanceName)
    console.log('[POST /api/evolution/instances] Instância criada:', instanceData)
    
    // O QR code já vem na resposta da criação da instância
    let qrCodeArray = null
    if (instanceData?.instance?.qrcode?.base64) {
      qrCodeArray = [{
        base64: instanceData.instance.qrcode.base64,
        code: instanceData.instance.qrcode.code
      }]
      console.log('[POST /api/evolution/instances] QR Code encontrado na instância!')
    } else {
      console.log('[POST /api/evolution/instances] QR Code NÃO encontrado, tentando buscar...')
      
      // Aguarda 2 segundos e tenta buscar
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      try {
        const qrCodeData = await evolutionAPI.getQRCode(validatedData.instanceName)
        console.log('[POST /api/evolution/instances] QR Code recebido da API')
        qrCodeArray = Array.isArray(qrCodeData) ? qrCodeData : [qrCodeData]
      } catch (error) {
        console.warn('[POST /api/evolution/instances] Erro ao buscar QR code:', error)
      }
    }

    return NextResponse.json({ 
      data: instanceData,
      qrcode: qrCodeArray 
    }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/evolution/instances]', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.issues },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message)
        return NextResponse.json(
          { 
            message: parsedError.message || 'Erro ao criar instância',
            details: parsedError.details
          },
          { status: parsedError.status || 500 }
        )
      } catch {
        return NextResponse.json(
          { message: error.message || 'Erro ao criar instância' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
