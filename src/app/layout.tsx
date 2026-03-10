import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import { AudioProvider } from '@/context/AudioContext'
import { ActivityProvider } from '@/context/ActivityContext'
import { Toaster } from 'sonner'
import { NotificationProvider } from '@/context/NotificationContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EASTCMSA - Islamic Knowledge Portal',
  description: 'Learn Quran, Tawhid, Fiqh, and Sirah online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sw" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers> {/* SessionProvider iko inside Providers */}
          <NotificationProvider> {/* NotificationProvider inatumia session, so inahitaji kuwa inside Providers */}
            <AudioProvider>
              <ActivityProvider>
                <Navbar />
                <main className="min-h-screen pt-20">
                  {children}
                </main>
                <Footer />
                <Toaster richColors position="top-right" />
              </ActivityProvider>
            </AudioProvider>
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  )
}