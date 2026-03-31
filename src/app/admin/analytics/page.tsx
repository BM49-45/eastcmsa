'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, Users, BookOpen, Download, Eye, 
  RefreshCw, Clock, Bell, Share2, Smartphone
} from 'lucide-react'
import { getAnalytics, getAudioAnalytics, getUserActivities, getUsers, type UserActivity, type AudioAnalytics, type DailyStat } from '@/lib/database'

interface TopUser {
  userId: string
  userName: string
  email: string
  downloaded: boolean
  shared: boolean
  subscribed: boolean
  totalActions: number
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDownloads: 0,
    totalRegistrations: 0,
    totalAudioPlays: 0,
    totalShares: 0,
    totalSubscribers: 0,
    usersWhoDidAll: 0
  })
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [topAudio, setTopAudio] = useState<AudioAnalytics[]>([])
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([])
  const [topUsers, setTopUsers] = useState<TopUser[]>([])

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    try {
      // Load from localStorage (frontend analytics)
      const analytics = getAnalytics()
      const audioAnalytics = getAudioAnalytics()
      const activities = getUserActivities()
      const users = getUsers()
      
      // Calculate totals
      const totalShares = activities.filter(a => a.action === 'share').length
      const totalDownloads = analytics.totalDownloads
      const totalRegistrations = analytics.totalRegistrations
      const totalAudioPlays = audioAnalytics.reduce((sum: number, a: AudioAnalytics) => sum + a.totalPlays, 0)
      const totalSubscribers = analytics.totalSubscribers

      // Calculate users who did all (downloaded, shared, and subscribed)
      const usersWithDownloads = new Set(activities.filter(a => a.action === 'download_app').map(a => a.userId))
      const usersWithShares = new Set(activities.filter(a => a.action === 'share').map(a => a.userId))
      const usersWithSubscriptions = new Set(users.filter(u => u.isSubscribed).map(u => u.id))
      
      // Find users who are in all three sets
      const usersWhoDidAllCount = [...usersWithDownloads].filter(userId => 
        usersWithShares.has(userId) && usersWithSubscriptions.has(userId)
      ).length

      setStats({
        totalDownloads,
        totalRegistrations,
        totalAudioPlays,
        totalShares,
        totalSubscribers,
        usersWhoDidAll: usersWhoDidAllCount
      })

      // Daily stats (last 14 days)
      setDailyStats(analytics.dailyStats.slice(0, 14).reverse())

      // Top audio (sorted by plays)
      const sortedAudio = [...audioAnalytics].sort((a, b) => b.totalPlays - a.totalPlays).slice(0, 5)
      setTopAudio(sortedAudio)

      // Recent activities (last 10)
      setRecentActivities(activities.slice(0, 10))

      // Top users - users who have completed most actions
      const userActionsMap = new Map<string, TopUser>()
      
      activities.forEach(activity => {
        if (!userActionsMap.has(activity.userId)) {
          userActionsMap.set(activity.userId, {
            userId: activity.userId,
            userName: activity.userName,
            email: '',
            downloaded: false,
            shared: false,
            subscribed: false,
            totalActions: 0
          })
        }
        const userData = userActionsMap.get(activity.userId)!
        if (activity.action === 'download_app') userData.downloaded = true
        if (activity.action === 'share') userData.shared = true
        if (activity.action === 'subscribe') userData.subscribed = true
        userData.totalActions++
      })
      
      // Add subscription status and email from users list
      users.forEach(user => {
        if (userActionsMap.has(user.id)) {
          const userData = userActionsMap.get(user.id)!
          userData.subscribed = user.isSubscribed || userData.subscribed
          userData.email = user.email
          userData.userName = user.name || userData.userName
        } else {
          userActionsMap.set(user.id, {
            userId: user.id,
            userName: user.name,
            email: user.email,
            downloaded: false,
            shared: false,
            subscribed: user.isSubscribed || false,
            totalActions: 0
          })
        }
      })
      
      const sortedUsers = Array.from(userActionsMap.values())
        .sort((a, b) => b.totalActions - a.totalActions)
        .slice(0, 10)
      
      setTopUsers(sortedUsers)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('sw', { hour: '2-digit', minute: '2-digit' })
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'download_app': return <Download size={14} className="text-green-500" />
      case 'play_audio': return <Eye size={14} className="text-blue-500" />
      case 'share': return <Share2 size={14} className="text-orange-500" />
      case 'subscribe': return <Bell size={14} className="text-purple-500" />
      default: return <Users size={14} className="text-gray-500" />
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'download_app': return 'Alipakua App'
      case 'play_audio': return 'Alisikiliza Audio'
      case 'share': return 'Alishiriki'
      case 'subscribe': return 'Alijiunga na Taarifa'
      case 'login': return 'Aliingia'
      case 'register': return 'Alijisajili'
      default: return action
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Inapakia takwimu...</p>
        </div>
      </div>
    )
  }

  // Calculate max value for chart
  const maxChartValue = Math.max(...dailyStats.map(d => d.downloads + d.registrations + d.audioPlays), 1)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="text-green-600" />
              Takwimu za Mfumo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Takwimu halisi za shughuli za watumiaji</p>
          </div>
          <button
            onClick={loadAnalytics}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Onyesha upya takwimu"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit mb-2">
              <Smartphone className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalDownloads)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upakuaji wa App</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mb-2">
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalRegistrations)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Watumiaji Waliojisajili</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mb-2">
              <Eye className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalAudioPlays)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Marudio ya Audio</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg w-fit mb-2">
              <Share2 className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalShares)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mashirikiano</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg w-fit mb-2">
              <Bell className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalSubscribers)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Wanaojiunga na Taarifa</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg w-fit mb-2">
              <Users className="text-teal-600 dark:text-teal-400" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.usersWhoDidAll)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Walio Pakua, Share, na Subscribe</p>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-lg font-bold mb-4">Shughuli za Kila Siku (Siku 14 zilizopita)</h3>
          {dailyStats.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Hakuna data ya shughuli bado</p>
          ) : (
            <div className="h-64 flex items-end justify-between gap-2">
              {dailyStats.map((day, i) => {
                const totalValue = day.downloads + day.registrations + day.audioPlays
                const barHeightPercent = (totalValue / maxChartValue) * 100
                const barHeight = Math.max(4, (barHeightPercent / 100) * 180)
                const dayDate = new Date(day.date)
                return (
                  <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-t-lg relative">
                      <div 
                        className="bg-green-600 rounded-t-lg transition-all duration-300" 
                        style={{ height: `${barHeight}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                        <div>Upakuaji: {day.downloads}</div>
                        <div>Wajisajili: {day.registrations}</div>
                        <div>Audio: {day.audioPlays}</div>
                      </div>
                    </div>
                    <span className="text-xs mt-2 text-gray-600">{dayDate.getDate()}/{dayDate.getMonth() + 1}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Audio and Top Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4">Audio Maarufu Zaidi</h3>
            {topAudio.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Hakuna data ya audio bado</p>
            ) : (
              <div className="space-y-3">
                {topAudio.map((audio, i) => {
                  const maxPlays = topAudio[0]?.totalPlays || 1
                  const widthPercent = (audio.totalPlays / maxPlays) * 100
                  return (
                    <div key={audio.audioId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="truncate flex-1">{audio.title}</span>
                        <span className="font-medium ml-2">{audio.totalPlays} mara</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{audio.category}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Top Users Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4">Watumiaji Walio na Mafanikio Zaidi</h3>
            {topUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Hakuna data ya watumiaji bado</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {topUsers.map((user, i) => (
                  <div key={user.userId} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-bold text-gray-500 w-6">#{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{user.userName || 'Mtumiaji'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || 'Hakuna barua pepe'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      {user.downloaded && (
                        <span className="text-green-500" title="Alipakua App">
                          <Download size={14} />
                        </span>
                      )}
                      {user.shared && (
                        <span className="text-orange-500" title="Alishiriki">
                          <Share2 size={14} />
                        </span>
                      )}
                      {user.subscribed && (
                        <span className="text-blue-500" title="Alijiunga na Taarifa">
                          <Bell size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4">Shughuli za Hivi Karibuni</h3>
          {recentActivities.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Hakuna shughuli za hivi karibuni</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition">
                  <div className="w-8">{getActionIcon(activity.action)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.userName}</p>
                    <p className="text-xs text-gray-500">{getActionLabel(activity.action)}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 text-right text-sm text-gray-500 flex items-center justify-end gap-2">
          <Clock size={14} />
          <span>Takwimu zinasasishwa moja kwa moja kutoka kwenye shughuli za watumiaji</span>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
