'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen, Plus, Search, Edit, Trash2,
  Eye, Download, Clock, RefreshCw
} from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  speaker: string
  category: string
  duration: string
  size: string
  downloads: number
  views: number
  createdAt: string
  status: 'published' | 'draft'
}

export default function AdminContentsPage() {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    setLoading(true)
    try {
      // Fetch from your API
      const res = await fetch('/api/admin/contents')
      if (res.ok) {
        const data = await res.json()
        setContents(data)
      } else {
        // Mock data for now
        setContents([
          {
            id: '1',
            title: 'Al-Usuul Al-Thalatha - Misingi Mitatu',
            speaker: 'Sheikh Abuu Mus\'ab At Tanzaniy',
            category: 'tawhiid',
            duration: '47:54',
            size: '43.8 MB',
            downloads: 234,
            views: 1567,
            createdAt: '2026-01-15',
            status: 'published'
          },
          {
            id: '2',
            title: 'Umdatul Ahkaam - Kitabu cha Fiqh',
            speaker: 'Ustadh Fadhili Adam',
            category: 'fiqh',
            duration: '57:04',
            size: '52.3 MB',
            downloads: 189,
            views: 1243,
            createdAt: '2026-02-10',
            status: 'published'
          },
          {
            id: '3',
            title: 'Khulaswah Nurulyaqyn - Sirah ya Mtume',
            speaker: 'Sheikh Iddy Issa',
            category: 'sirah',
            duration: '52:11',
            size: '47.8 MB',
            downloads: 156,
            views: 987,
            createdAt: '2026-03-05',
            status: 'published'
          },
          {
            id: '4',
            title: 'Mihadhara ya Semister - Kujituma Katika Elimu',
            speaker: 'Sheikh Abuu Umair Adam',
            category: 'lecture',
            duration: '48:46',
            size: '44.7 MB',
            downloads: 98,
            views: 654,
            createdAt: '2026-02-20',
            status: 'draft'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContents = contents.filter(content => {
    if (searchTerm && !content.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !content.speaker.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (filterCategory !== 'all' && content.category !== filterCategory) return false
    if (filterStatus !== 'all' && content.status !== filterStatus) return false
    return true
  })

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'tawhiid': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'fiqh': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'sirah': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      case 'lecture': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="text-green-600" />
              Dhibiti Maudhui
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Simamia na dhibiti maudhui yote ya darsa na mihadhara
            </p>
          </div>
          <Link
            href="/admin/contents/new"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 self-start"
          >
            <Plus size={18} />
            Pakia Maudhui Mapya
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Jumla ya Maudhui</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{contents.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Matazamio Jumla</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {contents.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Upakuaji Jumla</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {contents.reduce((sum, c) => sum + c.downloads, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Wazungumzaji</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(contents.map(c => c.speaker)).size}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tafuta kwa jina au mhadhiri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                title="Chagua kategoria"
              >
                <option value="all">Kategoria zote</option>
                <option value="tawhiid">Tawhiid</option>
                <option value="fiqh">Fiqh</option>
                <option value="sirah">Sirah</option>
                <option value="lecture">Mihadhara</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                title="Chagua hali"
              >
                <option value="all">Hali zote</option>
                <option value="published">Imechapishwa</option>
                <option value="draft">Rasimu</option>
              </select>
              <button
                type="button"
                onClick={fetchContents}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Onyesha upya"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Contents Table */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="inline-block w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Inapakia...</p>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hakuna Maudhui</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hakuna maudhui yanayolingana na vigezo vyako
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('all')
                setFilterStatus('all')
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ondoa Filters
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kichwa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mhadhiri</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Muda</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Takwimu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hali</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarehe</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Vitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContents.map((content) => (
                    <tr key={content.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {content.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300">{content.speaker}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(content.category)}`}>
                          {content.category.charAt(0).toUpperCase() + content.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          {content.duration}
                        </div>
                        <div className="text-xs text-gray-500">{content.size}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400" title="Matazamio">
                            <Eye size={14} /> {content.views}
                          </span>
                          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400" title="Upakuaji">
                            <Download size={14} /> {content.downloads}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          content.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {content.status === 'published' ? 'Imechapishwa' : 'Rasimu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(content.createdAt).toLocaleDateString('sw-TZ')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="Hariri"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Futa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}