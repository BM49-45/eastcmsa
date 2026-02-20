'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, Phone, MapPin, Send, CheckCircle, 
  MessageSquare, User, AlertCircle, Clock,
  Youtube, Instagram, MessageCircle
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('sw-TZ', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
      setCurrentTime(timeString)
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: <MapPin className="text-green-600" size={24} />,
      title: 'Mahali',
      details: ['Msikiti Mkuu wa Changanyikeni', 'EASTC, Ubungo', 'Dar es Salaam, Tanzania'],
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      icon: <Phone className="text-blue-600" size={24} />,
      title: 'Simu',
      details: ['+255 762 760 095', '+255 773 032 461', '+255 695 543 175', '+255 752 792 402', '+255 699 565 600'],
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      icon: <Mail className="text-purple-600" size={24} />,
      title: 'Barua Pepe',
      details: ['eastcmsa@protonmail.com'],
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ]

  const socialLinks = [
    {
      name: 'YouTube',
      icon: <Youtube size={20} className="text-red-600 dark:text-red-400" />,
      url: 'https://youtube.com/@eastcmsa',
      color: 'hover:bg-red-50 dark:hover:bg-red-900/20',
      bg: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      name: 'Instagram',
      icon: <Instagram size={20} className="text-pink-600 dark:text-pink-400" />,
      url: 'https://instagram.com/eastcmsa',
      color: 'hover:bg-pink-50 dark:hover:bg-pink-900/20',
      bg: 'bg-pink-100 dark:bg-pink-900/30'
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} className="text-green-600 dark:text-green-400" />,
      url: 'https://whatsapp.com/channel/0029VbC8YONIN9ig2UvBQr2P',
      color: 'hover:bg-green-50 dark:hover:bg-green-900/20',
      bg: 'bg-green-100 dark:bg-green-900/30'
    }
  ]

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-700 to-green-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl">✆</div>
          <div className="absolute bottom-10 right-10 text-9xl">✉</div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <MessageSquare className="w-12 h-12" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Wasiliana Nasi</h1>
                <p className="text-xl opacity-90">
                  Tupigie simu, tutumie barua pepe au uje kututembelea
                </p>
              </div>
            </div>
            
            {/* Live Time */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Clock size={18} />
              <span>Saa ya Tanzania: {currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Send className="text-green-600" />
                Tuma Ujumbe
              </h2>
              
              {isSubmitted ? (
                <div className="animate-fadeIn bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Ujumbe Umetumwa!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Asante kwa kuwasiliana nasi. Tutakujibu kwa haraka iwezekanavyo.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Tuma Ujumbe Mwingine
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        Jina Lako
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="Andika jina lako"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Mail size={16} className="text-gray-500" />
                        Barua Pepe
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Mada
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Mada ya ujumbe wako"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Ujumbe
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Andika ujumbe wako hapa..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Inatuma...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Tuma Ujumbe</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Info Note */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      <strong>Kumbuka:</strong> Tutakujibu ndani ya masaa 24.
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      Kwa msaada wa haraka, piga simu moja kwa moja kwenye namba zilizo hapo juu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information Cards */}
            {contactInfo.map((info, index) => (
              <div 
                key={info.title}
                className={`animate-fadeInUp delay-${index} ${info.bgColor} border ${info.borderColor} rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-bold">{info.title}</h3>
                </div>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 dark:text-gray-300">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social Media */}
            <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Tufuate Mitandaoni</h3>
              <p className="text-green-100 opacity-90 mb-6">
                Pata taarifa za haraka, darsa mpya, na matangazo kwenye mitandao yetu
              </p>
              
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`animate-fadeInUp delay-s-${index} flex items-center gap-3 p-3 rounded-lg ${social.color} transition-colors group`}
                  >
                    <div className={`p-2 rounded-lg ${social.bg} group-hover:scale-110 transition-transform`}>
                      {social.icon}
                    </div>
                    <div>
                      <div className="font-medium">{social.name}</div>
                      <div className="text-xs text-green-200 opacity-80">@{social.name === 'WhatsApp' ? 'EASTCMSA' : 'eastcmsa'}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-green-600" />
                Saa za Huduma
              </h3>
              
              <div className="space-y-4">
                {[
                  { day: 'Jumatatu - Ijumaa', time: '08:00 - 17:00', status: 'Funguliwa' },
                  { day: 'Jumamosi', time: '08:00 - 14:00', status: 'Funguliwa' },
                  { day: 'Jumapili', time: 'Funguliwa kwa darsa', status: 'Darsa tu' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{item.day}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.status}</div>
                    </div>
                    <div className="font-bold text-green-600">{item.time}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Kumbuka:</strong> Darsa za Jumapili huanza saa 9:00 asubuhi hadi 12:00 mchana.
                </p>
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Jibu la Haraka</h3>
              <p className="text-blue-100 mb-4">
                Kwa maswali ya haraka yanayohusu:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Ratiba ya darsa</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Vitabu vinavyofundishwa</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>Uanachama wa jumuiya</span>
                </li>
              </ul>
              <div className="mt-4 text-xs opacity-80">
                Tumia WhatsApp kwa majibu ya haraka zaidi.
              </div>
            </div>
          </div>
        </div>

        {/* Map/Visit Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-gradient-to-r from-green-800 to-green-900 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Kuja Kututembelea</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Karibu sana Msikitini mwetu wa Changanyikeni kwenye darsa za Tawhiid, Fiqh na Siirah.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-800 rounded-full font-bold hover:bg-gray-100 transition">
              <MapPin size={20} />
              <span>Changanyikeni, Ubungo - Dar es Salaam</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        /* Stagger delay utilities for card animations (0s, 0.1s, 0.2s, ...) */
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }
        .delay-7 { animation-delay: 0.7s; }
        .delay-8 { animation-delay: 0.8s; }
        .delay-9 { animation-delay: 0.9s; }

        /* Stagger starting at 0.3s for social links (0.3s, 0.4s, 0.5s, ...) */
        .delay-s-0 { animation-delay: 0.3s; }
        .delay-s-1 { animation-delay: 0.4s; }
        .delay-s-2 { animation-delay: 0.5s; }
        .delay-s-3 { animation-delay: 0.6s; }
        .delay-s-4 { animation-delay: 0.7s; }
        .delay-s-5 { animation-delay: 0.8s; }
        .delay-s-6 { animation-delay: 0.9s; }
        .delay-s-7 { animation-delay: 1.0s; }
        .delay-s-8 { animation-delay: 1.1s; }
        .delay-s-9 { animation-delay: 1.2s; }
      `}</style>
    </div>
  )
}