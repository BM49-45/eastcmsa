'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
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
  UserCircle,
  PanelLeft,
  PanelLeftClose,
  Clock,
  Users,
  Mail,
  MapPin,
  ListMusic,
  BarChart,
  FileText
} from 'lucide-react'

import SearchBar from '@/components/search/SearchBar'
import NotificationBell from '@/components/notifications/NotificationBell'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [profileImageError, setProfileImageError] = useState(false)

  const accountRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const isAdmin = session?.user?.role === "admin"
  const isLoggedIn = !!session

  // Remove the imageKey useEffect that causes reload on focus
  // We don't need imageKey anymore

  // Main navigation links
  const mainNavLinks = [
    { name: 'Nyumbani', href: '/', icon: Home, title: 'Nenda kwenye Nyumbani' },
    { name: 'Tawhiid', href: '/tawhiid', icon: BookOpen, title: 'Darsa za Tawhiid' },
    { name: 'Fiqh', href: '/fiqh', icon: Scale, title: 'Darsa za Fiqh' },
    { name: 'Sirah', href: '/sirah', icon: History, title: 'Darsa za Sirah' },
    { name: 'Mihadhara', href: '/lectures', icon: Mic, title: 'Mihadhara' },
    { name: 'Vitabu', href: '/books', icon: Book, title: 'Maktaba ya Vitabu' },
    { name: 'Matukio', href: '/events', icon: CalendarHeart, title: 'Ratiba za Matukio' },
    { name: 'Changia', href: '/donate', icon: Heart, title: 'Changia kwa ajili ya jumuiya' },
    { name: 'Kuhusu', href: '/about', icon: Info, title: 'Kuhusu EASTCMSA' },
    { name: 'Wasiliana', href: '/contact', icon: Phone, title: 'Wasiliana nasi' },
  ]

  // Sidebar additional links
  const sidebarLinks = [
    { name: 'Dashibodi', href: '/dashboard', icon: LayoutDashboard, title: 'Dashibodi yako' },
    { name: 'Wasifu', href: '/profile', icon: UserCircle, title: 'Wasifu wako' },
    { name: 'Mipangilio', href: '/settings', icon: Settings, title: 'Mipangilio ya akaunti' },
    { name: 'Favorites', href: '/favorites', icon: Heart, title: 'Orodha ya favorites zako' },
    { name: 'Orodha Zangu', href: '/playlists', icon: ListMusic, title: 'Orodha zako za kusikiliza' },
    { name: 'Shughuli', href: '/activity', icon: Clock, title: 'Shughuli zako za karibuni' },
    { name: 'Jumuiya', href: '/community', icon: Users, title: 'Jumuiya ya wanafunzi' },
  ]

  // Admin links
  const adminLinks = [
    { name: 'Admini Dashibodi', href: '/admin', icon: Shield, title: 'Dhibiti mfumo' },
    { name: 'Dhibiti Watumiaji', href: '/admin/users', icon: Users, title: 'Dhibiti watumiaji wote' },
    { name: 'Dhibiti Maudhui', href: '/admin/contents', icon: FileText, title: 'Dhibiti maudhui' },
    { name: 'Takwimu', href: '/admin/analytics', icon: BarChart, title: 'Takwimu za mfumo' },
  ]

  // Quick actions
  const quickActions = [
    { name: 'Tawhiid', href: '/tawhiid', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
    { name: 'Fiqh', href: '/fiqh', icon: Scale, color: 'from-green-500 to-green-600' },
    { name: 'Sirah', href: '/sirah', icon: History, color: 'from-amber-500 to-amber-600' },
    { name: 'Mihadhara', href: '/lectures', icon: Mic, color: 'from-blue-500 to-blue-600' },
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
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountOpen(false)
        setMobileOpen(false)
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [sidebarOpen])

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    setMobileOpen(false)
    setAccountOpen(false)
  }, [pathname])

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

  // Reset profile image error when session changes
  useEffect(() => {
    setProfileImageError(false)
  }, [session?.user?.image])

  return (
    <>
      {/* Main Navbar */}
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
            {/* Left section - Logo only */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center space-x-3 group" title="Nenda kwenye Nyumbani">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
                  {!logoError ? (
                    <Image
                      src="https://pub-7729259c73e646759f7039886bf31b23.r2.dev/image/logo.png"
                      alt="EASTCMSA Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                      priority
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <span className="text-xl font-bold text-green-600">E</span>
                  )}
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
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {mainNavLinks.slice(0, 5).map((link) => {
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
                    title={link.title}
                  >
                    <IconComponent size={16} />
                    <span>{link.name}</span>
                  </Link>
                )
              })}
              
              {/* More dropdown for remaining links */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  aria-label="Menyu zaidi"
                  title="Menyu zaidi"
                >
                  <span>Zaidi</span>
                  <ChevronDown size={14} />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {mainNavLinks.slice(5).map((link) => {
                    const IconComponent = link.icon
                    const isActive = isActiveLink(link.href)
                    
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl ${
                          isActive ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-gray-700 dark:text-gray-300'
                        }`}
                        title={link.title}
                      >
                        <IconComponent size={16} />
                        <span>{link.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right section - Search, Notifications, User menu */}
            <div className="flex items-center space-x-2">
              <SearchBar />
              {isLoggedIn && <NotificationBell />}

              {/* Theme Toggle */}
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200"
                  aria-label="Badilisha mandhari"
                  title={theme === 'dark' ? 'Badilisha hadi mandhari ya mchana' : 'Badilisha hadi mandhari ya usiku'}
                >
                  {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
                </button>
              )}

              {/* Auth Area */}
              {status === 'loading' ? (
                <div className="w-20 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ) : !isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="hidden md:flex items-center space-x-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                    title="Ingia kwenye akaunti yako"
                  >
                    <LogIn size={16} />
                    <span>Ingia</span>
                  </Link>

                  <Link
                    href="/register"
                    className="hidden md:flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                    title="Jisajili kama mwanachama mpya"
                  >
                    <UserPlus size={16} />
                    <span>Jisajili</span>
                  </Link>
                </>
              ) : (
                <div className="relative" ref={accountRef}>
                  <button
                    type="button"
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    aria-label="Menyu ya akaunti"
                    title="Fungua menyu ya akaunti"
                  >
                    <div className="relative w-6 h-6 rounded-full bg-white/20 overflow-hidden flex-shrink-0">
                      {session?.user?.image && !profileImageError ? (
                        <img 
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="w-full h-full object-cover"
                          onError={() => setProfileImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-700">
                          <span className="text-white font-bold text-sm">
                            {session?.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:inline">{session?.user?.name}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {accountOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      aria-label="Account menu"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full bg-green-600 overflow-hidden flex-shrink-0">
                            {session?.user?.image && !profileImageError ? (
                              <img 
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                className="w-full h-full object-cover"
                                onError={() => setProfileImageError(true)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-green-700">
                                <span className="text-white font-bold text-lg">
                                  {session?.user?.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {session?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {session?.user?.email}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          {isAdmin ? 'Msimamizi' : 'Mwanachama'}
                        </p>
                      </div>

                      {/* Quick actions */}
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Vitendo vya haraka
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {quickActions.map((action) => {
                            const Icon = action.icon
                            return (
                              <Link
                                key={action.name}
                                href={action.href}
                                onClick={() => setAccountOpen(false)}
                                className={`flex flex-col items-center p-2 rounded-lg bg-gradient-to-br ${action.color} text-white text-xs hover:shadow-md transition-all`}
                                title={action.name}
                              >
                                <Icon size={16} className="mb-1" />
                                <span>{action.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>

                      {/* User menu links */}
                      <div className="py-1">
                        {sidebarLinks.slice(0, 3).map((link) => (
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
                            title={link.title}
                          >
                            <link.icon size={16} />
                            <span>{link.name}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Admin section */}
                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                          <div className="px-4 py-1">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Msimamizi
                            </p>
                          </div>
                          <div className="py-1">
                            {adminLinks.map((link) => (
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
                                title={link.title}
                              >
                                <link.icon size={16} />
                                <span>{link.name}</span>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Logout button */}
                      <div className="border-t border-gray-200 dark:border-gray-700 mt-1"></div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Toka"
                        title="Toka kwenye akaunti yako"
                      >
                        <LogOut size={16} />
                        <span>Toka</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200"
                aria-label="Fungua menyu"
                title="Fungua menyu ya simu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 mt-3 pt-4 pb-3 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
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
                      title={link.title}
                    >
                      <IconComponent size={20} />
                      <span>{link.name}</span>
                    </Link>
                  )
                })}

                {isLoggedIn && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    
                    {sidebarLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActiveLink(link.href)
                            ? 'bg-green-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        title={link.title}
                      >
                        <link.icon size={20} />
                        <span>{link.name}</span>
                      </Link>
                    ))}

                    {isAdmin && adminLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActiveLink(link.href)
                            ? 'bg-green-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        title={link.title}
                      >
                        <link.icon size={20} />
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </>
                )}

                {!isLoggedIn && (
                  <div className="pt-4 space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 border border-green-600 text-green-600 rounded-lg w-full"
                      title="Ingia kwenye akaunti yako"
                    >
                      <LogIn size={18} />
                      <span>Ingia</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg w-full"
                      title="Jisajili kama mwanachama mpya"
                    >
                      <UserPlus size={18} />
                      <span>Jisajili</span>
                    </Link>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg w-full hover:bg-red-700 transition-colors"
                      aria-label="Toka"
                      title="Toka kwenye akaunti yako"
                    >
                      <LogOut size={18} />
                      <span>Toka</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar Toggle Button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-0 top-14 ml-6 z-50 p-2 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        aria-label={sidebarOpen ? "Funga sidebar" : "Fungua sidebar"}
        title={sidebarOpen ? "Funga menyu" : "Fungua menyu"}
      >
        {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-40 transition-all duration-300 ease-in-out pt-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}
        aria-label="Sidebar navigation"
      >
        <div className="h-full overflow-y-auto py-4 px-3">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!sidebarOpen && 'lg:hidden'}`}>
              Vitendo vya Haraka
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} p-3 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-lg transition-all group`}
                    title={action.name}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span className="text-sm font-medium">{action.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Links */}
          <div className="mb-6">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!sidebarOpen && 'lg:hidden'}`}>
              Akaunti Yangu
            </h3>
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = isActiveLink(link.href)
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title={link.title}
                  >
                    <Icon size={18} />
                    {sidebarOpen && <span className="text-sm">{link.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Admin Links */}
          {isAdmin && (
            <div className="mb-6">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!sidebarOpen && 'lg:hidden'}`}>
                Msimamizi
              </h3>
              <div className="space-y-1">
                {adminLinks.map((link) => {
                  const isActive = isActiveLink(link.href)
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      title={link.title}
                    >
                      <Icon size={18} />
                      {sidebarOpen && <span className="text-sm">{link.name}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className={`mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 ${!sidebarOpen && 'lg:hidden'}`}>
            <div className="space-y-2">
              <a href="mailto:eastcmsa@protonmail.com" className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 hover:text-green-600" title="Tuma barua pepe">
                <Mail size={14} />
                <span>eastcmsa@protonmail.com</span>
              </a>
              <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                <MapPin size={14} />
                <span>Changanyikeni, Ubungo</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}