'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  Menu, X, Search, Moon, Sun, Globe, 
  Bell, LogIn, UserPlus, LogOut, User
} from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tawhiid', href: '/tawhiid' },
    { name: 'Fiqh', href: '/fiqh' },
    { name: 'Lectures', href: '/lectures' },
    { name: 'Books', href: '/books' },
    { name: 'Events', href: '/events' },
    { name: 'Donate', href: '/donate' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const languages = [
    { code: 'sw', name: 'Kiswahili' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleNotifications = () => {
    setHasNotifications(false)
    // TODO: Fetch notifications
  }

  const handleLanguage = (langCode: string) => {
    console.log('Switching to:', langCode)
    // TODO: Implement language switching
  }

  const handleAuth = () => {
    if (session) {
      signOut({ callbackUrl: '/' })
    } else {
      router.push('/login')
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800'
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
              <Image
                src="/logo.png"
                alt="EASTCMSA Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden md:block">
              <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                EASTCMSA
              </div>
              <div className="text-xs text-yellow-500 dark:text-yellow-400">
                Islamic Knowledge Portal
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-gradient-to-r from-green-600 to-green-800 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center space-x-2">
            
            {/* Search */}
            <div className="relative">
              {showSearch && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Tafuta darsa, vitabu, au mada..."
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      aria-label="Submit search"
                      className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700"
                    >
                      <Search size={20} />
                    </button>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={handleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Language */}
            <div className="relative group">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                aria-label="Change Language"
              >
                <Globe size={20} />
              </button>
              <div className="absolute right-0 top-12 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguage(lang.code)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} className="text-yellow-500"/> : <Moon size={20}/>}
              </button>
            )}

            {/* Login/User */}
            <button
              type="button"
              onClick={handleAuth}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              {session ? (
                <>
                  <User size={18} />
                  <span>Account</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Login</span>
                </>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-green-600 to-green-800 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="px-4 py-3">
                <button
                  type="button"
                  onClick={handleAuth}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-medium"
                >
                  {session ? (
                    <>
                      <LogOut size={18} />
                      <span>Toka</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>Ingia / Jisajili</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
