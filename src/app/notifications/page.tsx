import { Metadata } from 'next'
import { Suspense } from 'react'
import NotificationsClient from './NotificationsClient'
import LoadingSpinner from '@/components/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Notifications | East CMSA',
  description: 'View your notifications'
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NotificationsClient />
    </Suspense>
  )
}