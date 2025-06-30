'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RSVPPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token') || ''
    const [guest, setGuest] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const [form, setForm] = useState({
        asistencia: '',
        nombre: '',
        email: '',
        numero_invitados: 1,
        alergias: '',
    })

    useEffect(() => {
        if (!token) {
            setError('No se encontró tu invitación personalizada.')
            setLoading(false)
            return
        }
        const fetchGuest = async () => {
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .eq('invite_token', token)
                .single()
            if (error || !data) {
                setError('Invitación no válida.')
                setLoading(false)
                return
            }
            setGuest(data)
            setForm((prev) => ({
                ...prev,
                nombre: data.name,
                email: data.email,
                numero_invitados: data.guest_count,
            }))
            setLoading(false)
        }
        fetchGuest()
    }, [token])

    const handleRSVP = async (e: React.FormEvent) => {
        e.preventDefault()
        // Optional: validate form fields
        const { error } = await supabase
            .from('guests')
            .update({
                confirmed: true,
                asistencia: form.asistencia,
                nombre: form.nombre,
                email: form.email,
                numero_confirmados: form.numero_invitados,
                alergias: form.alergias,
            })
            .eq('invite_token', token)
        if (!error) setConfirmed(true)
        else alert('Error al confirmar asistencia')
    }

    if (loading) return <div className="p-10">Cargando...</div>
    if (error) return <div className="p-10 text-red-600">{error}</div>
    if (confirmed) return (
        <div className="p-10 text-green-700 text-xl">
            ¡Gracias por confirmar tu asistencia, {form.nombre.split(' ')[0]}!
        </div>
    )

    return (
        <main className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
            <div className="bg-white/90 p-8 rounded-2xl shadow-lg max-w-xl w-full">
                <h2 className="text-3xl font-bold mb-4 text-center">Confirma tu asistencia</h2>
                <form onSubmit={handleRSVP} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Nombre</label>
                        <input
                            className="border px-3 py-2 w-full rounded"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            className="border px-3 py-2 w-full rounded"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">¿Podrás asistir?</label>
                        <select
                            className="border px-3 py-2 w-full rounded"
                            value={form.asistencia}
                            onChange={(e) => setForm({ ...form, asistencia: e.target.value })}
                            required
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="sí">Sí, asistiré</option>
                            <option value="no">No podré asistir</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Número de asistentes permitidos
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={guest.guest_count}
                            className="border px-3 py-2 w-full rounded"
                            value={form.numero_invitados}
                            onChange={(e) => setForm({ ...form, numero_invitados: +e.target.value })}
                            required
                        />
                        <div className="text-xs text-gray-600">
                            Tu invitación es válida para <span className="font-semibold">{guest.guest_count}</span> personas.
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">¿Alergias o comentarios?</label>
                        <input
                            className="border px-3 py-2 w-full rounded"
                            value={form.alergias}
                            onChange={(e) => setForm({ ...form, alergias: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 py-3 bg-rosewood text-white rounded shadow-lg font-semibold hover:bg-cherry transition"
                    >
                        Confirmar asistencia
                    </button>
                </form>
            </div>
        </main>
    )
}