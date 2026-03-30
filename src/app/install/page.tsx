'use client'

import { useState } from 'react'
import { Smartphone, Download, Share2, Plus, Home, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

export default function InstallPage() {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText('https://eastcmsa.vercel.app')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Pakua EASTCMSA App</h1>
          <p className="text-gray-300 mt-2">
            Fuata hatua hizi kusakinisha app kwenye simu yako bure kabisa
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/10">
            <div className="flex gap-4">
              <div className="bg-emerald-500/20 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-500 font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Fungua Browser</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Fungua Chrome, Safari au browser yoyote kwenye simu yako
                </p>
                <div className="mt-3 bg-gray-900 rounded-xl p-3 flex items-center justify-between">
                  <code className="text-emerald-400 text-sm">
                    eastcmsa.vercel.app
                  </code>
                  <button
                    onClick={copyLink}
                    className="text-gray-400 hover:text-white text-sm"
                    title="Nakili link"
                    aria-label="Nakili link"
                  >
                    {copied ? <CheckCircle size={16} className="text-green-500" /> : 'Nakili'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 - Android */}
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/10">
            <div className="flex gap-4">
              <div className="bg-emerald-500/20 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-500 font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Bofya Menyu</h3>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-gray-900 p-3 rounded-xl text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-gray-800 p-2 rounded-lg">
                        <span className="text-2xl text-white">⋮</span>
                      </div>
                    </div>
                    <p className="text-white text-xs">Chrome: Bofya menu (⋮)</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-xl text-center">
                    <div className="flex justify-center mb-2">
                      <div className="bg-gray-800 p-2 rounded-lg">
                        <Share2 size={20} className="text-white" />
                      </div>
                    </div>
                    <p className="text-white text-xs">Safari: Bofya "Share"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/10">
            <div className="flex gap-4">
              <div className="bg-emerald-500/20 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-500 font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Chagua "Add to Home Screen"</h3>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-gray-900 p-3 rounded-xl text-center">
                    <div className="flex justify-center mb-2">
                      <Plus size={20} className="text-white" />
                    </div>
                    <p className="text-white text-xs">Chrome: "Install App"</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-xl text-center">
                    <div className="flex justify-center mb-2">
                      <Home size={20} className="text-white" />
                    </div>
                    <p className="text-white text-xs">Safari: "Add to Home Screen"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/10">
            <div className="flex gap-4">
              <div className="bg-emerald-500/20 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-500 font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Thibitisha na Fungua</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Bonyeza "Add" au "Install". App itaonekana kwenye home screen yako!
                </p>
                <div className="mt-3 bg-emerald-600/20 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <p className="text-emerald-400 text-xs">App inafanya kazi offline!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-8 text-center bg-gray-800/30 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3">Scan QR Code</h3>
          <div className="flex justify-center">
            <img 
              src="/qr-code.png" 
              alt="QR Code for EASTCMSA" 
              className="w-48 h-48 bg-white p-2 rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-3">
            Scan QR code kwa simu yako kufungua app haraka
          </p>
        </div>

        {/* Logo Preview */}
        <div className="mt-6 text-center bg-gray-800/30 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3">Logo ya App</h3>
          <img 
            src="/logo.png" 
            alt="EASTCMSA Logo" 
            className="w-32 h-32 mx-auto bg-emerald-600/20 rounded-2xl p-2"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <p className="text-gray-400 text-xs mt-3">
            Eastern African Statistical Training Centre<br />
            Students Association
          </p>
        </div>

        {/* Share Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'EASTCMSA',
                  text: 'Jifunze Quran na Darsa za Kiislamu bure kabisa!',
                  url: 'https://eastcmsa.vercel.app'
                })
              }
            }}
            className="bg-gray-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition inline-flex items-center gap-2"
            title="Shiriki app"
            aria-label="Shiriki app"
          >
            <Share2 size={18} />
            Shiriki App
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          © 2026 EASTCMSA. Haki zote zimehifadhiwa.
        </p>
      </div>
    </div>
  )
}