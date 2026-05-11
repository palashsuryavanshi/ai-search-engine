import { Sun, Moon, Settings, Sparkles, Lock } from 'lucide-react'
import { Button } from '../ui/button'
import { useThemeStore } from '../../stores/theme-store'
import { useAuthStore } from '../../stores/auth-store'
import { Link } from 'wouter'

export function Header() {
  const { theme, toggle } = useThemeStore()
  const { lock } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glass morphism effect */}
      <div className="mx-4 mt-3 rounded-2xl border border-pink-200 dark:border-pink-300 bg-pink-100 dark:bg-pink-200 backdrop-blur-xl shadow-lg shadow-pink-300/30">
        <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-5">
          
          {/* Logo - Left */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              {/* Logo Icon */}
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-pink-700 to-pink-500 shadow-lg shadow-pink-500/25">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              {/* Brand Name */}
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900 tracking-tight">
                  Querax
                </span>
                <span className="text-[10px] font-medium text-pink-500 tracking-wide">
                  AI
                </span>
              </div>
            </div>
          </Link>

          {/* Buttons - Right */}
          <div className="flex items-center gap-1.5">
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggle}
              className="gap-2 text-pink-700 hover:text-pink-900"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span className="text-sm font-medium">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  <span className="text-sm font-medium">Light</span>
                </>
              )}
            </Button>

            {/* Settings */}
            <Link href="/settings">
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-2 text-pink-700 hover:text-pink-900"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </Button>
            </Link>

            {/* Lock */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={lock}
              className="gap-2 text-pink-700 hover:text-pink-900"
            >
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Lock</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}