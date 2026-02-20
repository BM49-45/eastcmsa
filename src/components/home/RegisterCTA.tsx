'use client'

import React, { useState } from "react";
import { Mail, Bell, Share2, UserPlus, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterCTA() {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);

  const handleRegister = () => {
    router.push("/register"); // Navigate to register page
  };

  const handleSubscribe = () => {
    setSubscribed(true); // Simple subscribe toggle
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "EASTCMSA Islamic Portal",
        text: "Check out EASTCMSA portal for lectures and updates!",
        url: window.location.href,
      });
    } else {
      // fallback copy link
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-800 to-emerald-900 rounded-2xl shadow-xl p-6 text-white space-y-4">
      
      <div className="mb-2">
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <Bell className="w-5 h-5 text-yellow-300" />
          Jiunge Nasi
        </h3>
        <p className="text-sm text-white/80">
          Pata taarifa za darsa, mawaidha na nyakati za swala moja kwa moja.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
          <Mail className="w-4 h-4 text-white/70" />
          <span className="truncate">eastcmsa@protonmail.com</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
          <Youtube className="w-4 h-4 text-red-400" />
          <span className="truncate">@eastcmsa</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button
          onClick={handleRegister}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-3 rounded-lg font-medium transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Register
        </button>

        <button
          onClick={handleSubscribe}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-3 rounded-lg font-medium transition-all"
        >
          <Bell className="w-4 h-4" />
          {subscribed ? "Subscribed!" : "Subscribe"}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-3 rounded-lg font-medium col-span-2 transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share Our Page
        </button>
      </div>
    </div>
  );
}
