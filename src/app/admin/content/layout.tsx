'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BookOpen, 
  Mic, 
  Calendar,
  FolderTree,
  Tag,
  Image,
  FileText
} from 'lucide-react'

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const contentLinks = [
    { name: 'Overview', href: '/admin/content', icon: FolderTree },
    { name: 'Lectures', href: '/admin/content/lectures', icon: Mic },
    { name: 'Books', href: '/admin/content/books', icon: BookOpen },
    { name: 'Events', href: '/admin/content/events', icon: Calendar },
    { name: 'Categories', href: '/admin/content/categories', icon: Tag },
    { name: 'Media', href: '/admin/content/media', icon: Image },
    { name: 'Pages', href: '/admin/content/pages', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Content Management
        </h1>
      </div>

      {/* Sub Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {contentLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  )
}