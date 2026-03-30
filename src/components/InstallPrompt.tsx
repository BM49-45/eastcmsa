'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user dismissed in last 7 days
    const dismissed = localStorage.getItem('install-prompt-dismissed')
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      return
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // For iOS, show prompt after 5 seconds
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        const dismissedIOS = localStorage.getItem('install-prompt-dismissed')
        if (!dismissedIOS && !window.matchMedia('(display-mode: standalone)').matches) {
          setShowPrompt(true)
        }
      }, 5000)
      return () => clearTimeout(timer)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // For iOS or when no prompt available
      if (isIOS) {
        alert('Bonyeza "Share" button (square with arrow) kisha "Add to Home Screen"')
      } else {
        // Try to show install instructions
        alert('Fungua menu ya browser (⋮) kisha chagua "Install App" au "Add to Home Screen"')
      }
      handleDismiss()
      return
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setShowPrompt(false)
        setIsInstalled(true)
        localStorage.setItem('install-prompt-dismissed', Date.now().toString())
      }
    } catch (error) {
      console.error('Install prompt error:', error)
    } finally {
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('install-prompt-dismissed', Date.now().toString())
  }

  if (isInstalled) return null
  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-2xl p-4 border border-emerald-400/30">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
            {isIOS ? (
              <Smartphone size={20} className="text-white" />
            ) : (
              <Download size={20} className="text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">
              Pakua EASTCMSA App
            </h3>
            <p className="text-white/80 text-xs mt-1">
              {isIOS 
                ? 'Bonyeza "Share" (mraba na mshale) kisha "Add to Home Screen"'
                : 'Pakua app kwenye simu yako. Inafanya kazi offline na matumizi bora!'
              }
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="bg-white text-emerald-600 px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/90 transition"
                title="Pakua App"
              >
                Pakua Sasa
              </button>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white text-xs px-2 py-1.5 transition"
              >
                Sio Sasa
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
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