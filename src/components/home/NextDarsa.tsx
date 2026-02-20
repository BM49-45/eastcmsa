'use client'

import React, { useEffect, useState } from "react";
import { MapPin, User, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface Darsa {
  day: string;
  dayEn: string;
  somo: string;
  eneo: string;
  mfundishaji: string;
  mfundishajiAr: string;
  time: string; // format HH:mm
}

const darsaSchedule: Darsa[] = [
  { day: "JUMAMOSI", dayEn: "Saturday", somo: "TAWHID", eneo: "MSIKITI MDOGO", mfundishaji: "SHEIKH ABUU MUSAB AT-TANZANI", mfundishajiAr: "الشيخ أبو مصعب التنزاني", time: "18:30" },
  { day: "JUMATATU", dayEn: "Monday", somo: "FIQHI", eneo: "MSIKITI MDOGO", mfundishaji: "SHEIKH FADHL ADAM", mfundishajiAr: "الشيخ فضل آدم", time: "18:30" },
  { day: "JUMANNE", dayEn: "Tuesday", somo: "SIIRAH", eneo: "MSIKITI MKUBWA", mfundishaji: "SHEIKH IDDY", mfundishajiAr: "الشيخ عدي", time: "18:30" },
  { day: "JUMATANO", dayEn: "Wednesday", somo: "SIIRAH", eneo: "MSIKITI MKUBWA", mfundishaji: "SHEIKH IDDY", mfundishajiAr: "الشيخ عدي", time: "18:30" },
  { day: "ALHAMISI", dayEn: "Thursday", somo: "FIQH", eneo: "MSIKITI MDOGO", mfundishaji: "SHEIKH FADHL ADAM", mfundishajiAr: "الشيخ فضل آدم", time: "18:30" },
];

const dayMap: Record<string, string> = {
  Sunday: "JUMAPILI",
  Monday: "JUMATATU",
  Tuesday: "JUMANNE",
  Wednesday: "JUMATANO",
  Thursday: "ALHAMISI",
  Friday: "IJUMAA",
  Saturday: "JUMAMOSI"
};

export default function NextDarsa() {
  const [nextDarsa, setNextDarsa] = useState<Darsa | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const dayEn = now.toLocaleDateString("en-US", { weekday: "long" });
    let today = dayMap[dayEn];

    let todayIndex = darsaSchedule.findIndex(d => d.day === today);
    if (todayIndex === -1) todayIndex = 0;
    setNextDarsa(darsaSchedule[todayIndex]);
  }, []);

  useEffect(() => {
    if (!nextDarsa) return;

    const interval = setInterval(() => {
      const now = new Date();
      const [hour, minute] = nextDarsa.time.split(":").map(Number);
      const darsaDate = new Date(now);
      darsaDate.setHours(hour, minute, 0, 0);
      if (darsaDate.getTime() < now.getTime()) darsaDate.setDate(darsaDate.getDate() + 7);

      const diff = darsaDate.getTime() - now.getTime();
      const h = Math.floor(diff / 1000 / 60 / 60);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextDarsa]);

  if (!nextDarsa) return null;

  return (
    <div className="bg-gradient-to-r from-pink-700 to-gray-900 p-4 rounded-xl shadow-lg text-white hover:from-pink-600 hover:to-gray-800 transition-all mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="font-semibold">{nextDarsa.day}</span>
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs">
          <Clock className="w-3 h-3" />
          {nextDarsa.time}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2">{nextDarsa.somo}</h3>

      <div className="space-y-2 text-sm text-white/90">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{nextDarsa.mfundishaji}, <span className="font-arabic">حافظه الله</span></span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{nextDarsa.eneo}</span>
        </div>
      </div>

      <div className="mt-3 text-xs bg-white/20 rounded-lg p-2 text-center font-mono">
        Muda hadi darsa: <span className="font-bold">{countdown}</span>
      </div>
    </div>
  );
}
