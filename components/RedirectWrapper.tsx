'use client'

/**
 * REDIRECT WRAPPER COMPONENT
 * 
 * LEARNING NOTE:
 * This component controls access to your main page during development.
 * 
 * HOW IT WORKS:
 * 1. Checks URL for ?dev=true parameter
 * 2. If found: Shows the main page (for you to work on)
 * 3. If not found: Redirects to Save the Date page
 * 4. Blocks RSVP access for guests (no tokens allowed)
 * 5. Always allows /admin routes
 * 
 * USAGE:
 * - Guests visit: bodasusanayjavier.com → See Save the Date
 * - Guests visit: bodasusanayjavier.com/rsvp → Redirected to Save the Date
 * - You visit: bodasusanayjavier.com?dev=true → See main page
 * - You visit: bodasusanayjavier.com/admin → Always accessible
 * 
 * TO DISABLE THIS REDIRECT (when ready to launch):
 * - Simply remove this component from page.tsx
 * - Or set ENABLE_REDIRECT = false below
 */

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const ENABLE_REDIRECT = true // Set to false when ready to launch main site

export default function RedirectWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if redirect is enabled
        if (!ENABLE_REDIRECT) {
            setIsAuthorized(true)
            setIsLoading(false)
            return
        }

        // ALWAYS allow admin routes - no questions asked
        if (pathname.startsWith('/admin')) {
            setIsAuthorized(true)
            setIsLoading(false)
            return
        }

        // Check for developer bypass parameter
        const isDev = searchParams.get('dev') === 'true'

        if (isDev) {
            // Developer mode: show main page
            setIsAuthorized(true)
            setIsLoading(false)

            // Store in sessionStorage so you don't need ?dev=true on every click
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('dev_mode', 'true')
            }
        } else {
            // Check if developer mode was set in session
            const devMode = typeof window !== 'undefined'
                ? sessionStorage.getItem('dev_mode') === 'true'
                : false

            if (devMode) {
                setIsAuthorized(true)
                setIsLoading(false)
            } else {
                // Regular visitor: redirect to Save the Date
                // This now includes RSVP page - no token access during development
                router.replace('/save-the-date')
            }
        }
    }, [router, searchParams, pathname])

    // Show loading state while checking
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-cream">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-wedding-rose border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-wedding-burgundy font-light">Cargando...</p>
                </div>
            </div>
        )
    }

    // Show main page if authorized
    if (isAuthorized) {
        return <>{children}</>
    }

    // This shouldn't be reached, but return null as fallback
    return null
}