"use client";

import { useState, useEffect } from 'react';
import { X, MapPin, Clock, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface EventPopupProps {
  title: string;
  content: string;
  date?: string;
  time?: string;
  location?: string;
  speaker?: string;
  onClose: () => void;
}

export default function EventPopup({
  title,
  content,
  date,
  time,
  location,
  speaker,
  onClose,
}: EventPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      // Store in localStorage that user closed it
      localStorage.setItem('muhadhara_popup_closed', 'true');
      localStorage.setItem('muhadhara_popup_closed_time', Date.now().toString());
    }, 300);
  };

  // Check if user closed it within last minute (60 seconds)
  useEffect(() => {
    const wasClosed = localStorage.getItem('muhadhara_popup_closed');
    const closedTime = localStorage.getItem('muhadhara_popup_closed_time');
    const oneMinutePassed = closedTime && (Date.now() - parseInt(closedTime)) > 60000;
    
    // If closed less than a minute ago, don't show
    if (wasClosed === 'true' && !oneMinutePassed) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 max-w-sm w-full md:w-96 transform transition-all duration-500 ${
        isExiting ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-2xl overflow-hidden border border-emerald-400/30">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-700 to-teal-800 px-4 py-3">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl animate-bounce">📢</span>
              <h3 className="text-white font-bold text-sm md:text-base">{title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-white/95 dark:bg-gray-900/95">
          {/* Main message */}
          <div className="mb-3">
            <p className={`text-gray-800 dark:text-gray-200 font-semibold text-sm md:text-base leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {content}
            </p>
            {content.length > 80 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 hover:underline"
              >
                {isExpanded ? (
                  <>Soma kidogo <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Soma zaidi <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-1.5 text-xs">
            {date && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">Tarehe:</span>
                <span>{date}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">Muda:</span>
                <span>{time}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">Mahali:</span>
                <span className="truncate">{location}</span>
              </div>
            )}
            {speaker && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">Muhadhiri:</span>
                <span className="text-amber-700 dark:text-amber-400 font-medium truncate">{speaker}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              ◈ EASTCMSA | ◈ Funga kwa kubonyeza X
            </p>
          </div>
        </div>

        {/* Pulse indicator - shows it's live */}
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute top-0" />
          </div>
        </div>
      </div>
    </div>
  );
}