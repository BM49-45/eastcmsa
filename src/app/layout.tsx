import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ThemeToggle from '@/components/ThemeToggle'
import Announcement from '@/components/Announcement'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EASTCMSA - Islamic Knowledge Portal',
  description: 'Elimu hupatikana kwa kuisoma',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sw" suppressHydrationWarning>
      <head>
        {/* This script runs before hydration to remove extension attributes */}
        <Script id="remove-extension-attributes" strategy="beforeInteractive">
          {`
            (function() {
              // Function to clean extension attributes
              function cleanExtensionAttributes() {
                if (typeof document === 'undefined') return;
                
                const body = document.body;
                const html = document.documentElement;
                
                // List of extension attributes to remove
                const extensionAttributes = [
                  'data-new-gr-c-s-check-loaded',
                  'data-gr-ext-installed',
                  'data-new-gr-c-s-loaded',
                  'data-grammarly-shadow-root',
                  'data-grammarly-id'
                ];
                
                // Remove from html element
                extensionAttributes.forEach(attr => {
                  if (html.hasAttribute(attr)) {
                    html.removeAttribute(attr);
                  }
                });
                
                // Remove from body element
                extensionAttributes.forEach(attr => {
                  if (body.hasAttribute(attr)) {
                    body.removeAttribute(attr);
                  }
                });
              }
              
              // Run immediately
              cleanExtensionAttributes();
              
              // Run after a short delay to catch any late additions
              setTimeout(cleanExtensionAttributes, 100);
              setTimeout(cleanExtensionAttributes, 500);
              
              // Set up a mutation observer to catch any new attributes
              if (typeof window !== 'undefined' && window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                  let shouldClean = false;
                  
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes') {
                      const attrName = mutation.attributeName;
                      if (attrName && (
                        attrName.includes('gr-c-') || 
                        attrName.includes('gr-ext-') || 
                        attrName.includes('grammarly')
                      )) {
                        shouldClean = true;
                      }
                    }
                  });
                  
                  if (shouldClean) {
                    cleanExtensionAttributes();
                  }
                });
                
                // Start observing after DOM is ready
                document.addEventListener('DOMContentLoaded', () => {
                  observer.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'data-grammarly-shadow-root']
                  });
                  
                  observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'data-grammarly-shadow-root']
                  });
                });
              }
            })();
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <ThemeToggle/>
          <Navbar />
          <main className="min-h-screen pt-16">
            <Announcement />
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}