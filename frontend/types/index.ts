export interface GenerationRequest {
  prompt: string
  model?: string
  width?: number
  height?: number
  seed?: number
  nologo?: boolean
  private?: boolean
}

export interface AudioRequest extends GenerationRequest {
  voice?: string
  speed?: number
  response_format?: string
}

export interface TextRequest extends GenerationRequest {
  model?: string
  max_tokens?: number
  temperature?: number
}

export interface GenerationResult {
  url?: string
  text?: string
  source?: string
  error?: string
  metadata?: {
    model?: string
    parameters?: Record<string, any>
    timestamp?: string
    duration?: number
  }
}

export interface BatchRequest {
  requests: Array<{
    type: 'image' | 'text' | 'audio'
    prompt: string
    [key: string]: any
  }>
}

export interface BatchResult {
  results: Array<{
    status: 'success' | 'error'
    result?: GenerationResult
    error?: string
  }>
}

export interface ApiError {
  detail: string
  status?: number
}

export type GenerationType = 'image' | 'text' | 'audio'

export interface GenerationHistory {
  id: string
  type: GenerationType
  prompt: string
  result: GenerationResult
  timestamp: Date
  parameters: Record<string, any>
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  defaultModel: string
  autoSave: boolean
  showAdvancedOptions: boolean
  preferredVoice: string
  defaultImageSize: {
    width: number
    height: number
  }
}

export interface ApiConfig {
  baseUrl: string
  apiKey?: string
  timeout: number
  retries: number
}

// Component Props Types
export interface GenerationResultProps {
  type: GenerationType
  result: GenerationResult | null
  error: string | null
  isLoading: boolean
}

export interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// Hook Return Types
export interface UseGenerationReturn {
  generateContent: (type: GenerationType, prompt: string, params?: Record<string, any>) => Promise<void>
  isLoading: boolean
  result: GenerationResult | null
  error: string | null
  reset: () => void
}
