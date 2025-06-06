'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHome = pathname === '/'

    useEffect(() => {
        const header = document.querySelector('.main-header') as HTMLElement

        const handleScroll = () => {
            if (!header) return

            if (window.scrollY < window.innerHeight - 100 && isHome) {
                header.style.display = 'none'
            } else {
                header.style.display = 'flex'
            }
        }

        // Initial check
        handleScroll()
        window.addEventListener('scroll', handleScroll)

        // NEW: If arrow is clicked, show header before scroll
        const arrow = document.querySelector('#scroll-arrow')
        arrow?.addEventListener('click', () => {
            if (isHome) {
                header.style.display = 'flex'
            }
        })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            arrow?.removeEventListener('click', () => header.style.display = 'flex')
        }
    }, [isHome])

    return <div className={!isHome ? 'pt-16' : ''}>{children}</div>
}