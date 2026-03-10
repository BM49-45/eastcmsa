'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Download,
  ArrowUp,
  ArrowDown,
  Loader2
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

type AnalyticsData = {
  overview: {
    totalUsers: number
    totalLectures: number
    totalViews: number
    totalLikes: number
    totalComments: number
    totalDownloads: number
    userGrowth: number
    viewGrowth: number
  }
  dailyStats: Array<{
    date: string
    users: number
    views: number
    likes: number
  }>
  topContent: Array<{
    _id: string
    title: string
    type: string
    views: number
    likes: number
    comments: number
  }>
  categoryBreakdown: Array<{
    name: string
    value: number
  }>
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/admin/analytics?range=${dateRange}`)
      const data = await res.json()
      if (res.ok) {
        setData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Safe formatter for pie chart labels
  const renderPieLabel = (entry: any) => {
    const percent = entry.percent || 0
    return `${entry.name} ${(percent * 100).toFixed(0)}%`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Date Range Selector - Fixed accessibility */}
      <div className="flex justify-end">
        <label htmlFor="date-range" className="sr-only">
          Select date range
        </label>
        <select
          id="date-range"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          title="Select date range for analytics"
          aria-label="Choose time period"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {data.overview.totalUsers.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                {data.overview.userGrowth > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${
                  data.overview.userGrowth > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(data.overview.userGrowth)}% vs last period
                </span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {data.overview.totalViews.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                {data.overview.viewGrowth > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${
                  data.overview.viewGrowth > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(data.overview.viewGrowth)}% vs last period
                </span>
              </div>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Likes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {data.overview.totalLikes.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {data.overview.totalDownloads.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Trends Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Trends
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#10b981" name="Users" />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Views" />
              <Line type="monotone" dataKey="likes" stroke="#ef4444" name="Likes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Content by Category
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderPieLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {data.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Content
          </h2>
          <div className="space-y-4">
            {data.topContent.map((item, index) => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {item.views}
                    </span>
                    <span className="flex items-center">
                      <Heart size={14} className="mr-1" />
                      {item.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle size={14} className="mr-1" />
                      {item.comments}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.type === 'lecture' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
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