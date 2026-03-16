import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"  // <- Ime sahihishwa! (ilikua "authOptions "@/lib/auth"")
import { redirect } from "next/navigation"
import Link from "next/link"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Define types
interface FavoriteItem {
  _id: string | ObjectId
  userId: string
  audioId: string
  audioData: {
    title: string
    speaker: string
    category: string
    duration?: string
    url?: string
    [key: string]: any
  }
  createdAt: Date
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Fetch real favorites from database
  let favorites: FavoriteItem[] = []
  
  try {
    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const result = await db
      .collection("favorites")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray()
    
    // Map to include string _id
    favorites = result.map((fav: any) => ({
      ...fav,
      _id: fav._id.toString(),
      audioData: fav.audioData || {
        title: "Unknown Audio",
        speaker: "Unknown Speaker",
        category: "general"
      }
    }))
  } catch (error) {
    console.error("Error fetching favorites:", error)
    // If error or no favorites yet, use empty array
    favorites = []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-600 rounded-3xl opacity-10"></div>
          <div className="relative p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
            <p className="text-xl text-gray-600">
              Your collection of favorite audio content
            </p>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div key={item._id.toString()} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                <div className="relative h-40 bg-gradient-to-br from-rose-500 to-purple-600">
                  {/* Audio wave visualization */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path d="M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20" stroke="white" fill="none" strokeWidth="2"/>
                      <path d="M0,25 Q15,15 30,25 T60,25 T90,25" stroke="white" fill="none" strokeWidth="2"/>
                      <path d="M0,15 Q20,25 40,15 T80,15" stroke="white" fill="none" strokeWidth="2"/>
                    </svg>
                  </div>
                  
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    {item.audioData.category || 'General'}
                  </span>

                  {/* Favorite icon */}
                  <div className="absolute top-4 right-4">
                    <svg className="w-6 h-6 text-rose-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" title={item.audioData.title}>
                    {item.audioData.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Speaker:</span> {item.audioData.speaker}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.audioData.duration || '00:00'}
                    </span>
                    <span>
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      className="flex-1 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors text-sm font-medium"
                      aria-label={`Play ${item.audioData.title}`}
                    >
                      Play
                    </button>
                    <button 
                      className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium"
                      aria-label={`Remove ${item.audioData.title} from favorites`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
            <div className="text-7xl mb-4 animate-pulse">❤️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
            <p className="text-gray-600 mb-8">Start adding your favorite audio content</p>
            <Link 
              href="/categories" 
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Browse Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}