import axios, { AxiosInstance, AxiosError } from 'axios'

const BASE_URL = process.env.EVOLUTION_API_BASE_URL || ''
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
      const response = await this.client.get('/instance/fetchInstances')
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async createInstance(instanceName: string) {
    try {
      const response = await this.client.post('/instance/create', {
        instanceName,
        integration: 'WHATSAPP-BAILEYS',
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
      const axiosError = error as AxiosError<{ message?: string; error?: string; response?: unknown }>
      const message = axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message
      const status = axiosError.response?.status || 500
      const details = axiosError.response?.data
      
      // Log completo para debug
      console.error('[Evolution API Error]', {
        status,
        message,
        details,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
      })
      
      throw new Error(JSON.stringify({ message, status, details }))
    }
    throw error
  }
}

export const evolutionAPI = new EvolutionAPIClient()
