import './globals.css'
import { Italianno, Bodoni_Moda, Luxurious_Script } from 'next/font/google'

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${bodoni.variable} ${italianno.variable}, ${luxury.variable}  } bg-[url('/background-wedding3.jpg')] bg-cover bg-fixed bg-center text-cocoa font-bodoni`}>
        {children}

        <footer className="bg-[#173039] border-t-[3px] border-[#DAC5AC] text-white text-center py-6 text-sm mt-12 w-full">
          <p className="italic text-lg mb-1 text-white drop-shadow">
            Aprobado por Chayanne, Chester y Henry
          </p>
          <p className="text-xs font-bodoni text-[173039] tracking-wider">
            &copy; {new Date().getFullYear()} Susana & Javier
          </p>
        </footer>
      </body>
    </html>
  )
}