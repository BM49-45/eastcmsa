'use client'

import { SessionProvider } from 'next-auth/react'
import { AudioProvider } from '@/context/AudioContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { ActivityProvider } from '@/context/ActivityContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>
        <AudioProvider>
          <ActivityProvider>
            {children}
          </ActivityProvider>
        </AudioProvider>
      </NotificationProvider>
    </SessionProvider>
  )
}