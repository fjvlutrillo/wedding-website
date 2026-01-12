import { Suspense } from 'react'
import RSVPFormBohoChic from './RSVPForm'

/**
 * RSVP PAGE - Boho-Chic Editorial Style
 * 
 * This page uses Suspense to handle the searchParams gracefully
 * and shows the editorial-style RSVP form
 */

export default function RSVPPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-wedding-blush-light">
            {/* Loading fallback with editorial style */}
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="inline-block w-12 h-12 border-3 border-wedding-burgundy border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-stone-600 font-light tracking-wide">Cargando formulario...</p>
                    </div>
                </div>
            }>
                <RSVPFormBohoChic />
            </Suspense>
        </main>
    )
}