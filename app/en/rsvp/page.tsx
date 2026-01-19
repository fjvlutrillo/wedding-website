import { Suspense } from 'react'
import RSVPFormBohoChic from './RSVPForm'

/**
 * RSVP PAGE - Boho-Chic Editorial Style (EN)
 */

export default function RSVPPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-wedding-blush-light">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="inline-block w-12 h-12 border-3 border-wedding-burgundy border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-stone-600 font-light tracking-wide">
                            Loading form...
                        </p>
                    </div>
                </div>
            }>
                <RSVPFormBohoChic />
            </Suspense>
        </main>
    )
}
