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

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("sw-TZ", { hour12: false, hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">

      {/* Soft Islamic Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/patterns/islamic-pattern.svg')] bg-repeat bg-center opacity-[0.035] dark:opacity-[0.06]"
      />

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
            <HomeContact /> {/* "Tufuate Mitandaoni" removed */}
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
