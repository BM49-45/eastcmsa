'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2, BookOpen, Scale, History, Mic, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define proper types
interface SearchResult {
  id: string
  title: string
  speaker: string
  category: string
  type: 'tawhiid' | 'fiqh' | 'sirah' | 'lecture'
  url: string
  date?: string
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState<string[]>(['Tawhiid', 'Fiqh', 'Sirah', 'Umdatul Ahkaam', 'Khulaswah Nurulyaqyn'])
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5))
      } catch {
        setRecentSearches([])
      }
    }
  }, [])

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle ESC key
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  // Search function
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        // Fetch real search results from API
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        } else {
          setResults([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))

    // Navigate to search page
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    setIsOpen(false)
    setQuery('')
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'tawhiid': return <BookOpen className="w-4 h-4 text-purple-500" />
      case 'fiqh': return <Scale className="w-4 h-4 text-green-500" />
      case 'sirah': return <History className="w-4 h-4 text-amber-500" />
      case 'lecture': return <Mic className="w-4 h-4 text-blue-500" />
      default: return <BookOpen className="w-4 h-4 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'tawhiid': return 'from-purple-500 to-purple-600'
      case 'fiqh': return 'from-green-500 to-green-600'
      case 'sirah': return 'from-amber-500 to-amber-600'
      case 'lecture': return 'from-blue-500 to-blue-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Tafuta"
        title="Tafuta maudhui"
      >
        <Search size={20} />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-2 mb-2">
              <Search className="text-green-600" size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Tafuta</h3>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Tafuta darsa, mhadhiri, au somo..."
                className="w-full pl-4 pr-20 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                aria-label="Weka neno la kutafuta"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <button
                    onClick={handleClear}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Futa"
                    title="Futa"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleSearch(query)}
                  disabled={!query.trim()}
                  className={`p-1.5 rounded-lg transition-colors ${
                    query.trim()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                  }`}
                  aria-label="Tafuta"
                  title="Tafuta"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Search Tips */}
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</span>
              <span>kutafuta</span>
            </p>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600 mb-2" />
                <p className="text-sm text-gray-500">Inatafuta...</p>
              </div>
            ) : query.length >= 2 ? (
              results.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {results.map((result, index) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getCategoryColor(result.category)} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                          {getCategoryIcon(result.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                            {result.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {result.speaker}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 capitalize">
                              {result.category === 'tawhiid' ? 'Tawhiid' :
                               result.category === 'fiqh' ? 'Fiqh' :
                               result.category === 'sirah' ? 'Sirah' : 'Mihadhara'}
                            </span>
                            {result.date && (
                              <span className="text-gray-400 flex items-center gap-1">
                                <Clock size={10} />
                                {new Date(result.date).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">Hakuna matokeo</p>
                  <p className="text-sm text-gray-500">
                    Hakuna matokeo ya "{query}"
                  </p>
                </div>
              )
            ) : (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Tafuta za Hivi Karibuni
                    </h4>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search)
                            handleSearch(search)
                          }}
                          className="flex items-center gap-2 w-full p-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                        >
                          <Clock size={14} className="text-gray-400 group-hover:text-green-600" />
                          <span className="flex-1">{search}</span>
                          <Search size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Tafuta Maarufu
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(term)
                          handleSearch(term)
                        }}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Tips */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <Search size={12} className="text-green-600 mt-0.5" />
                    <span>
                      Tafuta kwa jina la darsa, mhadhiri, au kitabu. Mfano: "Tawhiid", "Sheikh Iddy", "Umdatul Ahkaam"
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}