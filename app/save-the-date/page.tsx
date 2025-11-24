import SaveTheDate from '@/components/SaveTheDate'

/**
 * SAVE THE DATE PAGE
 * 
 * This is a standalone page specifically designed for sharing via WhatsApp
 * before sending the full invitation.
 * 
 * Route: /save-the-date
 * 
 * Usage:
 * 1. Share this URL: https://bodasusanayjavier.com/save-the-date
 * 2. Or use the guest management page to send WhatsApp messages with this link
 */

export const metadata = {
    title: 'Save the Date - Susana & Javier',
    description: 'Guarda la fecha - 6 de Junio, 2026',
    openGraph: {
        title: 'Save the Date - Susana & Javier',
        description: '¡Nos casamos! 6 de Junio, 2026 - Puebla, México',
        images: ['/hero.jpg'],
    },
}

export default function SaveTheDatePage() {
    return <SaveTheDate />
}