import ReactMarkdown from 'react-markdown'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { LoadingDots } from './loading-dots'
import { Citations } from './citations'
import type { Citation } from '../../types'

interface AIResponseProps {
  text: string
  citations: Citation[]
  isLoading: boolean
}

export function AIResponse({ text, citations, isLoading }: AIResponseProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Glass Morphism Card */}
      <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Answer
            </span>
          </div>
          
          {/* Copy Button */}
          {text && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingDots />
        ) : text ? (
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 select-text">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        ) : null}
      </div>

      {/* Citations */}
      {!isLoading && citations.length > 0 && (
        <Citations citations={citations} />
      )}
    </div>
  )
}