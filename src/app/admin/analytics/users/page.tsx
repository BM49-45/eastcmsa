'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  UserCheck,
  TrendingUp,
  Loader2,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

type UserAnalytics = {
  total: number
  active: number
  newToday: number
  newThisWeek: number
  newThisMonth: number
  growth: number
  byRole: {
    admin: number
    user: number
    sheikh: number
  }
  dailySignups: Array<{
    date: string
    count: number
  }>
  retention: Array<{
    date: string
    rate: number
  }>
}

// CSS classes for progress bars (fully moved to CSS)
const progressBarBase = 'h-2 rounded-full'
const progressBarColors = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500'
}

export default function UserAnalyticsPage() {
  const [data, setData] = useState<UserAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserAnalytics()
  }, [])

  const fetchUserAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics/users')
      const data = await res.json()
      if (res.ok) {
        setData(data)
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error)
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

  // Calculate percentages
  const userPercentage = data.total > 0 ? (data.byRole.user / data.total) * 100 : 0
  const adminPercentage = data.total > 0 ? (data.byRole.admin / data.total) * 100 : 0
  const sheikhPercentage = data.total > 0 ? (data.byRole.sheikh / data.total) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.total.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.active.toLocaleString()}
              </p>
              <p className="text-sm text-green-500 mt-2">
                {((data.active / data.total) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">New Today</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.newToday}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {data.growth}%
              </p>
              <div className="flex items-center mt-2">
                {data.growth > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${
                  data.growth > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  vs last month
                </span>
              </div>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Growth
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dailySignups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                name="New Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Users by Role
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Regular Users</span>
                <span className="font-medium">{data.byRole.user}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${progressBarColors.blue} ${progressBarBase}`}
                  style={{ width: `${userPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Admins</span>
                <span className="font-medium">{data.byRole.admin}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${progressBarColors.purple} ${progressBarBase}`}
                  style={{ width: `${adminPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Sheikhs</span>
                <span className="font-medium">{data.byRole.sheikh}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${progressBarColors.green} ${progressBarBase}`}
                  style={{ width: `${sheikhPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Retention
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.retention}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#10b981" name="Retention Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}