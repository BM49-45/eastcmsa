'use client'

import { useState, useEffect } from 'react'
import { MapPin, Users, BookOpen, Globe, Phone, Mail, Calendar, GraduationCap } from 'lucide-react'

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const scholars = [
    ''
  ]

  const teachers = [
    { name: 'Sir Leguma Bakari (Mwl. Mlezi)', phone: '+255 762 760 095' },
    { name: 'Sir Ali Khelef (Mwl. Mlezi)', phone: '+255 773 032 461' },
    { name: 'Abuu Bardizba (Amiri wa sasa)', phone: '+255 695 543 175' },
    { name: 'Usama (Katibu wa sasa)', phone: '+255 752 792 402' },
  ]

  const courses = [
    'Tawhiid Series',
    'Fiqh',
    'Siirah',
    'Mihadhara (Lectures)',
  ]

  const slides = [
    {
      title: 'Elimu ya Kiislamu',
      content: 'Kufundisha Aqeedah sahihi kwa mujibu wa Qur\'an na Sunnah.'
    },
    {
      title: 'Darsa za Msikitini',
      content: 'Darsa za masiku katika juma, Msikiti Mkuu wa Changanyikeni.'
    },
    {
      title: 'Mihadhara ya Semister',
      content: 'Mihadhara maalum kwa kila semister kwa wanafunzi wa EASTC na jamii nzima.'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-700 to-green-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">﷽</div>
          <div className="absolute bottom-10 right-10 text-9xl">ﷴ</div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm mb-8">
            <Globe className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Kuhusu EASTCMSA
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="text-xl md:text-2xl opacity-90 mb-8">
              Jumuiya ya Wanafunzi wa Kiislamu Chuo cha Takwimu Mashariki mwa Afrika
            </div>
            
            {/* Slides */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div key={currentSlide} className="animate-fadeIn">
                <div className="text-2xl font-bold mb-3">{slides[currentSlide].title}</div>
                <p className="opacity-90">{slides[currentSlide].content}</p>
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentSlide 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Nenda kwenye slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <MapPin className="text-green-600 dark:text-green-400" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Mahali Tulipo</h2>
                  <p className="text-gray-600 dark:text-gray-300">Msikiti Mkuu wa Changanyikeni</p>
                </div>
              </div>
              
              <div className="space-y-4">             
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-bold">Chuo cha Takwimu Mashariki mwa Afrika</div>
                    <p className="text-gray-600 dark:text-gray-300">Eastern Africa Statistical Training Center</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-bold">Eneo</div>
                    <p className="text-gray-600 dark:text-gray-300">Changanyikeni, Ubungo, Dar es Salaam</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scholars Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Darsa zinatolewa na Walimu kutoka maeneo mbalimbali</h2>
                  <p className="text-gray-600 dark:text-gray-300">Walimu wanafundisha kwa kufuata misingi sahihi ya Quran na Sunnah</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scholars.map((scholar, index) => (
                  <div 
                    key={index} 
                    className="animate-fadeInUp"
                    data-i={index}
                  >
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{scholar}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Hakika hiki ni kitabu kisichokuwa na shaka ndani yake; ni uongofu kwa wachamungu. (Al-Baqarah 2:2)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teachers Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <GraduationCap className="text-purple-600 dark:text-purple-400" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Kwa usaidizi wa haraka na maelezo ya ziada</h2>
                    <p className="text-gray-600 dark:text-gray-300">Wasiliana na wasimamizi wa jumuiya</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {teachers.map((teacher, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        <Users size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{teacher.name}</div>
                        <div className="text-gray-600 dark:text-gray-300"></div>
                      </div>
                    </div>
                    
                    <a 
                      href={`tel:${teacher.phone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Phone size={18} />
                      <span className="hidden sm:inline">Piga Simu</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold mb-6">Mawasiliano</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <MapPin className="text-green-600 dark:text-green-400" size={22} />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Mahali</div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Msikiti Mkuu wa Changanyikeni<br />
                      EASTC, Ubungo<br />
                      Dar es Salaam, Tanzania
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Phone className="text-blue-600 dark:text-blue-400" size={22} />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Simu</div>
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-300">+255 762 760 095</p>
                      <p className="text-gray-600 dark:text-gray-300">+255 773 032 461</p>
                      <p className="text-gray-600 dark:text-gray-300">+255 695 543 175</p>
                      <p className="text-gray-600 dark:text-gray-300">+255 752 792 402</p>
                      <p className="text-gray-600 dark:text-gray-300">+255 699 565 600</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Mail className="text-purple-600 dark:text-purple-400" size={22} />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Barua Pepe</div>
                    <div className="space-y-1">
                      <a href="mailto:eastcmsa@protonmail.com" className="text-green-600 hover:underline">
                        eastcmsa@protonmail.com
                      </a><br />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <BookOpen className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Masomo yanayofundishwa</h3>
                  <p className="text-gray-600 dark:text-gray-300">Kwa kufuata misingi sahihi ya Quran na Sunnah</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {courses.map((course, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{course}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tutembelee Tulipo</h3>
                  <p className="text-green-100 opacity-90">Msikiti wa Changanyikeni</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="font-bold">Jumatatu - Ijumaa</div>
                  <div className="text-green-100 opacity-90">7:30 Mchana - 11:00 Jioni</div>
                </div>
                
                <div>
                  <div className="font-bold">Jumamosi</div>
                  <div className="text-green-100 opacity-90">5:00 Asubuhi - 8:00 Mchana</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mt-20 p-8 bg-gradient-to-r from-green-800 to-green-900 text-white rounded-3xl text-center">
          <div className="text-3xl font-arabic mb-6">
            يَرْفَعِ ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ مِنكُمْ وَٱلَّذِينَ أُوتُوا۟ ٱلْعِلْمَ دَرَجَٰتٍ
          </div>
          <p className="text-2xl mb-4">
            "Mwenyezi Mungu atawainua walio amini miongoni mwenu na walio pewa ilimu daraja za juu."
          </p>
          <div className="text-lg opacity-80">Surah Al-Mujadilah 58:11</div>
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
        /* animation delays for scholar items (avoid inline styles) */
        .animate-fadeInUp[data-i="0"] { animation-delay: 0s; }
        .animate-fadeInUp[data-i="1"] { animation-delay: 0.1s; }
        .animate-fadeInUp[data-i="2"] { animation-delay: 0.2s; }
        .animate-fadeInUp[data-i="3"] { animation-delay: 0.3s; }
        .font-arabic {
          font-family: 'Traditional Arabic', 'Scheherazade', 'Lateef', serif;
        }
      `}</style>
    </div>
  )
}