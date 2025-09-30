import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { evolutionAPI } from '@/lib/evolution-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ instanceName: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { instanceName } = await params
    const data = await evolutionAPI.getQRCode(instanceName)
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[GET /api/evolution/instances/:instanceName/qrcode]', error)
    
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message)
        return NextResponse.json(
          { message: parsedError.message || 'Erro ao buscar QR Code' },
          { status: parsedError.status || 500 }
        )
      } catch {
        return NextResponse.json(
          { message: error.message || 'Erro ao buscar QR Code' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
