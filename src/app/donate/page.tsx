'use client'

import { useState, useEffect } from 'react'
import { Heart, Clock, CheckCircle, Mail, Shield, BookOpen, Users, Home } from 'lucide-react'

export default function DonatePage() {
  const [countdown, setCountdown] = useState(30)
  const [showForm, setShowForm] = useState(false)
  const [currentAyah, setCurrentAyah] = useState(0)

  const ayahs = [
    {
      arabic: "مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ فِى كُلِّ سُنۢبُلَةٍ مِّا۟ئَةُ حَبَّةٍ ۗ وَٱللَّهُ يُضَٰعِفُ لِمَن يَشَآءُ ۗ وَٱللَّهُ وَٰسِعٌ عَلِيمٌ",
      translation: "Mfano wa wanaoitoa mali yao kwenye Njia ya Allah ni kama mfano wa punje iliyomea mawimbi saba, kila ua likiwa na punje mia. Na Allah humzidisha amtakaye. Na Allah ni Mwenye kuwasha, Mwenye kujua.",
      reference: "Al-Baqarah 2:261"
    },
    {
      arabic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ أَنفِقُوا۟ مِمَّا رَزَقْنَٰكُم مِّن قَبْلِ أَن يَأْتِىَ يَوْمٌ لَّا بَيْعٌ فِيهِ وَلَا خُلَّةٌ وَلَا شَفَٰعَةٌ ۗ وَٱلْكَٰفِرُونَ هُمُ ٱلظَّٰلِمُونَ",
      translation: "Enyi mlioamini! Toeni katika vile tulivyokupeni kabla ya kufika siku isiyokuwa na mauzo wala urafiki wala uombezi. Na makafiri ndio walio dhulumu.",
      reference: "Al-Baqarah 2:254"
    },
    {
      arabic: "لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ ۚ وَمَا تُنفِقُوا۟ مِن شَىْءٍ فَإِنَّ ٱللَّهُ بِهِۦ عَلِيمٌ",
      translation: "Hamtapata wema mpaka mtoe katika vile mnavyovipenda. Na chochote mnavyotoa, hakika Allah ni Mwenye kujua.",
      reference: "Āli 'Imrān 3:92"
    }
  ]

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setShowForm(true)
    }
  }, [countdown])

  useEffect(() => {
    const ayahInterval = setInterval(() => {
      setCurrentAyah((prev) => (prev + 1) % ayahs.length)
    }, 8000)
    return () => clearInterval(ayahInterval)
  }, [])

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Usalama wa Malipo",
      description: "Tumia njia salama za M-Pesa, Tigo Pesa, Airtel Money na benki."
    },
    
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Ujumbe wa Shukrani",
      description: "Utapokea ujumbe wa shukrani na taarifa za mradi."
    }
  ]

  const donationAreas = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Manunuzi ya Vitabu",
      description: "Ununuzi wa Vitabu."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Shughuli za Darsa",
      description: "Kuendesha shughuli za darsa zinazofanyika"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Shughuli za Jumuiya",
      description: "Uendeshaji wa shughuli zote za jumuiya."
    }
  ]

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Ayah Rotation */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Changia Mradi Wetu
          </h1>
          
          {/* Ayah Display */}
          <div className="max-w-3xl mx-auto mb-8 min-h-[120px]">
            <div key={currentAyah} className="animate-fadeIn">
              <div className="text-2xl md:text-3xl font-arabic mb-4 leading-relaxed">
                {ayahs[currentAyah].arabic}
              </div>
              <div className="text-lg opacity-90 mb-2">
                {ayahs[currentAyah].translation}
              </div>
              <div className="text-sm opacity-70">
                {ayahs[currentAyah].reference}
              </div>
            </div>
            
            {/* Ayah Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {ayahs.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentAyah(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentAyah 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Nenda kwenye aya ya ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Changia kwenye njia ya Allah na upate malipo makubwa duniani na Akhera
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {!showForm ? (
          // Coming Soon Section
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-full mb-8">
                <Clock className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Inakuja Karibuni! 🚀
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Njia za kuchangia zinafanyiwa usakinishaji wa mwisho. 
                Tutakuwa tayari kukupokea muda mfupi tu.
              </p>

              {/* Countdown Timer */}
              <div className="mb-10">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Inafunguliwa baada ya:
                </div>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                  {countdown}s
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl animate-fadeInUp delay-${index}`}
                  >
                    <div className="text-green-600 dark:text-green-400 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Kwa maombi ya haraka ya kuchangia, wasiliana nasi:
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-medium hover:opacity-90 transition">
                  <Mail size={18} />
                  <span>eastcmsa@protonmail.com</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Placeholder for Actual Form
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Karibu!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Huduma ya kuchangia itafunguliwa hivi karibuni.
                Tafadhali rudi baada ya siku chache.
              </p>
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-bold hover:opacity-90 transition"
              >
                Rudi Nyumbani
              </button>
            </div>
          </div>
        )}

        {/* Donation Areas */}
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            Mchango Wako Unasaidia Nini?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationAreas.map((area, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mb-6">
                  <div className="text-white">
                    {area.icon}
                  </div>
                </div>
                <div className="text-green-600 font-bold text-xl mb-2">0{index + 1}</div>
                <h4 className="text-xl font-bold mb-3">{area.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Ayah Call to Action */}
        <div className="max-w-3xl mx-auto mt-20 p-8 bg-gradient-to-r from-green-800 to-green-900 text-white rounded-3xl text-center">
          <div className="text-2xl font-arabic mb-4">
            وَمَا تُقَدِّمُوا۟ لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ ٱللَّهِ
          </div>
          <p className="text-xl mb-6">
            "Na wema wowote mtakaojitolea nafsi zenu, mtakuta kwa Allah."
          </p>
          <div className="text-sm opacity-80">Al-Baqarah 2:110</div>
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
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .font-arabic {
          font-family: 'Traditional Arabic', 'Scheherazade', 'Lateef', serif;
        }
      `}</style>
    </div>
  )
}