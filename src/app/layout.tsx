'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GlobalAudioPlayer from '@/components/layout/GlobalAudioPlayer'
import Providers from '@/components/Providers'
import { Toaster } from 'sonner'
import Announcement from '@/components/Announcement'
import InstallPrompt from '@/components/InstallPrompt'
import { useEffect } from 'react'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Dynamically add meta tags after mount to avoid SSR warnings
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = '#10b981'
    document.head.appendChild(meta)
    
    const link = document.createElement('link')
    link.rel = 'apple-touch-icon'
    link.href = '/apple-icon.png'
    document.head.appendChild(link)
  }, [])

  return (
    <html lang="sw" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased`}
      >
        <Providers>
          <Announcement />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <GlobalAudioPlayer />
          <Footer />
          <InstallPrompt />
          <Toaster
            richColors
            position="top-right"
            toastOptions={{ duration: 4000 }}
          />
        </Providers>
      </body>
    </html>
  )
}