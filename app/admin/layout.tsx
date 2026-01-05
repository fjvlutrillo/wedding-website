'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname()
    const isActive = pathname?.startsWith(href)

    return (
        <Link
            href={href}
            className={`
                inline-block min-w-fit px-2 py-1.5 rounded-md transition-all duration-200 text-xs sm:text-sm
                ${isActive
                    ? 'bg-wedding-burgundy text-white font-medium shadow-md'
                    : 'text-warm-cream hover:bg-wedding-burgundy-light hover:text-white'
                }
            `}
        >
            {children}
        </Link>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [scrolled, setScrolled] = useState(false)

    // Auto-logout on token expiry or refresh failure
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT' || (event as any) === 'TOKEN_REFRESH_FAILED') {
                router.push('/login')
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [router])

    // Detect scroll to shrink header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Auto-logout after 1 hour of inactivity
    useEffect(() => {
        let timer: NodeJS.Timeout

        const resetTimer = () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                supabase.auth.signOut()
                router.push('/login')
            }, 60 * 60 * 1000)
        }

        resetTimer()
        window.addEventListener('mousemove', resetTimer)
        window.addEventListener('keydown', resetTimer)
        window.addEventListener('click', resetTimer)
        window.addEventListener('scroll', resetTimer)
        window.addEventListener('touchstart', resetTimer)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('mousemove', resetTimer)
            window.removeEventListener('keydown', resetTimer)
            window.removeEventListener('click', resetTimer)
            window.removeEventListener('scroll', resetTimer)
            window.removeEventListener('touchstart', resetTimer)
        }
    }, [router])

    // Manual logout button
    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen flex flex-col bg-warm-cream">
            {/* Compact Responsive Navigation - Shrinks on Scroll */}
            <nav className={`
                bg-gradient-to-r from-wedding-burgundy-dark via-wedding-burgundy to-wedding-burgundy-dark 
                text-white shadow-wedding-lg sticky top-0 z-50 transition-all duration-300
                ${scrolled ? 'py-1' : 'py-2 sm:py-3'}
            `}>
                <div className="max-w-full px-2 sm:px-4">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        {/* Logo/Title - Compact */}
                        <div className={`
                            flex items-center gap-1 sm:gap-2 flex-shrink-0 transition-all duration-300
                            ${scrolled ? 'text-base' : 'text-lg sm:text-xl'}
                        `}>
                            <span className="font-luxury text-warm-cream">S&J</span>
                            {!scrolled && (
                                <span className="hidden sm:inline text-xs sm:text-sm font-light text-warm-cream/80">
                                    Wedding Planner
                                </span>
                            )}
                        </div>

                        {/* Navigation Links - Compact with Scroll */}
                        <div className={`
                            flex items-center gap-1 sm:gap-2 flex-wrap justify-center flex-1 transition-all duration-300
                            ${scrolled ? 'max-h-8 overflow-hidden' : 'max-h-20'}
                        `}>
                            <NavLink href="/admin/guests">🎫 <span className="hidden sm:inline">Invitados</span></NavLink>
                            <NavLink href="/admin/venues/church">🏛️ <span className="hidden sm:inline">Iglesia</span></NavLink>
                            <NavLink href="/admin/venues/party">🎉 <span className="hidden sm:inline">Fiesta</span></NavLink>
                            <NavLink href="/admin/budget">💰 <span className="hidden sm:inline">Presupuesto</span></NavLink>
                            <NavLink href="/admin/payments">💳 <span className="hidden sm:inline">Pagos</span></NavLink>
                            <NavLink href="/admin/checklist">📅 <span className="hidden lg:inline">Checklist</span></NavLink>
                            <NavLink href="/admin/inventario">🍷 <span className="hidden lg:inline">Inventario</span></NavLink>
                            <NavLink href="/admin/seating">🪑 <span className="hidden lg:inline">Mesas</span></NavLink>
                        </div>

                        {/* Logout Button - Compact */}
                        <button
                            onClick={handleLogout}
                            className={`
                                flex-shrink-0 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium 
                                transition-all duration-300 shadow-md hover:shadow-lg
                                ${scrolled ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm'}
                            `}
                        >
                            <span className="hidden sm:inline">{scrolled ? 'Salir' : 'Cerrar sesión'}</span>
                            <span className="sm:hidden">🚪</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-3 sm:p-6">
                {children}
            </main>

            {/* Compact Footer */}
            <footer className="bg-white border-t border-wedding-blush py-2 sm:py-4 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm text-stone-500">
                    <p>Wedding Planner © {new Date().getFullYear()} - Susana & Javier</p>
                </div>
            </footer>
        </div>
    )
}