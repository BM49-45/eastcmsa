'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  FileText,
  MessageCircle
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'admin') {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 bg-green-200 rounded-full mx-auto mb-4"></div>
          <div className="text-gray-600">Loading admin panel...</div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Content', href: '/admin/content', icon: BookOpen },
    { name: 'Lectures', href: '/admin/lectures', icon: FileText },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Comments', href: '/admin/comments', icon: MessageCircle },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Comments', href: '/admin/comments', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40 pt-20">
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition"
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </Link>
            )
          })}
          
          <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Shield size={20} />
              <span>Back to Site</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-20 p-6">
        {children}
      </main>
    </div>
  )
}