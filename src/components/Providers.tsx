'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/context/ThemeContext"
import { AudioProvider } from "@/context/AudioContext"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AudioProvider>
          {children}
        </AudioProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}