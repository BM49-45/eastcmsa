'use client'

import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactInfo() {
  const contactInfo = [
    { icon: <MapPin size={24} className="text-gray-200"/>, title: "Mahali", details: ["Msikiti Mkuu wa Changanyikeni", "EASTC, Ubungo", "Dar es Salaam, Tanzania"] },
    { icon: <Phone size={24} className="text-gray-200"/>, title: "Simu", details: ["+255 762 760 095", "+255 773 032 461"] },
    { icon: <Mail size={24} className="text-gray-200"/>, title: "Barua Pepe", details: ["eastcmsa@protonmail.com"] }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {contactInfo.map((info, idx) => (
        <div key={idx} className="bg-gray-800/70 dark:bg-gray-900/50 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-700 rounded-lg">{info.icon}</div>
            <h3 className="font-bold text-lg">{info.title}</h3>
          </div>
          <div className="space-y-1 text-sm">
            {info.details.map((d, i) => (
              <p key={i}>{d}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
