'use client'

/**
 * SAVE THE DATE COMPONENT - FINAL VERSION
 * 
 * Features:
 * - LARGE hero image (takes most of the screen)
 * - Elegant wave effect at bottom of image
 * - Minimalist design matching wedding theme
 * - Calendar integration (Google + Apple) with venue links
 * - All-day event format
 * - Compact footer
 */

import { useState } from 'react'
import Image from 'next/image'

export default function SaveTheDate() {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Wedding details - all-day event
  const weddingDate = new Date('2026-06-06')

  // Venue details
  const venueUrl = 'https://maps.google.com/?q=Hacienda+San+Juan+Bautista+Amalucan+Tecamachalco+Puebla'

  // Add to Google Calendar (Android/Web)
  const addToGoogleCalendar = () => {
    const eventTitle = 'Boda Susana & Javier'
    const eventDetails = `Ceremonia religiosa en Hacienda San Juan Bautista Amalucan, Puebla\n\nVer ubicación: ${venueUrl}`
    const eventLocation = 'Hacienda San Juan Bautista Amalucan, Tecamachalco, Puebla'
    const startDate = '20260606'
    const endDate = '20260607'

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}&dates=${startDate}/${endDate}`

    window.open(googleCalUrl, '_blank')
  }

  // Add to iCal (iPhone/Mac)
  const addToICal = () => {
    const eventTitle = 'Boda Susana & Javier'
    const eventDetails = `Ceremonia religiosa en Hacienda San Juan Bautista Amalucan, Puebla\\n\\nVer ubicación: ${venueUrl}`
    const eventLocation = 'Hacienda San Juan Bautista Amalucan, Tecamachalco, Puebla'

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Susana & Javier//Wedding//ES
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
    link.download = 'boda-susana-javier.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Minimalist Card */}
        <div className="bg-white rounded-2xl shadow-wedding overflow-hidden border border-wedding-blush/30">

          {/* Hero Image - LARGE - takes up most of the viewport */}
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

            {/* Minimal overlay - just to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

            {/* Clean centered content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <div className="space-y-6">

                {/* Simple badge */}
                <div className="inline-block px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-wedding">
                  <p className="text-xs uppercase tracking-[0.3em] text-wedding-burgundy font-light">
                    Save the Date
                  </p>
                </div>

                {/* Names - elegant and prominent */}
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-luxury text-white drop-shadow-lg">
                  Susana <span className="text-wedding-blush">&</span> Javier
                </h1>

                {/* Date - clean and minimal */}
                <div className="space-y-2">
                  <p className="text-3xl sm:text-4xl font-light text-white tracking-wide">
                    6 · Junio · 2026
                  </p>
                  <p className="text-base text-white/90 font-light">
                    Puebla, México
                  </p>
                </div>

              </div>
            </div>

            {/* Elegant wave effect at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-16 sm:h-20"
              >
                {/* Main wave */}
                <path
                  d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
                  fill="white"
                />
                {/* Subtle shadow for depth */}
                <path
                  d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,130 L0,130 Z"
                  fill="rgba(71, 9, 28, 0.03)"
                />
              </svg>
            </div>
          </div>

          {/* Content Section - Compact and minimal */}
          <div className="p-6 sm:p-8 space-y-5">

            {/* Simple message */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-light text-wedding-burgundy">
                ¡Nos casamos!
              </h2>
              <p className="text-stone-600 leading-relaxed max-w-md mx-auto text-sm">
                Guarda la fecha y celebra con nosotros este día tan especial.
              </p>
            </div>

            {/* Calendar buttons - side by side */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">

              {/* Google Calendar */}
              <button
                onClick={addToGoogleCalendar}
                className="flex-1 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white py-3 px-6 rounded-full text-sm uppercase tracking-wide transition-all duration-300 shadow-wedding hover:shadow-wedding-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Google Calendar
              </button>

              {/* iCal / Apple */}
              <button
                onClick={addToICal}
                className="flex-1 bg-white hover:bg-stone-50 text-wedding-burgundy py-3 px-6 rounded-full text-sm uppercase tracking-wide transition-all duration-300 border border-wedding-blush hover:border-wedding-burgundy flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Apple Calendar
              </button>
            </div>

            {/* Location - clickable link */}
            <a
              href={venueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center space-y-1 group"
            >
              <p className="text-sm text-stone-500 uppercase tracking-wider group-hover:text-wedding-burgundy transition-colors">
                Hacienda San Juan Bautista Amalucan
              </p>
              <p className="text-xs text-stone-400 group-hover:text-wedding-rose transition-colors flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Tecamachalco, Puebla
              </p>
            </a>

            {/* Subtle divider */}
            <div className="flex items-center justify-center gap-3 py-1">
              <div className="h-px w-8 bg-wedding-blush" />
              <svg className="w-3 h-3 text-wedding-rose" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <div className="h-px w-8 bg-wedding-blush" />
            </div>

            {/* Footer - very compact */}
            <div className="text-center">
              <p className="text-xs text-stone-400 italic">
                Invitación formal próximamente
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}