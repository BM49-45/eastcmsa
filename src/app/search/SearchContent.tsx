'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search, 
  Headphones, 
  BookOpen, 
  FileText, 
  AlertCircle,
  Filter,
  Calendar,
  User,
  Download,
  PlayCircle,
  X,
  Clock,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

// simple debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }
}

// cast motion to any to avoid strict prop typing
const M: any = motion

// Sample search data - Later this will come from database
const searchData = [
  { 
    id: 1, 
    type: 'audio', 
    title: 'Tawhiid Series - Al Usuul Athalatha', 
    category: 'tawhiid', 
    url: '/tawhiid',
    description: 'Darsa ya kwanza kuhusu Umoja wa Mwenyezi Mungu',
    duration: '45 min',
    date: '2024-01-15',
    views: 1250,
    author: 'Sheikh Ahmed'
  },
  { 
    id: 2, 
    type: 'audio', 
    title: 'Fiqh - Manhaju As Saalikin', 
    category: 'fiqh', 
    url: '/fiqh',
    description: 'Mafundisho ya Fiqh kwa mwanzo',
    duration: '60 min',
    date: '2024-01-20',
    views: 980,
    author: 'Sheikh Ali'
  },
  { 
    id: 3, 
    type: 'audio', 
    title: 'Sirah - Khulaswah Nurulyaqyn', 
    category: 'sirah', 
    url: '/sirah',
    description: 'Maisha ya Mtume Muhammad (SAW)',
    duration: '50 min',
    date: '2024-01-25',
    views: 1560,
    author: 'Sheikh Iddy Issa'
  },
  { 
    id: 4, 
    type: 'book', 
    title: 'Kitabu cha Tawhiid (PDF)', 
    category: 'books', 
    url: '/books',
    description: 'Kitabu kamili cha Tawhiid kwa PDF',
    pages: 120,
    size: '2.4 MB',
    downloads: 540,
    author: 'Sheikh Ahmed'
  },
  { 
    id: 5, 
    type: 'book', 
    title: 'Manhaju As Saalikin PDF', 
    category: 'books', 
    url: '/books',
    description: 'Kitabu cha Fiqh kwa wale wanaoanza',
    pages: 180,
    size: '3.1 MB',
    downloads: 320,
    author: 'Sheikh Ali'
  },
  { 
    id: 6, 
    type: 'event', 
    title: 'Mihadhara ya Mwanzo wa Semister', 
    category: 'events', 
    url: '/events',
    description: 'Mihadhara ya kuongoza kwenye semister mpya',
    date: '2024-02-01',
    location: 'EASTC Hall',
    attendees: 150
  },
  { 
    id: 7, 
    type: 'contact', 
    title: 'Barua Pepe ya Mawasiliano', 
    category: 'contact', 
    url: '/contact',
    description: 'Tuma ujumbe wako kwa timu ya EASTCMSA',
    email: 'contact@eastcmsa.org',
    response: 'Within 24 hours'
  },
  { 
    id: 8, 
    type: 'page', 
    title: 'Kuhusu Jumuiya', 
    category: 'about', 
    url: '/about',
    description: 'Taarifa kuhusu jumuiya ya EASTCMSA',
    members: 250,
    established: '2023'
  },
]

const getIcon = (type: string) => {
  switch (type) {
    case 'audio': return <Headphones size={20} className="text-green-600" />
    case 'book': return <BookOpen size={20} className="text-blue-600" />
    case 'event': return <Calendar size={20} className="text-purple-600" />
    case 'contact': return <User size={20} className="text-red-600" />
    case 'page': return <FileText size={20} className="text-orange-600" />
    default: return <FileText size={20} className="text-gray-600" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'audio': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'book': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'event': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'contact': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

type FilterType = 'all' | 'audio' | 'book' | 'event' | 'contact' | 'page'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  const initialType = searchParams.get('type') as FilterType || 'all'
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialType)
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('eastcmsa_recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search to recent
  const saveSearch = useCallback((term: string) => {
    if (!term.trim()) return
    
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('eastcmsa_recent_searches', JSON.stringify(updated))
  }, [recentSearches])

  // Debounced search function
  const performSearch = useCallback(debounce(async (searchTerm: string, filter: FilterType) => {
  if (!searchTerm.trim()) {
    setResults([])
    setLoading(false)
    return
  }

  setLoading(true)
  
  try {
    // Tumia API badala ya mock data
    const results = await fetchSearchResults(searchTerm, filter)
    setResults(results)
  } catch (error) {
    console.error('Search error:', error)
    setResults([])
  } finally {
    setLoading(false)
    
    // Update URL
    const params = new URLSearchParams()
    params.set('q', searchTerm)
    if (filter !== 'all') params.set('type', filter)
    router.push(`/search?${params.toString()}`, { scroll: false })
  }
}, 300), [router])

  // Initial search on mount
  useEffect(() => {
    if (initialQuery) {
      setLoading(true)
      performSearch(initialQuery, initialType)
      saveSearch(initialQuery)
    }
  }, [initialQuery, initialType, performSearch, saveSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    saveSearch(query)
    performSearch(query, activeFilter)
  }

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
    if (query.trim()) {
      setLoading(true)
      performSearch(query, filter)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setActiveFilter('all')
    router.push('/search')
  }

  const fetchSearchResults = async (searchTerm: string, filter: FilterType) => {
  try {
    const params = new URLSearchParams({
      q: searchTerm,
      type: filter
    })
    
    const response = await fetch(`/api/search?${params}`)
    const data = await response.json()
    return data.results
  } catch (error) {
    console.error('Search API error:', error)
    return []
  }
}

  const filters: { type: FilterType; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: 'Zote', icon: <Filter size={16} /> },
    { type: 'audio', label: 'Audio', icon: <Headphones size={16} /> },
    { type: 'book', label: 'Vitabu', icon: <BookOpen size={16} /> },
    { type: 'event', label: 'Matukio', icon: <Calendar size={16} /> },
    { type: 'contact', label: 'Mawasiliano', icon: <User size={16} /> },
    { type: 'page', label: 'Kurasa', icon: <FileText size={16} /> },
  ]

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <M.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Search className="mr-3 text-green-600" size={32} />
                Utafutaji
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Tafuta darsa, vitabu, matukio na zaidi
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              aria-label="Toggle filters"
            >
              <Filter size={18} />
              <span>Chuja ({activeFilter === 'all' ? 'Zote' : filters.find(f => f.type === activeFilter)?.label})</span>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Andika neno la kutafuta (mf: Tawhiid, Fiqh, Sirah...)"
                className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 pr-24"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                    aria-label="Clear search"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                )}
                <button
                  type="submit"
                  className="p-2 bg-green-600 hover:bg-green-700 rounded-full"
                  aria-label="Search"
                  disabled={loading}
                >
                  <Search size={20} className="text-white" />
                </button>
              </div>
            </div>
          </form>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Utafutaji wa Hivi Karibuni:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(term)
                      setLoading(true)
                      saveSearch(term)
                      performSearch(term, activeFilter)
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    aria-label={`Search ${term}`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <M.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm font-medium mb-3">Chuja kwa aina:</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.type}
                    type="button"
                    onClick={() => handleFilterChange(filter.type)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      activeFilter === filter.type
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label={`Filter ${filter.label}`}
                  >
                    {filter.icon}
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </M.div>
          )}
        </M.div>

        {/* Search Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {query ? `Matokeo ya "${query}"` : 'Anza Kutafuta'}
            </h2>
            {query && (
              <div className="text-gray-600 dark:text-gray-300">
                {loading ? (
                  <span>Inatafuta...</span>
                ) : (
                  <span>{results.length} matokeo yamepatikana</span>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
              <p className="mt-4 text-lg">Inatafuta katika maktaba...</p>
              <p className="text-sm text-gray-500 mt-2">Inaweza kuchukua sekunde chache</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.map((item, index) => (
                <M.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <Link href={item.url} className="block hover:no-underline">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                            {getIcon(item.type)}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                              {item.type === 'audio' ? 'Darsa ya Sauti' : 
                               item.type === 'book' ? 'Kitabu' : 
                               item.type === 'event' ? 'Tukio' : 
                               item.type === 'contact' ? 'Mawasiliano' : 'Ukurasa'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {item.category}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                            {item.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            {item.description}
                          </p>

                          {/* Metadata based on type */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            {item.type === 'audio' && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {item.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <PlayCircle size={14} />
                                  {item.views} wasikilizaji
                                </span>
                              </>
                            )}
                            {item.type === 'book' && (
                              <>
                                <span>{item.pages} kurasa</span>
                                <span className="flex items-center gap-1">
                                  <Download size={14} />
                                  {item.downloads} upakuzi
                                </span>
                              </>
                            )}
                            {item.type === 'event' && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {item.date}
                                </span>
                                <span>{item.attendees} watu</span>
                              </>
                            )}
                            {item.author && (
                              <span className="text-green-600 font-medium">
                                {item.author}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-green-600">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                </M.div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-bold mb-3">Hakuna Matokeo</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                Hakuna matokeo yaliyopatikana kwa "<span className="font-bold">{query}</span>". 
                Jaribu neno lingine au angalia umeandika kwa usahihi.
              </p>
              
              <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                <h4 className="font-bold mb-3 text-lg">Vidokezo vya Utafutaji:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-2 text-green-600">Masomo:</p>
                    <ul className="space-y-1 text-sm">
                      <li>Tawhiid</li>
                      <li>Fiqh</li>
                      <li>Sirah</li>
                      <li>Manhaju</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-blue-600">Vitabu:</p>
                    <ul className="space-y-1 text-sm">
                      <li>Al Usuul Athalatha</li>
                      <li>Khulaswah</li>
                      <li>Qawaa'idul Arbaa</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={clearSearch}
                className="mt-6 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition"
                aria-label="Clear search"
              >
                Futa Utafutaji
              </button>
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
              <Search className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-bold mb-3">Anza Kutafuta</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
                Tumia kisanduku cha juu kutafuta darsa, vitabu, matukio, au mada zozote 
                unazozitaka kujifunza. Unaweza pia kuchuja matokeo kwa aina.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {filters.slice(1).map((filter) => (
                  <button
                    key={filter.type}
                    type="button"
                    onClick={() => {
                      setActiveFilter(filter.type)
                      setShowFilters(true)
                    }}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition flex flex-col items-center gap-2"
                    aria-label={`Filter ${filter.label}`}
                  >
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                      {filter.icon}
                    </div>
                    <span className="font-medium">{filter.label}</span>
                    <span className="text-xs text-gray-500">Bofya kuchuja</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Trending Searches */}
        {!query && (
          <M.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-green-200 dark:border-green-800"
          >
            <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
              <TrendingUp size={20} className="text-green-600" />
              Utafutaji Unaovuma
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Tawhiid', 'Fiqh wa Sala', 'Sirah ya Mtume', 'Quran Tafsiri', 'Ramadhan', 'Hajj', 'Zakaat'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term)
                    setLoading(true)
                    saveSearch(term)
                    performSearch(term, activeFilter)
                  }}
                  className="px-4 py-2 bg-white dark:bg-gray-700 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-200 dark:border-green-800 transition flex items-center gap-2"
                  aria-label={`Trending ${term}`}
                >
                  <span className="text-green-600">#</span>
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </M.div>
        )}
      </div>
    </div>
  )
}