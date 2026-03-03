'use client'

import { useState, useEffect } from 'react'
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Phone, ArrowRight, Loader2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type FormData = {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
  receiveUpdates: boolean
}

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

export default function RegisterPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    agreeTerms: false, receiveUpdates: true
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak')

  useEffect(() => {
    const checkStrength = (password: string) => {
      if (password.length === 0) return 'weak'
      let score = 0
      if (password.length >= 8) score++
      if (/[A-Z]/.test(password)) score++
      if (/[a-z]/.test(password)) score++
      if (/[0-9]/.test(password)) score++
      if (/[^A-Za-z0-9]/.test(password)) score++
      if (score >= 4) return 'strong'
      if (score >= 3) return 'good'
      if (score >= 2) return 'fair'
      return 'weak'
    }
    setPasswordStrength(checkStrength(formData.password))
  }, [formData.password])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: newValue }))
    if (errors[name]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Jina lina hitaji'
    else if (formData.fullName.length < 2) newErrors.fullName = 'Jina lazima liwe na herufi 2 au zaidi'
    if (!formData.email.trim()) newErrors.email = 'Barua pepe inahitajika'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Barua pepe siyo sahihi'
    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Nambari ya simu siyo sahihi'
    if (!formData.password) newErrors.password = 'Nenosiri linahitajika'
    else if (formData.password.length < 8) newErrors.password = 'Nenosiri lazima liwe na herufi 8 au zaidi'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Rudia nenosiri'
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Nenosiri halifanani'
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Lazima ukubali sheria na masharti'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setErrors({})
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          password: formData.password,
          receiveUpdates: formData.receiveUpdates
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Usajili umeshindikana.')
      document.cookie = `auth-session=${JSON.stringify(data.session)}; path=/; max-age=${24*60*60}`
      localStorage.setItem('user', JSON.stringify(data.user))
      setSuccess(true)
      setTimeout(() => { router.push('/dashboard') }, 3000)
    } catch (error: any) {
      setErrors({ submit: error.message || 'Hitilafu katika usajili. Jaribu tena.' })
    } finally {
      setLoading(false)
    }
  }

  const passwordRequirements = [
    { text: 'Angalau herufi 8', met: formData.password.length >= 8 },
    { text: 'Angalau herufi kubwa moja', met: /[A-Z]/.test(formData.password) },
    { text: 'Angalau nambari moja', met: /[0-9]/.test(formData.password) },
  ]

  const strengthColors = { weak: 'bg-red-500', fair: 'bg-orange-500', good: 'bg-yellow-500', strong: 'bg-green-500' }
  const strengthText = { weak: 'Dhaifu', fair: 'Wastani', good: 'Nzuri', strong: 'Imara' }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="text-2xl font-bold mb-3">Usajili Umekamilika!</h1>
            <p className="text-gray-600 mb-6">Akaunti yako imesajiliwa kikamilifu. Unaelekezwa kwenye dashibodi.</p>
            <div className="flex items-center justify-center text-green-600 mb-6">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Inaelekeza kwenye dashibodi...</span>
            </div>
            <button onClick={() => router.push('/dashboard')}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:opacity-90 transition">
              Nenda Moja Kwa Moja kwenye Dashibodi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl mb-4">
              <UserPlus className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Jisajili Sasa
            </h1>
            <p className="text-gray-600 mt-2">Jiunge na jumuiya yetu ya Kiislamu ya EASTCMSA</p>
          </div>

          {errors.submit && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{errors.submit}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center">
                <User size={16} className="mr-2 text-green-600" /> Jina Kamili
              </label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                className={`w-full p-3 border rounded-lg ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Mf: Ahmed Hassan" />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center">
                <Mail size={16} className="mr-2 text-green-600" /> Barua Pepe
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="mfano@email.com" />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center">
                <Lock size={16} className="mr-2 text-green-600" /> Nenosiri
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                  className={`w-full p-3 border rounded-lg pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Angalau herufi 8" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center">Rudia Nenosiri</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className={`w-full p-3 border rounded-lg pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Andika tena nenosiri" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Terms & Updates */}
            <div className="flex flex-col space-y-3">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="text-sm">
                  Nakubali{' '}
                  <Link href="/terms" className="text-green-600 hover:underline">
                    sheria na masharti
                  </Link>
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="receiveUpdates" checked={formData.receiveUpdates} onChange={handleChange} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="text-sm">Ningependa kupokea taarifa za darsa mpya na habari</span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {loading ? <><Loader2 className="animate-spin" size={20} /><span>Inasajili...</span></> :
               <><UserPlus size={20} /><span>Sajili Akaunti</span><ArrowRight size={20} /></>}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Tayari una akaunti?{' '}
              <Link href="/login" className="text-green-600 font-bold hover:underline inline-flex items-center">
                Ingia hapa <ArrowRight size={16} className="ml-1" />
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
