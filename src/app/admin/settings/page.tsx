'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, Loader2, Trash2 } from 'lucide-react'

type UserData = {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'sheikh'
  subscribed: boolean
  password?: string
  confirmPassword?: string
}

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export default function AdminSettingsPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error fetching users')
        setUsers(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (!editingUser?.password) return
    const pw = editingUser.password
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (score >= 4) setPasswordStrength('strong')
    else if (score >= 3) setPasswordStrength('good')
    else if (score >= 2) setPasswordStrength('fair')
    else setPasswordStrength('weak')
  }, [editingUser?.password])

  const handleEditClick = (user: UserData) => {
    setEditingUser({ ...user, password: '', confirmPassword: '' })
    setErrors({})
    setSuccess(false)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingUser) return
    const { name, type } = e.target
    const target = e.target as HTMLInputElement | HTMLSelectElement
    const value =
      type === 'checkbox' && 'checked' in target
        ? target.checked
        : target.value
    setEditingUser(prev => (prev ? { ...prev, [name]: value } : null))
    if (errors[name]) {
      setErrors(prev => {
        const newErr = { ...prev }
        delete newErr[name]
        return newErr
      })
    }
  }

  const validateUser = (user: UserData) => {
    const newErrors: Record<string, string> = {}
    if (!user.name.trim()) newErrors.name = 'Jina linahitajika'
    if (!user.email.trim()) newErrors.email = 'Email inahitajika'
    if (user.password && user.password.length < 8)
      newErrors.password = 'Password lazima iwe na herufi 8 au zaidi'
    if (user.password && user.password !== user.confirmPassword)
      newErrors.confirmPassword = 'Password hazifanani'
    if (!['user', 'admin', 'sheikh'].includes(user.role))
      newErrors.role = 'Chagua role halali'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEditSubmit = async () => {
    if (!editingUser) return
    if (!validateUser(editingUser)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Hitilafu')
      setUsers(prev =>
        prev.map(u => (u.id === editingUser.id ? { ...u, ...editingUser } : u))
      )
      setSuccess(true)
      setEditingUser(null)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Una uhakika unataka kufuta user huyu? Hii haiwezi kurekebishwa.')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Hitilafu')
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin Settings - Users</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded flex items-center">
          <CheckCircle size={20} className="mr-2" /> Mabadiliko yamehifadhiwa!
        </div>
      )}
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{errors.submit}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(u => (
          <div
            key={u.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p>
                <strong>{u.name}</strong> ({u.role})
              </p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(u)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
                aria-label={`Edit ${u.name}`}
              >
                <User size={16} /> <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteUser(u.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center space-x-1"
                aria-label={`Delete ${u.name}`}
              >
                <Trash2 size={16} /> <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-user-title"
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4"
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative space-y-4">
            <h2 id="edit-user-title" className="text-xl font-bold">
              Badilisha User: {editingUser.name}
            </h2>

            {/* Name */}
            <div>
              <label htmlFor="edit-name" className="text-sm font-medium mb-1">Jina</label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={editingUser.name}
                onChange={handleEditChange}
                className="w-full p-3 border rounded-lg border-gray-300"
                placeholder="Jina"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="edit-email" className="text-sm font-medium mb-1">Email</label>
              <input
                id="edit-email"
                type="email"
                name="email"
                value={editingUser.email}
                onChange={handleEditChange}
                className="w-full p-3 border rounded-lg border-gray-300"
                placeholder="Email"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="edit-role" className="text-sm font-medium mb-1">Role</label>
              <select
                id="edit-role"
                name="role"
                value={editingUser.role}
                onChange={handleEditChange}
                className="w-full p-3 border rounded-lg border-gray-300"
                title="Chagua role"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="sheikh">Sheikh</option>
              </select>
              {errors.role && <p className="text-red-600 text-sm">{errors.role}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="edit-password" className="text-sm font-medium mb-1 flex items-center">
                Password (acha ikiwa haubadilishi)
              </label>
              <div className="relative">
                <input
                  id="edit-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={editingUser.password || ''}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg pr-10 border-gray-300"
                  placeholder="Password"
                  title="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {editingUser.password && (
                <div
                  className={`w-24 h-2 mt-1 rounded ${
                    passwordStrength === 'weak'
                      ? 'bg-red-500'
                      : passwordStrength === 'fair'
                      ? 'bg-orange-500'
                      : passwordStrength === 'good'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  aria-hidden="true"
                />
              )}
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="edit-confirm" className="text-sm font-medium mb-1">Rudia Password</label>
              <div className="relative">
                <input
                  id="edit-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={editingUser.confirmPassword || ''}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg pr-10 border-gray-300"
                  placeholder="Rudia Password"
                  title="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Subscribed */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-subscribed"
                name="subscribed"
                checked={editingUser.subscribed || false}
                onChange={handleEditChange}
                className="rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="edit-subscribed" className="text-sm">Subscribed</label>
            </div>

            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline focus:outline-2 focus:outline-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline focus:outline-2 focus:outline-blue-500 flex items-center space-x-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <span>Hifadhi Mabadiliko</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}