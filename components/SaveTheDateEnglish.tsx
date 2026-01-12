'use client'

/**
 * SAVE THE DATE COMPONENT - ENGLISH VERSION
 * 
 * LEARNING NOTES FOR FRANCISCO:
 * ================================
 * 
 * WHAT WE CHANGED FROM SPANISH VERSION:
 * 
 * 1. TEXT TRANSLATIONS:
 *    - "Junio" → "June" (month name)
 *    - "Ver ubicación en mapa" → "View location on map"
 *    - "Invitación formal próximamente" → "Formal invitation coming soon"
 * 
 * 2. CALENDAR EVENT DETAILS:
 *    - Event titles and descriptions now in English
 *    - Calendar file download name changed to English
 * 
 * 3. DATE FORMATTING:
 *    - Notice how we handle the date: June 6, 2026
 *    - In Spanish it was "6 de Junio, 2026" (day first)
 *    - In English it's "June 6, 2026" (month first)
 * 
 * WHY THIS APPROACH:
 * - For now, we're creating two separate components
 * - Later, you can learn about i18n (internationalization) libraries like:
 *   * next-intl
 *   * react-i18next
 *   These would let you switch languages dynamically with one component!
 * 
 * NEXT STEPS TO MAKE THIS BILINGUAL:
 * 1. Create a language selector toggle
 * 2. Use URL parameters (?lang=en or ?lang=es)
 * 3. Store language preference in browser localStorage
 * 4. Conditionally render SaveTheDate or SaveTheDateEnglish
 */

import { useState } from 'react'
import Image from 'next/image'

export default function SaveTheDateEnglish() {
    const [imageLoaded, setImageLoaded] = useState(false)

    // Wedding details - all-day event
    const weddingDate = new Date('2026-06-06')

    // Venue details
    const venueUrl = 'https://maps.google.com/?q=Hacienda+San+Juan+Bautista+Amalucan+Tecamachalco+Puebla'

    // Add to Google Calendar (Android/Web)
    const addToGoogleCalendar = () => {
        const eventTitle = 'Susana & Javier Wedding'
        const eventDetails = `Religious ceremony at Hacienda San Juan Bautista Amalucan, Puebla\n\nView location: ${venueUrl}`
        const eventLocation = 'Hacienda San Juan Bautista Amalucan, Tecamachalco, Puebla'
        const startDate = '20260606'
        const endDate = '20260607'

        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}&dates=${startDate}/${endDate}`

        window.open(googleCalUrl, '_blank')
    }

    // Add to iCal (iPhone/Mac)
    const addToICal = () => {
        const eventTitle = 'Susana & Javier Wedding'
        const eventDetails = `Religious ceremony at Hacienda San Juan Bautista Amalucan, Puebla\\n\\nView location: ${venueUrl}`
        const eventLocation = 'Hacienda San Juan Bautista Amalucan, Tecamachalco, Puebla'

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Susana & Javier//Wedding//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:20260606
DTEND;VALUE=DATE:20260607
SUMMARY:${eventTitle}
DESCRIPTION:${eventDetails}
LOCATION:${eventLocation}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'susana-javier-wedding.ics'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">

                {/* Minimalist Card */}
                <div className="bg-white rounded-2xl shadow-wedding overflow-hidden border border-wedding-blush/30">

                    {/* Hero Image - LARGE - with new text layout */}
                    <div className="relative h-[70vh] sm:h-[75vh] min-h-[600px] overflow-hidden">
                        {/* Subtle placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-wedding-blush-light to-warm-cream" />

                        {/* Main image */}
                        <div
                            className={`absolute inset-0 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <Image
                                src="/hero.jpg"
                                alt="Susana & Javier"
                                fill
                                priority
                                quality={95}
                                className="object-cover"
                                onLoad={() => setImageLoaded(true)}
                            />
                        </div>

                        {/* DARKER overlay for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

                        {/* TEXT LAYOUT - English version */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

                            <div className="space-y-3">

                                {/* "SAVE THE DATE" - at top */}
                                <p className="text-sm sm:text-base font-light tracking-[0.35em] uppercase text-white drop-shadow-lg">
                                    Save the Date
                                </p>

                                {/* Names - elegant serif */}
                                <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-white drop-shadow-lg tracking-wide">
                                    Susana <span className="text-white/90">&</span> Javier
                                </h1>

                                {/* Vertical divider line */}
                                <div className="flex justify-center py-4">
                                    <div className="w-px h-12 sm:h-16 bg-white/60"></div>
                                </div>

                                {/* Date - Large vertical format - ENGLISH VERSION */}
                                <div className="space-y-1">
                                    <p className="text-7xl sm:text-8xl md:text-9xl font-light text-white tracking-tight leading-none">
                                        06
                                    </p>
                                    <p className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-[0.2em] uppercase">
                                        June
                                    </p>
                                    <p className="text-7xl sm:text-8xl md:text-9xl font-light text-white tracking-tight leading-none">
                                        26
                                    </p>
                                </div>

                                {/* Bottom divider line */}
                                <div className="flex justify-center py-4">
                                    <div className="w-px h-12 sm:h-16 bg-white/60"></div>
                                </div>

                                {/* Venue information */}
                                <div className="space-y-1">
                                    <p className="text-base sm:text-lg font-light text-white tracking-wide">
                                        Hacienda San Juan Bautista Amalucan
                                    </p>
                                    <p className="text-sm sm:text-base font-light text-white/90 tracking-wide">
                                        Tecamachalco, Puebla
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Slight snake wave at bottom */}
                        <div className="absolute bottom-0 left-0 right-0">
                            <svg
                                viewBox="0 0 1200 120"
                                preserveAspectRatio="none"
                                className="w-full h-12 sm:h-16"
                            >
                                {/* Smooth snake-like wave */}
                                <path
                                    d="M0 60 A600 40 0 0 0 1200 60 L1200 120 L0 120 Z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Content Section - Compact and minimal */}
                    <div className="p-6 sm:p-8 space-y-5">

                        {/* Location - clickable link - ENGLISH */}
                        <a
                            href={venueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center space-y-1 group"
                        >
                            <p className="text-sm text-wedding-burgundy uppercase tracking-wider group-hover:text-wedding-burgundy-light transition-colors font-medium">
                                View location on map
                            </p>
                            <p className="text-xs text-wedding-rose group-hover:text-wedding-burgundy transition-colors flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                Google Maps
                            </p>
                        </a>

                        {/* Calendar buttons - Subtle style with matching blush borders */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">

                            {/* Apple Calendar */}
                            <button
                                onClick={addToICal}
                                className="flex-1 bg-white hover:bg-stone-50 text-wedding-burgundy py-3 px-6 rounded-full text-sm uppercase tracking-wide transition-all duration-300 border border-wedding-blush hover:border-wedding-burgundy flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Apple Calendar
                            </button>

                            {/* Google Calendar */}
                            <button
                                onClick={addToGoogleCalendar}
                                className="flex-1 bg-white hover:bg-stone-50 text-wedding-burgundy py-3 px-6 rounded-full text-sm uppercase tracking-wide transition-all duration-300 border border-wedding-blush hover:border-wedding-burgundy flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Google Calendar
                            </button>
                        </div>

                        {/* Subtle divider */}
                        <div className="flex items-center justify-center gap-3 py-1">
                            <div className="h-px w-8 bg-wedding-blush" />
                            <svg className="w-3 h-3 text-wedding-rose" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <div className="h-px w-8 bg-wedding-blush" />
                        </div>

                        {/* Footer - ENGLISH */}
                        <div className="text-center">
                            <p className="text-sm text-stone-400 italic">
                                Formal invitation coming soon
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}