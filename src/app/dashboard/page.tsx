'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  BookOpen,
  Users,
  Calendar,
  MessageCircle,
  Heart,
  Download,
  Clock,
  TrendingUp,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  const stats = [
    { label: 'Mihadhara', value: '12', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Vikundi', value: '3', icon: Users, color: 'bg-green-500' },
    { label: 'Maoni', value: '45', icon: MessageCircle, color: 'bg-purple-500' },
    { label: 'Mapendekezo', value: '89', icon: Heart, color: 'bg-red-500' },
  ]

  const recentActivity = [
    { type: 'lecture', title: 'Tawhid - Umuhimu wa Tawhid', time: 'Dakika 30 zilizopita' },
    { type: 'comment', title: 'Ulitoa maoni kwenye darsa', time: 'Saa 2 zilizopita' },
    { type: 'download', title: 'Ulipakua kitabu cha Fiqh', time: 'Jana' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Karibu, {session?.user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hii ni dashibodi yako. Angalia shughuli zako za hivi karibuni.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.color} bg-opacity-10 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400">{stat.label}</h3>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="mr-2 text-green-600" size={20} />
              Shughuli za Hivi Karibuni
            </h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
              Angalia Shughuli Zote →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Vifaa vya Haraka
            </h2>
            
            <div className="space-y-3">
              <Link
                href="/lectures"
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition group"
              >
                <BookOpen className="text-green-600 group-hover:scale-110 transition" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Mihadhara Mpya</span>
              </Link>

              <Link
                href="/community"
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition group"
              >
                <Users className="text-green-600 group-hover:scale-110 transition" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Jiunge na Vikundi</span>
              </Link>

              <Link
                href="/schedule"
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition group"
              >
                <Calendar className="text-green-600 group-hover:scale-110 transition" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Ratiba ya Darsa</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition group"
              >
                <TrendingUp className="text-green-600 group-hover:scale-110 transition" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Progress Yangu</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Matukio Yajayo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Darsa la Tawhid</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jumatatu, 15:00</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Mkutano wa Jumuiya</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jumatano, 10:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}