// src/components/Providers.tsx
'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { AudioProvider } from '@/context/AudioContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {/* ThemeProvider at top-level ensures the script runs correctly */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="eastcmsa-islamic-theme"
      >
        <AudioProvider>
          {children}
        </AudioProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
