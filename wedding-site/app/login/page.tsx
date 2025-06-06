'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            router.push('/admin/guests')
        }
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
                <button type="submit" className="w-full bg-rosewood text-white py-2 rounded hover:bg-cherry transition">
                    Entrar
                </button>
            </form>
        </main>
    )
}