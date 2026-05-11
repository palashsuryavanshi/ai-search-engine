export async function onRequest(context: any) {
  const { request } = context
  const url = new URL(request.url)
  const query = url.searchParams.get('q')

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  // First try: Direct with known good instances
  const directInstances = [
    'https://searx.be',
    'https://priv.au',
  ]

  for (const instance of directInstances) {
    try {
      const searchUrl = `${instance}/search?q=${encodeURIComponent(query)}&format=json&language=en`
      
      const response = await fetch(searchUrl, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Querax/1.0'
        },
      })

      if (!response.ok) continue

      const data: any = await response.json()

      if (!data.results || data.results.length === 0) continue

      return new Response(JSON.stringify({
        results: data.results.slice(0, 10).map((r: any, i: number) => ({
          id: i + 1,
          title: r.title || 'Untitled',
          url: r.url,
          snippet: r.content || '',
          source: new URL(r.url).hostname,
        })),
        instance,
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })
    } catch (e) {
      continue
    }
  }

  // Second try: Use DuckDuckGo's free API (no key needed, always works)
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    const ddgResponse = await fetch(ddgUrl)
    const ddgData: any = await ddgResponse.json()

    const results: any[] = []

    // Add Abstract if available
    if (ddgData.AbstractText) {
      results.push({
        id: 1,
        title: ddgData.Heading || query,
        url: ddgData.AbstractURL || '',
        snippet: ddgData.AbstractText,
        source: ddgData.AbstractSource || 'DuckDuckGo',
      })
    }

    // Add Related Topics
    if (ddgData.RelatedTopics) {
      ddgData.RelatedTopics.forEach((topic: any, i: number) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            id: results.length + 1,
            title: topic.Text.slice(0, 50) + '...',
            url: topic.FirstURL,
            snippet: topic.Text,
            source: 'DuckDuckGo',
          })
        }
      })
    }

    if (results.length > 0) {
      return new Response(JSON.stringify({
        results: results.slice(0, 10),
        instance: 'DuckDuckGo API (fallback)',
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }
  } catch (e) {
    // DuckDuckGo also failed
  }

  return new Response(JSON.stringify({ 
    error: 'Unable to fetch search results. Please try again later.',
  }), {
    status: 502,
    headers: { 
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*',
    }
  })
}