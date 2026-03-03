export const siteMetadata = {
  title: 'EASTCMSA Islamic Portal - Elimu ya Kiislamu Halisi',
  description: 'Darsa za Tawhiid, Fiqh na Mihadhara kutoka Msikitini wa Changanyikeni, EASTC. Audio, vitabu na rasilimali za Kiislamu kwa lugha mbalimbali.',
  keywords: ['Tawhiid', 'Fiqh', 'Mihadhara', 'EASTC', 'Changanyikeni', 'Islamic', 'Swahili'],
  authors: [{ name: 'EASTCMSA' }],
  creator: 'Bastan',
  publisher: 'EASTCMSA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://eastcmsa.org'),
  alternates: {
    canonical: '/',
    languages: {
      'sw-TZ': '/',
      'en-US': '/en',
      'ar-SA': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'sw_TZ',
    url: 'https://eastcmsa.org',
    title: 'EASTCMSA Islamic Portal',
    description: 'Elimu ya Kiislamu Halisi kutoka Msikitini wa Changanyikeni',
    siteName: 'EASTCMSA',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EASTCMSA Islamic Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EASTCMSA Islamic Portal',
    description: 'Elimu ya Kiislamu Halisi kutoka Msikitini wa Changanyikeni',
    images: ['/images/twitter-image.jpg'],
    creator: '@eastcmsa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification',
  },
}

// Page-specific metadata
export const pageMetadata = {
  home: {
    title: 'Home - EASTCMSA Islamic Portal',
    description: 'Karibu kwenye portal ya Kiislamu ya EASTC. Darsa, vitabu na rasilimali za Kiislamu.',
  },
  tawhiid: {
    title: 'Tawhiid Series - Sheikh Abuu Mus\'ab',
    description: 'Mfululizo kamili wa Tawhiid kwa Sheikh Abuu Mus\'ab At Tanzaniy. Audio 18 za darsa.',
  },
  fiqh: {
    title: 'Fiqh - Manhaju As Saalikin',
    description: 'Masomo ya Fiqh kutoka kwa kitabu cha Manhaju As Saalikin. Ratiba ya darsa za Jumatatu na Alhamisi.',
  },
  lectures: {
    title: 'Mihadhara ya Jumamosa',
    description: 'Mihadhara ya kila Jumamosa katika Msikiti wa Changanyikeni, EASTC.',
  },
  events: {
    title: 'Matukio ya Kiislamu',
    description: 'Ratiba ya matukio yote ya Kiislamu katika EASTC na jumuiya.',
  },
  donate: {
    title: 'Changia Mradi wa Kiislamu',
    description: 'Usaidie kueneza elimu ya Kiislamu kwa vijana na jamii.',
  },
  about: {
    title: 'Kuhusu Sisi - EASTCMSA',
    description: 'Habari kuhusu jumuiya ya Kiislamu ya EASTC na waalimu wetu.',
  },
  contact: {
    title: 'Wasiliana Nasi - EASTCMSA',
    description: 'Wasiliana nasi kwa maswali, maoni au ushirikiano.',
  },
}