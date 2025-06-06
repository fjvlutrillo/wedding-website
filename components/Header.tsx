'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <header className="main-header bg-paper text-wine shadow-md sticky top-0 z-50 h-16 sm:h-16 flex items-center transition-all duration-300">
                <div className="relative flex justify-center items-center px-4 w-full max-w-6xl mx-auto">
                    {/* Centered title */}
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg sm:text-xl">
                        Boda Susana & Javier
                    </Link>

                    {/* Hamburger icon */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="absolute right-4"
                        aria-label="Abrir menú"
                    >
                        <svg className="w-6 h-6 text-rosewood" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Slide-out menu */}
            <div
                className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-6 space-y-6 text-wine font-medium text-lg">
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="absolute top-4 right-4 text-2xl"
                        aria-label="Cerrar menú"
                    >
                        ✕
                    </button>

                    <Link href="/#inicio" onClick={() => setMenuOpen(false)} className="block">
                        Inicio
                    </Link>
                    <Link href="/#historia" onClick={() => setMenuOpen(false)} className="block">
                        Nuestra historia
                    </Link>
                    <Link href="/#evento" onClick={() => setMenuOpen(false)} className="block">
                        Evento
                    </Link>
                    <Link href="/#galeria" onClick={() => setMenuOpen(false)} className="block">
                        Galería
                    </Link>
                    <Link href="/rsvp" onClick={() => setMenuOpen(false)} className="block">
                        Confirmar asistencia
                    </Link>
                </div>
            </div>

            {/* Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    )
}