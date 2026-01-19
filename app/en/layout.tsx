/**
 * ENGLISH VERSION LAYOUT
 * 
 * File location: app/en/layout.tsx
 * 
 * This layout handles the English version of your wedding site.
 * It has its own Open Graph metadata so when someone shares:
 * https://bodasusanayjavier.com/en
 * 
 * They'll see the hero image with English text in the preview!
 */

export const metadata = {
    // Basic metadata - English
    title: 'Susana & Javier Wedding | June 6, 2026',
    description: 'You are invited to celebrate our wedding on June 6, 2026 at Hacienda San Juan Bautista Amalucan, Puebla, Mexico. Please RSVP.',

    // 🌍 OPEN GRAPH TAGS - English Version
    openGraph: {
        title: 'Susana & Javier Wedding',
        description: 'You are invited to celebrate our wedding on June 6, 2026 in Puebla, Mexico',
        url: 'https://bodasusanayjavier.com/en',
        siteName: 'Susana & Javier Wedding',
        images: [
            {
                url: 'https://bodasusanayjavier.com/hero.jpg', // 🎯 SAME HERO IMAGE
                width: 1200,
                height: 630,
                alt: 'Susana & Javier - June 6, 2026 - Puebla, Mexico',
            },
        ],
        locale: 'en_US',  // English (United States)
        type: 'website',
    },

    // 🐦 TWITTER CARD TAGS - English Version
    twitter: {
        card: 'summary_large_image',
        title: 'Susana & Javier Wedding',
        description: 'You are invited to celebrate our wedding on June 6, 2026 in Puebla, Mexico',
        images: ['https://bodasusanayjavier.com/hero.jpg'], // 🎯 SAME HERO IMAGE
    },

    // Additional SEO
    keywords: 'wedding, Susana, Javier, Puebla, Mexico, 2026, Hacienda San Juan Bautista Amalucan',
    authors: [{ name: 'Susana & Javier' }],
}

export default function EnglishLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div lang="en">
            {children}
        </div>
    )
}