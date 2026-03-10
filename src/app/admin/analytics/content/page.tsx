'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen,
  Mic,
  Eye,
  Heart,
  MessageCircle,
  Download,
  Loader2,
  Filter
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

type ContentAnalytics = {
  overview: {
    totalLectures: number
    totalBooks: number
    totalEvents: number
    totalViews: number
    totalLikes: number
    totalComments: number
    totalDownloads: number
  }
  topLectures: Array<{
    _id: string
    title: string
    views: number
    likes: number
    comments: number
  }>
  topBooks: Array<{
    _id: string
    title: string
    views: number
    likes: number
    downloads: number
  }>
  viewsByCategory: Array<{
    name: string
    views: number
  }>
  dailyViews: Array<{
    date: string
    lectures: number
    books: number
  }>
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ContentAnalyticsPage() {
  const [data, setData] = useState<ContentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [contentType, setContentType] = useState('all')

  useEffect(() => {
    fetchContentAnalytics()
  }, [contentType])

  const fetchContentAnalytics = async () => {
    try {
      const res = await fetch(`/api/admin/analytics/content?type=${contentType}`)
      const data = await res.json()
      if (res.ok) {
        setData(data)
      }
    } catch (error) {
      console.error('Error fetching content analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!data) return null

  // Safe formatter for pie chart labels
  const renderPieLabel = (entry: any) => {
    const percent = entry.percent || 0
    return `${entry.name} ${(percent * 100).toFixed(0)}%`
  }

  // Custom tooltip formatter
  const formatTooltipValue = (value: number | string | undefined) => {
    if (typeof value === 'number') {
      return [value.toLocaleString(), 'Views']
    }
    return [value || 0, 'Views']
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <Filter className="text-gray-400" size={20} aria-hidden="true" />
          <label htmlFor="content-type-filter" className="sr-only">
            Filter by content type
          </label>
          <select
            id="content-type-filter"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            title="Select content type to filter"
            aria-label="Filter content by type"
          >
            <option value="all">All Content</option>
            <option value="lectures">Lectures Only</option>
            <option value="books">Books Only</option>
            <option value="events">Events Only</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Lectures</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overview.totalLectures}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Mic className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overview.totalBooks}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overview.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.overview.totalDownloads.toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Download className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Views by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Views by Category
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.viewsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderPieLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="views"
                  nameKey="name"
                >
                  {data.viewsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Views Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Views
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lectures" fill="#3b82f6" name="Lectures" />
                <Bar dataKey="books" fill="#10b981" name="Books" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Lectures */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performing Lectures
        </h2>
        <div className="space-y-4">
          {data.topLectures.map((lecture, index) => (
            <div key={lecture._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {lecture.title}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    {lecture.views}
                  </span>
                  <span className="flex items-center">
                    <Heart size={14} className="mr-1" />
                    {lecture.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle size={14} className="mr-1" />
                    {lecture.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}