'use client'

import { useState, useEffect } from 'react'
import { Share2, X, CheckCircle, Facebook, Twitter, Copy } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function SharePrompt() {
  const { trackShare } = useAnalytics()
  const [showPrompt, setShowPrompt] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check if user already shared
    const hasShared = localStorage.getItem('user-has-shared') === 'true'
    if (hasShared) return

    // Check if user permanently dismissed
    const permanentlyDismissed = localStorage.getItem('share-prompt-permanently-dismissed') === 'true'
    if (permanentlyDismissed) return

    // Check if user dismissed recently
    const dismissed = localStorage.getItem('share-prompt-dismissed')
    if (dismissed && Date.now() - parseInt(dismissed) < 30 * 24 * 60 * 60 * 1000) {
      return
    }

    // Check if user has visited at least 5 pages
    const pageVisits = parseInt(localStorage.getItem('page-visits') || '0')
    if (pageVisits >= 5) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Track page visits
  useEffect(() => {
    const visits = parseInt(localStorage.getItem('page-visits') || '0')
    localStorage.setItem('page-visits', (visits + 1).toString())
  }, [])

  const handleShare = async (platform?: string) => {
    const appUrl = 'https://eastcmsa.vercel.app'
    const appName = 'EASTCMSA'
    const text = `Jiunge nami kwenye ${appName} - Jifunze Quran na Darsa za Kiislamu bure kabisa!`

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + appUrl)}`, '_blank')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl)}`, '_blank')
    } else if (platform === 'copy') {
      await navigator.clipboard.writeText(appUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      // Still track even if just copy
      trackShare()
      localStorage.setItem('user-has-shared', 'true')
      setShowPrompt(false)
      return
    } else if (navigator.share) {
      await navigator.share({
        title: appName,
        text: text,
        url: appUrl
      })
    }

    trackShare()
    localStorage.setItem('user-has-shared', 'true')
    localStorage.setItem('share-prompt-permanently-dismissed', 'true')
    setShowPrompt(false)
  }

  const handleDismiss = (permanent: boolean = false) => {
    setShowPrompt(false)
    if (permanent) {
      localStorage.setItem('share-prompt-permanently-dismissed', 'true')
    } else {
      localStorage.setItem('share-prompt-dismissed', Date.now().toString())
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-2xl p-4 border border-orange-400/30">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
            <Share2 size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">
              Shiriki EASTCMSA na Wengine
            </h3>
            <p className="text-white/80 text-xs mt-1">
              Wasaidie wengine kupata manufaa ya Quran na Darsa za Kiislamu.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-green-600 transition flex items-center gap-1"
                type="button"
              >
                <FaWhatsapp size={12} />
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-1"
                type="button"
              >
                <Facebook size={12} />
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="bg-sky-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-sky-600 transition flex items-center gap-1"
                type="button"
              >
                <Twitter size={12} />
                X
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="bg-gray-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-gray-700 transition flex items-center gap-1"
                type="button"
              >
                {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                {copied ? 'Imenakiliwa!' : 'Nakili Link'}
              </button>
            </div>
          </div>
          <button
            onClick={() => handleDismiss(true)}
            className="text-white/60 hover:text-white transition flex-shrink-0"
            aria-label="Funga"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}