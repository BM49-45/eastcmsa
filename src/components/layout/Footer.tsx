'use client'

import { Heart, Mail, Phone, MapPin, Facebook, Youtube, Twitter, Instagram, Globe, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Nyakati za Swala', href: '#', onClick: () => {
      const prayerSection = document.querySelector('#prayer-times')
      if (prayerSection) prayerSection.scrollIntoView({ behavior: 'smooth' })
    }},
    { name: 'Nyumbani', href: '/' },
    { name: 'Ratiba ya Darsa', href: '/events' },
    { name: 'Tawhiid', href: '/tawhiid' },
    { name: 'Fiqh', href: '/fiqh' },
    { name: 'Sirah', href: '/sirah' },
    { name: 'Mihadhara', href: '/lectures' },
    { name: 'Vitabu', href: '/books' },
    { name: 'Matukio', href: '/events' },
    { name: 'Kuhusu Sisi', href: '/about' },
    { name: 'Wasiliana', href: '/contact' },
    { name: 'Changia', href: '/donate' },
    { name: 'Jisajili', href: '/register' },
    { name: 'Tuma Swali', href: '/contact' },
  ]

  const contactInfo = [
    { icon: <MapPin size={18} />, text: 'Msikiti Mkuu wa Changanyikeni- EASTC, Dar es Salaam' },
    { icon: <Phone size={18} />, text: '+255 762 760 095' },
    { icon: <Phone size={18} />, text: '+255 773 032 461' },
    { icon: <Phone size={18} />, text: '+255 695 543 175' },
    { icon: <Phone size={18} />, text: '+255 752 792 402' },
    { icon: <Phone size={18} />, text: '+255 699 565 600' },

    { icon: <Mail size={18} />, text: 'eastcmsa@protonmail.com' },
  ]

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://facebook.com/eastc.islamic', label: 'Facebook' },
    { icon: <Youtube size={20} />, href: 'https://youtube.com/@eastc_islamic', label: 'YouTube' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com/eastc_islamic', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com/eastc.islamic', label: 'Instagram' },
  ]

  const footerLinks = [
    {
      name: 'Audio Library',
      icon: <BookOpen size={18} />,
      onClick: () => window.location.href = '/tawhiid'
    },
    {
      name: 'Contact',
      icon: <Mail size={18} />,
      onClick: () => window.location.href = '/contact'
    },
    {
      name: 'About',
      icon: <Heart size={18} />,
      onClick: () => window.location.href = '/about'
    },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description - FIXED MOTION.DIV */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3">
                  <Link href="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-white">
                      <Image
                        src="/logo.png"
                        alt="EASTCMSA Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div>
                      <div className="text-xl font-bold">EASTCMSA</div>
                      <div className="text-sm text-gray-400">Islamic Knowledge Portal</div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </div>
            <p className="text-gray-400 mb-6">
              Elimu hupatikana kwa kuisoma.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-green-600 rounded-lg transition-colors"
                  aria-label={`Visit our ${social.label} page`}
                  title={`Visit ${social.label}`}
                >
                  {social.icon}
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Viungo vya Haraka</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.name === 'Nyakati za Swala' ? (
                    <button
                      type="button"
                      onClick={link.onClick}
                      className="text-gray-400 hover:text-green-400 transition-colors flex items-center space-x-2 w-full text-left"
                      aria-label={`Go to ${link.name}`}
                    >
                      <span>→</span>
                      <span>{link.name}</span>
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors flex items-center space-x-2"
                      aria-label={`Go to ${link.name}`}
                    >
                      <span>→</span>
                      <span>{link.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Mawasiliano</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-green-400 mt-0.5">
                    {info.icon}
                    <span className="sr-only">
                      {index === 0 ? 'Address' : index === 1 ? 'Phone' : 'Email'}
                    </span>
                  </div>
                  <p className="text-gray-400 whitespace-pre-line">{info.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">Jiunge na Jarida Letu</h3>
            <p className="text-gray-400 mb-4">
              Pokea taarifa za darsa mpya na matukio kwenye barua pepe yako.
            </p>
            <form className="space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Barua pepe yako
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Barua pepe yako"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
                aria-label="Enter your email address"
                aria-required="true"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                aria-label="Subscribe to newsletter"
              >
                Jiunge Sasa
              </button>
            </form>
          </div>
        </div>

        {/* Footer Action Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-4">
              {footerLinks.map((link, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={link.onClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label={`Go to ${link.name}`}
                  title={link.name}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <Globe size={16} aria-label="Available languages" />
              <span>Available in: Kiswahili | English | العربية</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500">
              © {currentYear} EASTC Muslim Association. Haki zote zimehifadhiwa.
            </p>
            <div className="flex items-center space-x-6 text-gray-500">
              <Link 
                href="/privacy" 
                className="hover:text-green-400 transition-colors"
                aria-label="View privacy policy"
              >
                Sera ya Faragha
              </Link>
              <Link 
                href="/terms" 
                className="hover:text-green-400 transition-colors"
                aria-label="View terms of service"
              >
                Masharti ya Matumizi
              </Link>
              <div className="flex items-center space-x-2">
                <Heart size={16} className="text-red-500" aria-label="Made with love" />
                <span>Tayarishwa kwa upendo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-600">
            Developed with Next.js 14 • Tailwind CSS • TypeScript
          </p>
          <p className="text-xs text-gray-600 mt-1">
             "Na semeni maneno mema kwa watu" (Al-Baqarah 2:83)
          </p>
        </div>
      </div>
    </footer>
  )
}import { AnimatePresence } from 'framer-motion'