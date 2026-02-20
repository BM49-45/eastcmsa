'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, Clock, MapPin, Calendar, 
  Bell, Download, AlertCircle, CheckCircle,
  Users, ChevronRight, Share2, Printer
} from 'lucide-react'
import { toast } from 'sonner'

// Data rahisi inayofanya kazi
const SWALA_TIMES = [
  { name: 'Fajr', time: '05:05', arabic: 'الفجر' },
  { name: 'Dhuhr', time: '12:45', arabic: 'الظهر' },
  { name: 'Asr', time: '15:45', arabic: 'العصر' },
  { name: 'Maghrib', time: '18:25', arabic: 'المغرب' },
  { name: 'Isha', time: '19:45', arabic: 'العشاء' },
]

const DARSA_SCHEDULE = [
  {
    day: 'Jumamosa',
    prayer: '18:30',
    start: 'Baada ya Swala ya Maghrib',
    title: 'Tawhiid Series',
    teacher: 'Sheikh Abuu Mus\'ab At Tanzaniy',
    book: 'Al Usuul Athalatha',
    description: 'Misingi mitatu ya Kiislamu - Al Usuul Athalatha'
  },
  {
    day: 'Jumatatu',
    prayer: '18:30',
    start: 'Baada ya Swala ya Maghrib',
    title: 'Fiqh Lessons',
    teacher: 'Sheikh Fadhil Adam',
    book: 'Umdatul-Ahkaam',
    description: 'Masomo ya fiqh kwa mujibu wa Qur\'an na Sunnah'
  },
  {
    day: 'Alhamisi',
    prayer: '18:30',
    start: 'Baada ya Swala ya Maghrib',
    title: 'Fiqh Lessons',
    teacher: 'Sheikh Fadhil Adam',
    book: 'Umdatul-Ahkaam',
    description: 'Muendelezo wa masomo ya fiqh'
  }
]

export default function RealScheduleWidget() {
  const [currentTime, setCurrentTime] = useState('')
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string} | null>(null)
  const [nextDarsa, setNextDarsa] = useState<any>(null)
  const [reminders, setReminders] = useState<string[]>([])

  // Setup ya saa rahisi
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      // Saa ya sasa
      setCurrentTime(now.toLocaleTimeString('sw-TZ', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))

      // Pata swala inayofuata
      const hour = now.getHours()
      const minute = now.getMinutes()
      
      for (const swala of SWALA_TIMES) {
        const [swalaHour, swalaMinute] = swala.time.split(':').map(Number)
        if (swalaHour > hour || (swalaHour === hour && swalaMinute > minute)) {
          setNextPrayer(swala)
          break
        }
      }

      // Pata darsa inayofuata
      const dayNames = ['Jumatatu', 'Alhamisi', 'Jumamosa']
      const today = dayNames[now.getDay()]
      
      const todayDarsa = DARSA_SCHEDULE.find(d => d.day === today)
      if (todayDarsa) {
        const [darsaHour, darsaMinute] = todayDarsa.start.split(':').map(Number)
        if (darsaHour > hour || (darsaHour === hour && darsaMinute > minute)) {
          setNextDarsa(todayDarsa)
        } else {
          // If today's darsa already passed, show tomorrow's
          const tomorrowIndex = (now.getDay() + 1) % 7
          const tomorrowDarsa = DARSA_SCHEDULE.find(d => d.day === dayNames[tomorrowIndex])
          setNextDarsa(tomorrowDarsa)
        }
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // Handle setting reminders
  const handleSetReminder = (type: 'swala' | 'darsa', details: any) => {
    const reminderId = `${type}-${Date.now()}`
    const newReminders = [...reminders, reminderId]
    setReminders(newReminders)
    
    // Save to localStorage
    localStorage.setItem('quran-reminders', JSON.stringify(newReminders))
    
    // Show toast notification
    toast.success('✅ Kikumbusho kimewekwa!', {
      description: type === 'swala' 
        ? `Utakumbushwa 10 dakika kabla ya ${details.name}`
        : `Utakumbushwa 30 dakika kabla ya darsa ya ${details.title}`
    })
    
    // Set actual browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(
        'Kikumbusho Kimewekwa',
        {
          body: type === 'swala' 
            ? `Swala ya ${details.name} (${details.time})`
            : `Darsa: ${details.title} @ ${details.start}`,
          icon: '/favicon.ico'
        }
      )
    }
  }

  // Handle download schedule
  const handleDownloadSchedule = () => {
    const content = `
╔═══════════════════════════════════════════════╗
║      RATIBA YA DARSA - EASTCMSA ISLAMIC          ║
║         Msikiti wa Changanyikeni              ║
║           ${new Date().toLocaleDateString('sw-TZ', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}         ║
╚═══════════════════════════════════════════════╝

📿 NYAKATI ZA SWALA:
${SWALA_TIMES.map(s => `  ${s.name.padEnd(8)} : ${s.time}  (${s.arabic})`).join('\n')}

📚 RATIBA YA DARSA:
${DARSA_SCHEDULE.map(d => `
  ${d.day}:
  ├─ SOMO    : ${d.title}
  ├─ MHADHIRI: ${d.teacher}
  ├─ SAA     : ${d.start} (Baada ya ${d.prayer})
  ├─ KITABU  : ${d.book}
  └─ MAELEZO : ${d.description}
`).join('\n')}

─────────────────────────────────────────────
📍 Mahali: Msikiti wa Changanyikeni-Ubungo, Dar es Salaaam
📞 Mawasiliano: +255 699 565 600
🌐 Tovuti: http://eastcmsa-org
─────────────────────────────────────────────

Karibu kwenye Darsa zote!
`.trim()

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ratiba-darsa-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.success('📄 Ratiba imepakuliwa!', {
      description: 'Faili ya ratiba imepakuliwa kwenye kifaa chako.'
    })
  }

  // Handle view details
  const handleViewDetails = (darsa: any) => {
    toast.info(`📖 ${darsa.title}`, {
      description: (
        <div className="text-sm space-y-1">
          <div><strong>Mhadhiri:</strong> {darsa.teacher}</div>
          <div><strong>Saa:</strong> {darsa.start} (Baada ya {darsa.prayer})</div>
          <div><strong>Kitabu:</strong> {darsa.book}</div>
          <div><strong>Maelezo:</strong> {darsa.description}</div>
        </div>
      ),
      duration: 8000
    })
  }

  // Handle share schedule
  const handleShareSchedule = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ratiba ya Darsa - EASTC Islamic',
        text: `Ratiba ya darsa za Kiislamu katika Msikiti wa Changanyikeni, EASTC`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('🔗 Link imekopwa!', {
        description: 'Link ya ratiba imekopwa kwenye clipboard.'
      })
    }
  }

  // Handle print schedule
  const handlePrintSchedule = () => {
    const printContent = document.createElement('div')
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #2e7d32;">EASTCMSA ISLAMIC PORTAL</h1>
        <h2 style="text-align: center;">Ratiba ya Darsa</h2>
        <h3 style="text-align: center;">Msikiti wa Changanyikeni</h3>
        <p style="text-align: center;">${new Date().toLocaleDateString('sw-TZ')}</p>
        
        <h4>Nyakati za Swala:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${SWALA_TIMES.map(s => `
            <tr>
              <td style="padding: 5px; border: 1px solid #ddd;">${s.name}</td>
              <td style="padding: 5px; border: 1px solid #ddd;">${s.time}</td>
              <td style="padding: 5px; border: 1px solid #ddd;">${s.arabic}</td>
            </tr>
          `).join('')}
        </table>
        
        <h4>Ratiba ya Darsa:</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 8px; border: 1px solid #ddd;">Siku</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Somo</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Mhadhiri</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Saa</th>
            </tr>
          </thead>
          <tbody>
            ${DARSA_SCHEDULE.map(d => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${d.day}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${d.title}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${d.teacher}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${d.start}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success('🔔 Ruhusa imepatikana!', {
            description: 'Utapokea arifa za darsa na swala.'
          })
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* CARD 1: NYAKATI ZA SWALA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nyakati za Swala</h3>
                <p className="text-green-200 text-sm">Saa ya sasa: {currentTime}</p>
              </div>
            </div>
            {nextPrayer && (
              <div className="text-right">
                <div className="text-sm text-green-300">Inafuata</div>
                <div className="font-bold">{nextPrayer.name} ({nextPrayer.time})</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {SWALA_TIMES.map((swala, i) => (
              <div key={i} className="bg-white/10 p-3 rounded-lg text-center hover:bg-white/15 transition-colors">
                <div className="font-bold text-lg">{swala.time}</div>
                <div className="text-sm">{swala.name}</div>
                <div className="text-xs text-green-300">{swala.arabic}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => nextPrayer && handleSetReminder('swala', nextPrayer)}
              className="flex-1 py-3 bg-white text-green-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <Bell size={20} />
              Nikumbushe 10 Dakika Kabla
            </button>
            
            <button
              type="button"
              onClick={requestNotificationPermission}
              className="px-4 py-3 bg-green-800 text-white rounded-xl font-bold hover:bg-green-700 transition"
              title="Weka arifa za swala"
            >
              <AlertCircle size={20} />
              <span className="sr-only">Weka Arifa</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: DARSA INAYOFUATA */}
      {nextDarsa && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Darsa Inayofuata</h3>
                  <p className="text-blue-200 text-sm">Baada ya Swala ya {nextDarsa.prayer}</p>
                </div>
              </div>
              <div className="px-4 py-1 bg-white/20 rounded-full">
                {nextDarsa.day}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-2xl font-bold mb-2">{nextDarsa.title}</h4>
              <div className="text-blue-300 mb-4">{nextDarsa.teacher}</div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm">Saa ya Swala</div>
                  <div className="text-xl font-bold">{nextDarsa.prayer}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm">Darsa Inaanza</div>
                  <div className="text-xl font-bold">{nextDarsa.start}</div>
                </div>
              </div>
              
              <div className="p-3 bg-white/10 rounded-lg">
                <div className="text-sm">Kitabu</div>
                <div className="font-medium">{nextDarsa.book}</div>
                <div className="text-sm text-blue-300 mt-1">{nextDarsa.description}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => handleSetReminder('darsa', nextDarsa)}
                className="py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <Bell size={18} />
                Nikumbushe Darsa Hii
              </button>
              
              <button 
                type="button"
                onClick={() => handleViewDetails(nextDarsa)}
                className="py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <ChevronRight size={18} />
                Angalia Maelezo
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* CARD 3: RATIBA KAMILI NA ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-green-600 dark:text-green-400" size={24} />
              <h3 className="text-xl font-bold dark:text-white">Ratiba ya Darsa Zote</h3>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <MapPin size={14} />
              Msikiti wa Changanyikeni, EASTC
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {DARSA_SCHEDULE.map((darsa, i) => (
              <div 
                key={i}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-500 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">{darsa.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{darsa.teacher}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{darsa.start}</div>
                    <div className="text-sm text-gray-500">{darsa.day}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Baada ya {darsa.prayer}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {darsa.book}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewDetails(darsa)}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <ChevronRight size={16} />
                    Angalia Maelezo
                  </button>
                  <button 
                    onClick={() => handleSetReminder('darsa', darsa)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center"
                    title="Weka Kikumbusho"
                  >
                    <Bell size={16} />
                    <span className="sr-only">Weka Kikumbusho</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleDownloadSchedule}
              className="py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Pakua Ratiba
            </button>
            
            <button 
              onClick={handlePrintSchedule}
              className="py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Printer size={18} />
              Print Ratiba
            </button>
            
            <button 
              onClick={handleShareSchedule}
              className="py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              Shiriki
            </button>
            
            <button 
              onClick={requestNotificationPermission}
              className="py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Bell size={18} />
              Arifa Zote
            </button>
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              <div>
                <h4 className="font-bold dark:text-white">Ratiba ya Juma Lote</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Darsa zote baada ya Maghrib (18:30) hadi Swala Isha (19:45) katika Msikiti wa Changanyikeni
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}