'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Video, BookOpen, Mic, ChevronRight } from 'lucide-react'

const Motion: any = motion

export default function EventsPage() {
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming')
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [hijriDate, setHijriDate] = useState('')

  // Calculate Hijri date
  useEffect(() => {
    const today = new Date()
    const hijriYear = 1447 // Current Hijri year
    const hijriMonth = 'شعبان'
    const hijriDay = 10
    
    setHijriDate(`${hijriDay} ${hijriMonth} ${hijriYear}H`)
    setCurrentYear(today.getFullYear())
  }, [])

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
      description: 'Masomo ya fiqh',
      time: 'Baada ya Swala ya Maghrib -  Swala ya Isha',
      location: 'Msikiti Mkuu wa Changanyikeni',
      speaker: 'Masheikh mbalimbali',
      type: 'fiqh',
      frequency: 'Jumatatu & Alhamisi',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Darsa za Tawhiid',
      description: 'Darsa za Silsila ya Tawhiid',
      time: 'Baada ya Swala ya Maghrib -  Swala ya Isha',
      location: 'Msikiti Mkuu wa Changanyikeni',
      speaker: 'Sheikh Abuu Mus\'ab At Tanzaniy',
      type: 'tawhiid',
      frequency: 'Kila Jumamosa',
      icon: <Video className="w-5 h-5" />
    }
  ]

  const pastEvents = [
    {
      id: 1,
      title: 'Mihadhara ya Mwisho wa Mwaka',
      year: currentYear - 1,
      recordings: 8,
      duration: '2 saa 30 dakika'
    },
    {
      id: 2,
      title: 'Mfululizo wa Darsa za Fiqh',
      year: currentYear - 1,
      recordings: 24,
      duration: '1 saa 15 dakika kila darsa'
    },
    {
      id: 3,
      title: 'Mihadhara Maalum',
      year: currentYear - 1,
      recordings: 5,
      duration: '3 saa'
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'from-green-500 to-green-700'
      case 'fiqh': return 'from-blue-500 to-blue-700'
      case 'tawhiid': return 'from-purple-500 to-purple-700'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  // Islamic Calendar data
  const islamicMonths = [
    'Muharram', 'Safar', 'Rabiʻ I', 'Rabiʻ II', 
    'Jumada I', 'Jumada II', 'Rajab', 'Shaʻban', 
    'Ramadan', 'Shawwal', 'Dhu al-Qidah', 'Dhu al-Hijjah'
  ]

  // Generate calendar days (29-30 days per month)
  const generateCalendarDays = () => {
    const days = []
    const daysInMonth = 30 // Islamic months are 29 or 30 days
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            📅 Ratiba za Masomo na Mihadhara
          </Motion.h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto text-center">
            Ratiba ya masomo ya kiislamu katika Msikiti wa Changanyikeni, EASTC
          </p>
          
          {/* Current Date Display */}
          <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-medium">Miladi: </span>
              <span>{new Date().toLocaleDateString('sw-TZ', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-medium">Hijri: </span>
              <span>{hijriDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold">Ratiba ya Kudumu</h3>
            </div>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 mr-2 text-green-500" />
                <span>Mihadhara miwili kwa kila semister</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 mr-2 text-blue-500" />
                <span>Jumatatu & Alhamisi: Fiqh</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 mr-2 text-purple-500" />
                <span>Jumamosa: Tawhiid</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold">Muda wa Masomo</h3>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              <p className="mb-2">Masomo yote hufanyika:</p>
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-3 text-center font-bold">
                Baada ya Swala ya Maghrib hadi  Swala ya Isha
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold">Mahali</h3>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              <p className="font-medium">Msikiti Mkuu wa Changanyikeni</p>
              <p className="text-sm mt-2">Chuo cha Takwimu Mashariki mwa Afrika (EASTC)</p>
              <p className="text-sm">Ubungo, Dar es Salaam</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-4 mb-8">
          <button
            type="button"
            onClick={() => setView('upcoming')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
              view === 'upcoming'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
            }`}
          >
            <Calendar className="mr-2 w-5 h-5" />
            Ratiba za Sasa
          </button>
          <button
            type="button"
            onClick={() => setView('past')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
              view === 'past'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
            }`}
          >
            <Video className="mr-2 w-5 h-5" />
            Recordings zilizopo
          </button>
        </div>

        {view === 'upcoming' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                {/* Event Header with Gradient */}
                <div className={`bg-gradient-to-r ${getTypeColor(event.type)} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 rounded-lg p-2">
                      {event.icon}
                    </div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {event.frequency}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="opacity-90">{event.description}</p>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Clock className="text-gray-600 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Muda</div>
                        <div className="text-gray-600 dark:text-gray-300">{event.time}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="text-gray-600 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Mahali</div>
                        <div className="text-gray-600 dark:text-gray-300">{event.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="text-gray-600 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Mhadhiri</div>
                        <div className="text-gray-600 dark:text-gray-300">{event.speaker}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <a 
                      href={event.type === 'tawhiid' ? '/tawhiid' : event.type === 'fiqh' ? '/fiqh' : '/lectures'}
                      className="block w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg font-medium text-center transition-all hover:shadow-lg"
                    >
                      Angalia Zaidi
                    </a>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <Motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full text-sm font-medium">
                    Mwaka {event.year}
                  </span>
                </div>
                
                <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{event.title}</h4>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Recordings:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{event.recordings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Muda wa wastani:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{event.duration}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a 
                    href="/lectures"
                    className="block w-full py-2 px-4 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white rounded-lg text-center font-medium transition-all"
                  >
                    Angalia Recordings
                  </a>
                </div>
              </Motion.div>
            ))}
          </div>
        )}

        {/* Islamic Calendar Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
            <Calendar className="mr-3" size={28} />
            Kalenda ya Kiislamu
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Month */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-center">شعبان 1447H</h3>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Ah', 'Is', 'Sa', 'Ar', 'Kh', 'Ju', 'Sa'].map((day, index) => (
                  <div key={index} className="text-center font-bold py-2 text-white/80">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map(day => (
                  <div
                    key={day}
                    className={`text-center py-3 rounded-lg transition-all ${
                      day === 10
                        ? 'bg-white/30 border-2 border-white font-bold' 
                        : day === 15
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {day}
                    {day === 10 && (
                      <div className="text-xs mt-1 text-white/90">
                        Leo
                      </div>
                    )}
                    {day === 15 && (
                      <div className="text-xs mt-1 text-white/80">
                        Nusfu
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Islamic Months */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-center">Miezi Ijayo</h3>
              
              <div className="space-y-4">
                {islamicMonths.slice(7, 12).map((month, index) => (
                  <div 
                    key={month} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-all hover:bg-white/10 ${
                      index === 0 ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <span className="font-bold">{index + 9}</span>
                      </div>
                      <span className="font-medium">{month}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-80">1447H</div>
                      {index === 0 && (
                        <div className="text-xs text-green-300 mt-1">Ramadan Karibu</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Dates */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="font-bold mb-3">Tarehe Muhimu</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ramadan:</span>
                    <span className="font-medium">Karibu</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eid al-Fitr:</span>
                    <span className="font-medium">Baada ya Ramadan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>

        {/* Quick Navigation */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Zingatia Hili Muhimu
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Kuhusu Recordings</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Darsa zote zinarekodiwa na kuhifadhiwa vizuri kwa ajili ya mrajaa. Recordings za mihadhara 
                zinapatikana pia kwa mihadhara yote. Angalia ukurasa wa <strong>Lectures</strong> kwa recordings zilizopo.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Kuhusu Vitabu</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Vitabu vinavyofundishwa kwa sasa kwa Tawhiid ni Al Usuul Sittat na kwa Fiqh ni Umdatul Ahkaam <strong>Al Usuul Sittat na Umdatul Ahkaam</strong>. 
                Kwa maelezo zaidi kuhusu vitabu vyote, tembelea ukurasa wa <strong>Vitabu</strong>.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="/lectures"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center"
            >
              <Video className="mr-2 w-5 h-5" />
              Angalia Lectures
            </a>
            <a 
              href="/books"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center"
            >
              <BookOpen className="mr-2 w-5 h-5" />
              Vitabu Vinavyofundishwa
            </a>
            <a 
              href="/tawhiid"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center"
            >
              <Mic className="mr-2 w-5 h-5" />
              Darsa za Tawhiid
            </a>
          </div>
        </Motion.div>
      </div>
    </div>
  )
}