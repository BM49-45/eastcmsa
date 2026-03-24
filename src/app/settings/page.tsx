'use client'

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import ProfilePicture from "@/components/profile/ProfilePicture"
import { Sun, Moon } from 'lucide-react'

export default function Settings() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [fontSize, setFontSize] = useState('medium')
  const [language, setLanguage] = useState('sw')
  const [theme, setTheme] = useState('system')
  const [activeTab, setActiveTab] = useState("account")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    downloadUpdates: true,
    newContentAlerts: false,
    weeklyNewsletter: true
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showActivity: true,
    allowMessages: false
  })

  // Load user settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/user/settings")
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications || notifications)
          setPrivacy(data.privacy || privacy)
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }
    if (session) {
      loadSettings()
    }
  }, [session])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password")
      }

      setMessage({ type: "success", text: "Password updated successfully!" })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationsSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifications)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings")
      }

      setMessage({ type: "success", text: "Notification settings saved!" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrivacySave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/user/privacy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(privacy)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save privacy settings")
      }

      setMessage({ type: "success", text: "Privacy settings saved!" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Fixed: Delete Account with proper session clearing
  const handleDeleteAccount = async () => {
    if (!confirm("JE, UNA UHAKIKA UNATAKA KUFUTA AKUUNTI YAKO?\n\nHatua hii haiwezi kutenguliwa. Data zako zote zitafutwa kabisa.")) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account")
      }

      // ✅ Immediately sign out and redirect
      await signOut({
        redirect: true,
        callbackUrl: "/?deleted=true"
      })

    } catch (error: any) {
      console.error("Delete account error:", error)
      setMessage({
        type: "error",
        text: error.message || "Hitilafu ya kufuta akaunti. Tafadhali jaribu tena."
      })
      setIsLoading(false)
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    update({
      ...session,
      user: {
        ...session?.user,
        image: imageUrl
      }
    })
  }

  // Tabs configuration
  const tabs = [
    { id: "account", name: "Akaunti", icon: "👤" },
    { id: "notifications", name: "Arifa"},
    { id: "privacy", name: "Faragha"},
    { id: "appearance", name: "Muonekano"},
  ]

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}>
                {message.text}
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <ProfilePicture
                    currentImage={session?.user?.image}
                    userName={session?.user?.name || "User"}
                    onUploadComplete={handleImageUpload}
                    onRemove={() => handleImageUpload("")}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                    <p className="text-sm text-gray-500">Upload a photo to personalize your account</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        minLength={6}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="emailNotifications" className="font-medium text-gray-900 cursor-pointer">
                      Arifa za Barua Pepe
                    </label>
                    <p className="text-sm text-gray-500">Pokea arifa za barua pepe kuhusu akaunti yako</p>
                  </div>
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="downloadUpdates" className="font-medium text-gray-900 cursor-pointer">
                      Arifa za Upakuaji
                    </label>
                    <p className="text-sm text-gray-500">Pata taarifa upakuaji wako unapokamilika</p>
                  </div>
                  <input
                    id="downloadUpdates"
                    type="checkbox"
                    checked={notifications.downloadUpdates}
                    onChange={(e) => setNotifications({ ...notifications, downloadUpdates: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="newContentAlerts" className="font-medium text-gray-900 cursor-pointer">
                      Arifa za Maudhui Mapya
                    </label>
                    <p className="text-sm text-gray-500">Kuwa wa kwanza kujua kuhusu maudhui mapya</p>

                  </div>
                  <input
                    id="newContentAlerts"
                    type="checkbox"
                    checked={notifications.newContentAlerts}
                    onChange={(e) => setNotifications({ ...notifications, newContentAlerts: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="weeklyNewsletter" className="font-medium text-gray-900 cursor-pointer">
                      Jarida la Kila Wiki
                    </label>
                    <p className="text-sm text-gray-500">Pokea jarida letu la kila wiki lenye muhtasari</p>

                  </div>
                  <input
                    id="weeklyNewsletter"
                    type="checkbox"
                    checked={notifications.weeklyNewsletter}
                    onChange={(e) => setNotifications({ ...notifications, weeklyNewsletter: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleNotificationsSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Notification Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 mb-2">
                    Muonekano wa Wasifu
                  </label>
                  <select
                    id="profileVisibility"
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="public">Umma</option>
                    <option value="private">Faragha</option>
                    <option value="friends">Marafiki Pekee</option>

                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="showActivity" className="font-medium text-gray-900 cursor-pointer">
                      Onyesha Shughuli
                    </label>
                    <p className="text-sm text-gray-500">Onyesha shughuli zako za kusikiliza kwa wengine</p>
                  </div>
                  <input
                    id="showActivity"
                    type="checkbox"
                    checked={privacy.showActivity}
                    onChange={(e) => setPrivacy({ ...privacy, showActivity: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="allowMessages" className="font-medium text-gray-900 cursor-pointer">
                      Ruhusu Ujumbe
                    </label>
                    <p className="text-sm text-gray-500">Wacha watumiaji wengine wakutumie ujumbe</p>
                  </div>
                  <input
                    id="allowMessages"
                    type="checkbox"
                    checked={privacy.allowMessages}
                    onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePrivacySave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Privacy Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mandhari (Theme)
                  </label>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 border-2 rounded-lg transition-all ${theme === 'light'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                        }`}
                    >
                      <div className="w-full h-20 bg-gray-100 rounded mb-2 flex items-center justify-center">
                        <Sun className="w-8 h-8 text-yellow-500" />
                      </div>
                      <p className="text-sm font-medium">Mwanga</p>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 border-2 rounded-lg transition-all ${theme === 'dark'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                        }`}
                    >
                      <div className="w-full h-20 bg-gray-900 rounded mb-2 flex items-center justify-center">
                        <Moon className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-sm font-medium dark:text-white">Giza</p>
                    </button>

                    <button
                      onClick={() => setTheme('system')}
                      className={`p-4 border-2 rounded-lg transition-all ${theme === 'system'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                        }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-r from-gray-100 to-gray-900 rounded mb-2 flex items-center justify-center">
                        <div className="flex gap-1">
                          <Sun className="w-4 h-4 text-yellow-500" />
                          <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>
                      <p className="text-sm font-medium">Mfumo</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ukubwa wa Maandishi
                  </label>
                  <select
                    id="fontSize"
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(e.target.value)
                      document.documentElement.style.fontSize =
                        e.target.value === 'small' ? '14px' :
                          e.target.value === 'large' ? '18px' : '16px'
                    }}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="small">Ndogo</option>
                    <option value="medium" selected>Kati</option>
                    <option value="large">Kubwa</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lugha
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="sw">Kiswahili</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}