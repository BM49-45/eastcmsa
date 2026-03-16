import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Define types
interface PlaylistItem {
  _id: string | ObjectId
  name: string
  userId: string
  description?: string
  coverImage?: string
  tracks: any[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  trackCount?: number
}

export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // Fetch real playlists from database
  let playlists: PlaylistItem[] = []
  
  try {
    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const result = await db
      .collection("playlists")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray()
    
    // Map to include trackCount
    playlists = result.map((playlist: any) => ({
      ...playlist,
      _id: playlist._id.toString(),
      trackCount: playlist.tracks?.length || 0
    }))
  } catch (error) {
    console.error("Error fetching playlists:", error)
    // If error or no playlists yet, use empty array
    playlists = []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Playlists</h1>
            <p className="text-xl text-gray-600">Organize your favorite audio</p>
          </div>
          <Link 
            href="/playlists/create" 
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 self-start"
            aria-label="Create new playlist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Playlist
          </Link>
        </div>

        {/* Playlists Grid */}
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div key={playlist._id.toString()} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="relative h-40 bg-gradient-to-br from-emerald-500 to-teal-600">
                  {playlist.coverImage ? (
                    <img 
                      src={playlist.coverImage} 
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                  )}
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-3xl font-bold">{playlist.trackCount || 0}</p>
                    <p className="text-sm opacity-90">tracks</p>
                  </div>
                  
                  {/* Privacy badge */}
                  {!playlist.isPublic && (
                    <span className="absolute top-4 right-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white">
                      Private
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{playlist.name}</h3>
                  {playlist.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{playlist.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">
                    Created {new Date(playlist.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/playlists/${playlist._id}`}
                      className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors text-center"
                      aria-label={`View playlist ${playlist.name}`}
                    >
                      View Playlist
                    </Link>
                    <button 
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      aria-label={`Delete playlist ${playlist.name}`}
                      title="Delete playlist"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
            <div className="text-7xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Playlists Yet</h2>
            <p className="text-gray-600 mb-8">Create your first playlist to organize audio</p>
            <Link 
              href="/playlists/create" 
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
              aria-label="Create your first playlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Playlist
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}