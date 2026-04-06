'use client'

import { useState, useEffect } from 'react'
import { Lock, Globe, Users, Bell, Save, AlertTriangle } from 'lucide-react'

interface CommunitySettings {
  isLocked: boolean
  onlyAdminsCanPost: boolean
  announcementsOnly: boolean
  welcomeMessage: string
}

export default function AdminCommunityPage() {
  const [settings, setSettings] = useState<CommunitySettings>({
    isLocked: false,
    onlyAdminsCanPost: false,
    announcementsOnly: false,
    welcomeMessage: 'Karibu kwenye Jumuiya ya EASTCMSA! Tafadhali heshimu wengine na epuka matusi.'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/community-settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/community-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Inapakia mipangilio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usimamizi wa Jumuiya</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Dhibiti jinsi watumiaji wanavyoshiriki kwenye jumuiya</p>
        </div>

        <div className="space-y-6">
          {/* Lock Community */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Lock className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Funga Jumuiya</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Ikiwa imefungwa, watumiaji hawataweza kutuma ujumbe mpya. Watumiaji pekee wataweza kutuma.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, isLocked: !settings.isLocked })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  settings.isLocked
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                {settings.isLocked ? 'Imefungwa ✓' : 'Funga'}
              </button>
            </div>
          </div>

          {/* Admins Only */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Users className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watumiaji Pekee Wanaweza Kutuma</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Watu wote wanaweza kuona ujumbe, lakini watumiaji pekee wanaweza kutuma.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, onlyAdminsCanPost: !settings.onlyAdminsCanPost })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  settings.onlyAdminsCanPost
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                {settings.onlyAdminsCanPost ? 'Imezimwa ✓' : 'Wezesha'}
              </button>
            </div>
          </div>

          {/* Announcements Only */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Bell className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Matangazo Pekee</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Watumiaji pekee wanaweza kutuma matangazo. Watu wote wanaweza kuona.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, announcementsOnly: !settings.announcementsOnly })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  settings.announcementsOnly
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                {settings.announcementsOnly ? 'Imezimwa ✓' : 'Wezesha'}
              </button>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Globe className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ujumbe wa Karibu</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Ujumbe unaoonekana juu ya jumuiya</p>
              </div>
            </div>
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Andika ujumbe wa karibu..."
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            {saved && (
              <span className="text-green-600 text-sm self-center">Imehifadhiwa!</span>
            )}
            <button
              onClick={saveSettings}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Hifadhi Mabadiliko
            </button>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0" size={20} />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold">Kumbuka:</p>
                <p>Mabadiliko haya yataanza kutumika mara moja. Watumiaji wote wataathirika na mabadiliko haya.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}