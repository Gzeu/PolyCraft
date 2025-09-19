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

export interface GenerationResult {
  url?: string
  text?: string
  source?: string
  error?: string
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
}
