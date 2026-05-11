import { create } from 'zustand'

interface AuthStore {
  isLocked: boolean
  isFirstTime: boolean
  apiKey: string | null
  passwordHash: string | null
  username: string | null
  
  setFirstTime: (value: boolean) => void
  unlock: (apiKey: string, passwordHash: string, username?: string) => void
  lock: () => void
  setApiKey: (key: string) => void
  setUsername: (name: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLocked: true,
  isFirstTime: (() => {
    const hash = localStorage.getItem('querax_password_hash')
    return !hash
  })(),
  apiKey: null,
  passwordHash: localStorage.getItem('querax_password_hash'),
  username: localStorage.getItem('querax_username'),

  setFirstTime: (value) => set({ isFirstTime: value }),
  
  unlock: (apiKey, passwordHash, username) => {
    localStorage.setItem('querax_password_hash', passwordHash)
    if (username) localStorage.setItem('querax_username', username)
    set({ 
      isLocked: false, 
      apiKey, 
      passwordHash,
      username: username || localStorage.getItem('querax_username'),
      isFirstTime: false 
    })
  },
  
  lock: () => {
    set({ isLocked: true, apiKey: null })
  },
  
  setApiKey: (key) => set({ apiKey: key }),
  
  setUsername: (name) => {
    localStorage.setItem('querax_username', name)
    set({ username: name })
  },
}))