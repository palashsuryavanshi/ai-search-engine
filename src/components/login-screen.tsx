import { useState } from 'react'
import { Key, Eye, EyeOff, ArrowRight, Shield, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { encryptApiKey, decryptApiKey, hashPassword } from '../lib/utils/crypto'
import { useAuthStore } from '../stores/auth-store'

export function LoginScreen() {
  const { isFirstTime, unlock, setFirstTime } = useAuthStore()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Setup mode (first time)
  const handleSetup = async () => {
    setError('')
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key')
      return
    }

    setIsLoading(true)
    try {
      const hashedPassword = await hashPassword(password)
      const encryptedKey = await encryptApiKey(apiKey.trim(), password)
      
      localStorage.setItem('querax_encrypted_key', encryptedKey)
      
      unlock(apiKey.trim(), hashedPassword)
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Unlock mode (returning user)
  const handleUnlock = async () => {
    setError('')
    
    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)
    try {
      const storedHash = localStorage.getItem('querax_password_hash')
      const hashedInput = await hashPassword(password)
      
      if (hashedInput !== storedHash) {
        setError('Incorrect password')
        setIsLoading(false)
        return
      }

      const encryptedKey = localStorage.getItem('querax_encrypted_key')
      if (!encryptedKey) {
        setError('No API key found. Please set up again.')
        setFirstTime(true)
        setIsLoading(false)
        return
      }

      const decryptedKey = await decryptApiKey(encryptedKey, password)
      unlock(decryptedKey, hashedInput)
    } catch (e) {
      setError('Incorrect password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-200 mb-4">
            <Shield className="h-7 w-7 text-pink-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isFirstTime ? 'Set Up Querax' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {isFirstTime 
              ? 'Create a master password to secure your API key' 
              : 'Enter your master password to unlock'}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg p-6 space-y-4">
          
          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isFirstTime ? 'Create password (min 6 chars)' : 'Enter password'}
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && (isFirstTime ? handleSetup() : handleUnlock())}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Setup only) */}
          {isFirstTime && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
            </div>
          )}

          {/* API Key Input (Setup only) */}
          {isFirstTime && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Get your key at{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline"
                >
                  https://aistudio.google.com/app/api-keys
                </a>
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={isFirstTime ? handleSetup : handleUnlock}
            disabled={isLoading}
            className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white rounded-xl gap-2"
          >
            {isLoading ? (
              'Please wait...'
            ) : (
              <>
                {isFirstTime ? 'Secure & Continue' : 'Unlock'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Privacy Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-400 justify-center pt-2">
            <Shield className="h-3 w-3" />
            Your password & API key never leave this device
          </div>
        </div>

        {/* Reset Option (Returning user) */}
        {!isFirstTime && (
          <p className="text-center mt-4 text-sm text-gray-400">
            Forgot password?{' '}
            <button
              onClick={() => {
                localStorage.clear()
                setFirstTime(true)
              }}
              className="text-pink-600 hover:underline"
            >
              Reset & set up again
            </button>
          </p>
        )}
      </div>
    </div>
  )
}