import axios, { AxiosInstance, AxiosError } from 'axios'

const BASE_URL = process.env.EVOLUTION_API_BASE_URL || 'https://api.primestratus.com.br'
const TOKEN = process.env.EVOLUTION_API_TOKEN || ''
const TIMEOUT = parseInt(process.env.EVOLUTION_API_TIMEOUT_MS || '15000', 10)

class EvolutionAPIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'apikey': TOKEN,
      },
    })
  }

  async listInstances() {
    try {
      // Primeiro busca todas as instâncias
      const response = await this.client.get('/instance/fetchInstances')
      const instances = response.data
      
      // Para cada instância, busca o status de conexão
      if (Array.isArray(instances)) {
        const instancesWithStatus = await Promise.all(
          instances.map(async (inst: any) => {
            try {
              const instanceData = inst.instance || inst
              const instanceName = instanceData.instanceName || instanceData.name
              
              if (instanceName) {
                const statusResponse = await this.client.get(`/instance/connectionState/${instanceName}`)
                return {
                  ...inst,
                  connectionState: statusResponse.data
                }
              }
              return inst
            } catch (error) {
              // Se falhar ao buscar status, retorna instância sem status
              return inst
            }
          })
        )
        return instancesWithStatus
      }
      
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async createInstance(instanceName: string) {
    try {
      const response = await this.client.post('/instance/create', {
        instanceName,
        token: TOKEN,
        qrcode: true,
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async getInstance(instanceName: string) {
    try {
      const response = await this.client.get(`/instance/connectionState/${instanceName}`)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async deleteInstance(instanceName: string) {
    try {
      const response = await this.client.delete(`/instance/delete/${instanceName}`)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async getQRCode(instanceName: string) {
    try {
      const response = await this.client.get(`/instance/connect/${instanceName}`)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>
      const message = axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message
      const status = axiosError.response?.status || 500
      
      throw new Error(JSON.stringify({ message, status }))
    }
    throw error
  }
}

export const evolutionAPI = new EvolutionAPIClient()
