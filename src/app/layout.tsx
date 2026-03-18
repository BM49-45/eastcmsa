import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="sw">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-20 transition-all duration-300">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}