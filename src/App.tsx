import { Route, Switch, useSearchParams } from 'wouter'
import { Header } from './components/layout/header'
import { SearchBar } from './components/search/search-bar'
import { useThemeStore } from './stores/theme-store'
import { Search } from 'lucide-react'
import { AIResponse } from './components/ai/ai-response'
import { LoginScreen } from './components/login-screen'
import { useAuthStore } from './stores/auth-store'
import { useState } from 'react'
import { Button } from './components/ui/button'
import { useEffect, useRef } from 'react'
import { useAISearch } from './hooks/use-ai-search'

function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
        Smart Search Starts Here
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
        You search, AI Summarises
      </p>
      <SearchBar />
    </div>
  )
}

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { response, citations, isLoading, error, search } = useAISearch()
  const hasSearched = useRef(false)

  useEffect(() => {
    if (query && !hasSearched.current) {
      hasSearched.current = true
      search(query)
    }
  }, [query, search])

  // Reset when query changes
  useEffect(() => {
    hasSearched.current = false
  }, [query])

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
      <SearchBar />
      
      {!query ? (
        /* Empty State */
        <div className="text-center mt-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-950 mb-4">
            <Search className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-lg">
            Search something first
          </p>
        </div>
      ) : (
        /* Results Area */
        <div className="mt-8">
          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          {/* AI Response */}
          <AIResponse 
            text={response}
            citations={citations}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  )
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'manage' | 'about'>('manage')
  const { username, setUsername, setApiKey, apiKey, lock } = useAuthStore()
  void lock
  const [newUsername, setNewUsername] = useState(username || '')
  const [newApiKey, setNewApiKey] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUpdateUsername = () => {
    if (newUsername.trim()) {
      setUsername(newUsername.trim())
      setMessage('Username updated!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleUpdateApiKey = async () => {
    if (!newApiKey.trim()) return
    if (!currentPassword) {
      setError('Enter current password to change API key')
      return
    }
    // Verify password then encrypt new key
    const { hashPassword, encryptApiKey } = await import('./lib/utils/crypto')
    const storedHash = localStorage.getItem('querax_password_hash')
    const hashedInput = await hashPassword(currentPassword)
    
    if (hashedInput !== storedHash) {
      setError('Incorrect password')
      return
    }
    
    const encryptedKey = await encryptApiKey(newApiKey.trim(), currentPassword)
    localStorage.setItem('querax_encrypted_key', encryptedKey)
    setApiKey(newApiKey.trim())
    setNewApiKey('')
    setCurrentPassword('')
    setMessage('API key updated!')
    setError('')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Fill all password fields')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const { hashPassword, decryptApiKey, encryptApiKey } = await import('./lib/utils/crypto')
    void decryptApiKey
    const storedHash = localStorage.getItem('querax_password_hash')
    const hashedInput = await hashPassword(currentPassword)
    
    if (hashedInput !== storedHash) {
      setError('Current password is incorrect')
      return
    }

    const encryptedKey = localStorage.getItem('querax_encrypted_key')
    if (encryptedKey && apiKey) {
      const newEncryptedKey = await encryptApiKey(apiKey, newPassword)
      localStorage.setItem('querax_encrypted_key', newEncryptedKey)
    }
    
    const newHash = await hashPassword(newPassword)
    localStorage.setItem('querax_password_hash', newHash)
    
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setMessage('Password changed!')
    setError('')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      {/* Messages */}
      {message && (
        <div className="mb-4 px-4 py-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 rounded-xl text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex gap-6 min-h-[500px]">
        
        {/* Left Panel - Navigation */}
        <div className="w-56 shrink-0">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 space-y-1">
            <button
              onClick={() => { setActiveTab('manage'); setError(''); setMessage('') }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'manage' 
                  ? 'bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Manage
            </button>
            <button
              onClick={() => { setActiveTab('about'); setError(''); setMessage('') }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'about' 
                  ? 'bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              About
            </button>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="flex-1">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            
            {/* MANAGE TAB */}
            {activeTab === 'manage' && (
              <div className="space-y-8">
                {/* Username */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Username
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder={username || 'Local username'}
                      className="flex-1 h-10 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                    />
                    <Button onClick={handleUpdateUsername} size="sm" className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
                      Save
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Change API Key */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Change API Key
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className="w-full h-10 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                    />
                    <input
                      type="password"
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="New Gemini API key"
                      className="w-full h-10 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                    />
                    <Button onClick={handleUpdateApiKey} size="sm" className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
                      Update API Key
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Change Password */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className="w-full h-10 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className="w-full h-10 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full h-10 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                    />
                    <Button onClick={handleChangePassword} size="sm" className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Querax - AI Search Summariser
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    A privacy-first AI search engine that uses community-run SearXNG instances 
                    for search results and Google Gemini API for AI-powered summaries. 
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Powered By
                  </h3>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• SearXNG - Privacy-respecting metasearch engine</li>
                    <li>• Google Gemini API - AI text generation</li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Vibecoded by
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Palash Suryavanshi
                  </p>
                  <a 
                    href="https://www.linkedin.com/in/palashsuryavanshi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-pink-600 dark:text-pink-400 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const { theme } = useThemeStore()
  const { isLocked } = useAuthStore()

  // If locked, show login screen instead of app
  if (isLocked) {
    return (
      <div className={theme}>
        <LoginScreen />
      </div>
    )
  }

  return (
    <div className={theme}>
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col transition-colors duration-300">
        <Header />
        <main className="flex-1 flex">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/settings" component={SettingsPage} />
          </Switch>
        </main>
      </div>
    </div>
  )
}

export default App