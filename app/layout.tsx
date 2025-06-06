import './globals.css'
import { Inter, Great_Vibes } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
})

export const metadata = {
  title: 'Boda Susana & Javier',
  description: 'Nuestra invitación de boda',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${greatVibes.variable} bg-paper text-wine`}>
        {children}

        {/* Footer */}
        <footer className="bg-[#1B1F3B] text-white text-center py-6 text-sm mt-12 w-full">
          <p className="italic mb-1">
            Aprobado por Chayanne, Chester y Henry
          </p>
          <p>&copy; {new Date().getFullYear()} Susana & Javier</p>
        </footer>
      </body>
    </html>
  )
}