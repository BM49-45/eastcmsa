'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, CheckCircle } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function InstallPrompt() {
  const { trackDownload } = useAnalytics()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user already installed (from localStorage)
    const hasInstalled = localStorage.getItem('app-installed') === 'true'
    if (hasInstalled) {
      setIsInstalled(true)
      return
    }

    // Check if user dismissed permanently
    const permanentlyDismissed = localStorage.getItem('install-prompt-permanently-dismissed') === 'true'
    if (permanentlyDismissed) return

    // Check if user dismissed recently
    const dismissed = localStorage.getItem('install-prompt-dismissed')
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      return
    }

    const timer = setTimeout(() => {
      if (!isInstalled) {
        setShowPrompt(true)
      }
    }, 5000)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setShowPrompt(false)
        setIsInstalled(true)
        trackDownload()
        localStorage.setItem('app-installed', 'true')
        localStorage.setItem('install-prompt-permanently-dismissed', 'true')
      }
      setDeferredPrompt(null)
    } else if (isIOS) {
      alert('Bonyeza "Share" button (mraba na mshale) kisha "Add to Home Screen"')
      // For iOS, we can't track installation, so we'll assume they installed
      localStorage.setItem('app-installed', 'true')
      setShowPrompt(false)
    }
  }

  const handleDismiss = (permanent: boolean = false) => {
    setShowPrompt(false)
    if (permanent) {
      localStorage.setItem('install-prompt-permanently-dismissed', 'true')
    } else {
      localStorage.setItem('install-prompt-dismissed', Date.now().toString())
    }
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
                ? 'Bonyeza "Share" → "Add to Home Screen" ili kupakua app'
                : 'Pakua app kwenye simu yako. Inafanya kazi offline na matumizi bora!'
              }
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="bg-white text-emerald-600 px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/90 transition"
              >
                Pakua Sasa
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