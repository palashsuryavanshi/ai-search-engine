import { useState, useCallback } from 'react'
import { searchSearXNG } from '../lib/searxng/client'
import { streamAIResponse } from '../lib/gemini/client'
import { buildContextFromResults, extractCitations } from '../lib/gemini/context'
import { useAuthStore } from '../stores/auth-store'
import type { Citation } from '../types'

export function useAISearch() {
  const [response, setResponse] = useState('')
  const [citations, setCitations] = useState<Citation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentInstance, setCurrentInstance] = useState('')
  const apiKey = useAuthStore((state) => state.apiKey)

  const search = useCallback(async (query: string) => {
    if (!apiKey) {
      setError('API key not found. Please unlock the app first.')
      return
    }

    setResponse('')
    setCitations([])
    setError('')
    setIsLoading(true)

    try {
      // Step 1: Search SearXNG
      const { results, instance } = await searchSearXNG(query)
      setCurrentInstance(instance)

      if (results.length === 0) {
        setResponse('No search results found. Please try a different query.')
        setIsLoading(false)
        return
      }

      // Step 2: Extract citations
      const extractedCitations = extractCitations(results)
      setCitations(extractedCitations)

      // Step 3: Build context for AI
      const context = buildContextFromResults(results)

      // Step 4: Stream AI response
      let fullResponse = ''
      for await (const chunk of streamAIResponse(apiKey, query, context)) {
        fullResponse += chunk
        setResponse(fullResponse)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [apiKey])

  return {
    response,
    citations,
    isLoading,
    error,
    currentInstance,
    search,
  }
}