/**
 * EDITORIAL SECTION HEADER COMPONENT
 * 
 * Matches the boho-chic hero aesthetic with:
 * - Magazine-style chapter numbering
 * - Asymmetric typography layout
 * - Burgundy accent colors
 * - Animated entrance on scroll
 * 
 * USAGE:
 * <SectionHeader 
 *   chapter="01"
 *   title="Nuestra"
 *   subtitle="Historia"
 *   description="Conoce cómo comenzó nuestra aventura juntos"
 * />
 */

import { useEffect, useRef, useState } from 'react'

interface SectionHeaderProps {
    chapter: string
    title: string
    subtitle: string
    description?: string
    align?: 'left' | 'center' | 'right'
}

export default function SectionHeader({
    chapter,
    title,
    subtitle,
    description,
    align = 'center'
}: SectionHeaderProps) {
    const [isVisible, setIsVisible] = useState(false)
    const headerRef = useRef<HTMLDivElement>(null)

    // Intersection Observer for scroll animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        if (headerRef.current) {
            observer.observe(headerRef.current)
        }

        return () => {
            if (headerRef.current) {
                observer.unobserve(headerRef.current)
            }
        }
    }, [])

    const alignmentClasses = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    }

    return (
        <div
            ref={headerRef}
            className={`flex flex-col ${alignmentClasses[align]} space-y-6 mb-12 sm:mb-16`}
        >
            {/* Chapter Number - Editorial masthead style */}
            <div
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
            >
                <div className="flex items-center gap-3">
                    {align === 'center' && <div className="w-8 sm:w-12 h-px bg-wedding-burgundy/30"></div>}
                    <span className="text-[10px] sm:text-xs font-light tracking-[0.4em] uppercase text-wedding-rose">
                        Capítulo {chapter}
                    </span>
                    <div className="w-8 sm:w-12 h-px bg-wedding-burgundy/30"></div>
                </div>
            </div>

            {/* Title & Subtitle - Asymmetric fashion magazine style */}
            <div
                className={`space-y-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
            >
                {/* Main title - clean sans-serif */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-charcoal leading-tight">
                    {title}
                </h2>

                {/* Subtitle - luxury script */}
                <div className="flex items-center gap-3">
                    {align === 'left' && <div className="w-16 h-[2px] bg-wedding-burgundy"></div>}
                    <p className="text-5xl sm:text-6xl md:text-7xl font-luxury text-wedding-burgundy leading-tight">
                        {subtitle}
                    </p>
                    {align === 'right' && <div className="w-16 h-[2px] bg-wedding-burgundy"></div>}
                </div>
            </div>

            {/* Description (optional) */}
            {description && (
                <div
                    className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                        {description}
                    </p>
                </div>
            )}

            {/* Decorative element */}
            <div
                className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}
            >
                <div className="flex items-center gap-2">
                    {align !== 'center' && <div className="w-12 h-px bg-wedding-blush"></div>}
                    <div className="w-2 h-2 rounded-full bg-wedding-burgundy"></div>
                    <div className="w-8 h-px bg-wedding-blush"></div>
                </div>
            </div>
        </div>
    )
}

/**
 * LEARNING NOTES:
 * 
 * 1. Intersection Observer API:
 *    - Detects when element enters viewport
 *    - Triggers animation on scroll
 *    - More performant than scroll event listeners
 * 
 * 2. Stagger Animations:
 *    - delay-200, delay-400, delay-500
 *    - Creates sequential reveal effect
 *    - Professional editorial feel
 * 
 * 3. Reusable Component Pattern:
 *    - Props for customization
 *    - TypeScript interfaces for type safety
 *    - Default values with optional props
 * 
 * 4. Responsive Design:
 *    - text-4xl sm:text-5xl md:text-6xl
 *    - Scales typography across breakpoints
 *    - Mobile-first approach
 */