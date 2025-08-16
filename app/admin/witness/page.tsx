'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import confetti from 'canvas-confetti'
import { supabase } from '@/lib/supabaseClient'
import { getWitnessChannel, removeWitnessChannel } from '@/lib/supabaseRealtime'

const Wheel = dynamic(() => import('react-custom-roulette').then(m => m.Wheel), { ssr: false })

type Guest = { id: string; name: string | null }

export default function WitnessDirector() {
    const [sessionReady, setSessionReady] = useState(false)
    const [allGuests, setAllGuests] = useState<Guest[]>([])
    const [excluded, setExcluded] = useState<Set<string>>(new Set())
    const [pickedIds, setPickedIds] = useState<string[]>([]) // winners in order
    const [spinning, setSpinning] = useState(false)
    const [prizeIndex, setPrizeIndex] = useState<number>(0)
    const [search, setSearch] = useState<string>('')

    const channelRef = useRef<ReturnType<typeof getWitnessChannel> | null>(null)

    useEffect(() => {
        ; (async () => {
            // Auth guard
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                setSessionReady(false)
                return
            }
            setSessionReady(true)

            // Realtime channel (single instance)
            channelRef.current = getWitnessChannel()

            // Load eligible guests: only tables 8 & 9 and confirmed
            const { data: guests, error } = await supabase
                .from('guests')
                .select('id,name,table_number,did_confirm,number_confirmations')
                .in('table_number', [8, 9])
                .or('did_confirm.is.true,number_confirmations.gt.0')
                .order('name')

            if (!error && guests) {
                setAllGuests(guests.map(g => ({ id: g.id, name: g.name ?? 'Invitado' })))
            }
        })()

        return () => {
            removeWitnessChannel()
        }
    }, [])

    const broadcastWinner = (name: string, guestId: string) => {
        channelRef.current?.send({
            type: 'broadcast',
            event: 'winner',
            payload: { name, guestId }
        })
    }

    const filteredAll = useMemo(() => {
        const s = search.trim().toLowerCase()
        if (!s) return allGuests
        return allGuests.filter(g => (g.name ?? 'Invitado').toLowerCase().includes(s))
    }, [allGuests, search])

    const eligible = useMemo(
        () => filteredAll.filter(g => !excluded.has(g.id) && !pickedIds.includes(g.id)),
        [filteredAll, excluded, pickedIds]
    )

    const wheelData = eligible.length
        ? eligible.map(g => ({ option: g.name ?? 'Invitado' }))
        : [{ option: '—' }]

    const toggleExclude = (id: string) => {
        setExcluded(s => {
            const n = new Set(s)
            n.has(id) ? n.delete(id) : n.add(id)
            return n
        })
    }

    const selectAll = () => setExcluded(new Set())                    // include everyone
    const clearAll = () => setExcluded(new Set(allGuests.map(g => g.id))) // include no one
    const resetAll = () => { setExcluded(new Set()); setPickedIds([]) }

    // Spin management
    const canSpin = eligible.length > 0 && !spinning && pickedIds.length < 2

    const spin = () => {
        if (!canSpin) return
        const idx = Math.floor(Math.random() * eligible.length)
        setPrizeIndex(idx)
        setSpinning(true)
    }

    const onStopSpinning = async () => {
        setSpinning(false)
        const winner = eligible[prizeIndex]
        if (!winner) return

        // Local store
        setPickedIds(prev => [...prev, winner.id])

        // Confetti
        // Confetti en dorado y burdeos
        // 🎆 Confetti burst triple en dorado y burdeos
        const shootConfetti = () => {
            const defaults = {
                origin: { y: 0.6 },
                colors: ['#FFD700', '#E5AAAE', '#651D28'], // Oro, rosa suave, burdeos
                scalar: 1.2,
                ticks: 250
            }

            // Primera ráfaga (centro)
            confetti({
                ...defaults,
                particleCount: 100,
                spread: 70
            })

            // Segunda ráfaga (ligeramente a la izquierda)
            setTimeout(() => {
                confetti({
                    ...defaults,
                    particleCount: 80,
                    spread: 55,
                    angle: 60,
                    origin: { x: 0.2, y: 0.6 }
                })
            }, 300)

            // Tercera ráfaga (ligeramente a la derecha)
            setTimeout(() => {
                confetti({
                    ...defaults,
                    particleCount: 80,
                    spread: 55,
                    angle: 120,
                    origin: { x: 0.8, y: 0.6 }
                })
            }, 600)
        }

        // Ejecutar cuando hay ganador
        shootConfetti()

        // Broadcast to audience
        broadcastWinner(winner.name ?? 'Invitado', winner.id)

        // Optional: Persist to DB (witness_picks)
        const { data: authData } = await supabase.auth.getSession()
        if (authData.session) {
            await supabase.from('witness_picks').insert([
                { picked_order: pickedIds.length + 1, guest_id: winner.id, picked_by: authData.session.user.id }
            ])
        }
    }

    if (!sessionReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FBF3F9]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-[#651D28]">Se requiere acceso</h2>
                    <p className="text-[#9D9D9D] mt-2">Inicia sesión como admin para continuar.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen"
            style={{ background: 'linear-gradient(180deg, #FBF3F9 0%, #FCFCFC 100%)' }}>
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between"
                style={{ borderColor: '#4D1C20' }}>
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-[#651D28]">
                        Director — Selección de Testigos (Mesas 8 & 9)
                    </h1>
                    <p className="text-sm text-[#9D9D9D]">Elige 2 testigos de forma divertida</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={resetAll}
                        className="px-4 py-2 rounded-lg border"
                        style={{ borderColor: '#4D1C20', color: '#4D1C20', backgroundColor: '#FCFCFC' }}>
                        Reiniciar
                    </button>
                    <a href="/witness-live" target="_blank" className="px-4 py-2 rounded-lg"
                        style={{ backgroundColor: '#651D28', color: '#FCFCFC' }}>
                        Abrir pantalla del público
                    </a>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: list editor */}
                <div className="bg-white/80 rounded-2xl shadow border"
                    style={{ borderColor: '#4D1C20' }}>
                    <div className="p-5 border-b" style={{ borderColor: '#D2D2D2' }}>
                        <div className="flex flex-wrap items-center gap-3">
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar invitado…"
                                className="rounded-lg px-4 py-2 border w-full md:w-auto"
                                style={{ borderColor: '#D2D2D2' }}
                            />
                            <button onClick={selectAll} className="px-3 py-2 rounded-lg border"
                                style={{ borderColor: '#4D1C20', color: '#4D1C20' }}>
                                Seleccionar todos
                            </button>
                            <button onClick={clearAll} className="px-3 py-2 rounded-lg border"
                                style={{ borderColor: '#4D1C20', color: '#4D1C20' }}>
                                Deseleccionar todos
                            </button>
                            <span className="text-sm text-[#9D9D9D]">
                                Elegibles: {eligible.length} &middot; Excluidos: {excluded.size}
                            </span>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="flex flex-wrap gap-2">
                            {allGuests.map(g => {
                                const isExcluded = excluded.has(g.id)
                                const isPicked = pickedIds.includes(g.id)
                                return (
                                    <button
                                        key={g.id}
                                        onClick={() => toggleExclude(g.id)}
                                        disabled={isPicked}
                                        className={`px-3 py-1 rounded-full border transition ${isPicked
                                                ? 'opacity-60 cursor-not-allowed'
                                                : 'hover:shadow'
                                            }`}
                                        style={{
                                            borderColor: '#4D1C20',
                                            backgroundColor: isExcluded ? '#FCFCFC' : '#E5AAAE',
                                            color: '#4D1C20',
                                            textDecoration: isExcluded ? 'line-through' : 'none'
                                        }}
                                        title={isPicked ? 'Ya seleccionado' : (isExcluded ? 'Excluido' : 'Incluido')}
                                    >
                                        {g.name ?? 'Invitado'}
                                    </button>
                                )
                            })}
                            {allGuests.length === 0 && (
                                <div className="text-[#9D9D9D]">Cargando invitados elegibles…</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: wheel */}
                <div className="bg-white/80 rounded-2xl shadow border flex flex-col items-center"
                    style={{ borderColor: '#4D1C20' }}>
                    <div className="w-full p-5 border-b" style={{ borderColor: '#D2D2D2' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-[#651D28]">Ruleta de Testigos</h2>
                                <p className="text-sm text-[#9D9D9D]">
                                    Seleccionados: {pickedIds.length} / 2
                                </p>
                            </div>
                            <button
                                onClick={spin}
                                disabled={!canSpin}
                                className="px-5 py-2 rounded-lg font-medium disabled:opacity-50"
                                style={{
                                    backgroundColor: '#651D28',
                                    color: '#FCFCFC',
                                    boxShadow: '0 6px 16px rgba(77,28,32,0.2)'
                                }}
                            >
                                {pickedIds.length === 0 ? 'Elegir Testigo #1' :
                                    pickedIds.length === 1 ? 'Elegir Testigo #2' : 'Completado'}
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex-1 flex items-center justify-center p-6">
                        <div className="max-w-[520px] w-full">
                            <Wheel
                                mustStartSpinning={spinning}
                                prizeNumber={prizeIndex}
                                data={wheelData}
                                onStopSpinning={onStopSpinning}
                                outerBorderColor="#4D1C20"
                                outerBorderWidth={6}
                                innerBorderColor="#4D1C20"
                                radiusLineColor="#FCFCFC"
                                radiusLineWidth={2}
                                backgroundColors={['#651D28', '#9B4E54', '#CC7379', '#E5AAAE']}
                                textColors={['#FCFCFC']}
                                fontSize={16}
                            />
                        </div>
                    </div>

                    {pickedIds.length > 0 && (
                        <div className="w-full p-5 border-t" style={{ borderColor: '#D2D2D2' }}>
                            <h3 className="text-[#651D28] font-semibold mb-2">Resultados</h3>
                            <ol className="space-y-1">
                                {pickedIds.map((id, i) => {
                                    const g = allGuests.find(x => x.id === id)
                                    return (
                                        <li key={id} className="text-[#4D1C20]">
                                            <span className="inline-block px-2 py-0.5 rounded-full mr-2"
                                                style={{ backgroundColor: '#E5AAAE', color: '#4D1C20' }}>
                                                #{i + 1}
                                            </span>
                                            {g?.name ?? 'Invitado'}
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}