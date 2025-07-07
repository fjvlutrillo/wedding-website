'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabaseClient'

export default function RSVPForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    // Status logic
    const [status, setStatus] = useState<'loading' | 'ready' | 'submitted' | 'already' | 'error'>('loading')
    const [guestName, setGuestName] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [confirming, setConfirming] = useState<boolean | null>(null)
    const [guestCount, setGuestCount] = useState(1)

    useEffect(() => {
        const fetchGuest = async () => {
            if (!token) {
                setStatus('error')
                return
            }
            const { data, error } = await supabase
                .from('guests')
                .select('name, guest_count, number_confirmations, did_confirm, email, phone_number')
                .eq('invite_token', token)
                .single()

            if (error || !data) {
                setStatus('error')
                return
            }
            setGuestName(data.name || '')
            setMaxGuests(data.guest_count || 1)
            if (data.did_confirm !== null) {
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
            .update({ did_confirm: false, number_confirmations: 0 })
            .eq('invite_token', token)
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
                did_confirm: true,
                number_confirmations: guestCount,
            })
            .eq('invite_token', token)
        setStatus('submitted')
        setConfirming(true)
    }

    return (
        <>
            <Header />
            <div className="relative min-h-screen flex flex-col">
                {/* Soft overlay (you can add a background image if you want here) */}
                <div className="absolute inset-0 bg-[#f0dfcc] bg-opacity-40 z-10 pointer-events-none select-none" />
                <main className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-6 py-0">
                    <section className="w-full max-w-md bg-white/90 text-[#173039] p-8 border-[3px] border-[#E4C3A1] shadow-xl rounded-xl">
                        <h1 className="text-5xl font-bold mb-6 text-center font-luxury text-[#173039]">
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