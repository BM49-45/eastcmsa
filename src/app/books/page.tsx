'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Download, Eye, ChevronDown, ChevronUp, Heart, Share2, Star } from 'lucide-react'

interface Book {
  id: string
  title: string
  titleAr: string
  author: string
  description: string
  category: string
  fileUrl: string
  pages?: number
}

const books: Book[] = [
  {
    id: 'usul-sitta',
    title: 'Al-Usuul As-Sitta',
    titleAr: 'الأصول السنة',
    author: 'Shaykh Salih Al-Fawzan',
    description: 'Kitabu kinachoelezea misingi sita muhimu ya imani na utauhid.',
    category: 'Aqeedah',
    fileUrl: 'https://pub-7729259c73e646759f7039886bf31b23.r2.dev/books/%D8%A7%D9%84%D8%A3%D8%B5%D9%88%D9%84%20%D8%A7%D9%84%D8%B3%D8%AA%D8%A9.pdf',
    pages: 49
  },
  {
    id: 'fiqh-muyassar',
    title: 'Al-Fiqh Al-Muyassar',
    titleAr: 'الفقه الميسر',
    author: 'Wizarah Al-Awqaf Kuwait',
    description: 'Kitabu cha fiqh kilichorahisishwa kwa ufahamu wa kila mtu.',
    category: 'Fiqh',
    fileUrl: 'https://pub-7729259c73e646759f7039886bf31b23.r2.dev/books/%D8%A7%D9%84%D9%81%D9%82%D9%87%20%D8%A7%D9%84%D9%85%D9%8A%D8%B3%D8%B1%20%D9%81%D9%8A%20%D8%B6%D9%88%D8%A1%20%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D8%A8%20%D9%88.pdf',
    pages: 35
  },
  {
    id: 'umdatul-ahkam',
    title: 'Sharh Umdatul Ahkam',
    titleAr: 'شرح عمدة الأحكام',
    author: 'Shaykh Abdullah Al-Bassam',
    description: 'Ufafanuzi wa hadith za hukumu za muhimu katika Uislamu.',
    category: 'Hadith',
    fileUrl: 'https://pub-7729259c73e646759f7039886bf31b23.r2.dev/books/%D8%B4%D8%B1%D8%AD%20%D8%B9%D9%85%D8%AF%D8%A9%20%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85.pdf',
    pages: 0
  },
  {
    id: 'qawaid-arba',
    title: 'Al-Qawaid Al-Arba',
    titleAr: 'متن القواعد الأربع',
    author: 'Shaykh Muhammad Ibn Abdul Wahhab',
    description: 'Kanuni nne za msingi katika kutofautisha kati ya utauhid na ushirik.',
    category: 'Aqeedah',
    fileUrl: 'https://pub-7729259c73e646759f7039886bf31b23.r2.dev/books/%D9%85%D8%AA%D9%86%20%D8%A7%D9%84%D9%82%D9%88%D8%A7%D8%B9%D8%AF%20%D8%A7%D9%84%D8%A3%D8%B1%D8%A8%D8%B9.pdf',
    pages: 0
  },
  {
    id: 'sharh-sunnah',
    title: 'Sharh As-Sunnah',
    titleAr: 'شرح السنة للإمام المزني',
    author: 'Imam Al-Muzani',
    description: 'Ufafanuzi wa misingi ya Sunnah na imani sahihi.',
    category: 'Aqeedah',
    fileUrl: 'https://pub-7729259c73e646759f7039886bf31b23.r2.dev/books/%D9%85%D8%AA%D9%86%20%D8%B4%D8%B1%D8%AD%20%D8%A7%D9%84%D8%B3%D9%86%D8%A9%20%D9%84%D9%84%D8%A5%D9%85%D8%A7%D9%85%20%D8%A7%D9%84%D9%85%D8%B2%D9%86%D9%8A%20%D8%B1%D8%AD%D9%85%D9%87%20%D8%A7%D9%84%D9%84%D9%87.pdf',
    pages: 0
  },
  {
    id: 'kashf-shubuhat',
    title: 'Kashf Ash-Shubuhat',
    titleAr: 'كشف الشبهات',
    author: 'Shaykh Muhammad Ibn Abdul Wahhab',
    description: 'Kitabu kinachojibu na kufafanua mashaka kuhusu utauhid.',
    category: 'Aqeedah',
    fileUrl: 'https://pub-7729259c73e646759f7039886bf31b23.r2.dev/books/%D9%85%D8%AA%D9%86%20%D9%83%D8%B4%D9%81%20%D8%A7%D9%84%D8%B4%D8%A8%D9%87%D8%A7%D8%AA.PDF',
    pages: 0
  }
]

const categories = ['All', 'Aqeedah', 'Fiqh', 'Hadith']

export default function BooksPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedBook, setExpandedBook] = useState<string | null>(null)

  // User interactions states (stored in localStorage)
  const [likedBooks, setLikedBooks] = useState<string[]>([])
  const [favouritedBooks, setFavouritedBooks] = useState<string[]>([])
  const [sharedBooks, setSharedBooks] = useState<string[]>([])

  // Load saved interactions from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedBooks')
    const savedFavourites = localStorage.getItem('favouritedBooks')
    const savedShares = localStorage.getItem('sharedBooks')

    if (savedLikes) setLikedBooks(JSON.parse(savedLikes))
    if (savedFavourites) setFavouritedBooks(JSON.parse(savedFavourites))
    if (savedShares) setSharedBooks(JSON.parse(savedShares))
  }, [])

  // Save interactions to localStorage
  const saveLikes = (newLikes: string[]) => {
    setLikedBooks(newLikes)
    localStorage.setItem('likedBooks', JSON.stringify(newLikes))
  }

  const saveFavourites = (newFavourites: string[]) => {
    setFavouritedBooks(newFavourites)
    localStorage.setItem('favouritedBooks', JSON.stringify(newFavourites))
  }

  const saveShares = (newShares: string[]) => {
    setSharedBooks(newShares)
    localStorage.setItem('sharedBooks', JSON.stringify(newShares))
  }

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDownload = (fileUrl: string, bookId: string) => {
    window.open(fileUrl, '_blank')
  }

  const handleRead = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  const handleLike = (bookId: string) => {
    if (likedBooks.includes(bookId)) {
      saveLikes(likedBooks.filter(id => id !== bookId))
    } else {
      saveLikes([...likedBooks, bookId])
    }
  }

  const handleFavourite = (bookId: string) => {
    if (favouritedBooks.includes(bookId)) {
      saveFavourites(favouritedBooks.filter(id => id !== bookId))
    } else {
      saveFavourites([...favouritedBooks, bookId])
    }
  }

  const handleShare = async (book: Book) => {
    const shareData = {
      title: book.title,
      text: `Nimekipenda kitabu "${book.title}" kutoka EASTCMSA Maktaba. Unaweza kukisoma na kukipakua bure!`,
      url: book.fileUrl
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${book.title} - ${book.fileUrl}`)
        alert('Link ya kitabu imenakiliwa!')
      }

      if (!sharedBooks.includes(book.id)) {
        saveShares([...sharedBooks, book.id])
      }
    } catch (error) {
      console.log('Share cancelled or failed')
    }
  }

  // Get favourite books for display
  const favouriteBooksList = books.filter(book => favouritedBooks.includes(book.id))
  const likedBooksList = books.filter(book => likedBooks.includes(book.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Maktaba ya Vitabu
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Vitabu vya muhimu katika Aqeedah, Fiqh, na Hadith kwa manufaa ya kila Muislamu
          </p>
        </div>

        {/* Favourites Section - Only shows if there are favourites */}
        {favouritedBooks.length > 0 && (
          <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              Vitabu Uliyovipenda (Favourites)
            </h2>
            <div className="flex flex-wrap gap-2">
              {favouriteBooksList.map(book => (
                <button
                  key={book.id}
                  onClick={() => {
                    document.getElementById(book.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition"
                >
                  {book.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tafuta kitabu kwa jina, mwandishi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Search books"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl transition-colors ${selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                  }`}
              >
                {cat === 'All' ? 'Zote' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Hakuna kitabu kilichopatikana kwa utafutaji wako.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isLiked = likedBooks.includes(book.id)
              const isFavourited = favouritedBooks.includes(book.id)
              const isShared = sharedBooks.includes(book.id)

              return (
                <div
                  key={book.id}
                  id={book.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                >
                  {/* Book Cover Area */}
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-center relative">
                    <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{book.title}</h3>
                    <p className="text-emerald-100 text-sm">{book.titleAr}</p>

                    {/* Interaction Buttons on Cover */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={() => handleLike(book.id)}
                        className={`p-1.5 rounded-full transition ${isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        title={isLiked ? 'Ondoa Like' : 'Weka Like'}
                      >
                        <Heart size={14} className={isLiked ? 'fill-white' : ''} />
                      </button>
                      <button
                        onClick={() => handleFavourite(book.id)}
                        className={`p-1.5 rounded-full transition ${isFavourited ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        title={isFavourited ? 'Ondoa Favourite' : 'Weka Favourite'}
                      >
                        <Star size={14} className={isFavourited ? 'fill-white' : ''} />
                      </button>
                      <button
                        onClick={() => handleShare(book)}
                        className={`p-1.5 rounded-full transition ${isShared ? 'bg-blue-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        title={isShared ? 'Imeshare tayari' : 'Share Kitabu'}
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                        {book.category}
                      </span>
                      {book.pages && book.pages > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {book.pages} kurasa
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      <strong>Mwandishi:</strong> {book.author}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {book.description}
                    </p>

                    {/* Interaction Stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {isLiked && <span className="text-red-500">❤️ Umeipenda</span>}
                      {isFavourited && <span className="text-amber-500">⭐ Kwenye Favourites</span>}
                      {isShared && <span className="text-blue-500">📤 Umeshare</span>}
                    </div>

                    {/* Expandable Description */}
                    {expandedBook === book.id && (
                      <div className="mt-2 mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {book.description} Kitabu hiki ni muhimu kwa kila anayetaka kuelewa misingi ya dini.
                        </p>
                      </div>
                    )}

                    {book.description.length > 100 && (
                      <button
                        onClick={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
                        className="text-emerald-600 dark:text-emerald-400 text-xs mb-3 flex items-center gap-1"
                      >
                        {expandedBook === book.id ? (
                          <>Onyesha Kidogo <ChevronUp size={12} /></>
                        ) : (
                          <>Soma Zaidi <ChevronDown size={12} /></>
                        )}
                      </button>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleRead(book.fileUrl)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors text-sm font-medium"
                      >
                        <Eye size={16} />
                        Soma
                      </button>
                      <button
                        onClick={() => handleDownload(book.fileUrl, book.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors text-sm font-medium"
                      >
                        <Download size={16} />
                        Pakua PDF
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
          <p>Vitabu vyote vinapatikana kwa bure. Hakimiliki zimehifadhiwa kwa wamiliki wake.</p>
        </div>
      </div>
    </div>
  )
}