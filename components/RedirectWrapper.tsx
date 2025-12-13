'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const ENABLE_REDIRECT = true

export default function RedirectWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!ENABLE_REDIRECT) {
            setIsAuthorized(true)
            setIsLoading(false)
            return
        }

        // ALWAYS allow admin routes
        if (pathname.startsWith('/admin')) {
            setIsAuthorized(true)
            setIsLoading(false)
            return
        }

        // Read query params from the real URL (reliable)
        const urlParams = new URLSearchParams(window.location.search)
        const devValue = urlParams.get('dev')
        const isDev = devValue === 'true' || devValue === '1'

        if (isDev) {
            setIsAuthorized(true)
            setIsLoading(false)
            sessionStorage.setItem('dev_mode', 'true')
            return
        }

        // Session bypass
        const devMode = sessionStorage.getItem('dev_mode') === 'true'
        if (devMode) {
            setIsAuthorized(true)
            setIsLoading(false)
            return
        }

        // Regular visitor: redirect to Save the Date
        if (pathname !== '/save-the-date') {
            router.replace('/save-the-date')
        }
        setIsLoading(false)
    }, [router, pathname])

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

    if (isAuthorized) return <>{children}</>

    return null
}
