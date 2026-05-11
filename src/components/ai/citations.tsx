import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import type { Citation } from '../../types'

interface CitationsProps {
  citations: Citation[]
}

export function Citations({ citations }: CitationsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (citations.length === 0) return null

  return (
    <div className="mt-6">
      {/* Pills Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1">
          Sources:
        </span>
        {citations.slice(0, isExpanded ? citations.length : 4).map((citation) => (
          <a
            key={citation.id}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900 border border-pink-200 dark:border-pink-800 transition-colors"
          >
            <span className="w-4 h-4 rounded-full bg-pink-200 dark:bg-pink-800 flex items-center justify-center text-[10px] font-bold text-pink-700 dark:text-pink-300">
              {citation.id}
            </span>
            {citation.title.slice(0, 25)}
            {citation.title.length > 25 ? '...' : ''}
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        ))}
        
        {/* Expand/Collapse Button */}
        {citations.length > 4 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950 transition-colors"
          >
            {isExpanded ? (
              <>Show less <ChevronUp className="h-3 w-3" /></>
            ) : (
              <>+{citations.length - 4} more <ChevronDown className="h-3 w-3" /></>
            )}
          </button>
        )}
      </div>

      {/* Expanded List */}
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {citations.map((citation) => (
            <a
              key={citation.id}
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-xs font-bold text-pink-700 dark:text-pink-300 mt-0.5 shrink-0">
                  {citation.id}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {citation.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {citation.snippet}
                  </p>
                  <p className="text-xs text-pink-600 dark:text-pink-400 mt-1 truncate">
                    {citation.url}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}