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

export const metadata = {
  title: 'Boda Susana & Javier',
  description: 'Nuestra invitación de boda',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <BodyWrapper fontClasses={`${bodoni.variable} ${italianno.variable} ${luxury.variable}`}>
        {children}

        <footer className="bg-gradient-to-b from-stone-50 to-white border-t border-stone-200 text-stone-600 text-center py-12 mt-16 w-full">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <p className="text-lg font-light text-stone-500">
              Aprobado por Chayanne, Chester y Henry
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300" />
              <svg className="w-4 h-4 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300" />
            </div>
            <p className="text-sm font-light tracking-wider text-stone-400">
              © {new Date().getFullYear()} Susana & Javier
            </p>
          </div>
        </footer>
      </BodyWrapper>
    </html>
  )
}