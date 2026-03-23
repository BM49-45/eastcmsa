'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, Users, BookOpen, Download, Eye, 
  ArrowUp, ArrowDown, RefreshCw, Clock, AlertCircle
} from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  totalDownloads: number
  totalUsers: number
  totalContent: number
  viewsGrowth: number
  downloadsGrowth: number
  usersGrowth: number
  contentGrowth: number
  viewsByCategory: { category: string, views: number, downloads: number }[]
  recentActivity: { date: string, views: number, downloads: number }[]
  topContent: { title: string, speaker: string, views: number, downloads: number }[]
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalViews: 0,
    totalDownloads: 0,
    totalUsers: 0,
    totalContent: 0,
    viewsGrowth: 0,
    downloadsGrowth: 0,
    usersGrowth: 0,
    contentGrowth: 0,
    viewsByCategory: [],
    recentActivity: [],
    topContent: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const analyticsData = await res.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Hitilafu kupakia takwimu. Tafadhali jaribu tena.')
    } finally {
      setLoading(false)
    }
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp size={14} className="inline mr-1" />
    if (growth < 0) return <ArrowDown size={14} className="inline mr-1" />
    return null
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
    return num.toString()
  }

  const getMaxViews = () => {
    if (data.viewsByCategory.length === 0) return 1
    return Math.max(...data.viewsByCategory.map(item => item.views))
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hitilafu</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Jaribu Tena
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="text-green-600" />
              Takwimu za Mfumo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Takwimu halisi za shughuli za tovuti</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="time-range" className="sr-only">Chagua muda</label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
              title="Chagua muda wa takwimu"
            >
              <option value="day">Leo</option>
              <option value="week">Wiki Hii</option>
              <option value="month">Mwezi Huu</option>
              <option value="year">Mwaka Huu</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Onyesha upya takwimu"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Eye className="text-blue-600 dark:text-blue-400" size={24} /></div>
              <span className={`text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full ${getGrowthColor(data.viewsGrowth)}`}>
                {getGrowthIcon(data.viewsGrowth)}{data.viewsGrowth > 0 ? '+' : ''}{data.viewsGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(data.totalViews)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Matazamio Jumla</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg"><Download className="text-green-600 dark:text-green-400" size={24} /></div>
              <span className={`text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full ${getGrowthColor(data.downloadsGrowth)}`}>
                {getGrowthIcon(data.downloadsGrowth)}{data.downloadsGrowth > 0 ? '+' : ''}{data.downloadsGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(data.totalDownloads)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upakuaji Jumla</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Users className="text-purple-600 dark:text-purple-400" size={24} /></div>
              <span className={`text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full ${getGrowthColor(data.usersGrowth)}`}>
                {getGrowthIcon(data.usersGrowth)}{data.usersGrowth > 0 ? '+' : ''}{data.usersGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalUsers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Watumiaji Waliosajiliwa</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg"><BookOpen className="text-amber-600 dark:text-amber-400" size={24} /></div>
              <span className={`text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full ${getGrowthColor(data.contentGrowth)}`}>
                {getGrowthIcon(data.contentGrowth)}{data.contentGrowth > 0 ? '+' : ''}{data.contentGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalContent}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Jumla ya Maudhui</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4">Matazamio kwa Kategoria</h3>
            {data.viewsByCategory.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Hakuna data ya matazamio</p>
            ) : (
              <div className="space-y-4">
                {data.viewsByCategory.map((item) => {
                  const percentage = getMaxViews() > 0 ? (item.views / getMaxViews()) * 100 : 0
                  return (
                    <div key={item.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.views.toLocaleString()} views</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.downloads.toLocaleString()} downloads</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4">Shughuli za Karibuni</h3>
            {data.recentActivity.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Hakuna shughuli za karibuni</p>
            ) : (
              <div className="h-64 flex items-end justify-between gap-2">
                {data.recentActivity.map((day, i) => {
                  const maxViews = Math.max(...data.recentActivity.map(d => d.views), 1)
                  const height = (day.views / maxViews) * 180
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 group">
                      <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-t-lg relative">
                        <div className="bg-green-600 rounded-t-lg transition-all duration-300" style={{ height: `${height}px` }} />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                          {day.views} views
                        </div>
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{new Date(day.date).getDate()}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold mb-4">Maudhui Maarufu Zaidi</h3>
          {data.topContent.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Hakuna maudhui maarufu</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Kichwa</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mhadhiri</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Matazamio</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Upakuaji</th>
                   </tr>
                </thead>
                <tbody>
                  {data.topContent.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{item.title}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.speaker}</td>
                      <td className="py-3 px-4 text-right">{item.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{item.downloads.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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