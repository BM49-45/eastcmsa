import React, { useState, useEffect } from "react";
import { Clock, Bell, Calendar, MapPin, User, BookOpen } from "lucide-react";

interface Darsa {
  day: string;
  kitabu: string;
  kitabuAr: string;
  somo: string;
  eneo: string;
  mfundishaji: string;
  time: string;
}

const darsaSchedule: Darsa[] = [
  {
    day: "JUMAMOSI",
    kitabu: "اللهُ أَشْهَدُ لِلَّهِ",
    kitabuAr: "Allahu Ashhadu Lillah",
    somo: "TAWHID",
    eneo: "MSIKITI MDOGO",
    mfundishaji: "SHEIKH ABUU MUSAB",
    time: "18:45"
  },
  {
    day: "JUMATATU",
    kitabu: "اللهُ أَعْلَمُ",
    kitabuAr: "Allahu A'lam",
    somo: "FIQHI",
    eneo: "MSIKITI MDOGO",
    mfundishaji: "SHEIKH FADHL ADAM",
    time: "18:45"
  },
  {
    day: "JUMANNE",
    kitabu: "اللهُ نَزَّلَهُ النَّبِيُّ",
    kitabuAr: "Allahu Nazzalahu An-Nabi",
    somo: "SIIRAH",
    eneo: "MSIKITI MKUBWA",
    mfundishaji: "SHEIKH IDDY",
    time: "18:45"
  },
  {
    day: "JUMATANO",
    kitabu: "اللهُ أَعْلَمُ",
    kitabuAr: "Allahu A'lam",
    somo: "SIIRAH",
    eneo: "MSIKITI MKUBWA",
    mfundishaji: "SHEIKH IDDY",
    time: "18:45"
  },
  {
    day: "ALHAMISI",
    kitabu: "اللهُ أَعْلَمُ",
    kitabuAr: "Allahu A'lam",
    somo: "FIQH",
    eneo: "MSIKITI MDOGO",
    mfundishaji: "SHEIKH FADHL ADAM",
    time: "18:45"
  }
];

const dayMap: { [key: string]: string } = {
  "Monday": "JUMATATU",
  "Tuesday": "JUMANNE",
  "Wednesday": "JUMATANO",
  "Thursday": "ALHAMISI",
  "Friday": "IJUMAA",
  "Saturday": "JUMAMOSI",
  "Sunday": "JUMAPILI"
};

export default function NextDarsaCountdown() {
  const [nextDarsa, setNextDarsa] = useState<Darsa | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    const findNextDarsa = () => {
      const now = new Date();
      const dayEn = now.toLocaleDateString("en-US", { weekday: "long" });
      const today = dayMap[dayEn];
      
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      const darsaTimeInMinutes = 18 * 60 + 45;

      const todayDarsa = darsaSchedule.find(d => d.day === today);
      
      if (todayDarsa && currentTimeInMinutes < darsaTimeInMinutes) {
        setNextDarsa(todayDarsa);
      } else {
        const todayIndex = darsaSchedule.findIndex(d => d.day === today);
        const tomorrowIndex = (todayIndex + 1) % darsaSchedule.length;
        setNextDarsa(darsaSchedule[tomorrowIndex]);
      }
    };

    findNextDarsa();
    const interval = setInterval(findNextDarsa, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!nextDarsa) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const target = new Date();
      const [hours, minutes] = nextDarsa.time.split(':').map(Number);
      target.setHours(hours, minutes, 0);

      if (target < now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      const hoursRem = Math.floor(diff / (1000 * 60 * 60));
      const minutesRem = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsRem = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({
        hours: hoursRem,
        minutes: minutesRem,
        seconds: secondsRem
      });
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [nextDarsa]);

  if (!nextDarsa) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <h3 className="text-sm font-bold">Darsa Inayofuata</h3>
          </div>
          <button
            onClick={() => setReminder(!reminder)}
            className={`p-1 rounded-lg transition-colors ${
              reminder 
                ? 'bg-white/30 text-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label={reminder ? "Remove reminder" : "Set reminder"}
            title={reminder ? "Ondoa ukumbusho" : "Weka ukumbusho"}
          >
            <Bell className={`w-3.5 h-3.5 ${reminder ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="text-center mb-2">
          <div className="text-xl font-bold font-mono">
            {String(timeRemaining.hours).padStart(2, '0')}:
            {String(timeRemaining.minutes).padStart(2, '0')}:
            {String(timeRemaining.seconds).padStart(2, '0')}
          </div>
          <p className="text-[10px] text-emerald-200">imesalia</p>
        </div>

        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm text-xs">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3" />
            <span className="text-[10px] font-medium">{nextDarsa.day} {nextDarsa.time}</span>
          </div>

          <h4 className="font-bold text-sm mb-0.5">{nextDarsa.kitabu}</h4>
          <p className="text-[10px] font-arabic mb-1 text-emerald-100" dir="rtl">
            {nextDarsa.kitabuAr}
          </p>

          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <div className="flex items-center gap-1">
              <BookOpen className="w-2.5 h-2.5" />
              <span>{nextDarsa.somo}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-2.5 h-2.5" />
              <span className="truncate">{nextDarsa.mfundishaji}</span>
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <MapPin className="w-2.5 h-2.5" />
              <span>{nextDarsa.eneo}</span>
            </div>
          </div>
        </div>

        {reminder && (
          <p className="text-[10px] text-center text-emerald-200 mt-1 animate-pulse">
            ✓ Utakumbushwa dakika 10 kabla
          </p>
        )}
      </div>
    </div>
  );
}