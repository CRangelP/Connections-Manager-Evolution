import { z } from 'zod'

// Schema para login
export const signInSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
})

// Schema para criar instância Evolution API
export const createInstanceSchema = z.object({
  instanceName: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }).max(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
})

// Schema para deletar instância
export const deleteInstanceSchema = z.object({
  instanceName: z.string().min(1, { message: 'Nome da instância é obrigatório' }),
})

export type SignInInput = z.infer<typeof signInSchema>
export type CreateInstanceInput = z.infer<typeof createInstanceSchema>
export type DeleteInstanceInput = z.infer<typeof deleteInstanceSchema>
