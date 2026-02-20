'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Calendar, PlayCircle, Download, Clock, History } from 'lucide-react'
import Link from 'next/link'

export default function SirahPage() {
  const sirahDetails = {
    teacher: 'Sheikh Iddy Issa',
    book: 'Khulaswah Nurulyaqyn',
    started: 'Desemba 2025',
    schedule: 'Jumanne na Jumatano',
    time: 'Baada ya Maghrib hadi Isha',
    location: 'Msikiti Mkuu wa Changanyikeni'
  }

  const sessions = [
    {
      week: 1,
      topic: 'Utangulizi wa Sirah',
      date: 'Des 3, 2025',
      duration: '40 min',
      status: 'imekamilika'
    },
    {
      week: 2,
      topic: 'Uzazi na Utoto wa Mtume',
      date: 'Des 10, 2025',
      duration: '48 min',
      status: 'imekamilika'
    },
    {
      week: 3,
      topic: 'Maisha Kabla ya Ufunuo',
      date: 'Des 17, 2025',
      duration: '52 min',
      status: 'ijayo'
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 flex items-center"
          >
            <History className="mr-4" />
            Sirah - Khulaswah Nurulyaqyn
          </motion.h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Maisha ya Mtume Muhammad (SAW) - Kuanzia Desemba 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Maelezo ya Kozi</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.entries(sirahDetails).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {key === 'teacher' ? 'Mwalimu' :
                       key === 'book' ? 'Kitabu' :
                       key === 'started' ? 'Imeanzia' :
                       key === 'schedule' ? 'Ratiba' :
                       key === 'time' ? 'Muda' : 'Mahali'}
                    </div>
                    <div className="font-bold">{value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <h3 className="font-bold mb-4 flex items-center">
                  <BookOpen className="mr-2" />
                  Kuhusu Kitabu
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  <strong>"Khulaswah Nurulyaqyn"</strong> ni kitabu maarufu kinachozungumzia maisha ya 
                  Mtume Muhammad (SAW) kwa ufupi na wazi. Kinachukuliwa kama moja ya vitabu bora 
                  vya Sirah kwa lugha ya Kiswahili.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kitabu hiki kinaelezea maisha yote ya Mtume (SAW) kutoka kuzaliwa hadi kufariki.
                </p>
              </div>
            </div>

            {/* Teacher Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Users className="mr-2" />
                Kuhusu Mwalimu
              </h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl">
                    SI
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">Sheikh Iddy Issa</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Mtaalamu wa Sirah na Historia ya Kiislamu. Anafundisha kitabu cha 
                    "Khulaswah Nurulyaqyn" kwa kina na mifano wazi.
                  </p>
                  <div className="text-sm text-gray-500">
                    Anafundisha kila Jumanne na Jumatano baada ya swala la Maghrib.
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Darsa</h2>
              
              <div className="space-y-4">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.week}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border rounded-xl ${
                      session.status === 'imekamilika'
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                        : session.status === 'ijayo'
                        ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">Wiki {session.week}: {session.topic}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {session.date}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {session.duration}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        session.status === 'imekamilika'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                          : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300'
                      }`}>
                        {session.status === 'imekamilika' ? 'Imepakuliwa' : 'Inakuja'}
                      </span>
                    </div>
                    
                    {session.status === 'imekamilika' ? (
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2">
                          <PlayCircle size={18} />
                          <span>Sikiliza</span>
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center space-x-2">
                          <Download size={18} />
                          <span>Pakua</span>
                        </button>
                      </div>
                    ) : (
                      <button className="px-4 py-2 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg">
                        Weka Kikumbusho
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Book */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Pakua Kitabu</h3>
              <div className="space-y-3">
                <button
                  onClick={() => alert('Kitabu cha Khulaswah Nurulyaqyn kitapakuliwa')}
                  className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">Khulaswah Nurulyaqyn (PDF)</div>
                    <div className="text-sm opacity-80">8.7 MB • Kamili</div>
                  </div>
                  <Download size={18} />
                </button>
                <button
                  onClick={() => alert('Muhtasari wa masomo kitapakuliwa')}
                  className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">Muhtasari wa Masomo</div>
                    <div className="text-sm opacity-80">2.1 MB • PDF</div>
                  </div>
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* Course Outline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Muhtasari wa Kozi</h3>
              <div className="space-y-2">
                <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm mr-3">1</div>
                  <span>Utangulizi na Uzazi</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm mr-3">2</div>
                  <span>Utoto na Ujana</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm mr-3">3</div>
                  <span>Kupokea Ufunuo</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm mr-3">4</div>
                  <span>Hijra ya Madina</span>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Masomo Mengine</h3>
              <div className="space-y-2">
                <Link href="/tawhiid" className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Tawhiid Series
                </Link>
                <Link href="/fiqh" className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Fiqh - Manhaju As Saalikin
                </Link>
                <Link href="/lectures" className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Mihadhara ya Semister
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}