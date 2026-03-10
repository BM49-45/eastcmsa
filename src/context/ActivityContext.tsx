'use client'

import { createContext, useContext, ReactNode } from 'react'
import { ActivityType } from '@/types/activity'

interface ActivityContextType {
  trackActivity: (
    type: ActivityType, 
    itemId?: string, 
    itemTitle?: string, 
    metadata?: Record<string, any>
  ) => Promise<void>
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const trackActivity = async (
    type: ActivityType,
    itemId?: string,
    itemTitle?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      await fetch('/api/user/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId, itemTitle, metadata })
      })
    } catch (error) {
      console.error('Failed to track activity:', error)
    }
  }

  return (
    <ActivityContext.Provider value={{ trackActivity }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}