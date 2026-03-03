'use client'

import React, { useEffect, useState } from "react";
import { Clock, Bell, Moon, Sun, Sunrise, Sunset } from "lucide-react";

interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
  icon: React.ReactNode;
}

export default function PrayerTimes() {
  const [currentTime, setCurrentTime] = useState("");
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [reminder, setReminder] = useState(false);

  const prayerTimes: PrayerTime[] = [
    { name: "Fajr", nameAr: "الفجر", time: "05:05", icon: <Moon className="w-3.5 h-3.5" /> },
    { name: "Dhuhr", nameAr: "الظهر", time: "12:45", icon: <Sun className="w-3.5 h-3.5" /> },
    { name: "Asr", nameAr: "العصر", time: "15:45", icon: <Sunrise className="w-3.5 h-3.5" /> },
    { name: "Maghrib", nameAr: "المغرب", time: "18:25", icon: <Sunset className="w-3.5 h-3.5" /> },
    { name: "Isha", nameAr: "العشاء", time: "19:45", icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("sw-TZ", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const findNextPrayer = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (const prayer of prayerTimes) {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        const prayerMinutes = hours * 60 + minutes;
        if (prayerMinutes > currentMinutes) {
          setNextPrayer({ name: prayer.name, time: prayer.time });
          return;
        }
      }
      setNextPrayer({ name: "Fajr", time: "05:05" });
    };

    findNextPrayer();
    const interval = setInterval(findNextPrayer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800/70 dark:bg-gray-900/60 rounded-xl shadow-lg overflow-hidden backdrop-blur-md">
      <div className="p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <h2 className="text-sm font-bold">Nyakati za Swala</h2>
          </div>
          <div className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-mono">
            {currentTime || "..."}
          </div>
        </div>

        {nextPrayer && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 mb-2 flex items-center justify-between border border-white/20 text-xs">
            <span className="text-gray-200">Inafuata</span>
            <span className="font-medium">{nextPrayer.name} ({nextPrayer.time})</span>
          </div>
        )}

        <div className="space-y-1 mb-3">
          {prayerTimes.map((prayer, index) => (
            <div key={index} className="flex items-center justify-between p-1.5 hover:bg-white/10 rounded-lg transition-colors border-b border-white/10 last:border-0 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">{prayer.icon}</span>
                <span className="font-medium">{prayer.time}</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{prayer.name}</span>
                <span className="text-[10px] text-gray-300 ml-1 font-arabic">{prayer.nameAr}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setReminder(!reminder)}
          className={`w-full flex items-center justify-center gap-1 p-1.5 rounded-lg transition-all text-xs ${
            reminder ? 'bg-white text-gray-800 hover:bg-gray-100' : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
          }`}
        >
          <Bell className={`w-3.5 h-3.5 ${reminder ? 'fill-current' : ''}`} />
          <span className="text-xs font-medium">{reminder ? "Umekumbushwa" : "Nikumbushe 10' kabla"}</span>
        </button>
      </div>
    </div>
  );
}
