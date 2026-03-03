import React, { useEffect, useState } from "react";
import { Moon, Calendar } from "lucide-react";

interface DateInfo {
  hijri: string;
  gregorian: string;
  weekDay: string;
  month: string;
  day: number;
}

export default function IslamicCalendar() {
  const [dateInfo, setDateInfo] = useState<DateInfo>({
    hijri: "",
    gregorian: "",
    weekDay: "",
    month: "",
    day: 0
  });

  useEffect(() => {
    const updateDates = () => {
      const now = new Date();
      
      const gregorian = now.toLocaleDateString("sw-TZ", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      const hijriDate = new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(now);

      const weekDay = now.toLocaleDateString("sw-TZ", { weekday: "long" });
      const month = now.toLocaleDateString("sw-TZ", { month: "long" });
      const day = now.getDate();

      setDateInfo({
        gregorian,
        hijri: hijriDate,
        weekDay,
        month,
        day
      });
    };

    updateDates();
    const timer = setInterval(updateDates, 3600000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg overflow-hidden h-full">
      <div className="p-5 text-white h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            <h3 className="font-bold">Kalenda</h3>
          </div>
          <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
            {dateInfo.weekDay}
          </span>
        </div>

        <div className="flex-1 space-y-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
            <p className="text-xs text-emerald-200 mb-1">Hijri</p>
            <p className="text-base font-arabic font-bold" dir="rtl">
              {dateInfo.hijri}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
            <p className="text-xs text-emerald-200 mb-1">Miladia</p>
            <p className="text-sm font-medium">{dateInfo.gregorian}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
              <p className="text-xs text-emerald-200">Mwezi</p>
              <p className="text-sm font-medium">{dateInfo.month}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
              <p className="text-xs text-emerald-200">Siku</p>
              <p className="text-sm font-medium">{dateInfo.day}</p>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[10px] text-emerald-200">
            * Ru'yatil hilal
          </p>
        </div>
      </div>
    </div>
  );
}