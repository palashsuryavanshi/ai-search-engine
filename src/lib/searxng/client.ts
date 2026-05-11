import type { SearchResult } from '../../types'

interface SearXNGApiResponse {
  results: Array<{
    title: string
    url: string
    content: string
    engine: string
  }>
}

// Your curated list of public SearXNG instances
const INSTANCES = [
  'https://test.cors.workers.dev/?https://search.zina.dev/',
  'https://test.cors.workers.dev/?https://priv.au/',
  'https://test.cors.workers.dev/?https://searxng.website/',
  'https://test.cors.workers.dev/?https://search.internetsucks.net/',
  'https://test.cors.workers.dev/?https://searx.party/',
  'https://test.cors.workers.dev/?https://searx.tiekoetter.com/',
  'https://test.cors.workers.dev/?https://search.datenkrake.ch/',
  'https://test.cors.workers.dev/?https://searx.oloke.xyz/',
]

// Free CORS proxies to bypass browser restrictions
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://test.cors.workers.dev/?',
]

async function fetchWithProxy(url: string): Promise<Response> {
  // 1st attempt: Try a direct connection (some instances may allow it or you could be on the same domain)
  try {
    const directResponse = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    })
    if (directResponse.ok) return directResponse
  } catch (e) {
    console.log('Direct fetch failed, trying CORS proxies...')
  }

  // 2nd attempt: Loop through the free CORS proxy services
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy + encodeURIComponent(url)
      const response = await fetch(proxyUrl)
      if (response.ok) return response
    } catch (e) {
      continue // This proxy failed, try the next one
    }
  }

  // If all methods fail, throw an error
  throw new Error('All fetch methods failed for URL: ' + url)
}

export async function searchSearXNG(query: string): Promise<{ results: SearchResult[]; instance: string }> {
  for (const instance of INSTANCES) {
    try {
      const searchUrl = `${instance}/search?q=${encodeURIComponent(query)}&format=json&language=en`
      
      const response = await fetchWithProxy(searchUrl)
      
      if (!response.ok) {
        console.warn(`Instance ${instance} returned ${response.status}`)
        continue // Try the next instance
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
        continue // Try the next instance
      }

      // Success! Return the results and the instance that worked
      return { results, instance }
    } catch (error) {
      console.warn(`Instance ${instance} failed completely:`, error)
      continue // Try the next instance
    }
  }
  
  // If you reach this point, every instance in your list failed.
  throw new Error('All SearXNG instances are currently unavailable. Please try again later.')
}