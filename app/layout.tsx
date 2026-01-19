import './globals.css'
import { Italianno, Bodoni_Moda, Luxurious_Script } from 'next/font/google'
import BodyWrapper from '@/components/BodyWrapper'

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-italianno',
})

const luxury = Luxurious_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-luxury',
})

const bodoni = Bodoni_Moda({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-bodoni',
})

/**
 * ROOT LAYOUT - SPANISH VERSION (Default)
 * 
 * This handles the Spanish version at https://bodasusanayjavier.com
 * 
 * For bilingual setup:
 * - Spanish (this file): https://bodasusanayjavier.com
 * - English: https://bodasusanayjavier.com/en (needs separate metadata)
 * 
 * Open Graph tags ensure the hero photo shows when sharing on:
 * WhatsApp, iMessage, Facebook, Twitter, LinkedIn, etc.
 */
export const metadata = {
  // Basic metadata
  title: 'Boda Susana & Javier | 6 de Junio, 2026',
  description: 'Te invitamos a celebrar nuestra boda el 6 de Junio, 2026 en Hacienda San Juan Bautista Amalucan, Puebla, México. Por favor confirma tu asistencia.',

  // Favicon
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Optional: for iOS home screen
  },

  // 🌍 OPEN GRAPH TAGS - Spanish Version
  // These control how links appear when shared on social media
  openGraph: {
    title: 'Boda Susana & Javier',
    description: 'Te invitamos a celebrar nuestra boda el 6 de Junio, 2026 en Puebla, México',
    url: 'https://bodasusanayjavier.com',
    siteName: 'Boda Susana & Javier',
    images: [
      {
        url: 'https://bodasusanayjavier.com/hero.jpg', // 🎯 YOUR HERO IMAGE
        width: 1200,
        height: 630,
        alt: 'Susana y Javier - 6 de Junio, 2026 - Puebla, México',
      },
    ],
    locale: 'es_MX',  // Spanish (Mexico)
    type: 'website',
  },

  // 🐦 TWITTER CARD TAGS - Spanish Version
  twitter: {
    card: 'summary_large_image',
    title: 'Boda Susana & Javier',
    description: 'Te invitamos a celebrar nuestra boda el 6 de Junio, 2026 en Puebla, México',
    images: ['https://bodasusanayjavier.com/hero.jpg'], // 🎯 YOUR HERO IMAGE
  },

  // Additional SEO
  keywords: 'boda, wedding, Susana, Javier, Puebla, México, 2026, Hacienda San Juan Bautista Amalucan',
  authors: [{ name: 'Susana & Javier' }],

  // 🔒 Optional: Prevent search engine indexing for privacy
  // Uncomment these lines if you want the wedding site to be private:
  // robots: {
  //   index: false,
  //   follow: false,
  //   nocache: true,
  // },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <BodyWrapper fontClasses={`${bodoni.variable} ${italianno.variable} ${luxury.variable}`}>
        {children}

        <footer className="bg-gradient-to-b from-stone-50 to-white border-t border-stone-200 text-stone-600 text-center py-4 w-full">
          <div className="max-w-4xl mx-auto px-4 space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-stone-300" />
              <svg className="w-3.5 h-3.5 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-stone-300" />
            </div>
            <p className="text-sm font-light tracking-wide text-stone-500">
              © {new Date().getFullYear()} Susana & Javier
            </p>
          </div>
        </footer>
      </BodyWrapper>
    </html>
  )
}