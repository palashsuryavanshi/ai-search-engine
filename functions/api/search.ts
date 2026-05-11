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

  const instances = [
    'https://searx.be',
    'https://priv.au',
    'https://searx.tiekoetter.com',
    'https://search.hbubli.cc',
    'https://searx.si',
    'https://searx.ro',
    'https://search.sapti.me',
    'https://searx.fmac.xyz',
  ]

  let lastError = ''

  for (const instance of instances) {
    try {
      const searchUrl = `${instance}/search?q=${encodeURIComponent(query)}&format=json&language=en`
      
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(searchUrl, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Querax/1.0'
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeout)

      if (!response.ok) {
        lastError = `Instance ${instance} returned ${response.status}`
        continue
      }

      const data: any = await response.json()

      if (!data.results || data.results.length === 0) {
        lastError = `Instance ${instance} returned 0 results`
        continue
      }

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
    } catch (e: any) {
      lastError = `Instance ${instance} failed: ${e.message}`
      continue
    }
  }

  return new Response(JSON.stringify({ 
    error: 'All instances failed',
    details: lastError,
    query: query
  }), {
    status: 502,
    headers: { 
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*',
    }
  })
}