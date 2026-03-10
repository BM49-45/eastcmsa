import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import clientPromise from '@/lib/mongodb'
import Link from 'next/link'
import { 
  Mic, 
  BookOpen, 
  Calendar,
  Eye,
  Download,
  Heart,
  MessageCircle,
  TrendingUp,
  Clock
} from 'lucide-react'

async function getContentStats() {
  const client = await clientPromise
  const db = client.db('eastcmsa')

  const [totalLectures, totalBooks, totalEvents, recentContent] = await Promise.all([
    db.collection('lectures').countDocuments(),
    db.collection('books').countDocuments(),
    db.collection('events').countDocuments(),
    db.collection('content')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()
  ])

  // Get popular content
  const popularLectures = await db.collection('lectures')
    .find({})
    .sort({ views: -1 })
    .limit(5)
    .toArray()

  return {
    totalLectures,
    totalBooks,
    totalEvents,
    recentContent,
    popularLectures
  }
}

export default async function ContentOverview() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    redirect('/login')
  }

  const stats = await getContentStats()

  const statCards = [
    { 
      name: 'Total Lectures', 
      value: stats.totalLectures, 
      icon: Mic, 
      color: 'bg-blue-500',
      href: '/admin/content/lectures'
    },
    { 
      name: 'Total Books', 
      value: stats.totalBooks, 
      icon: BookOpen, 
      color: 'bg-green-500',
      href: '/admin/content/books'
    },
    { 
      name: 'Total Events', 
      value: stats.totalEvents, 
      icon: Calendar, 
      color: 'bg-purple-500',
      href: '/admin/content/events'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Popular Lectures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Popular Lectures
          </h2>
          <div className="space-y-3">
            {stats.popularLectures.map((lecture: any) => (
              <div
                key={lecture._id.toString()}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {lecture.title}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {lecture.views || 0}
                    </span>
                    <span className="flex items-center">
                      <Heart size={14} className="mr-1" />
                      {lecture.likes || 0}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle size={14} className="mr-1" />
                      {lecture.comments || 0}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/content/lectures/${lecture._id}`}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-600" />
            Recent Content
          </h2>
          <div className="space-y-3">
            {stats.recentContent.map((item: any) => (
              <div
                key={item._id.toString()}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.type === 'lecture' 
                    ? 'bg-blue-100 text-blue-800'
                    : item.type === 'book'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}