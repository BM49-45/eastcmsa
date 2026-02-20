'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, BookOpen, Calendar, MessageSquare, Settings, LogOut, Bell, Award } from 'lucide-react'
import Link from 'next/link'
import Admin from '@/components/Pages/Admin/Admin'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasSession = document.cookie.split('; ').some(row => row.startsWith('auth-session='))
        if (!hasSession) { router.push('/login'); return }

        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          const response = await fetch('/api/auth/me')
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            localStorage.setItem('user', JSON.stringify(data.user))
          } else {
            router.push('/login')
          }
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = () => {
    document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    localStorage.removeItem('user')
    router.push('/login')
    router.refresh()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="text-green-600" size={24} />
            <span className="text-xl font-bold text-gray-800">EASTCMSA</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notification button – FIXED: type="button" */}
            <button
              type="button"
              className="relative p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Notifikesheni"
              title="Notifikesheni"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-green-600" />
              </div>
              <span className="font-medium">{user?.name || 'Mtumiaji'}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              aria-label="Toka kwenye akaunti"
            >
              <LogOut size={16} /><span>Tokaa</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Karibu, {user?.name || 'Mwanafunzi'}! 👋
          </h1>
          <p className="text-gray-600">
            {user?.role === 'admin'
              ? 'Hapa unaweza kusimamia mfumo wote, kudhibiti maudhui na watumiaji.'
              : 'Hapa ndipo unapoweza kufikia darsa zako, kufuatilia maendeleo, na kushiriki katika jumuiya.'}
          </p>
        </div>

        {/* Role-based view */}
        {user?.role === 'admin' ? (
          <Admin />
        ) : (
          <>
            {/* Student stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: BookOpen, label: 'Darsa Zilizokamilika', value: '12', color: 'bg-blue-500' },
                { icon: Calendar, label: 'Matukio Yajayo', value: '5', color: 'bg-green-500' },
                { icon: MessageSquare, label: 'Majadiliano', value: '23', color: 'bg-purple-500' },
                { icon: Award, label: 'Pointi Zako', value: '450', color: 'bg-orange-500' }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${stat.color} rounded-lg`}>
                      <stat.icon className="text-white" size={20} />
                    </div>
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Account settings */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Settings className="mr-2 text-purple-600" size={20} /> Mipangilio ya Akaunti
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Jina', value: user?.name },
                  { label: 'Barua Pepe', value: user?.email },
                  { label: 'Nambari ya Simu', value: user?.phone || '+255 7XX XXX XXX' },
                  { label: 'Akaunti Ilianzishwa', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('sw-TZ') }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-colors">
                Badilisha Mipangilio
              </button>
            </div>
          </>
        )}
      </div>

      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} EASTCMSA - Jumuiya ya Kiislamu ya Wanafunzi. Haki zote zimehifadhiwa.</p>
          <div className="mt-2 space-x-4">
            <Link href="/help" className="hover:text-green-600">Usaidizi</Link>
            <Link href="/privacy" className="hover:text-green-600">Faragha</Link>
            <Link href="/terms" className="hover:text-green-600">Masharti</Link>
            <Link href="/contact" className="hover:text-green-600">Mawasiliano</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
