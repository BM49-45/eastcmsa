import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import ActivityFeed from "@/components/activity/ActivityFeed"
import ActivitySummary from "@/components/activity/ActivitySummary"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {session?.user?.name}
          </p>
        </div>

        {/* Activity Summary */}
        <div className="mb-8">
          <ActivitySummary />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed - Takes 2/3 of space */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>

          {/* Quick Actions - Takes 1/3 of space */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Vitendo vya Haraka
              </h2>
              <div className="space-y-3">
                <Link href="/categories" 
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                    📚
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Vinjari Kategoria</span>
                </Link>

                <Link href="/favorites" 
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600">
                    ❤️
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Favorites Zangu</span>
                </Link>

                <Link href="/playlists" 
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
                    🎵
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Playlists Zangu</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}