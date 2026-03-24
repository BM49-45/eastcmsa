import Link from "next/link"
import { 
  ChevronRight, 
  Home, 
  BookOpen, 
  Scale, 
  History, 
  Mic, 
  Book, 
  CalendarHeart, 
  Heart, 
  Info, 
  Phone,
  Bookmark,
  Star,
  Users,
  Globe,
  Menu
} from 'lucide-react'
import { getAllAudioFiles } from "@/lib/r2"

// Main navigation links
const mainNavLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tawhiid', href: '/tawhiid', icon: BookOpen },
  { name: 'Fiqh', href: '/fiqh', icon: Scale },
  { name: 'Sirah', href: '/sirah', icon: History },
  { name: 'Mihadhara', href: '/mihadhara', icon: Mic },
  { name: 'Vitabu', href: '/books', icon: Book },
  { name: 'Matukio', href: '/events', icon: CalendarHeart },
  { name: 'Changia', href: '/donate', icon: Heart },
  { name: 'Kuhusu', href: '/about', icon: Info },
  { name: 'Wasiliana', href: '/contact', icon: Phone }
]

// Filter only category pages
const categoryPages = mainNavLinks.filter(link => 
  ['Tawhiid', 'Fiqh', 'Sirah', 'Mihadhara'].includes(link.name)
).map(link => ({
  ...link,
  gradient: link.name === 'Tawhiid' ? 'from-purple-500 to-indigo-700' :
            link.name === 'Fiqh' ? 'from-green-500 to-emerald-700' :
            link.name === 'Sirah' ? 'from-amber-500 to-orange-700' :
            'from-blue-500 to-cyan-700',
  description: link.name === 'Tawhiid' ? 'Umoja wa Mwenyezi Mungu na Misingi ya Imani' :
              link.name === 'Fiqh' ? 'Sheria za Kiislamu na Hukumu za Kisheria' :
              link.name === 'Sirah' ? 'Maisha na Mafundisho ya Mtume Muhammad (SAW)' :
              'Mihadhara na Mafundisho ya Kiislamu'
}))

export default async function CategoriesPage() {
  // Fetch real data
  const allAudio = await getAllAudioFiles()
  
  // Get top 3 most downloaded audios
  const topAudios = [...allAudio]
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 3)
  
  // Add counts to categories
  const categoriesWithCounts = categoryPages.map(cat => ({
    ...cat,
    count: allAudio.filter(audio => 
      audio.category?.toLowerCase() === cat.name.toLowerCase() ||
      (cat.name === 'Mihadhara' && audio.category === 'mihadhara')
    ).length
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Vinjari Kategoria</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gundua mkusanyiko wetu wa nyaraka za Kiislamu katika kategoria mbalimbali
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesWithCounts.map((category) => {
            const Icon = category.icon
            
            return (
              <Link
                key={category.href}
                href={category.href}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`}></div>
                
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="relative p-8 text-white">
                  <div className="w-20 h-20 mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Icon className="w-10 h-10" />
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
                  <p className="text-lg opacity-90 mb-4">{category.count} mafaili</p>
                  <p className="text-sm opacity-75 mb-4">{category.description}</p>
                  
                  <div className="flex items-center text-sm opacity-75 group-hover:opacity-100 transition-opacity">
                    <span>Vinjari {category.name}</span>
                    <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white rounded-full opacity-10"></div>
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-white rounded-full opacity-10"></div>
              </Link>
            )
          })}
        </div>

        {/* Most Popular Section - REAL DATA */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Maarufu Wiki Hii
          </h2>
          {topAudios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Hakuna maudhui maarufu kwa sasa</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topAudios.map((audio, i) => {
                const category = categoryPages.find(c => 
                  c.name.toLowerCase() === audio.category?.toLowerCase() ||
                  (c.name === 'Mihadhara' && audio.category === 'mihadhara')
                )
                const CategoryIcon = category?.icon || BookOpen
                
                return (
                  <Link 
                    key={i} 
                    href={category?.href || `/${audio.category}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${category?.gradient || 'from-blue-500 to-purple-600'} rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
                      <CategoryIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-1">{audio.title}</p>
                      <p className="text-sm text-gray-600">{audio.speaker}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{audio.downloads || 0} upakuaji</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{category?.name}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Navigation to Other Pages */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Sehemu Nyingine</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mainNavLinks.slice(5).map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors mb-2">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                    {link.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Stats Summary - REAL DATA */}
        <div className="mt-12 bg-green-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">{allAudio.length}</p>
              <p className="text-sm opacity-90">Jumla ya Mafaili</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {new Set(allAudio.map(a => a.speaker)).size}
              </p>
              <p className="text-sm opacity-90">Wazungumzaji</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4</p>
              <p className="text-sm opacity-90">Kategoria</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {allAudio.reduce((sum, a) => sum + (a.downloads || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm opacity-90">Jumla ya Upakuaji</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Kila kategoria ina mkusanyiko wake wa darsa na mihadhara. 
            Bofya kategoria yoyote kuona mafaili yote.
          </p>
        </div>
      </div>
    </div>
  )
}