'use client'

/**
 * app/admin/layout.tsx
 *
 * What changed:
 * - Reads `sj_user_role` from sessionStorage (set by login page).
 * - If no role is cached yet, fetches it from `public.profiles` once.
 * - 'planner' role:
 *     • Sees only the Invitados, Mesas, and Inventario nav links.
 *     • Is redirected to /admin/guests if they try to visit any
 *       other /admin/* route directly (URL bar, back button, etc.).
 * - 'admin' role: unchanged, sees everything.
 * - Nothing else changed.
 */

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'

// Routes a 'planner' is allowed to visit
const PLANNER_ALLOWED = ['/admin/guests', '/admin/seating', '/admin/inventario']

type Role = 'admin' | 'planner'

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
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [role, setRole] = useState<Role | null>(null)

    // ── Resolve role ──────────────────────────────────────────────────────
    useEffect(() => {
        ; (async () => {
            // Fast path: already stored by the login page
            const cached = sessionStorage.getItem('sj_user_role') as Role | null
            if (cached) { setRole(cached); return }

            // Slower path: fresh tab or hard refresh — fetch from Supabase
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.push('/login'); return }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()

            const resolved = (profile?.role ?? 'admin') as Role
            sessionStorage.setItem('sj_user_role', resolved)
            setRole(resolved)
        })()
    }, [router])

    // ── Guard: redirect planner away from restricted routes ──────────────
    useEffect(() => {
        if (role !== 'planner') return
        const allowed = PLANNER_ALLOWED.some(r => pathname?.startsWith(r))
        if (!allowed) router.replace('/admin/guests')
    }, [role, pathname, router])

    // ── Auth state listener (sign-out / token expiry) ─────────────────────
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT' || (event as any) === 'TOKEN_REFRESH_FAILED') {
                sessionStorage.removeItem('sj_user_role')
                router.push('/login')
            }
        })
        return () => authListener.subscription.unsubscribe()
    }, [router])

    // ── Scroll detection ──────────────────────────────────────────────────
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', fn)
        return () => window.removeEventListener('scroll', fn)
    }, [])

    // ── Inactivity auto-logout (1 hour) ───────────────────────────────────
    useEffect(() => {
        let timer: NodeJS.Timeout
        const reset = () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                sessionStorage.removeItem('sj_user_role')
                supabase.auth.signOut()
                router.push('/login')
            }, 60 * 60 * 1000)
        }
        reset()
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
        events.forEach(ev => window.addEventListener(ev, reset))
        return () => {
            clearTimeout(timer)
            events.forEach(ev => window.removeEventListener(ev, reset))
        }
    }, [router])

    // ── Manual logout ─────────────────────────────────────────────────────
    const handleLogout = async () => {
        sessionStorage.removeItem('sj_user_role')
        await supabase.auth.signOut()
        router.push('/login')
    }

    // ── Render: show nothing until role is resolved (avoids flash) ────────
    if (!role) return null

    const isPlanner = role === 'planner'

    return (
        <div className="min-h-screen flex flex-col bg-warm-cream">
            {/* Compact Responsive Navigation */}
            <nav className={`
                bg-gradient-to-r from-wedding-burgundy-dark via-wedding-burgundy to-wedding-burgundy-dark 
                text-white shadow-wedding-lg sticky top-0 z-50 transition-all duration-300
                ${scrolled ? 'py-1' : 'py-2 sm:py-3'}
            `}>
                <div className="max-w-full px-2 sm:px-4">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        {/* Logo */}
                        <div className={`
                            flex items-center gap-1 sm:gap-2 flex-shrink-0 transition-all duration-300
                            ${scrolled ? 'text-base' : 'text-lg sm:text-xl'}
                        `}>
                            <span className="font-luxury text-warm-cream">S&J</span>
                            {!scrolled && (
                                <span className="hidden sm:inline text-xs sm:text-sm font-light text-warm-cream/80">
                                    {isPlanner ? 'Wedding Planner' : 'Admin'}
                                </span>
                            )}
                        </div>

                        {/* Nav links — filtered by role */}
                        <div className={`
                            flex items-center gap-1 sm:gap-2 flex-wrap justify-center flex-1 transition-all duration-300
                            ${scrolled ? 'max-h-8 overflow-hidden' : 'max-h-20'}
                        `}>
                            {/* Shared by both roles */}
                            <NavLink href="/admin/guests">🎫 <span className="hidden sm:inline">Invitados</span></NavLink>
                            <NavLink href="/admin/seating">🪑 <span className="hidden lg:inline">Mesas</span></NavLink>
                            <NavLink href="/admin/inventario">🍷 <span className="hidden lg:inline">Inventario</span></NavLink>

                            {/* Admin-only */}
                            {!isPlanner && (
                                <>
                                    <NavLink href="/admin/venues/church">🏛️ <span className="hidden sm:inline">Iglesia</span></NavLink>
                                    <NavLink href="/admin/venues/party">🎉 <span className="hidden sm:inline">Fiesta</span></NavLink>
                                    <NavLink href="/admin/budget">💰 <span className="hidden sm:inline">Presupuesto</span></NavLink>
                                    <NavLink href="/admin/payments">💳 <span className="hidden sm:inline">Pagos</span></NavLink>
                                    <NavLink href="/admin/checklist">📅 <span className="hidden lg:inline">Checklist</span></NavLink>
                                </>
                            )}
                        </div>

                        {/* Logout */}
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

            {/* Footer */}
            <footer className="bg-white border-t border-wedding-blush py-2 sm:py-4 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm text-stone-500">
                    <p>Wedding Planner © {new Date().getFullYear()} - Susana & Javier</p>
                </div>
            </footer>
        </div>
    )
}