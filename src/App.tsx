import { Route, Switch, useSearchParams } from 'wouter'
import { Header } from './components/layout/header'
import { SearchBar } from './components/search/search-bar'
import { useThemeStore } from './stores/theme-store'
import { Search } from 'lucide-react'
import { AIResponse } from './components/ai/ai-response'
import { LoginScreen } from './components/login-screen'
import { useAuthStore } from './stores/auth-store'

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
          {/* TODO: We'll connect real data in Phase 3 */}
          <AIResponse 
            text=""
            citations={[]}
            isLoading={true}
          />
        </div>
      )}
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Settings page coming soon...
      </p>
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