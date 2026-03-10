'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Heart,
  MessageCircle,
  Download,
  Edit,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  name: string
  email: string
  phone?: string
  bio?: string
  location?: string
  image?: string | null
  joinedAt: string
  stats: {
    lectures: number
    books: number
    likes: number
    comments: number
    downloads: number
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile')
        const data = await res.json()
        if (res.ok) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchProfile()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Hitilafu kupakia profaili</p>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-600"></div>
          
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-xl">
                {profile.image ? (
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="absolute top-4 right-6">
              <Link
                href="/settings"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Edit size={18} />
                <span>Hariri</span>
              </Link>
            </div>

            {/* Profile Info */}
            <div className="ml-36 pt-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              
              <div className="mt-4 space-y-2">
                <p className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Mail size={16} className="mr-2 text-green-600" />
                  {profile.email}
                </p>
                
                {profile.phone && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Phone size={16} className="mr-2 text-green-600" />
                    {profile.phone}
                  </p>
                )}
                
                {profile.location && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin size={16} className="mr-2 text-green-600" />
                    {profile.location}
                  </p>
                )}
                
                <p className="text-gray-500 dark:text-gray-500 flex items-center text-sm">
                  <Calendar size={14} className="mr-2" />
                  Alijiunga: {new Date(profile.joinedAt).toLocaleDateString('sw-TZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {profile.bio && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.stats.lectures}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mihadhara</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <Heart className="w-8 h-8 mx-auto text-red-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.stats.likes}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mapendekezo</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.stats.comments}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Maoni</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <Download className="w-8 h-8 mx-auto text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.stats.downloads}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pakua</div>
          </div>
        </div>
      </div>
    </div>
  )
}