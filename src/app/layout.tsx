// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GlobalAudioPlayer from '@/components/layout/GlobalAudioPlayer'
import Providers from '@/components/Providers'
import { Toaster } from 'sonner'
import ClientLayout from '@/components/ClientLayout' // Unda component hii

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'EASTCMSA - Islamic Knowledge Portal',
  description: 'Learn Quran, Tawhiid, Fiqh, and Sirah online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sw" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <GlobalAudioPlayer />
          <Footer />
          <Toaster
            richColors
            position="top-right"
            toastOptions={{ duration: 4000 }}
          />
          <ClientLayout /> {/* Kwa ajili ya AOS na client-side code */}
        </Providers>
      </body>
    </html>
  )
}