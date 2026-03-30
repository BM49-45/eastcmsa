'use client'

import React, { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import RotatingWisdom from "@/components/home/RotatingWisdom";
import CampusSlider from "@/components/home/CampusSlider";
import FullSchedule from "@/components/home/DarsaSchedule";
import NextDarsa from "@/components/home/NextDarsa";
import RegisterCTA from "@/components/home/RegisterCTA";
import HomeContact from "@/components/home/HomeContact";
import SocialLinks from "@/components/home/SocialLinks";
import IslamicCalendar from "@/components/home/IslamicCalendar";
import PrayerTimes from "@/components/home/PrayerTimes";
import LiveQuran from "@/components/widgets/LiveQuran";
import { Download, Smartphone } from "lucide-react";

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState("");
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("sw-TZ", { hour12: false, hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    
    // Check if app is installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('install-banner-dismissed');
    
    if (!isInstalled && !dismissed) {
      setShowInstallBanner(true);
    }
    
    // Check iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    return () => clearInterval(timer);
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      alert('Bonyeza "Share" button (square with arrow) kisha "Add to Home Screen"');
    } else {
      // Trigger install prompt
      window.dispatchEvent(new Event('beforeinstallprompt'));
    }
    setShowInstallBanner(false);
    localStorage.setItem('install-banner-dismissed', Date.now().toString());
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('install-banner-dismissed', Date.now().toString());
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">

      {/* Soft Islamic Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/patterns/islamic-pattern.svg')] bg-repeat bg-center opacity-[0.035] dark:opacity-[0.06]"
      />

      {/* Install Banner - On Homepage */}
      {showInstallBanner && (
        <div className="relative z-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Smartphone size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Pakua EASTCMSA App!</p>
                  <p className="text-xs text-white/80">Pata matumizi bora, inafanya kazi offline</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <Download size={16} />
                  Pakua Sasa
                </button>
                <button
                  onClick={handleDismissBanner}
                  className="text-white/80 hover:text-white text-sm px-3 py-2 transition"
                >
                  Sio Sasa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <HeroSection currentTime={currentTime} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
        <RotatingWisdom />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">
            <CampusSlider />
            <FullSchedule />
            <NextDarsa />
            <HomeContact />
            <RegisterCTA />
            <SocialLinks />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm p-4">
              <IslamicCalendar />
            </div>
            <div className="rounded-xl bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm p-4">
              <PrayerTimes />
            </div>
            <div className="rounded-xl bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm p-4">
              <LiveQuran />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}