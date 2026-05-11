const INSTANCES = [
  'https://searx.be',
  'https://priv.au',
  'https://search.hbubli.cc',
  'https://searx.si',
  'https://search.sapti.me',
  'https://searx.tuxcloud.net',
  'https://searx.ro',
];

export async function searchSearXNG(query: string) {
  for (const instance of INSTANCES) {
    try {
      const url = `${instance}/search?format=json&q=${encodeURIComponent(query)}`;
      
      const response = await fetch(url, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        console.warn(`Instance ${instance} returned ${response.status}`);
        continue;
      }

      const data = await response.json();

      console.log('Data structure:', Object.keys(data));

      // Handle different response structures
      let results = data.results || data.data || data.items || [];

      if (results.length === 0) {
        console.warn(`Instance ${instance} returned 0 results`);
        continue;
      }

      const formattedResults = results.slice(0, 10).map((result: any, index: number) => ({
        id: index + 1,
        title: result.title || 'Untitled',
        url: result.url || result.link || '',
        snippet: result.content || result.snippet || result.description || '',
        source: result.source || result.engine || 'Unknown',
      }));

      return {
        results: formattedResults,
        instance: new URL(instance).hostname,
      };
    } catch (error) {
      console.error(`Instance ${instance} failed:`, error);
      continue;
    }
  }
  
  // Return empty results instead of throwing
  console.error('All SearXNG instances failed');
  return {
    results: [],
    instance: 'none',
  };
}

export type { };