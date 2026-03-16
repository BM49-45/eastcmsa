"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Settings() {
  const { data: session, status } = useSession()
  const router = useRouter()
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

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.")) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE"
      })

      if (res.ok) {
        router.push("/")
      } else {
        const data = await res.json()
        alert(data.error || "Failed to delete account")
      }
    } catch (error) {
      alert("An error occurred while deleting your account")
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: "account", name: "Account", icon: "👤" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "privacy", name: "Privacy", icon: "🔒" },
    { id: "appearance", name: "Appearance", icon: "🎨" }
  ]

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
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
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}>
                {message.text}
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
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
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                    Delete Account
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
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-500">Receive email notifications about your account</p>
                  </div>
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="downloadUpdates" className="font-medium text-gray-900 cursor-pointer">
                      Download Updates
                    </label>
                    <p className="text-sm text-gray-500">Get notified when your downloads are ready</p>
                  </div>
                  <input
                    id="downloadUpdates"
                    type="checkbox"
                    checked={notifications.downloadUpdates}
                    onChange={(e) => setNotifications({...notifications, downloadUpdates: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="newContentAlerts" className="font-medium text-gray-900 cursor-pointer">
                      New Content Alerts
                    </label>
                    <p className="text-sm text-gray-500">Be the first to know about new audio content</p>
                  </div>
                  <input
                    id="newContentAlerts"
                    type="checkbox"
                    checked={notifications.newContentAlerts}
                    onChange={(e) => setNotifications({...notifications, newContentAlerts: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="weeklyNewsletter" className="font-medium text-gray-900 cursor-pointer">
                      Weekly Newsletter
                    </label>
                    <p className="text-sm text-gray-500">Receive our weekly newsletter with highlights</p>
                  </div>
                  <input
                    id="weeklyNewsletter"
                    type="checkbox"
                    checked={notifications.weeklyNewsletter}
                    onChange={(e) => setNotifications({...notifications, weeklyNewsletter: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleNotificationsSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                    Profile Visibility
                  </label>
                  <select
                    id="profileVisibility"
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="showActivity" className="font-medium text-gray-900 cursor-pointer">
                      Show Activity
                    </label>
                    <p className="text-sm text-gray-500">Display your listening activity to others</p>
                  </div>
                  <input
                    id="showActivity"
                    type="checkbox"
                    checked={privacy.showActivity}
                    onChange={(e) => setPrivacy({...privacy, showActivity: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <label htmlFor="allowMessages" className="font-medium text-gray-900 cursor-pointer">
                      Allow Messages
                    </label>
                    <p className="text-sm text-gray-500">Let other users send you messages</p>
                  </div>
                  <input
                    id="allowMessages"
                    type="checkbox"
                    checked={privacy.allowMessages}
                    onChange={(e) => setPrivacy({...privacy, allowMessages: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePrivacySave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    <button 
                      onClick={async () => {
                        await fetch("/api/user/theme", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ theme: "light" })
                        })
                      }}
                      className="p-4 border-2 border-blue-500 rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="w-full h-20 bg-gray-100 rounded mb-2"></div>
                      <p className="text-sm font-medium">Light</p>
                    </button>
                    <button 
                      onClick={async () => {
                        await fetch("/api/user/theme", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ theme: "dark" })
                        })
                      }}
                      className="p-4 border-2 border-gray-200 rounded-lg bg-gray-900 hover:shadow-md transition-shadow"
                    >
                      <div className="w-full h-20 bg-gray-800 rounded mb-2"></div>
                      <p className="text-sm font-medium text-white">Dark</p>
                    </button>
                    <button 
                      onClick={async () => {
                        await fetch("/api/user/theme", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ theme: "system" })
                        })
                      }}
                      className="p-4 border-2 border-gray-200 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-md transition-shadow"
                    >
                      <div className="w-full h-20 bg-white/20 rounded mb-2"></div>
                      <p className="text-sm font-medium text-white">System</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <select
                    id="fontSize"
                    onChange={async (e) => {
                      await fetch("/api/user/font-size", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fontSize: e.target.value })
                      })
                    }}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium" selected>Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    id="language"
                    onChange={async (e) => {
                      await fetch("/api/user/language", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ language: e.target.value })
                      })
                    }}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                    <option value="ar">Arabic</option>
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