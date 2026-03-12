'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import {
  Menu,
  X,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  User,
  Shield,
  Home,
  BookOpen,
  Scale,
  History,
  Mic,
  Book,
  CalendarHeart,
  Heart,
  Info,
  Phone,
  ChevronDown,
  Settings,
  UserCircle
} from 'lucide-react'

// Import the notification bell component
import NotificationBell from '@/components/notifications/NotificationBell'

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const accountRef = useRef<HTMLDivElement>(null)

const isAdmin = (session?.user as any)?.role === 'admin'
const isLoggedIn = !!session

  // Main navigation links - visible to everyone
  const mainNavLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Tawhid', href: '/tawhid', icon: BookOpen },
    { name: 'Fiqh', href: '/fiqh', icon: Scale },
    { name: 'Sirah', href: '/sirah', icon: History },
    { name: 'Lectures', href: '/lectures', icon: Mic },
    { name: 'Books', href: '/books', icon: Book },
    { name: 'Events', href: '/events', icon: CalendarHeart },
    { name: 'Donate', href: '/donate', icon: Heart },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
  ]

  // User menu links - for logged in users
  const userMenuLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/profile', icon: UserCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  // Admin menu links - only for admins
  const adminMenuLinks = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'Manage Users', href: '/admin/users', icon: User },
    { name: 'Manage Content', href: '/admin/content', icon: BookOpen },
    { name: 'Analytics', href: '/admin/analytics', icon: LayoutDashboard },
  ]

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountOpen(false)
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  // Helper function to check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
    setAccountOpen(false)
  }, [pathname])

  // Handle sign out with loading state
  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: true, 
        callbackUrl: '/' 
      })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Convert boolean to string for ARIA attributes
  const accountExpanded = accountOpen ? "true" : "false"
  const mobileExpanded = mobileOpen ? "true" : "false"

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white dark:bg-gray-900 py-3'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
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
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                EASTCMSA
              </span>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Islamic Knowledge Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {mainNavLinks.map((link) => {
              const isActive = isActiveLink(link.href)
              const IconComponent = link.icon
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent size={16} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side - User menu and controls */}
          <div className="flex items-center space-x-2">

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
              </button>
            )}

            {/* Notifications - only for logged in users */}
            {isLoggedIn && <NotificationBell />}

            {/* Auth Area */}
            {status === 'loading' ? (
              <div className="w-20 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ) : !isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="hidden md:flex items-center space-x-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  className="hidden md:flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  aria-label="User account menu"
                  title="User account menu"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">{session.user?.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    role="menu"
                    aria-label="User menu"
                  >
                    
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {session?.user?.email}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {isAdmin ? 'Administrator' : 'Member'}
                      </p>
                    </div>

                    {/* User menu links */}
                    {userMenuLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setAccountOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          isActiveLink(link.href)
                            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                        role="menuitem"
                      >
                        <link.icon size={16} />
                        <span>{link.name}</span>
                      </Link>
                    ))}

                    {/* Admin section separator */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <div className="px-4 py-1">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Admin
                          </p>
                        </div>
                        
                        {/* Admin menu links */}
                        {adminMenuLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setAccountOpen(false)}
                            className={`flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                              isActiveLink(link.href)
                                ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                            role="menuitem"
                          >
                            <link.icon size={16} />
                            <span>{link.name}</span>
                          </Link>
                        ))}
                      </>
                    )}

                    {/* Logout button */}
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Logout"
                      title="Logout"
                      role="menuitem"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200"
              aria-label="Toggle menu"
              title="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 mt-3 pt-4 pb-3 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              
              {/* Main navigation links for mobile */}
              {mainNavLinks.map((link) => {
                const isActive = isActiveLink(link.href)
                const IconComponent = link.icon
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent size={20} />
                    <span>{link.name}</span>
                  </Link>
                )
              })}

              {/* User section for mobile */}
              {isLoggedIn && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  
                  {/* User menu links for mobile */}
                  {userMenuLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActiveLink(link.href)
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <link.icon size={20} />
                      <span>{link.name}</span>
                    </Link>
                  ))}

                  {/* Admin links for mobile */}
                  {isAdmin && adminMenuLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActiveLink(link.href)
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <link.icon size={20} />
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile auth buttons */}
              {!isLoggedIn && (
                <div className="pt-4 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-green-600 text-green-600 rounded-lg w-full"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg w-full"
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Mobile logout */}
              {isLoggedIn && (
                <div className="pt-4">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg w-full hover:bg-red-700 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}