'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Users, BookOpen, Globe, Phone, Mail, Calendar, 
  GraduationCap, Heart, ChevronDown, ChevronUp, Clock, 
  Star, Award, Target, Eye, BookMarked, Mic, Scale, History,
  ChevronRight, ExternalLink
} from 'lucide-react'
import Link from 'next/link'

const Motion = motion

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showFullHistory, setShowFullHistory] = useState(false)
  const [showFullMission, setShowFullMission] = useState(false)
  const [showFullTeachers, setShowFullTeachers] = useState(false)
  const [showFullSupporters, setShowFullSupporters] = useState(false)
  
  const historyRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const teachersRef = useRef<HTMLDivElement>(null)
  const supportersRef = useRef<HTMLDivElement>(null)

  // Scholars/Teachers (Real people)
  const scholars = [
    { 
      name: 'Sheikh Abuu Mus\'ab At Tanzaniy', 
      role: 'Sheikh Mlezi - Aqidah',
      description: 'Darsa za Tawhiid (Kwa kufuata Silsila ya Tawhiid; Al-Usuul Al-Thalatha, Al-Qawaid Al-Arbaa, Al-Usuul Al-Sitta, na mwendelezo wake), pamoja na kuhadhiri katika mihadhara mbalimabli'
    },
    { 
      name: 'Sheikh Iddy Issa', 
      role: 'Sheikh Mlezi - Sirah',
      description: 'Darsa za Sirah (Khulaswah Nurulyaqyn), pamoja na kuhadhiri katika mihadhara mbalimabli na ndiye Sheikh wa Msikiti wa Changanyikeni na mwenyeji wetu'
    },
    { 
      name: 'Sheikh Abuu Umair Adam Khamis', 
      role: 'Mhadhiri',
      description: 'Mihadhara maalum'
    },
    { 
      name: 'Ustadh Fadhili Adam', 
      role: 'Mwalimu - Fiqh',
      description: 'Darsa za Fiqh (Umdatul Ahkaam)'
    },
    { 
      name: 'Ustadh Ahmad Salum', 
      role: 'Mwalimu - Fiqh',
      description: 'Darsa za Fiqh'
    }
  ]

  // Teachers/Guardians (Real people)
  const teachers = [
    { name: 'Sir Leguma Bakari', role: 'Mwalimu Mlezi', phone: '+255 762 760 095' },
    { name: 'Sir Ali Khelef', role: 'Mwalimu Mlezi', phone: '+255 773 032 461' },
  ]

  // Current Leadership (Real people)
  const currentLeaders = [
    { name: 'Abuu Bardizba', role: 'Amiri (Mwenyekiti wa sasa)', phone: '+255 695 543 175' },
    { name: 'Usama', role: 'Katibu wa sasa', phone: '+255 752 792 402' },
    { name: 'Abdulbaasit', role: 'IT & Support', phone: '+255 699 565 600' },
  ]

  // Supporters (Real people)
  const supporters = [
    'Wanafunzi walioanzisha jumuiya',
    'Wanafunzi waliomaliza masomo na kuendelea kusaidia',
    'Viongozi wote wa jumuiya tangu kuanzishwa',
    'Waislamu wote wanaoshiriki darsa',
  ]

  const slides = [
    {
      title: '📚 Darsa za Tawhiid',
      content: 'Darsa za Silsila ya Tawhiid - Al-Usuul Al-Thalatha, Al-Qawaid Al-Arbaa, Al-Usuul Al-Sitta, na mwendelezo wake',
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: '⚖️ Darsa za Fiqh',
      content: 'Darsa za Fiqh kutoka kitabu cha Umdatul Ahkaam',
      icon: <Scale className="w-6 h-6" />
    },
    {
      title: '📖 Darsa za Sirah',
      content: 'Darsa za Sirah kutoka kitabu cha Khulaswah Nurulyaqyn',
      icon: <History className="w-6 h-6" />
    },
    {
      title: '🎤 Mihadhara ya Semister',
      content: 'Mihadhara maalum kwa kila semister - Mihadhara 2 kwa semister',
      icon: <Mic className="w-6 h-6" />
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
     
      {/* Hero Section with Bismillah */}
      <div className="relative bg-gradient-to-r from-green-700 to-green-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-8xl">﷽</div>
          <div className="absolute bottom-10 right-10 text-8xl">ﷴ</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-10">
            EASTCMSA
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm mb-6 border-2 border-white/20"
          >
            <Globe className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Jumuiya ya Waislamu EASTC
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl opacity-90 max-w-3xl mx-auto mb-8"
          >
            Eastern Africa Statistical Training Center Muslim Association
          </motion.p>

          {/* Slides */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div key={currentSlide} className="animate-fadeIn">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {slides[currentSlide].icon}
                  </div>
                  <div className="text-xl font-bold">{slides[currentSlide].title}</div>
                </div>
                <p className="opacity-90">{slides[currentSlide].content}</p>
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentSlide 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Nenda kwenye slide ${idx + 1}`}
                    title={`Onyesha ${slides[idx].title}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <button
              onClick={() => scrollToSection(historyRef)}
              className="animate-bounce bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              aria-label="Tembeza chini"
              title="Tembeza chini kuona maelezo zaidi"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => scrollToSection(historyRef)}
            className="px-4 py-2 bg-white dark:bg-gray-800 shadow-lg rounded-full text-sm font-medium hover:shadow-xl transition-shadow flex items-center gap-2 border border-gray-200 dark:border-gray-700"
          >
            <BookOpen className="w-4 h-4 text-green-600" />
            Historia
          </button>
          <button
            onClick={() => scrollToSection(missionRef)}
            className="px-4 py-2 bg-white dark:bg-gray-800 shadow-lg rounded-full text-sm font-medium hover:shadow-xl transition-shadow flex items-center gap-2 border border-gray-200 dark:border-gray-700"
          >
            <Target className="w-4 h-4 text-blue-600" />
            Dhamira
          </button>
          <button
            onClick={() => scrollToSection(teachersRef)}
            className="px-4 py-2 bg-white dark:bg-gray-800 shadow-lg rounded-full text-sm font-medium hover:shadow-xl transition-shadow flex items-center gap-2 border border-gray-200 dark:border-gray-700"
          >
            <Users className="w-4 h-4 text-purple-600" />
            Walimu
          </button>
          <button
            onClick={() => scrollToSection(supportersRef)}
            className="px-4 py-2 bg-white dark:bg-gray-800 shadow-lg rounded-full text-sm font-medium hover:shadow-xl transition-shadow flex items-center gap-2 border border-gray-200 dark:border-gray-700"
          >
            <Heart className="w-4 h-4 text-red-600" />
            Washirika
          </button>
          <Link
            href="/donate"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg rounded-full text-sm font-medium hover:shadow-xl transition-shadow flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Changia
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* History Section with Scroll */}
            <div ref={historyRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Historia Yetu</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className={`prose dark:prose-invert max-w-none ${!showFullHistory ? 'max-h-96 overflow-hidden relative' : ''}`}>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <span className="font-bold text-green-600">Jumuiya ya Waislamu EASTC</span> ni muunganiko wa wanafunzi Waislamu waliokusanyika kwa lengo la kujifunza, kuelimishana, na kuimarisha imani zao kupitia mafunzo mbalimbali ya Kiislamu huku wakiendelea na masomo yao chuoni.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Tulianza kama muunganiko mdogo wa wanafunzi wachache waliokuwa na hamu ya kujifunza zaidi dini yao, na kwa neema ya Mwenyezi Mungu, tumekua na kuwa jumuiya inayojumuisha wanafunzi wote wenye bidii ya kujifunza na kueneza elimu ya Kiislamu.
                  </p>

                  {showFullHistory && (
                    <>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        <span className="font-bold">Mwanzo rasmi:</span> Tarehe 14 Desemba 2024 (13 Jumadal Thaniya 1446H) ulifanyika ufunguzi rasmi wa Darsa za Tawhiid katika Msikiti Mkuu wa Changanyikeni kwa muhadhara ulioelezea vipengele 10 katika fani za kielimu, uliotolewa na Sheikh Abuu Mus'ab At Tanzaniy. Huu ndio ukawa mwanzo wa durusu za elimu ya maarifa ya Kiislamu.
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Kwa neema ya Mwenyezi Mungu, sasa tumefikia hatua ya kuwa na darsa tatu tofauti: <span className="font-bold text-green-600">Tawhiid, Fiqh na Sirah</span> – ambayo ni hatua kubwa ya maendeleo. Kila darsa inarekodiwa kwa njia ya sauti kwa ajili ya marejeo na usambazaji wa elimu hii, si kwa ajili ya wanajumuiya tu bali kwa jamii nzima ya Kiislamu.
                      </p>

                      <p className="text-gray-700 dark:text-gray-300">
                        Tunajitahidi kufuata utaratibu mzuri unaoendana na mwongozo wa Qur'an na Sunnah na kwa kuzingatia maelezo na ushauri wa masheikh wanaotufundisha.
                      </p>
                    </>
                  )}
                  
                  {!showFullHistory && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                  )}
                </div>
                
                <button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  {showFullHistory ? (
                    <>Onyesha Machache <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Soma Zaidi <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Mission & Vision Section with Scroll */}
            <div ref={missionRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Dhamira Yetu</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className={`prose dark:prose-invert max-w-none ${!showFullMission ? 'max-h-40 overflow-hidden relative' : ''}`}>
                  <p className="text-gray-700 dark:text-gray-300">
                    Dhamira yetu ni kuwawezesha wanafunzi na jamii kwa ujumla kupata elimu sahihi ya Kiislamu kupitia nyenzo bora na mafunzo ya kina, huku tukihifadhi urithi wa elimu kwa ajili ya vizazi vijavyo.
                  </p>

                  {showFullMission && (
                    <>
                      <p className="text-gray-700 dark:text-gray-300 mt-4">
                        Tunajitahidi kuhakikisha kuwa kila mwenye nia ya kujifunza anaweza kufikia nyenzo za kujifunzia kwa urahisi, iwe ni kwa kuhudhuria darsa ana kwa ana au kwa kusikiliza rekodi za darsa mtandaoni.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-4">
                        Lengo letu la mwisho ni kuona jamii yenye uelewa sahihi wa dini yao, wanaofuata misingi ya Qur'an na Sunnah, na wanaochangia katika kueneza elimu ya Kiislamu kwa vizazi vijavyo.
                      </p>
                    </>
                  )}
                  
                  {!showFullMission && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                  )}
                </div>
                
                <button
                  onClick={() => setShowFullMission(!showFullMission)}
                  className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {showFullMission ? (
                    <>Onyesha Machache <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Soma Zaidi <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Teachers Section with Scroll */}
            <div ref={teachersRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Walimu na Masheikh</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className={`space-y-4 ${!showFullTeachers ? 'max-h-80 overflow-hidden relative' : ''}`}>
                  {scholars.map((scholar, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{scholar.name}</h4>
                          <p className="text-sm text-green-600 dark:text-green-400 mb-2">{scholar.role}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{scholar.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!showFullTeachers && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                  )}
                </div>
                
                <button
                  onClick={() => setShowFullTeachers(!showFullTeachers)}
                  className="mt-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  {showFullTeachers ? (
                    <>Onyesha Machache <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Onyesha Walimu Wote <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Supporters Section with Scroll */}
            <div ref={supportersRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Washirika na Wasaidizi</h2>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Tunatoa shukurani za dhati kwa wote wanaotupa ushirikiano na msaada:
                </p>
                
                <div className={`space-y-3 ${!showFullSupporters ? 'max-h-40 overflow-hidden relative' : ''}`}>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2">Uongozi wa Msikiti Mkuu wa Changanyikeni</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Sheikh Iddi Issa, Imamu, Katibu na katibu wa Msikiti huu, na wengineo kwa kutupatia ushirikiano mkubwa na kufanya Msikiti huu kuwa mahala petu pa kufanyia ibada na shughuli zote za jumuiya.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2">Walimu Walezi</h4>
                    <div className="space-y-2">
                      {teachers.map((teacher, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{teacher.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({teacher.role})</span>
                          </div>
                          <a href={`tel:${teacher.phone}`} className="text-green-600 hover:underline text-sm">
                            {teacher.phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2">Viongozi wa Jumuiya</h4>
                    <div className="space-y-2">
                      {currentLeaders.map((leader, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{leader.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({leader.role})</span>
                          </div>
                          <a href={`tel:${leader.phone}`} className="text-green-600 hover:underline text-sm">
                            {leader.phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {supporters.map((supporter, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{supporter}</span>
                      </div>
                    </div>
                  ))}
                  
                  {!showFullSupporters && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                  )}
                </div>
                
                <button
                  onClick={() => setShowFullSupporters(!showFullSupporters)}
                  className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  {showFullSupporters ? (
                    <>Onyesha Machache <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Onyesha Washirika Wote <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Changia Katika Harakati Hizi</h3>
              <p className="mb-6 opacity-90">
                Mchango wako utasaidia kuendeleza elimu ya Kiislamu, kuhifadhi darsa, na kupanua wigo wa elimu kwa jamii nzima.
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg"
              >
                <Heart className="w-5 h-5" />
                Changia Sasa
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-8">
            {/* Location Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <MapPin className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h3 className="text-xl font-bold">Mahali Tulipo</h3>
              </div>
              
              <div className="space-y-3">
                <p className="font-medium">Msikiti Mkuu wa Changanyikeni</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Chuo cha Takwimu Mashariki mwa Afrika (EASTC)<br />
                  Changanyikeni, Ubungo<br />
                  Dar es Salaam, Tanzania
                </p>
                
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Ratiba ya Masomo:</span>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>Jumatatu & Alhamisi: Fiqh (baada ya Maghrib)</li>
                    <li>Jumanne & Jumatano: Sirah (baada ya Maghrib)</li>
                    <li>Jumamosa: Tawhiid (baada ya Maghrib)</li>
                    <li>Mihadhara ya Semister: Mara 2 kwa semister</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Contacts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Phone className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-bold">Mawasiliano ya Haraka</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold mb-2">Walimu Walezi:</p>
                  {teachers.map((teacher, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-sm">{teacher.name}</span>
                      <a href={`tel:${teacher.phone}`} className="text-green-600 hover:underline text-sm">
                        {teacher.phone}
                      </a>
                    </div>
                  ))}
                </div>
                
                <div>
                  <p className="text-sm font-bold mb-2">Viongozi wa Jumuiya:</p>
                  {currentLeaders.map((leader, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div>
                        <span className="text-sm">{leader.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({leader.role})</span>
                      </div>
                      <a href={`tel:${leader.phone}`} className="text-green-600 hover:underline text-sm">
                        {leader.phone}
                      </a>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <a 
                    href="mailto:eastcmsa@protonmail.com" 
                    className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">eastcmsa@protonmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Courses Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <BookOpen className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
                <h3 className="text-xl font-bold">Masomo Yanayoendelea Kufundishwa kwa sasa</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span className="font-bold">Tawhiid</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Vitabu: Al-Usuul Al-Thalatha, Al-Qawaid Al-Arbaa, Al-Usuul Al-Sitta</p>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span className="font-bold">Fiqh</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Kitabu: Umdatul Ahkaam</p>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <History className="w-4 h-4 text-amber-600" />
                    <span className="font-bold">Sirah</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Kitabu: Khulaswah Nurulyaqyn</p>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-green-600" />
                    <span className="font-bold">Mihadhara</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Mihadhara 2 kwa kila semister</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Viungo vya Haraka</h3>
              <div className="space-y-3">
                <Link href="/tawhiid" className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span>Darsa za Tawhiid</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/fiqh" className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span>Darsa za Fiqh</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/sirah" className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span>Darsa za Sirah</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/lectures" className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span>Mihadhara</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/events" className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span>Ratiba za Masomo</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Ayah */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-gradient-to-r from-green-800 to-green-900 text-white rounded-2xl text-center">
          <div className="text-2xl font-arabic mb-4">
            وَتَعَاوَنُوا۟ عَلَى ٱلْبِرِّ وَٱلتَّقْوَىٰ
          </div>
          <p className="text-lg mb-2">
            "Na saidianeni katika kufanya wema na kumcha Mungu"
          </p>
          <div className="text-sm opacity-80">Al-Ma'idah 5:2</div>
        </div>

        {/* Back to Top Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
            aria-label="Rudi juu"
            title="Rudi juu"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .font-arabic {
          font-family: 'Traditional Arabic', 'Scheherazade', 'Lateef', serif;
        }
      `}</style>
    </div>
  )
}