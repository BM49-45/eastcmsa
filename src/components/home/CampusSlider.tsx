'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface CampusImage {
  src: string;
  caption: string;
  location: string;
}

const campusImages: CampusImage[] = [
  {
    src: "/eastc.jpeg",
    caption: "EASTC Campus - Main Building",
    location: "Changanyikeni, Dar es Salaam"
  },
  {
    src: "/eastc1.jpeg",
    caption: "Library & Resource Center",
    location: "Changanyikeni, Dar es Salaam"
  },
  {
    src: "/eastc2.jpeg",
    caption: "Students' Lounge Area",
    location: "Changanyikeni, Dar es Salaam"
  }
];

export default function CampusSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (campusImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % campusImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const goToSlide = (index: number) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % campusImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + campusImages.length) % campusImages.length);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-xl h-72 md:h-80 group">

      {/* Images */}
      {campusImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img.src}
            alt={img.caption}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      ))}

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-lg">
          <MapPin className="w-4 h-4 text-white" />
          <div>
            <p className="text-sm font-medium text-white">{campusImages[currentIndex].caption}</p>
            <p className="text-xs text-white/90">{campusImages[currentIndex].location}</p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {campusImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentIndex
                ? "w-5 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
