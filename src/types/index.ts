export interface SearchResult {
  id: number
  title: string
  url: string
  snippet: string
  source: string
}

export interface Citation {
  id: number
  title: string
  url: string
  snippet: string
}

export interface AIResponse {
  text: string
  citations: Citation[]
  isLoading: boolean
}