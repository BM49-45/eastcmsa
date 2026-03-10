import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import clientPromise from '@/lib/mongodb'
import { 
  Users, 
  BookOpen, 
  Calendar,
  MessageCircle,
  TrendingUp,
  Clock
} from 'lucide-react'

async function getDashboardStats() {
  const client = await clientPromise
  const db = client.db('eastcmsa')

  const [totalUsers, totalLectures, totalEvents, totalComments, recentUsers] = await Promise.all([
    db.collection('users').countDocuments(),
    db.collection('lectures').countDocuments(),
    db.collection('events').countDocuments(),
    db.collection('comments').countDocuments(),
    db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()
  ])

  return {
    totalUsers,
    totalLectures,
    totalEvents,
    totalComments,
    recentUsers
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    redirect('/login')
  }

  const stats = await getDashboardStats()

  const statCards = [
    { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { name: 'Total Lectures', value: stats.totalLectures, icon: BookOpen, color: 'bg-green-500' },
    { name: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'bg-purple-500' },
    { name: 'Total Comments', value: stats.totalComments, icon: MessageCircle, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {session.user.name}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
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
            </div>
          )
        })}
      </div>

      {/* Recent Users */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Users
        </h2>
        <div className="space-y-3">
          {stats.recentUsers.map((user: any) => (
            <div
              key={user._id.toString()}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {user.role}
                </span>
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}