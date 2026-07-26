'use client'

import { motion } from 'framer-motion'
import { 
  MapPin, Users, BookOpen, Globe, Phone, Mail, Calendar, 
  GraduationCap, Heart, Clock, Target, Eye, Award,
  ChevronRight, ExternalLink, Sparkles, Shield
} from 'lucide-react'
import Link from 'next/link'

const Motion = motion

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      
      {/* Hero Section - Simple & Clean */}
      <div className="relative bg-gradient-to-r from-green-700 to-green-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-8xl">﷽</div>
          <div className="absolute bottom-10 right-10 text-8xl">ﷴ</div>
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
            EASTC-MSA
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl opacity-90 max-w-3xl mx-auto"
          >
            Jumuiya ya Waislamu Chuo cha Takwimu Mashariki mwa Afrika
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg opacity-80 max-w-2xl mx-auto mt-4"
          >
            Eastern Africa Statistical Training Centre Muslim Students Association
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        
        {/* About Section - Short Description */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-12"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Kuhusu Sisi</h2>
            </div>
          </div>
          
          <div className="p-8">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              <span className="font-bold text-green-600 dark:text-green-400">EASTC-MSA</span> ni jumuiya ya wanafunzi Waislamu wa Chuo cha Takwimu Mashariki mwa Afrika (EASTC) ipo kwa lengo la kujifunza elimu sahihi ya kiislamu kwa kufuata msingi wa Quran na Sunnah, na mafunzo ya waja wema waliotangulia, kuelimishana, na kuimarisha imani kupitia mafunzo mbalimbali ya dini yetu, huku wakiendelea na masomo yao chuoni.
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
                <p className="font-bold text-lg"></p>
                <p className="text-sm text-gray-500 dark:text-gray-400"></p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                <p className="font-bold text-lg"></p>
                <p className="text-sm text-gray-500 dark:text-gray-400"></p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                <p className="font-bold text-lg">2024</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mwaka wa Kuanzishwa</p>
              </div>
            </div>
          </div>
        </Motion.div>

        {/* Vision & Mission - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Vision */}
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Dhamira Yetu</h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">Dhamira</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Kutoa elimu sahihi ya Kiislamu kwa wanafunzi na jamiikwa ujumla.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  "Tunajitahidi kuwa chanzo cha mwanga wa elimu ya Kiislamu kwa jamii inayotuzunguka, tukilenga kueneza maarifa sahihi ya Uislamu, na kuimarisha imani ya waja wema."
                </p>
              </div>
            </div>
          </Motion.div>

          {/* Mission */}
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Lengo Letu</h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">Lengo Kuu</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Kuwezesha kila mwanafunzi na mshiriki kupata elimu sahihi ya Kiislamu kupitia mafunzo ya kina, 
                    kuhifadhi rekodi za darsa, na kueneza elimu hii kwa vizazi vijavyo.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kufundisha darsa za Tawhiid, Fiqh, Sirah na Mihadhara ya Kielimu</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kurekodi na kuhifadhi darsa kwa ajili ya marejeo</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kueneza elimu ya Kiislamu kwa jamii kwa ujumla</p>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Quick Links Section */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-green-700 to-green-900 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Jiunge Nasi</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
            Karibu katika harakati za kueneza elimu ya Kiislamu. Darsa zetu zipo wazi kwa wote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tawhiid"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              Darsa za Tawhiid
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Wasiliana Nasi
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </Motion.div>

        {/* Footer Ayah */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-gradient-to-r from-green-800 to-green-900 text-white rounded-2xl text-center">
          <div className="text-2xl font-arabic mb-4">
            وَتَعَاوَنُوا عَلَى لْبِرِّ وَلتَّقْوَىٰ
          </div>
          <p className="text-lg mb-2">
            "Na saidianeni katika kufanya wema na kumcha Mungu"
          </p>
          <div className="text-sm opacity-80">Al-Ma'idah 5:2</div>
        </div>

        {/* Back to Top */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
            aria-label="Rudi juu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .font-arabic {
          font-family: 'Traditional Arabic', 'Scheherazade', 'Lateef', serif;
        }
      `}</style>
    </div>
  )
}