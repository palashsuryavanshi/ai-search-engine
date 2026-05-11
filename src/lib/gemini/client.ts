import { GoogleGenerativeAI } from '@google/generative-ai'

export async function generateAIResponse(
  apiKey: string,
  query: string,
  context: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  
  const prompt = `You are Querax, an AI search assistant. Answer the user's question based on the search results provided. Be helpful, accurate, and concise. Always cite sources using the format [1], [2], etc.

Search Results:
${context}

User Question: ${query}

Instructions:
- Answer based on the provided search results
- Use [1], [2] etc. to cite specific sources
- If search results don't have enough information, say so honestly
- Keep your answer clear and well-structured
- Use markdown formatting for readability`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

export async function* streamAIResponse(
  apiKey: string,
  query: string,
  context: string
): AsyncGenerator<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  
  const prompt = `You are Querax, an AI search assistant. Answer the user's question based on the search results provided. Be helpful, accurate, and concise. Always cite sources using the format [1], [2], etc.

Search Results:
${context}

User Question: ${query}

Instructions:
- Answer based on the provided search results
- Use [1], [2] etc. to cite specific sources
- If search results don't have enough information, say so honestly
- Keep your answer clear and well-structured
- Use markdown formatting for readability`

  const result = await model.generateContentStream(prompt)
  
  for await (const chunk of result.stream) {
    yield chunk.text()
  }
}