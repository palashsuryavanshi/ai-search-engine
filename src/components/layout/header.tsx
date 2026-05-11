import { Sun, Moon, Settings } from 'lucide-react'
import { Button } from '../ui/button'
import { useThemeStore } from '../../stores/theme-store'
import { Link } from 'wouter'

export function Header() {
  const { theme, toggle } = useThemeStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/">
          <span className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer">
            🔍 AI Search
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggle}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}