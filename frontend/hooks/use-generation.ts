"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { GenerationResult, GenerationType, ApiError, UseGenerationReturn } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { parseApiError } from "@/lib/utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

interface GenerationParams {
  [key: string]: any
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
  },
})

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message)
    }
    return Promise.reject(error)
  }
)

export function useGeneration(): UseGenerationReturn {
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: async ({ 
      type, 
      prompt, 
      params 
    }: { 
      type: GenerationType
      prompt: string
      params: GenerationParams 
    }) => {
      const endpoint = `/api/generate/${type}`
      const payload = { prompt, ...params }
      
      const response = await apiClient.post(endpoint, payload)
      return response.data as GenerationResult
    },
    onSuccess: (data, variables) => {
      // Add metadata to the result
      const enrichedResult: GenerationResult = {
        ...data,
        metadata: {
          ...data.metadata,
          timestamp: new Date().toISOString(),
          parameters: variables.params,
        }
      }
      
      setResult(enrichedResult)
      setError(null)
      
      toast({
        title: "Generation Complete!",
        description: `Your ${variables.type} has been generated successfully.`,
      })
    },
    onError: (error: any, variables) => {
      const errorMessage = parseApiError(error)
      setError(errorMessage)
      setResult(null)
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
      
      // Log error details in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`${variables.type} generation failed:`, error)
      }
    },
  })

  const generateContent = async (
    type: GenerationType, 
    prompt: string, 
    params: GenerationParams = {}
  ) => {
    // Validate inputs
    if (!prompt?.trim()) {
      const errorMsg = 'Please enter a prompt'
      setError(errorMsg)
      toast({
        title: "Invalid Input",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    // Validate prompt length
    if (prompt.length > 1000) {
      const errorMsg = 'Prompt must be less than 1000 characters'
      setError(errorMsg)
      toast({
        title: "Prompt Too Long",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    // Clear previous state
    setError(null)
    setResult(null)
    
    // Start generation
    mutation.mutate({ type, prompt, params })
  }

  const reset = () => {
    setResult(null)
    setError(null)
    mutation.reset()
  }

  return {
    generateContent,
    isLoading: mutation.isPending,
    result,
    error,
    reset,
  }
}

// Hook for batch generation (future feature)
export function useBatchGeneration() {
  const [results, setResults] = useState<Array<{ status: 'success' | 'error', result?: GenerationResult, error?: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateBatch = async (requests: Array<{ type: GenerationType, prompt: string, [key: string]: any }>) => {
    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      const response = await apiClient.post('/api/batch', { requests })
      setResults(response.data.results)
      
      toast({
        title: "Batch Generation Complete",
        description: `Generated ${requests.length} items successfully.`,
      })
    } catch (error: any) {
      const errorMessage = parseApiError(error)
      setError(errorMessage)
      
      toast({
        title: "Batch Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setResults([])
    setError(null)
    setIsLoading(false)
  }

  return {
    generateBatch,
    isLoading,
    results,
    error,
    reset,
  }
}
