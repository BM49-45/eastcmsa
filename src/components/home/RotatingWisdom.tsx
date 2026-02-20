import React, { useEffect, useState } from "react";
import { BookOpen, Scale, Heart, Lightbulb, GraduationCap } from "lucide-react";

interface Wisdom {
  id: number;
  arabic: string;
  translation: string;
  source: string;
  icon: React.ReactNode;
  category: string;
  color: string;
}

const wisdoms: Wisdom[] = [
  {
    id: 1,
    arabic: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
    translation: "Sema: Je, wanaweza kuwa sawa wale wanaojua na wale wasiojua?",
    source: "Quran (Az-Zumar: 9)",
    icon: <BookOpen className="w-5 h-5" />,
    category: "Elimu",
    color: "from-green-700 to-blue-900"
  },
  {
    id: 2,
    arabic: "إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ",
    translation: "Kwa hakika wanaomcha Mwenyezi Mungu katika waja wake ni wanazuoni tu.",
    source: "Quran (Fatir: 28)",
    icon: <Scale className="w-5 h-5" />,
    category: "Ucha Mungu",
    color: "from-yellow-700 to-purple-900"
  },
  {
    id: 3,
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    translation: "Kutafuta elimu ni faradhi kwa kila Muislamu.",
    source: "Hadith (Ibn Majah)",
    icon: <GraduationCap className="w-5 h-5" />,
    category: "Elimu",
    color: "from-red-700 to-green-900"
  },
  {
    id: 4,
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation: "Mbora wenu ni anayejifunza Qur'an na kufundisha.",
    source: "Hadith (Bukhari)",
    icon: <Heart className="w-5 h-5" />,
    category: "Quran",
    color: "from-pink-700 to-green-900"
  },
  {
    id: 5,
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    translation: "Anayekwenda njia akitafuta elimu, Mwenyezi Mungu anamrahisishia njia ya kuingia Peponi.",
    source: "Hadith (Muslim)",
    icon: <Lightbulb className="w-5 h-5" />,
    category: "Tija",
    color: "from-amber-700 to-blue-900"
  }
];

export default function RotatingWisdom() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % wisdoms.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`bg-gradient-to-br ${wisdoms[current].color} rounded-xl shadow-lg overflow-hidden h-full`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 p-5 text-white h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            {wisdoms[current].icon}
          </span>
          <span className="text-xs uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
            {wisdoms[current].category}
          </span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xl md:text-2xl font-arabic text-right leading-loose mb-3" dir="rtl">
            {wisdoms[current].arabic}
          </p>
          
          <p className="text-sm md:text-base italic border-r-2 border-white/30 pr-3 mb-2">
            "{wisdoms[current].translation}"
          </p>
          
          <p className="text-xs opacity-80">
            <span className="bg-white/20 px-2 py-0.5 rounded-full inline-block">
              {wisdoms[current].source}
            </span>
          </p>
        </div>

        <div className="flex justify-center gap-1.5 mt-3">
          {wisdoms.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${
                i === current 
                  ? "w-6 h-1.5 bg-white" 
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to wisdom ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}