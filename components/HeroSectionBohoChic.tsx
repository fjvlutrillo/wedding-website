'use client'

/**
 * BOHO CHIC EDITORIAL HERO SECTION - FIXED SCROLL
 * 
 * Fixed Issues:
 * - Scroll arrow now properly scrolls to historia section
 * - Uses window.pageYOffset instead of window.scrollY for better compatibility
 * - Added cursor-pointer class for better UX
 * - Fallback scroll if historia section not found
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HeroSectionBohoChic() {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [textVisible, setTextVisible] = useState(false)

    // Stagger text animation after image loads
    useEffect(() => {
        if (imageLoaded) {
            setTimeout(() => setTextVisible(true), 300)
        }
    }, [imageLoaded])

    const handleScrollToHistoria = () => {
        // Find the historia section
        const target = document.getElementById('historia')

        if (target) {
            // Show header first
            const header = document.querySelector('.main-header') as HTMLElement
            if (header) {
                header.style.display = 'flex'
            }

            // Use a fixed header height
            const headerHeight = 80

            // Get the target position
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight

            // Smooth scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            })
        } else {
            // Fallback: scroll one viewport
            window.scrollTo({
                top: window.innerHeight - 100,
                behavior: 'smooth'
            })

            // Show header
            const header = document.querySelector('.main-header') as HTMLElement
            if (header) {
                header.style.display = 'flex'
            }
        }
    }

    return (
        <section
            id="inicio"
            className="relative h-screen flex items-center justify-center overflow-hidden bg-warm-cream"
        >
            {/* ==================== BACKGROUND IMAGE ==================== */}
            {/* Subtle placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-warm-cream via-wedding-blush-light to-warm-cream" />

            {/* Hero image with editorial crop & fade-in */}
            <div
                className={`absolute inset-0 transition-all duration-1500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
            >
                <Image
                    src="/hero.jpg"
                    alt="Susana y Javier"
                    fill
                    priority
                    quality={95}
                    className="object-cover object-center sm:object-[center_30%]"
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* Modern gradient overlay - lighter on left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/40" />

            {/* ==================== EDITORIAL LAYOUT ==================== */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center">

                    {/* ==================== LEFT COLUMN: Editorial Typography ==================== */}
                    <div className="lg:col-span-6 space-y-8 lg:space-y-12">

                        {/* Masthead - Magazine style */}
                        <div
                            className={`space-y-2 transition-all duration-700 delay-100 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-wedding-burgundy"></div>
                                <span className="text-[10px] sm:text-xs font-light tracking-[0.4em] uppercase text-warm-cream">
                                    Edición 2026
                                </span>
                            </div>
                        </div>

                        {/* Main Title - Asymmetric Vogue Style */}
                        <div
                            className={`space-y-4 transition-all duration-700 delay-300 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {/* "Save The" - Small caps above */}
                            <div className="overflow-hidden">
                                <h2 className="text-sm sm:text-base font-light tracking-[0.3em] uppercase text-warm-cream/90">
                                    Save The
                                </h2>
                            </div>

                            {/* "DATE" - Large bold statement */}
                            <div className="overflow-hidden">
                                <h1 className="text-7xl sm:text-8xl md:text-9xl font-light tracking-tight text-warm-cream leading-none">
                                    DATE
                                </h1>
                            </div>

                            {/* Decorative line */}
                            <div className="flex items-center gap-3 pt-2">
                                <div className="w-20 h-[2px] bg-wedding-burgundy"></div>
                                <div className="w-2 h-2 rounded-full bg-wedding-burgundy"></div>
                            </div>
                        </div>

                        {/* Names - Editorial feature style */}
                        <div
                            className={`space-y-3 transition-all duration-700 delay-500 ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                }`}
                        >
                            <div className="inline-block">
                                <p className="text-5xl sm:text-6xl md:text-7xl font-luxury text-warm-cream leading-tight">
                                    Susana
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="w-full h-px bg-warm-cream/40"></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pl-8 sm:pl-12">
                                <span className="text-3xl sm:text-4xl text-wedding-burgundy/80">&</span>
                                <p className="text-5xl sm:text-6xl md:text-7xl font-luxury text-warm-cream">
                                    Javier
                                </p>
                            </div>
                        </div>

                        {/* Date & Location - Responsive: card on desktop, simple text on mobile */}
                        <div
                            className={`max-w-md transition-all duration-700 delay-700 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {/* Mobile version - no blur, simpler */}
                            <div className="sm:hidden space-y-4">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-light text-warm-cream tabular-nums">06</span>
                                    <div className="space-y-0.5">
                                        <p className="text-lg font-light text-warm-cream">Junio</p>
                                        <p className="text-3xl font-light text-warm-cream tabular-nums">2026</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-wedding-burgundy/40"></div>
                                    <p className="text-base text-warm-cream">Puebla, México</p>
                                </div>
                            </div>

                            {/* Desktop version - with blur card */}
                            <div className="hidden sm:block bg-warm-cream/10 backdrop-blur-md border border-warm-cream/20 rounded-2xl p-6 sm:p-8">
                                <div className="space-y-4">
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-6xl sm:text-7xl font-light text-warm-cream tabular-nums">06</span>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xl sm:text-2xl font-light text-warm-cream">Junio</p>
                                            <p className="text-4xl sm:text-5xl font-light text-warm-cream tabular-nums">2026</p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-warm-cream/20"></div>

                                    <div className="space-y-1">
                                        <p className="text-sm uppercase tracking-[0.2em] text-warm-cream/70">Ceremonia</p>
                                        <p className="text-base sm:text-lg text-warm-cream">Puebla, México</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ==================== RIGHT COLUMN: Floating Elements ==================== */}
                    <div className="hidden lg:flex lg:col-span-6 items-center justify-center relative h-full">

                        {/* Geometric floating shapes - Boho editorial touch */}
                        <div
                            className={`absolute top-1/4 right-1/4 w-32 h-32 transition-all duration-1000 delay-500 ${textVisible ? 'opacity-30 rotate-12' : 'opacity-0 rotate-0'
                                }`}
                        >
                            <div className="w-full h-full border-2 border-wedding-burgundy/40 rounded-full animate-float"></div>
                        </div>

                        <div
                            className={`absolute bottom-1/3 right-1/3 w-24 h-24 transition-all duration-1000 delay-700 ${textVisible ? 'opacity-20 -rotate-12' : 'opacity-0 rotate-0'
                                }`}
                        >
                            <div className="w-full h-full border border-warm-cream/60 rotate-45"></div>
                        </div>

                        {/* Vertical text - Editorial magazine style */}
                        <div
                            className={`absolute right-12 top-1/2 -translate-y-1/2 transition-all duration-1000 delay-900 ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                                }`}
                        >
                            <p
                                className="text-xs tracking-[0.5em] uppercase text-warm-cream/50"
                                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                            >
                                Una celebración de amor
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* ==================== SCROLL INDICATOR - FIXED ==================== */}
            <button
                onClick={handleScrollToHistoria}
                className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 group transition-all duration-700 delay-1000 hover:scale-110 cursor-pointer z-20 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                aria-label="Scroll to next section"
            >
                <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-full hover:bg-warm-cream/10 transition-colors">
                    {/* Animated chevron icon */}
                    <svg
                        className="w-8 h-8 text-warm-cream animate-fade-pulse group-hover:text-wedding-burgundy transition-colors"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>

                    {/* Desktop only text */}
                    <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-warm-cream/70 font-light group-hover:text-warm-cream transition-colors">
                        Scroll
                    </span>
                </div>
            </button>

            {/* ==================== DECORATIVE CORNER ELEMENTS ==================== */}
            {/* Top left corner */}
            <div
                className={`absolute top-8 left-8 transition-all duration-1000 delay-200 ${textVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-4 -translate-y-4'
                    }`}
            >
                <div className="flex flex-col gap-2">
                    <div className="w-12 h-px bg-warm-cream/40"></div>
                    <div className="w-8 h-px bg-warm-cream/40"></div>
                </div>
            </div>

            {/* Bottom right corner */}
            <div
                className={`absolute bottom-8 right-8 transition-all duration-1000 delay-400 ${textVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-4 translate-y-4'
                    }`}
            >
                <div className="flex flex-col items-end gap-2">
                    <div className="w-12 h-px bg-warm-cream/40"></div>
                    <div className="w-8 h-px bg-warm-cream/40"></div>
                </div>
            </div>

        </section>
    )
}