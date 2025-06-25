'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    // Auto-logout on token expiry or refresh failure
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
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
            }, 60 * 60 * 1000) // 1 hour
        }

        // Start the timer initially
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
        <div className="min-h-screen flex flex-col">
            <nav className="bg-[#1B1F3B] text-white flex gap-4 p-4 text-sm font-medium shadow-md overflow-x-auto whitespace-nowrap">
                <div className="flex items-center gap-4 px-4 py-2 min-w-max">
                    <span className="text-base font-semibold mr-6 whitespace-nowrap">S&J Boda – Planner</span>
                    <Link href="/admin/guests" className="hover:underline inline-block min-w-fit">🎫 Invitados</Link>
                    <Link href="/admin/venues/church" className="hover:underline inline-block min-w-fit">🏛️ Iglesia</Link>
                    <Link href="/admin/venues/party" className="hover:underline inline-block min-w-fit">🎉 Fiesta</Link>
                    <Link href="/admin/budget" className="hover:underline inline-block min-w-fit">💰 Presupuesto</Link>
                    <Link href="/admin/payments" className="hover:underline inline-block min-w-fit">💳 Pagos</Link>
                    <Link href="/admin/checklist" className="hover:underline inline-block min-w-fit">📅 Checklist</Link>
                    <button
                        onClick={handleLogout}
                        className="ml-8 bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>
            <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
    )
}