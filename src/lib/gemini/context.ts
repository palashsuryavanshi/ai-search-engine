import type { SearchResult } from '../../types'

export function buildContextFromResults(results: SearchResult[]): string {
  return results
    .map((result, index) => {
      return `[${index + 1}] Title: ${result.title}
URL: ${result.url}
Content: ${result.snippet}
Source: ${result.source}`
    })
    .join('\n\n')
}

export function extractCitations(results: SearchResult[]): Array<{
  id: number
  title: string
  url: string
  snippet: string
}> {
  return results.map((result, index) => ({
    id: index + 1,
    title: result.title,
    url: result.url,
    snippet: result.snippet.slice(0, 200) + '...',
  }))
}