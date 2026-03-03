'use client'

import React from "react";
import { Clock, MapPin, PlayCircle, Star, Globe } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  currentTime: string;
}

export default function HeroSection({ currentTime }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-green-800 to-emerald-900 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Jambo la Mwanzo, ni Elimu</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              EASTCMSA Islamic Portal
            </span>
          </h1>

          <p className="text-lg md:text-xl opacity-90 mb-6">
            Chuo cha Takwimu Mashariki mwa Afrika
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{currentTime} EAT</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Dar es Salaam, Tanzania</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
            <Link
              href="/lectures"
              className="px-6 py-3 bg-white text-green-900 rounded-xl font-bold hover:shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105 hover:bg-emerald-50"
            >
              <PlayCircle className="w-5 h-5" /> 
              <span>Anza Kusikiliza</span>
            </Link>

            <Link
              href="/about"
              className="px-6 py-3 border-2 border-white rounded-xl font-bold hover:bg-white/10 flex items-center justify-center gap-2 transition-all hover:border-emerald-200"
            >
              <Globe className="w-5 h-5" /> 
              <span>Jua Zaidi</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
