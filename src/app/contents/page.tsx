import Link from "next/link"
import { getAllAudioFiles } from "@/lib/r2"
import { BookOpen, Scale, History, Headphones } from 'lucide-react'

const categories = [
  { name: "Tawhiid", slug: "tawhiid", description: "Masomo ya Tawhiid - Umoja wa Mwenyezi Mungu", icon: BookOpen, color: "from-purple-500 to-indigo-700" },
  { name: "Fiqh", slug: "fiqh", description: "Masomo ya Fiqh - Sheria za Kiislamu", icon: Scale, color: "from-green-500 to-emerald-700" },
  { name: "Sirah", slug: "sirah", description: "Masomo ya Sirah - Maisha ya Mtume Muhammad (SAW)", icon: History, color: "from-amber-500 to-orange-700" },
  { name: "Mihadhara", slug: "lectures", description: "Mihadhara mbalimbali za Kiislamu", icon: Headphones, color: "from-blue-500 to-cyan-700" },
]

export default async function ContentsPage() {
  const allAudio = await getAllAudioFiles()
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: allAudio.filter(audio => audio.category === cat.slug.toLowerCase()).length
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Maktaba ya Maudhui</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Gundua mkusanyiko wetu wa darsa, mihadhara na masomo ya Kiislamu</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesWithCounts.map((cat) => {
            const Icon = cat.icon
            return (
              <Link key={cat.slug} href={`/${cat.slug}`} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className={`p-6 bg-gradient-to-br ${cat.color} text-white`}>
                  <Icon className="w-12 h-12 mb-4 opacity-90" />
                  <h2 className="text-2xl font-bold">{cat.name}</h2>
                  <p className="text-sm opacity-90 mt-1">{cat.count} mafaili</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400">{cat.description}</p>
                  <div className="mt-4 flex items-center text-green-600 group-hover:translate-x-1 transition">Tembelea →</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}