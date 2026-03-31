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
import SubscribePrompt from '@/components/SubscribePrompt'
import SharePrompt from '@/components/SharePrompt'
import { useEffect } from 'react'
import Head from 'next/head'

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

  const siteUrl = 'https://eastcmsa.vercel.app'
  const siteTitle = 'EASTCMSA - Islamic Knowledge Portal'
  const siteDescription = 'Jifunze Quran, Hudhuria Darsa za Kiislamu, na Shiriki Katika Jumuiya ya Waislamu. Pata manufaa ya kusikiliza Quran Tukufu na mambo mengine yenye baraka.'
  const logoUrl = 'https://pub-7729259c73e646759f7039886bf31b23.r2.dev/image/logo.png'

  return (
    <html lang="sw" suppressHydrationWarning>
      <head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content={siteTitle} />
        <meta property="twitter:description" content={siteDescription} />
        <meta property="twitter:image" content={logoUrl} />
        
        {/* Favicon */}
        <link rel="icon" href={logoUrl} type="image/png" />
        <link rel="shortcut icon" href={logoUrl} type="image/png" />
      </head>
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
          <SubscribePrompt />
          <SharePrompt />
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