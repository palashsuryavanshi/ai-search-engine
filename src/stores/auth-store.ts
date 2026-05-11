import { create } from 'zustand'

interface AuthStore {
  isLocked: boolean
  isFirstTime: boolean
  apiKey: string | null
  passwordHash: string | null
  
  setFirstTime: (value: boolean) => void
  unlock: (apiKey: string, passwordHash: string) => void
  lock: () => void
  setApiKey: (key: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLocked: true,
  isFirstTime: (() => {
    const hash = localStorage.getItem('querax_password_hash')
    return !hash
  })(),
  apiKey: null,
  passwordHash: localStorage.getItem('querax_password_hash'),

  setFirstTime: (value) => set({ isFirstTime: value }),
  
  unlock: (apiKey, passwordHash) => {
    localStorage.setItem('querax_password_hash', passwordHash)
    set({ 
      isLocked: false, 
      apiKey, 
      passwordHash,
      isFirstTime: false 
    })
  },
  
  lock: () => {
    set({ isLocked: true, apiKey: null })
  },
  
  setApiKey: (key) => set({ apiKey: key }),
}))