'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Send, CheckCircle, Clock, MessageSquare, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('sw-TZ'))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 5000)
    }, 1500)
  }

  const contactInfo = [
    { icon: <MapPin className="text-white" size={24} />, title: 'Mahali', details: ['Msikiti Mkuu wa Changanyikeni', 'EASTC, Ubungo', 'Dar es Salaam, Tanzania'], gradient: 'from-green-600 to-green-700' },
    { icon: <Phone className="text-white" size={24} />, title: 'Simu', details: ['+255 762 760 095', '+255 773 032 461', '+255 695 543 175', '+255 752 792 402', '+255 699 565 600'], gradient: 'from-blue-600 to-blue-700' },
    { icon: <Mail className="text-white" size={24} />, title: 'Barua Pepe', details: ['eastcmsa@protonmail.com'], gradient: 'from-purple-600 to-purple-700' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wasiliana Nasi</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">Tupigie simu, tutumie barua pepe au uje kututembelea</p>
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white/20 rounded-full">
            <Clock size={18} />
            <span>Saa za Tanzania: {currentTime}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Send className="text-green-600" />Tuma Ujumbe</h2>
              {isSubmitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ujumbe Umetumwa!</h3>
                  <p className="mb-4">Asante kwa kuwasiliana nasi. Tutakujibu kwa haraka iwezekanavyo.</p>
                  <button onClick={() => setIsSubmitted(false)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Tuma Ujumbe Mwingine</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Jina Lako</label>
                      <input id="name" type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg" required placeholder="Jina lako kamili" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Barua Pepe</label>
                      <input id="email" type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-lg" required placeholder="barua@pepe.com" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Mada</label>
                    <input id="subject" type="text" name="subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full p-3 border rounded-lg" required placeholder="Mada ya ujumbe wako" />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Ujumbe</label>
                    <textarea id="message" name="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={6} className="w-full p-3 border rounded-lg" required placeholder="Andika ujumbe wako hapa..." />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                    {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Inatuma...</span></> : <><Send size={20} /><span>Tuma Ujumbe</span></>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {contactInfo.map((info, i) => (
              <div key={i} className={`bg-gradient-to-r ${info.gradient} rounded-2xl p-6 text-white`}>
                <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-white/20 rounded-lg">{info.icon}</div><h3 className="text-xl font-bold">{info.title}</h3></div>
                {info.details.map((d, j) => <p key={j} className="mb-1">{d}</p>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}