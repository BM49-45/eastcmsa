// src/components/ClientLayout.tsx
'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function ClientLayout() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
      offset: 100,
    })
    
    // Refresh AOS on window resize
    window.addEventListener('resize', () => {
      AOS.refresh()
    })
    
    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh()
      })
    }
  }, [])

  return null // This component doesn't render anything
}