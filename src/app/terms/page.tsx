'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-16 px-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Sheria na Masharti</h1>
        
        <p className="text-gray-700 mb-4">
          Kwa kutumia mfumo huu, unakubali kufuata misingi ya Qur’an na Sunnah. Mtumiaji lazima awe na
          mwenendo wa mafunzo ya waja wema waliotangulia (Salafi Saleh). Maadili na tabia njema lazima zifuatwe kama ilivyoelekezwa katika Qur’an na Sunnah.
        </p>
        
        <p className="text-gray-700 mb-4">
          Taarifa zako za kibinafsi zitasajiliwa na kuhifadhiwa kwa usalama. Hakuna data yako itakayoshirikiwa bila idhini yako. 
        </p>

        <p className="text-gray-700 mb-4">
          Kwa kutumia huduma hii, unathibitisha kuwa umeelewa na unakubali masharti yote yaliyowekwa. 
        </p>

        <div className="mt-6 text-right">
          <Link
            href="/register"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90"
          >
            Rudi Usajili
          </Link>
        </div>
      </div>
    </div>
  )
}
