'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Loader2, BookOpen, Scale, History, Mic } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  speaker: string
  category: string
  url: string
}

export default function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (query) {
      performSearch()
    } else {
      setIsLoading(false)
      setResults([])
    }
  }, [query])

  const performSearch = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      // Handle both array response and object response with results.all
      const searchResults = Array.isArray(data) ? data : data.results?.all || []
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'tawhiid': return <BookOpen className="w-5 h-5 text-purple-500" />
      case 'fiqh': return <Scale className="w-5 h-5 text-green-500" />
      case 'sirah': return <History className="w-5 h-5 text-amber-500" />
      case 'lecture': return <Mic className="w-5 h-5 text-blue-500" />
      default: return <BookOpen className="w-5 h-5 text-gray-500" />
    }
  }

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tafuta Sauti au Mihadhara
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Andika neno katika kisanduku cha utafutaji ili kupata matokeo
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Matokeo ya Utafutaji
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Umetafuta: "{query}"
        </p>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Inatafuta...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <Link
                key={result.id}
                href={result.url}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    {getCategoryIcon(result.category)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {result.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {result.speaker}
                    </p>
                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full capitalize">
                      {result.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Hakuna Matokeo
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Hakuna matokeo yaliyopatikana kwa "{query}". Jaribu maneno mengine.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}