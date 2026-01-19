'use client'

/**
 * ENGLISH VERSION - ENHANCED BOHO CHIC EDITORIAL HERO SECTION
 * 
 * Same visual design as Spanish version, with English text
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HeroSectionBohoChicEN() {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [textVisible, setTextVisible] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Parallax scroll tracking
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.pageYOffset)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Stagger text animation after image loads
    useEffect(() => {
        if (imageLoaded) {
            setTimeout(() => setTextVisible(true), 300)
        }
    }, [imageLoaded])

    // Parallax calculations - mobile optimized
    const photoParallax = isMobile ? 0 : scrollY * 0.3
    const textParallax = isMobile ? 0 : scrollY * 0.3
    const decorativeParallax = isMobile ? scrollY * 0.15 : scrollY * 0.7
    const shapeRotation = scrollY * 0.1
    const shapeOpacity = Math.max(0, 1 - scrollY / 500)

    // Scroll to section
    const handleScrollToStory = () => {
        const target = document.getElementById('story')
        if (target) {
            const header = document.querySelector('.main-header') as HTMLElement
            if (header) header.style.display = 'flex'

            const headerHeight = 80
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            })
        }
    }

    return (
        <section
            id="home"
            className="relative h-screen flex items-center justify-center overflow-hidden bg-warm-cream"
        >
            {/* Grain texture overlay */}
            <div
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 200px',
                    mixBlendMode: 'overlay',
                    opacity: 0.03
                }}
            />

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-warm-cream via-wedding-blush-light to-warm-cream" />

            {/* Hero image with parallax */}
            <div
                className={`absolute inset-0 transition-all duration-1500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                style={{
                    transform: `translateY(${photoParallax}px)`,
                    willChange: 'transform'
                }}
            >
                <Image
                    src="/hero.jpg"
                    alt="Susana and Javier"
                    fill
                    priority
                    quality={95}
                    className="object-cover object-center sm:object-[center_30%]"
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* Gradient overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/40"
                style={{
                    transform: `translateY(${photoParallax * 0.8}px)`
                }}
            />

            {/* Floating geometric shapes */}
            {textVisible && (
                <>
                    {/* Desktop shapes */}
                    <div
                        className="absolute top-20 right-20 w-64 h-64 pointer-events-none hidden lg:block"
                        style={{
                            transform: `translateY(${decorativeParallax}px) rotate(${shapeRotation}deg)`,
                            opacity: shapeOpacity,
                            transition: 'opacity 0.3s ease-out'
                        }}
                    >
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="100" cy="100" r="90" fill="none" stroke="#B76E79" strokeWidth="1" opacity="0.3" />
                            <circle cx="100" cy="100" r="70" fill="none" stroke="#47091C" strokeWidth="0.5" opacity="0.2" />
                        </svg>
                    </div>

                    <div
                        className="absolute bottom-32 left-16 w-32 h-32 pointer-events-none hidden lg:block"
                        style={{
                            transform: `translateY(${-decorativeParallax * 0.5}px) rotate(${-shapeRotation * 2}deg)`,
                            opacity: shapeOpacity * 0.8
                        }}
                    >
                        <div className="w-full h-full border border-warm-cream/40 rotate-12" />
                    </div>

                    <div
                        className="absolute bottom-40 right-1/4 w-48 h-24 pointer-events-none hidden lg:block"
                        style={{
                            transform: `translateY(${decorativeParallax * 1.2}px)`,
                            opacity: shapeOpacity * 0.6
                        }}
                    >
                        <svg viewBox="0 0 200 100" className="w-full h-full">
                            <path d="M0,50 Q50,20 100,50 T200,50" fill="none" stroke="#B76E79" strokeWidth="1" opacity="0.4" />
                        </svg>
                    </div>

                    <div
                        className="absolute top-40 left-1/4 flex gap-3 pointer-events-none hidden lg:block"
                        style={{
                            transform: `translateY(${decorativeParallax * 0.8}px)`,
                            opacity: shapeOpacity
                        }}
                    >
                        <div className="w-2 h-2 rounded-full bg-wedding-burgundy/40" />
                        <div className="w-3 h-3 rounded-full bg-wedding-rose/30" />
                        <div className="w-2 h-2 rounded-full bg-wedding-burgundy/40" />
                    </div>

                    {/* Mobile shapes */}
                    <div
                        className="absolute top-16 right-6 w-32 h-32 pointer-events-none lg:hidden"
                        style={{
                            transform: `translateY(${decorativeParallax}px)`,
                            opacity: shapeOpacity * 0.5
                        }}
                    >
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="100" cy="100" r="90" fill="none" stroke="#B76E79" strokeWidth="2" opacity="0.6" />
                        </svg>
                    </div>

                    <div
                        className="absolute top-40 left-6 w-20 h-20 pointer-events-none lg:hidden"
                        style={{
                            transform: `translateY(${-decorativeParallax * 0.4}px)`,
                            opacity: shapeOpacity * 0.4
                        }}
                    >
                        <div className="w-full h-full border-2 border-warm-cream/60 rounded-full" />
                    </div>

                    <div
                        className="absolute top-1/3 right-4 flex flex-col gap-2 pointer-events-none lg:hidden"
                        style={{
                            transform: `translateY(${decorativeParallax * 0.6}px)`,
                            opacity: shapeOpacity * 0.6
                        }}
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-wedding-burgundy/70" />
                        <div className="w-2 h-2 rounded-full bg-wedding-rose/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-wedding-burgundy/70" />
                    </div>

                    <div
                        className="absolute bottom-1/3 left-6 w-16 h-16 pointer-events-none lg:hidden"
                        style={{
                            transform: `translateY(${-decorativeParallax * 0.5}px) rotate(20deg)`,
                            opacity: shapeOpacity * 0.4
                        }}
                    >
                        <div className="w-full h-full border-2 border-warm-cream/50" />
                    </div>
                </>
            )}

            {/* Typography layers */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start lg:items-center justify-items-start pt-20 sm:pt-24 lg:pt-0">

                    {/* Left column */}
                    <div className="lg:col-span-6 space-y-12 sm:space-y-14 lg:space-y-12 relative w-full">

                        {/* Background "LOVE" (Desktop only) */}
                        <div
                            className={`absolute -top-20 -left-10 text-9xl font-light text-warm-cream/5 select-none pointer-events-none hidden lg:block transition-all duration-700 ${textVisible ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{
                                transform: `translateY(${textParallax * 0.5}px)`,
                                zIndex: 1
                            }}
                        >
                            LOVE
                        </div>

                        {/* Masthead */}
                        <div
                            className={`transition-all duration-700 delay-100 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{
                                transform: `translateY(${-textParallax * 0.3}px)`,
                                zIndex: 5
                            }}
                        >
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="w-10 sm:w-12 h-px bg-wedding-burgundy"></div>
                                <span className="text-xs sm:text-sm font-light tracking-[0.3em] sm:tracking-[0.4em] uppercase text-warm-cream">
                                    2026 Edition
                                </span>
                            </div>
                        </div>

                        {/* "Save The" */}
                        <div
                            className={`transition-all duration-700 delay-300 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{
                                transform: `translateY(${-textParallax * 0.4}px)`,
                                zIndex: 10
                            }}
                        >
                            <h2 className="text-xs sm:text-base font-light tracking-[0.25em] sm:tracking-[0.3em] uppercase text-warm-cream/90">
                                Save The
                            </h2>
                        </div>

                        {/* "DATE" */}
                        <div
                            className={`transition-all duration-700 delay-400 -mt-6 sm:-mt-8 lg:-mt-2 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{
                                transform: `translateY(${-textParallax * 0.6}px)`,
                                zIndex: 15
                            }}
                        >
                            <h1 className="text-7xl sm:text-8xl md:text-9xl font-light tracking-tight text-warm-cream leading-none">
                                DATE
                            </h1>

                            <div className="flex items-center gap-2 sm:gap-3 pt-2">
                                <div className="w-16 sm:w-20 h-[1.5px] sm:h-[2px] bg-wedding-burgundy"></div>
                                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-wedding-burgundy"></div>
                            </div>
                        </div>

                        {/* Large "2026" (Desktop only) */}
                        <div
                            className={`absolute top-1/2 -right-20 text-[150px] font-light text-warm-cream/5 select-none pointer-events-none hidden lg:block transition-all duration-700 delay-600 ${textVisible ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{
                                transform: `translateY(${textParallax * 0.4}px)`,
                                zIndex: 3
                            }}
                        >
                            2026
                        </div>

                        {/* Names */}
                        <div
                            className={`space-y-4 sm:space-y-5 lg:space-y-3 transition-all duration-700 delay-500 ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                }`}
                            style={{
                                transform: `translateY(${-textParallax * 0.5}px)`,
                                zIndex: 20
                            }}
                        >
                            <div className="inline-block">
                                <p className="text-5xl sm:text-6xl md:text-7xl font-luxury text-warm-cream leading-tight">
                                    Susana
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="w-full h-px bg-warm-cream/40"></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4 pl-6 sm:pl-12">
                                <span className="text-2xl sm:text-4xl text-wedding-burgundy/80">&</span>
                                <p className="text-5xl sm:text-6xl md:text-7xl font-luxury text-warm-cream">
                                    Javier
                                </p>
                            </div>
                        </div>

                        {/* Date card */}
                        <div
                            className={`max-w-md transition-all duration-700 delay-700 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{
                                transform: `translateY(${-textParallax * 0.7}px)`,
                                zIndex: 25
                            }}
                        >
                            {/* Mobile version */}
                            <div className="sm:hidden space-y-3">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-light text-warm-cream tabular-nums">06</span>
                                    <div className="space-y-0.5">
                                        <p className="text-lg font-light text-warm-cream">June</p>
                                        <p className="text-3xl font-light text-warm-cream tabular-nums">2026</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-px bg-wedding-burgundy/40"></div>
                                    <p className="text-base text-warm-cream">Puebla, Mexico</p>
                                </div>
                            </div>

                            {/* Desktop version */}
                            <div className="hidden sm:block bg-warm-cream/10 backdrop-blur-md border border-warm-cream/20 rounded-2xl p-6 sm:p-8">
                                <div className="space-y-4">
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-6xl sm:text-7xl font-light text-warm-cream tabular-nums">06</span>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xl sm:text-2xl font-light text-warm-cream">June</p>
                                            <p className="text-4xl sm:text-5xl font-light text-warm-cream tabular-nums">2026</p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-warm-cream/20"></div>

                                    <div className="space-y-1">
                                        <p className="text-sm uppercase tracking-[0.2em] text-warm-cream/70">Ceremony</p>
                                        <p className="text-base sm:text-lg text-warm-cream">Puebla, Mexico</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right column (Desktop only) */}
                    <div className="hidden lg:flex lg:col-span-6 items-center justify-center relative h-full">

                        <div
                            className={`absolute top-1/4 right-1/4 w-32 h-32 transition-all duration-1000 delay-500`}
                            style={{
                                opacity: shapeOpacity * 0.3,
                                transform: `translateY(${decorativeParallax}px) rotate(${shapeRotation}deg)`
                            }}
                        >
                            <div className="w-full h-full border-2 border-wedding-burgundy/40 rounded-full animate-float"></div>
                        </div>

                        <div
                            className={`absolute bottom-1/3 right-1/3 w-24 h-24 transition-all duration-1000 delay-700`}
                            style={{
                                opacity: shapeOpacity * 0.2,
                                transform: `translateY(${-decorativeParallax * 0.5}px) rotate(${-shapeRotation}deg)`
                            }}
                        >
                            <div className="w-full h-full border border-warm-cream/60 rotate-45"></div>
                        </div>

                        <div
                            className={`absolute right-12 top-1/2 -translate-y-1/2 transition-all duration-1000 delay-900`}
                            style={{
                                opacity: textVisible ? shapeOpacity : 0,
                                transform: `translateY(${-decorativeParallax * 0.3}px) translateX(${textVisible ? 0 : 8}px)`
                            }}
                        >
                            <p
                                className="text-xs tracking-[0.5em] uppercase text-warm-cream/50"
                                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                            >
                                A celebration of love
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <button
                onClick={handleScrollToStory}
                className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 group transition-all duration-700 delay-1000 hover:scale-110 cursor-pointer z-30 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                style={{
                    transform: `translateX(-50%) translateY(${-textParallax * 0.2}px)`
                }}
                aria-label="Scroll to next section"
            >
                <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-full hover:bg-warm-cream/10 transition-colors">
                    <svg
                        className="w-8 h-8 text-warm-cream animate-fade-pulse group-hover:text-wedding-burgundy transition-colors"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>

                    <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-warm-cream/70 font-light group-hover:text-warm-cream transition-colors">
                        Scroll
                    </span>
                </div>
            </button>

            {/* Decorative corners */}
            <div
                className={`absolute top-8 left-8 transition-all duration-1000 delay-200 z-20 ${textVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-4 -translate-y-4'
                    }`}
                style={{
                    transform: `translateY(${decorativeParallax * 0.3}px)`
                }}
            >
                <div className="flex flex-col gap-2">
                    <div className="w-8 sm:w-12 h-px bg-warm-cream/40"></div>
                    <div className="w-6 sm:w-8 h-px bg-warm-cream/40"></div>
                </div>
            </div>

            <div
                className={`absolute bottom-8 right-8 transition-all duration-1000 delay-400 z-20 ${textVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-4 translate-y-4'
                    }`}
                style={{
                    transform: `translateY(${-decorativeParallax * 0.3}px)`
                }}
            >
                <div className="flex flex-col items-end gap-2">
                    <div className="w-8 sm:w-12 h-px bg-warm-cream/40"></div>
                    <div className="w-6 sm:w-8 h-px bg-warm-cream/40"></div>
                </div>
            </div>

        </section>
    )
}