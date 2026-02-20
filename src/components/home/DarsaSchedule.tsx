'use client'

import React, { useState } from "react";
import { Clock, PlayCircle } from "lucide-react";

interface Darsa {
  day: string;
  kitab: string;
  somo: string;
  mwalimu: string;
  eneo: string;
}

const darsas: Darsa[] = [
  { day: "Jumamosi", kitab: "الأصول الست", somo: "Tawḥīd", mwalimu: "Sheikh Abuu Musab At-Tanzania", eneo: "Msikiti Mdogo" },
  { day: "Jumatatu", kitab: "عدة الأحكام", somo: "Fiqh", mwalimu: "Sheikh Fadhil Adam", eneo: "Msikiti Mdogo" },
  { day: "Jumanne", kitab: "خلاصة نور اليقين", somo: "Siirah", mwalimu: "Sheikh Iddy", eneo: "Msikiti Mkubwa" },
  { day: "Jumatano", kitab: "خلاصة نور اليقين", somo: "Siirah", mwalimu: "Sheikh Iddy", eneo: "Msikiti Mkubwa" },
  { day: "Alhamisi", kitab: "عدة الأحكام", somo: "Fiqh", mwalimu: "Sheikh Fadhil Adam", eneo: "Msikiti Mdogo" },
];

export default function FullSchedule() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="text-green-600" /> Ratiba ya Darsa
      </h2>

      <div className="space-y-2">
        {darsas.map((darsa, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleOpen(index)}
              className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <div className="text-left">
                <p className="font-medium">{darsa.day} - {darsa.somo}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{darsa.kitab}</p>
              </div>
              <PlayCircle className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-90" : ""}`} />
            </button>

            {openIndex === index && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm">
                <p><strong>Mwalimu:</strong> {darsa.mwalimu}</p>
                <p><strong>Eneo:</strong> {darsa.eneo}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
