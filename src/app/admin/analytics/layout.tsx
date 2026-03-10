'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen,
  Mic,
  Calendar,
  Download,
  Eye,
  Heart,
  Globe
} from 'lucide-react'

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const analyticsLinks = [
    { name: 'Overview', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Users', href: '/admin/analytics/users', icon: Users },
    { name: 'Content', href: '/admin/analytics/content', icon: BookOpen },
    { name: 'Engagement', href: '/admin/analytics/engagement', icon: Heart },
    { name: 'Downloads', href: '/admin/analytics/downloads', icon: Download },
    { name: 'Geography', href: '/admin/analytics/geography', icon: Globe },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics & Reports
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div>
            <label htmlFor="time-range" className="sr-only">
              Select time range
            </label>
            <select
              id="time-range"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Select time range for analytics"
              title="Choose the time period for analytics data"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Export analytics report"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <nav 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2"
        aria-label="Analytics sections"
      >
        <div className="flex flex-wrap gap-2">
          {analyticsLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isActive
                    ? 'bg-green-600 text-white focus:ring-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-offset-2'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Content */}
      <main>
        {children}
      </main>
    </div>
  )
}