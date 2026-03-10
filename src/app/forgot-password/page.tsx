'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(data.message)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-4 w-full max-w-md">
        <h1 className="text-xl font-bold">Umesahau Nenosiri?</h1>
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
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded flex justify-center items-center disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={20}/> : null} Tuma OTP
        </button>
      </form>
    </div>
  )
}