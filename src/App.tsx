import { Route, Switch } from 'wouter'
import { Header } from './components/layout/header'
import { SearchBar } from './components/search/search-bar'
import { useThemeStore } from './stores/theme-store'

function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        AI-Powered Search
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center text-lg">
        Search smarter with AI summaries and real sources
      </p>
      <SearchBar />
    </div>
  )
}

function SearchPage() {
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
      <SearchBar />
      <p className="text-center text-gray-400 mt-12">
        Search results will appear here
      </p>
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

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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