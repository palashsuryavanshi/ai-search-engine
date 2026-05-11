import type { SearchResult } from '../../types'

interface SearXNGApiResponse {
  results: Array<{
    title: string
    url: string
    content: string
    engine: string
  }>
}

// Reliable public SearXNG instances (tested and working)
const INSTANCES = [
  'https://search.zina.dev/',
  'https://priv.au/',
  'https://searxng.website/',
  'https://search.internetsucks.net/',
  'https://searx.party/',
  'https://searx.tiekoetter.com/',
  'https://search.datenkrake.ch/',
  'https://searx.oloke.xyz/',
]

export async function searchSearXNG(query: string): Promise<{ results: SearchResult[]; instance: string }> {
  // Try each instance until one works
  for (const instance of INSTANCES) {
    try {
      const url = `${instance}/search?q=${encodeURIComponent(query)}&format=json&language=en`
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      })
      
      if (!response.ok) {
        console.warn(`Instance ${instance} returned ${response.status}`)
        continue
      }
      
      const data: SearXNGApiResponse = await response.json()
      
      const results = data.results.slice(0, 10).map((result, index) => ({
        id: index + 1,
        title: result.title || 'Untitled',
        url: result.url,
        snippet: result.content || '',
        source: new URL(result.url).hostname,
      }))

      if (results.length === 0) {
        console.warn(`Instance ${instance} returned 0 results`)
        continue
      }

      return { results, instance }
    } catch (error) {
      console.warn(`Instance ${instance} failed:`, error)
      continue
    }
  }
  
  throw new Error('All SearXNG instances are currently unavailable. Please try again later.')
}