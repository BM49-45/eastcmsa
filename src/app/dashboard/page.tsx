import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, User, Settings, Heart, Award, Clock } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const stats = {
    downloads: 0,
    favorites: 0,
    playlists: 0,
    hours: 0
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, {session.user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Downloads</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.downloads}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Favorites</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favorites}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Playlists</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.playlists}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Listening Hours</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hours}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/profile" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <User className="text-green-600" size={20} />
            <span>My Profile</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <Settings className="text-green-600" size={20} />
            <span>Settings</span>
          </Link>
          <Link href="/favorites" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <Heart className="text-green-600" size={20} />
            <span>Favorites</span>
          </Link>
          <Link href="/playlists" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <Award className="text-green-600" size={20} />
            <span>Playlists</span>
          </Link>
        </div>
      </div>
    </div>
  )
}