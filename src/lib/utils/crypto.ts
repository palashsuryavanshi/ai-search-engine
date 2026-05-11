// Convert password to encryption key
async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('querax-salt-2024'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// Encrypt API key with password
export async function encryptApiKey(apiKey: string, password: string): Promise<string> {
  const key = await deriveKey(password)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoder = new TextEncoder()
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(apiKey)
  )
  
  // Combine IV + encrypted data and convert to base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  
  return btoa(String.fromCharCode(...combined))
}

// Decrypt API key with password
export async function decryptApiKey(encryptedData: string, password: string): Promise<string> {
  const key = await deriveKey(password)
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
  
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  )
  
  return new TextDecoder().decode(decrypted)
}

// Hash password for verification (so we don't store plain password)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(password))
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}