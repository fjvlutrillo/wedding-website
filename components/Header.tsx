'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
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

    // Track scroll for subtle header background
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
                className={`main-header sticky top-0 z-50 h-16 sm:h-16 flex items-center transition-all duration-300 ${scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200'
                        : 'bg-white/90 backdrop-blur-sm'
                    }`}
            >
                <div className="relative flex justify-center items-center px-4 w-full max-w-6xl mx-auto">
                    {/* Centered title - Minimalist */}
                    <Link
                        href="/"
                        className="absolute left-1/2 transform -translate-x-1/2 text-center group"
                    >
                        <span className="font-light text-sm tracking-[0.2em] uppercase text-[#2C2C2C] group-hover:text-stone-600 transition-colors">
                            Susana <span className="text-stone-400">&</span> Javier
                        </span>
                        <span className="block text-[10px] tracking-widest uppercase text-stone-500 mt-0.5">
                            6 · Junio · 2026
                        </span>
                    </Link>

                    {/* Minimalist hamburger icon */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="absolute right-4 w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
                        aria-label="Abrir menú"
                    >
                        <span className="w-5 h-px bg-[#2C2C2C] transition-all group-hover:w-6"></span>
                        <span className="w-5 h-px bg-[#2C2C2C] transition-all"></span>
                        <span className="w-5 h-px bg-[#2C2C2C] transition-all group-hover:w-6"></span>
                    </button>
                </div>
            </header>

            {/* Slide-out menu - Minimalist Design */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-stone-200">
                        <span className="text-sm uppercase tracking-[0.2em] text-stone-500 font-light">
                            Menú
                        </span>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors group"
                            aria-label="Cerrar menú"
                        >
                            <svg className="w-5 h-5 text-stone-600 group-hover:text-[#2C2C2C] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-6 space-y-1">
                        {[
                            { href: '/#inicio', label: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                            { href: '/#historia', label: 'Nuestra Historia', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                            { href: '/#evento', label: 'Evento', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                            { href: '/#galeria', label: 'Galería', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="group flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-stone-50 transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5 text-stone-600 group-hover:text-[#2C2C2C] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                </div>
                                <span className="text-base font-light text-[#2C2C2C] group-hover:translate-x-1 transition-transform">
                                    {item.label}
                                </span>
                            </Link>
                        ))}

                        {showRSVP && (
                            <Link
                                href={`/rsvp?token=${token}`}
                                onClick={() => setMenuOpen(false)}
                                className="group flex items-center gap-4 py-3 px-4 rounded-lg bg-[#2C2C2C] hover:bg-[#1A1A1A] transition-all duration-200 mt-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-base font-light text-white group-hover:translate-x-1 transition-transform">
                                    Confirmar Asistencia
                                </span>
                            </Link>
                        )}
                    </nav>

                    {/* Footer */}
                    <div className="p-6 border-t border-stone-200">
                        <div className="text-center space-y-2">
                            <p className="text-sm text-stone-500 font-light">
                                Nos casamos
                            </p>
                            <p className="text-lg font-luxury text-[#2C2C2C]">
                                6 de Junio, 2026
                            </p>
                            <p className="text-xs text-stone-400 uppercase tracking-wider">
                                Puebla, México
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay with blur */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    )
}