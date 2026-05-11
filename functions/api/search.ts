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
  ]

  for (const instance of instances) {
    try {
      const searchUrl = `${instance}/search?q=${encodeURIComponent(query)}&format=json&language=en`
      const response = await fetch(searchUrl, {
        headers: { 'Accept': 'application/json' }
      })

      if (!response.ok) continue

      const data: any = await response.json()

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

  return new Response(JSON.stringify({ error: 'All instances failed' }), {
    status: 502,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}