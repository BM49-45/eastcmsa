'use client'

import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function SubscribePrompt() {
  const { data: session } = useSession()
  const { trackSubscribe } = useAnalytics()
  const [showPrompt, setShowPrompt] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkSubscription = async () => {
      // Check if user already subscribed (from localStorage)
      const hasSubscribed = localStorage.getItem('user-subscribed') === 'true'
      if (hasSubscribed) {
        setIsSubscribed(true)
        return
      }

      if (!session?.user) return
      
      try {
        const res = await fetch('/api/user/subscription')
        const data = await res.json()
        if (data.isSubscribed) {
          setIsSubscribed(true)
          localStorage.setItem('user-subscribed', 'true')
          return
        }
      } catch (error) {
        console.error('Error checking subscription:', error)
      }

      // Check if user permanently dismissed
      const permanentlyDismissed = localStorage.getItem('subscribe-prompt-permanently-dismissed') === 'true'
      if (permanentlyDismissed) return

      // Check if user dismissed recently
      const dismissed = localStorage.getItem('subscribe-prompt-dismissed')
      if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
        return
      }

      // Show prompt after 10 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 10000)
      return () => clearTimeout(timer)
    }

    checkSubscription()
  }, [session])

  const handleSubscribe = async () => {
    if (!session?.user) {
      window.location.href = '/login?redirect=/'
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        setIsSubscribed(true)
        setShowPrompt(false)
        trackSubscribe()
        localStorage.setItem('user-subscribed', 'true')
        localStorage.setItem('subscribe-prompt-permanently-dismissed', 'true')
        
        // Show success message
        const successMsg = document.createElement('div')
        successMsg.className = 'fixed bottom-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5'
        successMsg.innerHTML = '✅ Umejiunga kikamilifu! Utapata taarifa mpya.'
        document.body.appendChild(successMsg)
        setTimeout(() => successMsg.remove(), 3000)
      }
    } catch (error) {
      console.error('Subscribe error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = (permanent: boolean = false) => {
    setShowPrompt(false)
    if (permanent) {
      localStorage.setItem('subscribe-prompt-permanently-dismissed', 'true')
    } else {
      localStorage.setItem('subscribe-prompt-dismissed', Date.now().toString())
    }
  }

  if (isSubscribed) return null
  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-4 border border-blue-400/30">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
            <Bell size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">
              Jiunge na Taarifa Zetu
            </h3>
            <p className="text-white/80 text-xs mt-1">
              Pata taarifa za darsa mpya, matukio, na mambo muhimu moja kwa moja kwenye simu yako.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="bg-white text-blue-600 px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/90 transition disabled:opacity-50 flex items-center gap-1"
              >
                {isLoading ? (
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle size={12} />
                )}
                Jiunga Sasa
              </button>
              <button
                onClick={() => handleDismiss(true)}
                className="text-white/80 hover:text-white text-xs px-2 py-1.5 transition"
              >
                Usionyeshe Tena
              </button>
              <button
                onClick={() => handleDismiss(false)}
                className="text-white/80 hover:text-white text-xs px-2 py-1.5 transition"
              >
                Sio Sasa
              </button>
            </div>
          </div>
          <button
            onClick={() => handleDismiss(false)}
            className="text-white/60 hover:text-white transition flex-shrink-0"
            aria-label="Funga"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}