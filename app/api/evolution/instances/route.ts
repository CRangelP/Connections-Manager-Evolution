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

    const data = await evolutionAPI.createInstance(validatedData.instanceName)
    return NextResponse.json({ data }, { status: 201 })
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
