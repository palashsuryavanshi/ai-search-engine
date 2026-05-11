interface SearchResult {
  id: number
  title: string
  url: string
  snippet: string
  source: string
}

export async function searchSearXNG(query: string): Promise<{ results: SearchResult[]; instance: string }> {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
  
  const response = await fetch(url)
  const data = await response.json()
  
  const results: SearchResult[] = []
  
  // Add abstract/instant answer if available
  if (data.AbstractText) {
    results.push({
      id: 1,
      title: data.Heading || query,
      url: data.AbstractURL || '',
      snippet: data.AbstractText,
      source: data.AbstractSource || 'DuckDuckGo',
    })
  }
  
  // Add related topics as search results
  if (data.RelatedTopics) {
    data.RelatedTopics.forEach((topic: any, i: number) => {
      if (topic.Text && topic.FirstURL) {
        results.push({
          id: results.length + 1,
          title: topic.Text.slice(0, 80),
          url: topic.FirstURL,
          snippet: topic.Text,
          source: 'DuckDuckGo',
        })
      }
    })
  }
  
  return {
    results: results.slice(0, 10),
    instance: 'DuckDuckGo',
  }
}