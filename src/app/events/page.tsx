'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Video, BookOpen, Mic, ChevronRight, Moon, CalendarDays, Star } from 'lucide-react'
import Link from 'next/link'

const Motion: any = motion

// Islamic month names
const islamicMonthsSw = [
  'Muharram', 'Safar', 'Rabiul Awwal', 'Rabiul Thani',
  'Jumadal Ula', 'Jumadal Thaniya', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhul Qa\'dah', 'Dhul Hijjah'
]

const islamicMonthsAr = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
]

// Gregorian month names
const gregorianMonths = [
  'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
  'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'
]

// Function to get public holidays for any year
const getPublicHolidays = (year: number) => {
  return [
    { date: `${year}-01-01`, name: 'Mwaka Mpya', type: 'public' },
    { date: `${year}-01-12`, name: 'Mapinduzi ya Zanzibar', type: 'public' },
    { date: `${year}-04-07`, name: 'Kipaimara (Karume Day)', type: 'public' },
    { date: `${year}-04-26`, name: 'Siku ya Muungano', type: 'public' },
    { date: `${year}-05-01`, name: 'Siku ya Wafanyakazi', type: 'public' },
    { date: `${year}-07-07`, name: 'Saba Saba (Sekta ya Biashara)', type: 'public' },
    { date: `${year}-08-08`, name: 'Nane Nane (Siku ya Wakulima)', type: 'public' },
    { date: `${year}-12-09`, name: 'Siku ya Uhuru', type: 'public' },
    { date: `${year}-12-25`, name: 'Krismasi', type: 'public' },
    { date: `${year}-12-26`, name: 'Boxing Day', type: 'public' },
  ]
}

// Function to calculate Islamic holidays (approximate)
const getIslamicHolidays = (year: number) => {
  return [
    { date: `${year}-03-27`, name: 'Laylatul Qadr', type: 'islamic' },
    { date: `${year}-03-30`, name: 'Eid al-Fitr', type: 'islamic' },
    { date: `${year}-06-07`, name: 'Eid al-Adha', type: 'islamic' },
    { date: `${year}-06-28`, name: 'Muharram (Mwaka Mpya)', type: 'islamic' },
    { date: `${year}-09-05`, name: 'Maulid', type: 'islamic' },
  ]
}

// Function to get accurate Hijri date
const getHijriDate = () => {
  const now = new Date()
  // Using Intl.DateTimeFormat for accurate Hijri date
  const hijriFormatter = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  })
  
  const parts = hijriFormatter.formatToParts(now)
  let day = '', month = '', year = ''
  
  parts.forEach(part => {
    if (part.type === 'day') day = part.value
    if (part.type === 'month') month = part.value
    if (part.type === 'year') year = part.value
  })
  
  return { day: parseInt(day), month: parseInt(month), year: parseInt(year) }
}

// Get current Islamic month name and day
const getCurrentIslamicInfo = () => {
  const { day, month, year } = getHijriDate()
  return {
    day,
    month: month - 1, // 0-indexed
    year,
    monthName: islamicMonthsSw[month - 1],
    monthNameAr: islamicMonthsAr[month - 1]
  }
}

// Get days in Islamic month (29 or 30)
const getDaysInIslamicMonth = (month: number, year: number) => {
  // Islamic months alternate between 29 and 30 days
  // Odd months (1,3,5,7,9,11) have 30 days, even months have 29
  // But this is approximate
  if ([0, 2, 4, 6, 8, 10].includes(month)) return 30
  return 29
}

export default function EventsPage() {
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming')
  const [gregorianDate, setGregorianDate] = useState('')
  const [hijriDate, setHijriDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  
  // Islamic calendar state - UPDATES AUTOMATICALLY
  const [islamicMonth, setIslamicMonth] = useState(8)
  const [islamicYear, setIslamicYear] = useState(1447)
  const [islamicDay, setIslamicDay] = useState(28)
  const [islamicDays, setIslamicDays] = useState<{day: number, isToday: boolean, isSpecial?: string}[]>([])
  
  // Gregorian calendar state
  const [gregorianMonth, setGregorianMonth] = useState(new Date().getMonth())
  const [gregorianYear, setGregorianYear] = useState(new Date().getFullYear())
  const [gregorianDays, setGregorianDays] = useState<{day: number, isToday: boolean, holiday?: string, type?: string}[]>([])
  const [publicHolidays, setPublicHolidays] = useState<{date: string, name: string, type: string}[]>([])
  const [islamicHolidays, setIslamicHolidays] = useState<{date: string, name: string, type: string}[]>([])

  // Update all dates automatically
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      
      // Gregorian date
      setGregorianDate(now.toLocaleDateString('sw-TZ', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
      
      // Current time
      setCurrentTime(now.toLocaleTimeString('sw-TZ', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }))

      // Get accurate Hijri date
      const hijri = getCurrentIslamicInfo()
      
      setHijriDate(`${hijri.day} ${hijri.monthName} ${hijri.year}H`)
      setIslamicMonth(hijri.month)
      setIslamicYear(hijri.year)
      setIslamicDay(hijri.day)
      
      // Set Gregorian date
      setGregorianMonth(now.getMonth())
      setGregorianYear(currentYear)
      
      // Get holidays for current year
      setPublicHolidays(getPublicHolidays(currentYear))
      setIslamicHolidays(getIslamicHolidays(currentYear))
      
      // Generate calendars
      generateIslamicCalendar(hijri.month, hijri.year, hijri.day)
      generateGregorianCalendar(now.getMonth(), currentYear, now.getDate())
    }

    updateDateTime()
    // Update every minute to catch date changes at midnight
    const timer = setInterval(updateDateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  // Generate Islamic calendar - AUTOMATIC with correct days
  const generateIslamicCalendar = (month: number, year: number, todayDay: number) => {
    const daysInMonth = getDaysInIslamicMonth(month, year)
    
    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      let isToday = i === todayDay
      let isSpecial = ''
      
      // Special days in Ramadan
      if (month === 8) { // Ramadan
        if (i === 27) isSpecial = 'Laylatul Qadr'
        else if (i <= 10) isSpecial = 'Ashra ya Kwanza (Rehema)'
        else if (i <= 20) isSpecial = 'Ashra ya Pili (Msamaha)'
        else isSpecial = 'Ashra ya Tatu (Kwokoa Motoni)'
      }
      
      days.push({ day: i, isToday, isSpecial })
    }
    
    setIslamicDays(days)
  }

  // Generate Gregorian calendar with holidays
  const generateGregorianCalendar = (month: number, year: number, todayDay: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1
    
    const days = []
    
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({ day: 0, isToday: false })
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const publicHoliday = publicHolidays.find(h => h.date === dateStr)
      const islamicHoliday = islamicHolidays.find(h => h.date === dateStr)
      
      days.push({
        day: i,
        isToday: i === todayDay && month === new Date().getMonth() && year === new Date().getFullYear(),
        holiday: publicHoliday?.name || islamicHoliday?.name,
        type: publicHoliday?.type || islamicHoliday?.type
      })
    }
    
    setGregorianDays(days)
  }

  const upcomingEvents = [
    {
      id: 1,
      title: 'Mihadhara ya Jumamosa',
      description: 'Mihadhara ya kiislamu kulingana na mada mbalimbali zinazohitajika',
      time: 'Kuanzia saa 3:00 asubuhi - kufikia wakati wa swala ya Dhuhr 6:30 mchana',
      location: 'Msikiti Mkuu wa Changanyikeni',
      speaker: 'Masheikh mbalimbali',
      type: 'lecture',
      frequency: 'Kila Jumamosa',
      icon: <Mic className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Darsa za Fiqh',
      description: 'Masomo ya fiqh kutoka kitabu cha Umdatul Ahkaam',
      time: 'Baada ya Swala ya Maghrib - Swala ya Isha',
      location: 'Msikiti Mkuu wa Changanyikeni',
      speaker: 'Ustadh Fadhili Adam & Ustadh Ahmad Salum',
      type: 'fiqh',
      frequency: 'Jumatatu & Alhamisi',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Darsa za Tawhiid',
      description: 'Darsa za Silsila ya Tawhiid - Al-Usuul Al-Thalatha, Al-Qawaid Al-Arbaa, Al-Usuul Al-Sitta',
      time: 'Baada ya Swala ya Maghrib - Swala ya Isha',
      location: 'Msikiti Mkuu wa Changanyikeni',
      speaker: 'Sheikh Abuu Mus\'ab At Tanzaniy',
      type: 'tawhiid',
      frequency: 'Kila Jumamosa',
      icon: <Video className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Darsa za Sirah',
      description: 'Masomo ya Sirah kutoka kitabu cha Khulaswah Nurulyaqyn',
      time: 'Baada ya Swala ya Maghrib - Swala ya Isha',
      location: 'Msikiti Mkuu wa Changanyikeni',
      speaker: 'Sheikh Iddy Issa',
      type: 'sirah',
      frequency: 'Jumanne & Jumatano',
      icon: <Video className="w-5 h-5" />
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'from-green-500 to-green-700'
      case 'fiqh': return 'from-blue-500 to-blue-700'
      case 'tawhiid': return 'from-purple-500 to-purple-700'
      case 'sirah': return 'from-amber-500 to-amber-700'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Compact */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <Motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-2xl md:text-3xl font-bold mb-2 text-center"
          >
            📅 Ratiba za Masomo na Mihadhara
          </Motion.h1>
          <p className="text-sm md:text-base opacity-90 max-w-2xl mx-auto text-center">
            Ratiba ya masomo ya kiislamu katika Msikiti wa Changanyikeni, EASTC
          </p>
          
          {/* Current Date Display - Compact */}
          <div className="mt-3 flex flex-col md:flex-row justify-center items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
              <span className="font-medium">Gregorian: </span>
              <span>{gregorianDate}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
              <span className="font-medium">Hijri: </span>
              <span>{hijriDate}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
              <span className="font-medium">Saa: </span>
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-base font-bold">Ratiba ya Kudumu</h3>
            </div>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1 text-green-500" /><span>Mihadhara 2 kwa kila muhula</span></li>
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1 text-blue-500" /><span>Jumatatu & Alhamisi: Fiqh</span></li>
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1 text-purple-500" /><span>Jumamosa: Tawhiid</span></li>
              <li className="flex items-center"><ChevronRight className="w-3 h-3 mr-1 text-amber-500" /><span>Jumanne & Jumatano: Sirah</span></li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base font-bold">Muda wa Masomo</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-2 text-center text-sm font-bold">
              Baada ya Maghrib hadi Isha
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">(Kila siku za masomo)</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-base font-bold">Mahali</h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium">Msikiti Mkuu wa Changanyikeni</p>
              <p className="text-xs mt-1">EASTC, Ubungo, Dar es Salaam</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-base font-bold">Masheikh</h3>
            </div>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <li>Sheikh Abuu Mus'ab - Tawhiid</li>
              <li>Sheikh Iddy Issa - Sirah</li>
              <li>Ustadh Fadhili Adam - Fiqh</li>
              <li>Ustadh Ahmad Salum - Fiqh</li>
            </ul>
          </div>
        </div>

        {/* Two Calendars Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Islamic Calendar - AUTOMATICALLY UPDATES */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <Moon className="mr-2 w-5 h-5 text-green-600" />
              Kalenda ya Kiislamu - {islamicMonthsSw[islamicMonth]} {islamicYear}H
            </h2>
            
            <div className="flex justify-between items-center mb-3">
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed" aria-label="Mwezi uliopita" disabled>
                <ChevronRight className="w-4 h-4 transform rotate-180" />
              </button>
              <div className="text-center">
                <div className="font-bold text-lg">{islamicMonthsAr[islamicMonth]}</div>
                <div className="text-xs text-gray-500">{islamicMonthsSw[islamicMonth]}</div>
              </div>
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed" aria-label="Mwezi ujao" disabled>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-bold text-gray-500">
              {['J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J1'].map(day => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {islamicDays.map(({day, isToday, isSpecial}, index) => (
                <div
                  key={index}
                  className={`relative text-center py-1 text-xs rounded transition-all ${
                    isToday ? 'bg-green-600 text-white font-bold scale-105 shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={isToday ? `Leo - ${islamicMonthsSw[islamicMonth]} ${day}` : isSpecial || ''}
                >
                  <div>{day}</div>
                  {isSpecial === 'Laylatul Qadr' && (
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 text-xs">
              <div className="flex items-center"><div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div><span>Leo - {islamicMonthsSw[islamicMonth]} {islamicDay}</span></div>
              <div className="flex items-center"><div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div><span>Laylatul Qadr (27)</span></div>
              <div className="flex items-center"><div className="w-2 h-2 bg-green-100 dark:bg-green-900/20 rounded-full mr-1"></div><span>Ashra za Ramadan</span></div>
            </div>

            {islamicMonth === 8 && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded"><div className="font-bold">{islamicDay}</div><div className="text-gray-500">Siku ya Ramadan</div></div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded"><div className="font-bold">{getDaysInIslamicMonth(islamicMonth, islamicYear) - islamicDay}</div><div className="text-gray-500">Zimesalia</div></div>
              </div>
            )}
          </div>

          {/* Gregorian Calendar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <CalendarDays className="mr-2 w-5 h-5 text-blue-600" />
              Kalenda ya Kawaida - {gregorianMonths[gregorianMonth]} {gregorianYear}
            </h2>
            
            <div className="flex justify-between items-center mb-3">
              <button 
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Mwezi uliopita"
                title="Mwezi uliopita"
              >
                <ChevronRight className="w-4 h-4 transform rotate-180" />
              </button>
              <div className="text-center">
                <div className="font-bold text-lg">{islamicMonthsAr[islamicMonth]}</div>
                <div className="text-xs text-gray-500">{islamicMonthsSw[islamicMonth]}</div>
              </div>
              <button 
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Mwezi ujao"
                title="Mwezi ujao"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-bold text-gray-500">
              {['J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J1'].map(day => (<div key={day} className="text-center">{day}</div>))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {gregorianDays.map(({day, isToday, holiday, type}, index) => (
                <div
                  key={index}
                  className={`relative text-center py-1 text-xs rounded transition-all ${
                    isToday ? 'bg-blue-600 text-white font-bold scale-105 shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${holiday ? (type === 'public' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20') : ''}`}
                  title={holiday || (isToday ? 'Leo' : '')}
                >
                  {day > 0 ? (<>{day}{holiday && <Star className={`w-2 h-2 inline ml-0.5 ${type === 'public' ? 'text-red-500' : 'text-yellow-500'} fill-current`} />}</>) : <div>&nbsp;</div>}
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-bold mb-2">Sikukuu za Mwaka {gregorianYear}:</h3>
              <div className="flex flex-wrap gap-3 text-xs mb-2">
                <div className="flex items-center"><Star className="w-3 h-3 text-yellow-500 fill-current mr-1" /><span>Sikukuu za Kiislamu</span></div>
                <div className="flex items-center"><Star className="w-3 h-3 text-red-500 fill-current mr-1" /><span>Sikukuu za Taifa</span></div>
              </div>
              <div className="mt-2 max-h-32 overflow-y-auto text-xs space-y-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                {[...publicHolidays, ...islamicHolidays].sort((a, b) => a.date.localeCompare(b.date)).map((holiday, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><Star className={`w-2 h-2 ${holiday.type === 'public' ? 'text-red-500' : 'text-yellow-500'} fill-current`} /><span>{holiday.name}</span></span>
                    <span className="text-gray-500">{new Date(holiday.date).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-3 mb-6">
          <button onClick={() => setView('upcoming')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${view === 'upcoming' ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}>
            <Calendar className="mr-1.5 w-4 h-4" /> Ratiba za Sasa
          </button>
          <button onClick={() => setView('past')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${view === 'past' ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}>
            <Video className="mr-1.5 w-4 h-4" /> Recordings zilizopo
          </button>
        </div>

        {/* Events Grid */}
        {view === 'upcoming' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event, index) => (
              <Motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -3 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${getTypeColor(event.type)} p-4 text-white`}>
                  <div className="flex items-center justify-between mb-2"><div className="bg-white/20 rounded-lg p-1.5">{event.icon}</div><span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">{event.frequency}</span></div>
                  <h3 className="text-base font-bold mb-1">{event.title}</h3>
                  <p className="text-xs opacity-90 line-clamp-2">{event.description}</p>
                </div>
                <div className="p-4">
                  <div className="space-y-2 text-xs"><div className="flex items-start"><Clock className="text-gray-600 dark:text-gray-400 mr-2 mt-0.5" size={14} /><span className="text-gray-600 dark:text-gray-300 line-clamp-1">{event.time}</span></div>
                  <div className="flex items-start"><MapPin className="text-gray-600 dark:text-gray-400 mr-2 mt-0.5" size={14} /><span className="text-gray-600 dark:text-gray-300 line-clamp-1">{event.location}</span></div>
                  <div className="flex items-start"><Users className="text-gray-600 dark:text-gray-400 mr-2 mt-0.5" size={14} /><span className="text-gray-600 dark:text-gray-300 line-clamp-1">{event.speaker}</span></div></div>
                  <div className="mt-3"><a href={event.type === 'tawhiid' ? '/tawhiid' : event.type === 'fiqh' ? '/fiqh' : event.type === 'sirah' ? '/sirah' : '/lectures'} className="block w-full py-2 text-xs bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg font-medium text-center transition-all">Angalia Zaidi</a></div>
                </div>
              </Motion.div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500"><Video className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>Hakuna recordings za zamani kwa sasa</p><p className="text-sm mt-2">Tembelea ukurasa wa Mihadhara kuona mihadhara iliyopo</p></div>
        )}
      </div>
    </div>
  )
}