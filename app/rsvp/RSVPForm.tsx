'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabaseClient' // Update path as needed

export default function RSVPForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    // Status logic
    const [status, setStatus] = useState<'loading' | 'ready' | 'submitted' | 'already' | 'error'>('loading')
    const [guestName, setGuestName] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [confirming, setConfirming] = useState<boolean | null>(null)
    const [guestCount, setGuestCount] = useState(1)
    const [alergias, setAlergias] = useState('')

    // Fetch guest info and response status
    useEffect(() => {
        const fetchGuest = async () => {
            if (!token) {
                setStatus('error')
                return
            }
            // Adjust columns to match your Supabase schema
            const { data, error } = await supabase
                .from('guests')
                .select('nombre, apellido, guest_count, confirmed, confirmed_guests')
                .eq('token', token)
                .single()
            if (error || !data) {
                setStatus('error')
                return
            }
            setGuestName(`${data.nombre} ${data.apellido}`)
            setMaxGuests(data.guest_count || 1)
            // If already responded, lock them out
            if (data.confirmed !== null) {
                setStatus('already')
            } else {
                setStatus('ready')
            }
        }
        fetchGuest()
    }, [token])

    // Handle confirm/decline
    const handleConfirm = () => setConfirming(true)
    const handleDecline = async () => {
        if (!token) return
        setStatus('loading')
        await supabase
            .from('guests')
            .update({ confirmed: false, confirmed_guests: 0 })
            .eq('token', token)
        setStatus('submitted')
        setConfirming(false)
    }

    // Submit confirmation
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return
        setStatus('loading')
        await supabase
            .from('guests')
            .update({
                confirmed: true,
                confirmed_guests: guestCount,
                alergias,
            })
            .eq('token', token)
        setStatus('submitted')
        setConfirming(true)
    }

    return (
        <>
            <Header />
            <div className="relative min-h-screen">
                {/* RSVP background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/rsvp-bg.jpg')",
                        opacity: 0.15,
                        zIndex: 0,
                    }}
                    aria-hidden="true"
                />
                {/* Soft overlay */}
                <div className="absolute inset-0 bg-[#f0dfcc] bg-opacity-80 z-10 pointer-events-none select-none" />
                <main className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 py-20">
                    <section className="w-full max-w-md bg-white/90 text-[#173039] p-8 border-[3px] border-[#E4C3A1] shadow-xl rounded-xl">
                        <h1 className="text-3xl font-bold mb-6 text-center font-luxury text-[#173039]">
                            Confirmar asistencia
                        </h1>

                        {/* Status messages */}
                        {status === 'loading' && <p className="text-center">Cargando...</p>}
                        {status === 'error' && (
                            <p className="text-center text-lg text-[#7B4B38] font-bold mb-4">
                                Invitación no válida o token incorrecto.
                            </p>
                        )}
                        {status === 'already' && (
                            <p className="text-center text-lg text-[#7B4B38] font-bold mb-4">
                                Ya has respondido a esta invitación.<br />
                                ¡Gracias, {guestName}!
                            </p>
                        )}
                        {status === 'submitted' && (
                            <p className="text-center text-lg text-[#173039] font-bold mb-4">
                                ¡Gracias por confirmar tu respuesta!<br />
                                {confirming === false
                                    ? 'Sentimos que no puedas acompañarnos.'
                                    : `¡Nos vemos el 16 de agosto!`}
                            </p>
                        )}

                        {status === 'ready' && confirming === null && (
                            <div className="flex flex-col items-center gap-6">
                                <p className="text-xl font-bodoni">
                                    {guestName
                                        ? `Hola, ${guestName}, ¿podrás acompañarnos?`
                                        : '¿Podrás acompañarnos?'}
                                </p>
                                <div className="flex gap-4 mt-4">
                                    <button
                                        className="bg-[#173039] hover:bg-[#7B4B38] text-[#f0dfcc] font-bold py-3 px-8 rounded-xl shadow-lg transition"
                                        onClick={handleConfirm}
                                    >
                                        Sí, confirmo
                                    </button>
                                    <button
                                        className="bg-[#DAC5AC] hover:bg-[#E4C3A1] text-[#173039] font-bold py-3 px-8 rounded-xl shadow-lg transition"
                                        onClick={handleDecline}
                                    >
                                        No podré asistir
                                    </button>
                                </div>
                            </div>
                        )}

                        {status === 'ready' && confirming === true && (
                            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                                <div className="flex flex-col">
                                    <label htmlFor="guestCount" className="font-medium text-[#173039]">
                                        ¿Cuántas personas asistirán? <span className="text-[#7B4B38]">*</span>
                                    </label>
                                    <select
                                        id="guestCount"
                                        name="guestCount"
                                        required
                                        value={guestCount}
                                        onChange={e => setGuestCount(Number(e.target.value))}
                                        className="mt-1 p-2 border border-[#E4C3A1] rounded bg-white text-[#173039]"
                                    >
                                        {[...Array(maxGuests)].map((_, idx) => (
                                            <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="alergias" className="font-medium text-[#173039]">
                                        ¿Tienes alguna alergia o requerimiento especial?
                                    </label>
                                    <textarea
                                        id="alergias"
                                        name="alergias"
                                        value={alergias}
                                        onChange={e => setAlergias(e.target.value)}
                                        className="mt-1 p-2 border border-[#E4C3A1] rounded bg-white text-[#173039]"
                                        placeholder="Escríbelo aquí (opcional)"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#173039] hover:bg-[#7B4B38] text-[#f0dfcc] font-bold py-3 px-4 rounded-xl shadow-lg transition"
                                >
                                    Enviar confirmación
                                </button>
                            </form>
                        )}
                    </section>
                </main>
            </div>
        </>
    )
}