'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(data.message)
      setEmail('')
      setOtp('')
      setNewPassword('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-4 w-full max-w-md">
        <h1 className="text-xl font-bold">Weka Nenosiri Mpya</h1>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <input
          type="email"
          placeholder="Barua pepe yako"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded border-gray-300"
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
          className="w-full p-3 border rounded border-gray-300"
        />
        <input
          type="password"
          placeholder="Nenosiri jipya"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          className="w-full p-3 border rounded border-gray-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded flex justify-center items-center disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={20}/> : null} Badilisha Nenosiri
        </button>
      </form>
    </div>
  )
}