import React from "react";
import { Youtube, Instagram, MessageCircle, Globe, Mail } from "lucide-react";
import Link from "next/link";

const socialPlatforms = [
  {
    name: "YouTube",
    icon: <Youtube className="w-4 h-4" />,
    handle: "@eastcmsa",
    url: "https://youtube.com/@eastcmsa",
    bg: "from-red-500 to-red-600"
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-4 h-4" />,
    handle: "@eastcmsa",
    url: "https://instagram.com/eastcmsa",
    bg: "from-pink-500 to-purple-600"
  },
  {
    name: "WhatsApp",
    icon: <MessageCircle className="w-4 h-4" />,
    handle: "EASTCMSA Channel",
    url: "https://whatsapp.com/channel/0029VbC8YONIN9ig2UvBQr2P",
    bg: "from-green-500 to-green-600"
  },
  {
    name: "Email",
    icon: <Mail className="w-4 h-4" />,
    handle: "eastcmsa@protonmail.com",
    url: "mailto:eastcmsa@protonmail.com",
    bg: "from-blue-500 to-blue-600"
  },
  {
    name: "Website",
    icon: <Globe className="w-4 h-4" />,
    handle: "eastcmsa.org",
    url: "https://eastcmsa.org",
    bg: "from-emerald-500 to-emerald-600"
  }
];

export default function SocialLinks() {
  return (
    <div className="w-56 space-y-2">
      {socialPlatforms.map((platform, i) => (
        <Link
          key={i}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 p-2 rounded-lg text-white text-xs bg-gradient-to-r ${platform.bg} hover:shadow-md transition-transform transform hover:scale-105`}
        >
          <div className="bg-white/20 p-1.5 rounded flex-shrink-0">
            {platform.icon}
          </div>
          <div className="truncate">
            <p className="font-medium">{platform.handle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
