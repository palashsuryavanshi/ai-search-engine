import { useState, KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { Button } from '../ui/button'
import { useLocation } from 'wouter'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [, setLocation] = useLocation()

  const handleSearch = () => {
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-sm"
          />
        </div>
        <Button 
          onClick={handleSearch}
          size="lg"
          className="ml-3 rounded-xl"
        >
          Search
        </Button>
      </div>
    </div>
  )
}