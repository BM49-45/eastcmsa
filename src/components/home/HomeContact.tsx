'use client'

import {
  MapPin,
  Phone,
  Mail,
  Youtube,
  Instagram,
  MessageCircle
} from 'lucide-react'

export default function HomeContact() {
  return (
    <section
      className="
        rounded-xl p-6
        bg-gradient-to-br from-emerald-700 via-pink-900 to-emerald-900
        text-white shadow-lg
        transition-all hover:shadow-2xl
      "
    >
      {/* Header */}
      <h2 className="text-lg font-bold mb-4">Wasiliana Nasi Kwa namba za Simu</h2>

      {/* Contact Info */}
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-green-200" />
          <span>
            EASTCMSA-
            EASTC, Ubungo – Dar es Salaam
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-green-200 mt-0.5" />
          <span>
            +255 762 760 095 <br />
            +255 773 032 461 <br />
            +255 695 543 175 <br />
            +255 752 792 402 <br />
            +255 699 565 600
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-green-200" />
          <span>eastcmsa@protonmail.com</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-6">
        <p className="text-xs text-green-200 mb-3 font-medium">
          Tufuate Mitandaoni
        </p>

        <div className="flex gap-3">
          <a
            href="https://youtube.com/@eastcmsa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Channel: @eastcmsa"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
          >
            <Youtube className="w-5 h-5 text-red-400" />
          </a>

          <a
            href="https://instagram.com/eastcmsa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram: @eastcmsa"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
          >
            <Instagram className="w-5 h-5 text-pink-400" />
          </a>

          <a
            href="https://whatsapp.com/channel/0029VbC8YONIN9ig2UvBQr2P"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Channel: EASTCMSA"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 text-green-300" />
          </a>
        </div>
      </div>
    </section>
  )
}
