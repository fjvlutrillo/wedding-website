'use client'

/**
 * app/login/page.tsx
 *
 * What changed:
 * - After a successful sign-in we fetch the user's row from `public.profiles`
 *   and store the `role` ('admin' | 'planner') in sessionStorage.
 * - Planners are redirected to /admin/guests (the first route they're allowed).
 * - Admins go to /admin/guests as before.
 * - Nothing else changed.
 */

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

        if (signInError || !data.session) {
            setError(signInError?.message ?? 'Error al iniciar sesión')
            setLoading(false)
            return
        }

        // Fetch role from profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single()

        const role = profile?.role ?? 'admin'
        // Store role so the layout can read it without an extra round-trip
        sessionStorage.setItem('sj_user_role', role)

        router.push('/admin/guests')
        setLoading(false)
    }

    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-paper text-wine p-6">
            <h1 className="text-3xl font-bold mb-6">Iniciar sesión</h1>
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    required
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-rosewood text-white py-2 rounded hover:bg-cherry transition disabled:opacity-60"
                >
                    {loading ? 'Entrando…' : 'Entrar'}
                </button>
            </form>
        </main>
    )
}