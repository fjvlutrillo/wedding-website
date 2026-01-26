'use client'

/**
 * BOHO-CHIC EDITORIAL HEADER
 * 
 * Updated to match the fashion magazine aesthetic:
 * - Minimalist clean design
 * - Editorial typography
 * - Smooth burgundy accents
 * - Magazine-style slide-out menu
 * - Elegant animations
 * - RSVP FIRST with burgundy highlight
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HeaderBohoChic() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)
    const [token, setToken] = useState('')
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search)
            const t = urlParams.get('token')
            if (t) {
                setShowRSVP(true)
                setToken(t)
            }
        }
    }, [])

    // Track scroll for header background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <header
                className={`main-header sticky top-0 z-50 h-20 flex items-center transition-all duration-500 ${scrolled
                    ? 'bg-white/98 backdrop-blur-xl shadow-wedding-md border-b border-wedding-blush/50'
                    : 'bg-white/95 backdrop-blur-lg'
                    }`}
            >
                <div className="relative flex justify-between items-center px-6 sm:px-8 w-full max-w-7xl mx-auto">

                    {/* Left: Editorial Logo */}
                    <Link
                        href="/"
                        className="group flex flex-col"
                    >
                        <span className="text-base sm:text-lg font-light tracking-[0.15em] uppercase text-wedding-burgundy group-hover:text-wedding-burgundy-light transition-colors duration-300">
                            Susana <span className="text-wedding-rose font-luxury text-xl">&</span> Javier
                        </span>
                        <span className="text-[11px] sm:text-[12px] tracking-[0.3em] uppercase text-wedding-rose/70 mt-0.5">
                            06 · Junio · 2026
                        </span>
                    </Link>

                    {/* Right: Menu Button - Editorial style */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="group flex items-center gap-3 hover:gap-4 transition-all duration-300"
                        aria-label="Abrir menú"
                    >
                        <span className="hidden sm:block text-xs uppercase tracking-[0.3em] text-wedding-burgundy group-hover:text-wedding-burgundy-light transition-colors font-light">
                            Menú
                        </span>
                        <div className="flex flex-col gap-[5px] w-7">
                            <span className="h-[1.5px] w-full bg-wedding-burgundy transition-all group-hover:w-5 group-hover:bg-wedding-burgundy-light"></span>
                            <span className="h-[1.5px] w-full bg-wedding-burgundy transition-all group-hover:bg-wedding-burgundy-light"></span>
                            <span className="h-[1.5px] w-full bg-wedding-burgundy transition-all group-hover:w-5 group-hover:bg-wedding-burgundy-light"></span>
                        </div>
                    </button>
                </div>
            </header>

            {/* Editorial Slide-out Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-warm-cream shadow-2xl z-50 transform transition-transform duration-700 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">

                    {/* Header - Magazine masthead style */}
                    <div className="relative p-8 border-b border-wedding-blush/50">
                        {/* Close button - top right */}
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full hover:bg-wedding-blush/30 transition-all duration-300 group"
                            aria-label="Cerrar menú"
                        >
                            <svg
                                className="w-6 h-6 text-wedding-burgundy group-hover:rotate-90 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Menu title - editorial style */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-px bg-wedding-burgundy/30"></div>
                                <span className="text-[10px] uppercase tracking-[0.4em] text-wedding-rose font-light">
                                    Navegación
                                </span>
                            </div>
                            <h2 className="text-3xl font-luxury text-wedding-burgundy">
                                Menú
                            </h2>
                        </div>
                    </div>

                    {/* Navigation - Editorial list style */}
                    <nav className="flex-1 p-8 space-y-2 overflow-y-auto">
                        {/* 🎯 RSVP BUTTON - FIRST & HIGHLIGHTED IN BURGUNDY */}
                        {showRSVP && (
                            <Link
                                href={`/rsvp?token=${token}`}
                                onClick={() => setMenuOpen(false)}
                                className="group block mb-6 p-6 bg-gradient-to-br from-wedding-burgundy to-wedding-burgundy-light rounded-2xl hover:shadow-wedding-lg transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>

                                <div className="relative space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                                            RSVP
                                        </span>
                                    </div>
                                    <p className="text-xl font-light text-white">
                                        Confirmar Asistencia
                                    </p>
                                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                                        <span className="text-sm">Responder ahora</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Regular Menu Items */}
                        {[
                            { href: '/#inicio', label: 'Inicio' },
                            { href: '/#historia', label: 'Nuestra Historia' },
                            { href: '/#evento', label: 'El Evento' },
                            { href: '/#dresscode', label: 'Código de Vestimenta' },
                            { href: '/#galeria', label: 'Galería' },
                            { href: '/#registry', label: 'Mesa de Regalos' },
                        ].map((item, idx) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="group block py-4 border-b border-wedding-blush/30 hover:border-wedding-burgundy/30 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="block text-2xl font-light text-charcoal group-hover:text-wedding-burgundy transition-colors duration-300">
                                            {item.label}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase tracking-[0.3em] text-wedding-rose/60 group-hover:text-wedding-rose transition-colors">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <div className="w-0 h-px bg-wedding-burgundy group-hover:w-8 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                    <svg
                                        className="w-6 h-6 text-wedding-burgundy/30 group-hover:text-wedding-burgundy group-hover:translate-x-2 transition-all duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer - Wedding details */}
                    <div className="p-8 border-t border-wedding-blush/50 bg-warm-cream/50">
                        <div className="space-y-4">
                            {/* Date block */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-light text-wedding-burgundy tabular-nums">06</span>
                                <div>
                                    <p className="text-lg font-light text-charcoal">Junio</p>
                                    <p className="text-3xl font-light text-wedding-burgundy tabular-nums">2026</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-stone-600">
                                <svg className="w-4 h-4 text-wedding-rose" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span className="text-sm uppercase tracking-wider">Puebla, México</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay - Subtle burgundy tint */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-wedding-burgundy/10 backdrop-blur-sm z-40 transition-opacity duration-500"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    )
}