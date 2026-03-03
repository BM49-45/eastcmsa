'use client'

import { useState } from 'react'
import { Mail, Lock, Loader2, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Hitilafu katika kuingia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl mb-4">
              <LogIn className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Ingia kwenye Akaunti
            </h1>
            <p className="text-gray-600 mt-2">Ingia kwenye akaunti yako ya EASTCMSA</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 flex items-center">
                <Mail size={16} className="mr-2 text-blue-600" /> Barua Pepe
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                placeholder="mwanafunzi@email.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 flex items-center">
                <Lock size={16} className="mr-2 text-blue-600" /> Nenosiri
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
                placeholder="Nenosiri lako"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl font-bold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Inaingiza...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Ingia</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="text-center">
              <p className="text-gray-600">
                Bado huna akaunti?{' '}
                <Link href="/register" className="text-blue-600 font-bold hover:underline">
                  Jisajili hapa
                </Link>
              </p>
            </div>
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                Umesahau nenosiri?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
