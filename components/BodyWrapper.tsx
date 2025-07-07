'use client'
import { usePathname } from 'next/navigation'

export default function BodyWrapper({
    children,
    fontClasses
}: {
    children: React.ReactNode
    fontClasses: string
}) {
    const pathname = usePathname()
    const isRSVP = pathname?.startsWith('/rsvp')

    return (
        <body
            className={`
        ${fontClasses}
        ${isRSVP
                    ? "bg-[url('/rsvp-bg.jpg')] bg-cover bg-fixed bg-center"
                    : "bg-[url('/background-wedding3.jpg')] bg-cover bg-fixed bg-center"
                }
        text-cocoa font-bodoni min-h-screen
      `}
        >
            {children}
        </body>
    )
}