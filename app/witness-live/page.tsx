'use client'

import { useEffect, useState } from 'react'
import { getWitnessChannel, removeWitnessChannel } from '@/lib/supabaseRealtime'

type Winner = { name: string }

export default function WitnessLive() {
    const [winners, setWinners] = useState<Winner[]>([])

    useEffect(() => {
        const channel = getWitnessChannel()
        channel.on('broadcast', { event: 'winner' }, ({ payload }) => {
            setWinners(prev => [...prev, { name: payload.name as string }])
        })
        return () => removeWitnessChannel()
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6"
            style={{ background: 'linear-gradient(180deg, #FBF3F9 0%, #FCFCFC 100%)' }}>
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-semibold mb-2 text-[#651D28] tracking-wide">
                    Testigos de Javier
                </h1>
                <p className="text-[#9D9D9D] mb-8">¡Dinámica especial antes de la firma!</p>
            </div>

            <div className="w-full max-w-xl bg-white/80 rounded-2xl shadow-xl border"
                style={{ borderColor: '#4D1C20' }}>
                <ol className="p-8 space-y-6">
                    {winners.map((w, i) => (
                        <li key={i} className="text-2xl md:text-3xl font-semibold text-center">
                            <span className="inline-block px-3 py-1 rounded-full mr-3"
                                style={{ backgroundColor: '#E5AAAE', color: '#4D1C20' }}>
                                #{i + 1}
                            </span>
                            <span className="text-[#651D28]">{w.name}</span>
                        </li>
                    ))}
                    {winners.length === 0 && (
                        <li className="text-xl md:text-2xl text-center text-[#9D9D9D]">Esperando resultado…</li>
                    )}
                </ol>
            </div>
        </div>
    )
}