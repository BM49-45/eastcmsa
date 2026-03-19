'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AudioProvider } from "@/context/AudioContext"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AudioProvider>
          {children}
        </AudioProvider>
      </NextThemesProvider>
    </SessionProvider>
  )
}