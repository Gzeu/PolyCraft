"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { GenerationResult, GenerationType, ApiError } from "@/types"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface GenerationParams {
  [key: string]: any
}

export function useGeneration() {
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: async ({ type, prompt, params }: { type: GenerationType; prompt: string; params: GenerationParams }) => {
      const endpoint = `${API_BASE_URL}/api/generate/${type}`
      const payload = { prompt, ...params }
      
      const response = await axios.post(endpoint, payload, {
        timeout: 60000, // 60 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      return response.data
    },
    onSuccess: (data) => {
      setResult(data)
      setError(null)
      toast({
        title: "Generation Complete",
        description: "Your content has been generated successfully!",
      })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || error.message || 'An unexpected error occurred'
      setError(errorMessage)
      setResult(null)
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })

  const generateContent = async (type: GenerationType, prompt: string, params: GenerationParams = {}) => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setError(null)
    setResult(null)
    
    mutation.mutate({ type, prompt, params })
  }

  return {
    generateContent,
    isLoading: mutation.isPending,
    result,
    error,
    reset: () => {
      setResult(null)
      setError(null)
      mutation.reset()
    },
  }
}
