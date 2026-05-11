import type { SearchResult } from '../../types'

interface ProxyResponse {
  results?: SearchResult[]
  instance?: string
  error?: string
}

export async function searchSearXNG(query: string): Promise<{ results: SearchResult[]; instance: string }> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  
  if (!response.ok) {
    throw new Error('Search failed. Please try again.')
  }
  
  const data: ProxyResponse = await response.json()
  
  if (data.error || !data.results) {
    throw new Error(data.error || 'No results found')
  }
  
  return {
    results: data.results,
    instance: data.instance || 'unknown',
  }
}