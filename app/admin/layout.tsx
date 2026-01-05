'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname()
    const isActive = pathname?.startsWith(href)

    return (
        <Link
            href={href}
            className={`
                inline-block min-w-fit px-3 py-2 rounded-md transition-all duration-200
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
            {/* Updated Navigation with Wedding Theme */}
            <nav className="bg-gradient-to-r from-wedding-burgundy-dark via-wedding-burgundy to-wedding-burgundy-dark text-white shadow-wedding-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between py-3">
                        {/* Logo/Title */}
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-luxury text-warm-cream">S&J</span>
                            <span className="text-sm font-light text-warm-cream/80">Wedding Planner</span>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-2 overflow-x-auto">
                            <NavLink href="/admin/guests">🎫 Invitados</NavLink>
                            <NavLink href="/admin/venues/church">🏛️ Iglesia</NavLink>
                            <NavLink href="/admin/venues/party">🎉 Fiesta</NavLink>
                            <NavLink href="/admin/budget">💰 Presupuesto</NavLink>
                            <NavLink href="/admin/payments">💳 Pagos</NavLink>
                            <NavLink href="/admin/checklist">📅 Checklist</NavLink>
                            <NavLink href="/admin/inventario">🍷 Inventario</NavLink>
                            <NavLink href="/admin/seating">🪑 Mesas</NavLink>
                            <NavLink href="/admin/witness">🎭 Dinámica</NavLink>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-wedding-blush py-4 px-6">
                <div className="max-w-7xl mx-auto text-center text-sm text-stone-500">
                    <p>Wedding Planner © {new Date().getFullYear()} - Susana & Javier</p>
                </div>
            </footer>
        </div>
    )
}