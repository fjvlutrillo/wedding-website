'use client'

/**
 * TRAVEL GUIDE COMPONENT - ENGLISH VERSION ONLY (FIXED)
 * 
 * FIXES APPLIED:
 * ✅ Actual Image components instead of placeholders
 * ✅ Adjusted grid layout for fewer restaurants (4 items)
 * ✅ Adjusted grid layout for fewer attractions (7 items)
 * ✅ Better mobile responsiveness
 * ✅ No awkward white space on desktop
 * 
 * Features:
 * - Magazine-style layout
 * - Expandable sections
 * - Real images with Next.js optimization
 * - Burgundy/terracotta color scheme
 */

import { useState } from 'react'
import Image from 'next/image'
import SectionHeader from '@/components/SectionHeader'

interface Restaurant {
    name: string
    cuisine: string
    description: string
    priceRange: string
    mustTry: string
    imagePlaceholder: string
}

interface Attraction {
    name: string
    category: string
    description: string
    duration: string
    imagePlaceholder: string
}

interface FlightInfo {
    from: string
    airline: string
    notes: string
}

export default function TravelGuide() {
    const [activeSection, setActiveSection] = useState<'flights' | 'restaurants' | 'attractions' | 'shuttle'>('shuttle')

    // Shuttle Information
    const shuttleInfo = {
        pickup: "We'll provide complimentary shuttle service from Mexico City airport (MEX) to your hotel",
        dropoff: "Return shuttle to the airport will be available after the wedding",
        booking: "Please RSVP with your flight details so we can coordinate pickup times",
        contact: "Contact us via WhatsApp for shuttle coordination"
    }

    // Flight Recommendations
    const flightRecommendations: FlightInfo[] = [
        {
            from: "United States",
            airline: "Direct flights available from major cities",
            notes: "Houston, Dallas, Atlanta and NYC offer the most frequent connections to Mexico City"
        },
        {
            from: "Mexico City (MEX)",
            airline: "1.5-hour drive",
            notes: "Consider flying into Mexico City if you want to explore the capital before the wedding"
        },
        {
            from: "Other International",
            airline: "Connect through Mexico City or Houston",
            notes: "Allow extra time for connections and customs"
        }
    ]

    // Restaurant Recommendations (4 restaurants - adjusted grid)
    const restaurants: Restaurant[] = [
        {
            name: "La Noria",
            cuisine: "Traditional Mexican",
            description: "Elegant hacienda-style restaurant serving authentic Puebla cuisine in a historic setting.",
            priceRange: "$$$",
            mustTry: "Mole poblano, chiles en nogada (in season)",
            imagePlaceholder: "/travel/restaurant-1.jpg"
        },
        {
            name: "El Mural de los Poblanos",
            cuisine: "Contemporary Mexican",
            description: "Modern take on traditional dishes with stunning views of the cathedral.",
            priceRange: "$$$",
            mustTry: "Cemita poblana, molotes",
            imagePlaceholder: "/travel/restaurant-2.jpg"
        },
        {
            name: "Casa Reyna Restaurant",
            cuisine: "Fine Dining",
            description: "Upscale dining experience in a beautifully restored colonial mansion.",
            priceRange: "$$$$",
            mustTry: "Tasting menu, local wines",
            imagePlaceholder: "/travel/restaurant-3.jpg"
        },
        {
            name: "Fonda de Santa Clara",
            cuisine: "Traditional Poblano",
            description: "Family-run restaurant known for authentic regional flavors since 1965.",
            priceRange: "$$",
            mustTry: "Chalupas, mole, tamales",
            imagePlaceholder: "/travel/restaurant-4.jpg"
        }
    ]

    // Puebla Attractions (7 attractions - adjusted grid)
    const attractions: Attraction[] = [
        {
            name: "Historic Center (Zócalo)",
            category: "Architecture & Culture",
            description: "UNESCO World Heritage Site with stunning colonial architecture, the cathedral, and vibrant street life.",
            duration: "Half day",
            imagePlaceholder: "/travel/zocalo.jpg"
        },
        {
            name: "Biblioteca Palafoxiana",
            category: "History",
            description: "First public library in the Americas, housing over 45,000 antique books in a breathtaking baroque setting.",
            duration: "1-2 hours",
            imagePlaceholder: "/travel/library.jpg"
        },
        {
            name: "Cholula Pyramid",
            category: "Archaeological Site",
            description: "Largest pyramid by volume in the world, topped with a colonial church. Nearby colorful town with artisan markets.",
            duration: "Half day",
            imagePlaceholder: "/travel/cholula.jpg"
        },
        {
            name: "Estrella de Puebla",
            category: "Views & Entertainment",
            description: "Giant observation wheel offering panoramic views of the city and surrounding volcanoes.",
            duration: "1 hour",
            imagePlaceholder: "/travel/estrella.jpg"
        },
        {
            name: "Barrio del Artista",
            category: "Art & Shopping",
            description: "Charming artists' quarter with galleries, live painters, and traditional crafts.",
            duration: "2-3 hours",
            imagePlaceholder: "/travel/barrio.jpg"
        },
        {
            name: "Museo Amparo",
            category: "Museum",
            description: "World-class museum featuring pre-Hispanic, colonial, and contemporary Mexican art.",
            duration: "2-3 hours",
            imagePlaceholder: "/travel/museo.jpg"
        },
        {
            name: "Talavera Workshops",
            category: "Artisan Experience",
            description: "Visit traditional pottery workshops to see master artisans creating the famous Puebla tiles and ceramics.",
            duration: "2 hours",
            imagePlaceholder: "/travel/talavera.jpg"
        }
    ]

    return (
        <section id="travel-guide" className="relative py-16 sm:py-24 px-4 bg-gradient-to-b from-warm-cream to-stone-50">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <SectionHeader
                    chapter="03"
                    title="Travel"
                    subtitle="Guide"
                    description="Everything you need to know for your trip to Puebla"
                    align="center"
                />

                {/* Tab Navigation - Magazine style */}
                <div className="flex justify-center mb-12 overflow-x-auto">
                    <div className="inline-flex bg-white rounded-full p-2 gap-2 shadow-wedding border border-wedding-blush min-w-max">
                        {[
                            { id: 'shuttle', label: 'Airport Shuttle', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
                            { id: 'flights', label: 'Flights', icon: 'M5 13l4 4L19 7' },
                            { id: 'restaurants', label: 'Restaurants', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                            { id: 'attractions', label: 'What to See', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id as any)}
                                className={`
                                    flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-light tracking-wide uppercase transition-all duration-300
                                    ${activeSection === tab.id
                                        ? 'bg-wedding-burgundy text-white shadow-wedding-lg'
                                        : 'text-stone-600 hover:text-wedding-burgundy hover:bg-wedding-blush/30'
                                    }
                                `}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                                </svg>
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ==================== AIRPORT SHUTTLE SECTION ==================== */}
                {activeSection === 'shuttle' && (
                    <div className="max-w-5xl mx-auto animate-fade-in-up">
                        {/* Hero Banner */}
                        <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-xl mb-12 border border-wedding-blush">
                            {/* ACTUAL SHUTTLE IMAGE */}
                            <Image
                                src="/travel/shuttle.jpg"
                                alt="Airport shuttle service"
                                fill
                                sizes="(max-width: 1280px) 100vw, 1280px"
                                className="object-cover"
                                priority
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Overlay text */}
                            <div className="absolute bottom-8 left-8 right-8 z-10">
                                <h3 className="text-3xl sm:text-4xl font-light text-white mb-2">
                                    Complimentary Airport Shuttle
                                </h3>
                                <p className="text-white/90 text-sm sm:text-base">
                                    We've got your transportation covered!
                                </p>
                            </div>
                        </div>

                        {/* Shuttle Information Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Pickup Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-wedding border border-wedding-blush">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wedding-burgundy/10 to-wedding-rose/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-light text-wedding-burgundy mb-2">Airport Pickup</h4>
                                        <p className="text-stone-600 text-sm leading-relaxed">
                                            {shuttleInfo.pickup}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-warm-cream rounded-xl p-4 border border-wedding-blush/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-wedding-rose" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-xs uppercase tracking-wider text-wedding-burgundy font-medium">From</span>
                                    </div>
                                    <p className="text-sm text-stone-700">Mexico City International Airport (MEX)</p>
                                </div>
                            </div>

                            {/* Return Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-wedding border border-wedding-blush">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wedding-burgundy/10 to-wedding-rose/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-light text-wedding-burgundy mb-2">Return Shuttle</h4>
                                        <p className="text-stone-600 text-sm leading-relaxed">
                                            {shuttleInfo.dropoff}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-warm-cream rounded-xl p-4 border border-wedding-blush/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-wedding-rose" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs uppercase tracking-wider text-wedding-burgundy font-medium">When</span>
                                    </div>
                                    <p className="text-sm text-stone-700">June 7, 2026</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Instructions */}
                        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-200/50 shadow-wedding">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-light text-wedding-burgundy mb-3">How to Book Your Shuttle</h4>
                                    <ol className="space-y-3 text-sm text-stone-600">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-wedding-burgundy text-white text-xs flex items-center justify-center font-medium">1</span>
                                            <span>Confirm your attendance via RSVP</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-wedding-burgundy text-white text-xs flex items-center justify-center font-medium">2</span>
                                            <span>Share your flight details (arrival & departure times)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-wedding-burgundy text-white text-xs flex items-center justify-center font-medium">3</span>
                                            <span>We'll coordinate pickup times and send you shuttle details</span>
                                        </li>
                                    </ol>

                                    <a
                                        href="https://wa.me/12146002210?text=Hi%20Susana%20and%20Javier%2C%20I%20need%20help%20with%20shuttle%20coordination"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Contact us on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== FLIGHTS SECTION ==================== */}
                {activeSection === 'flights' && (
                    <div className="max-w-5xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl sm:text-4xl font-light text-wedding-burgundy mb-4">Getting to Puebla</h3>
                            <p className="text-stone-600 max-w-2xl mx-auto">
                                Mexico City International Airport (MEX) is your closest option. Consider a 1.5 hour drive and enjoy the scenic drive through the volcanoes.
                            </p>
                        </div>

                        {/* Flight Options */}
                        <div className="space-y-6">
                            {flightRecommendations.map((flight, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-8 shadow-wedding border border-wedding-blush hover:shadow-wedding-lg transition-shadow duration-300">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wedding-burgundy/10 to-wedding-rose/10 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-8 h-8 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                            </svg>
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="text-2xl font-light text-wedding-burgundy mb-2">{flight.from}</h4>
                                            <p className="text-stone-700 mb-3 font-medium">{flight.airline}</p>
                                            <p className="text-stone-600 text-sm leading-relaxed">{flight.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Travel Tips */}
                        <div className="mt-12 bg-gradient-to-br from-warm-cream to-white rounded-2xl p-8 border border-wedding-blush shadow-wedding">
                            <h4 className="text-xl font-light text-wedding-burgundy mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Travel Tips
                            </h4>

                            <ul className="space-y-3 text-sm text-stone-600">
                                <li className="flex items-start gap-3">
                                    <span className="text-wedding-burgundy mt-0.5">•</span>
                                    <span><strong>Book early:</strong> June is peak travel season in Mexico. We recommend booking flights 2-3 months in advance.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-wedding-burgundy mt-0.5">•</span>
                                    <span><strong>Customs:</strong> International travelers will clear customs at Mexico City.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-wedding-burgundy mt-0.5">•</span>
                                    <span><strong>Arrival time:</strong> We recommend arriving on June 4 to avoid travel stress on wedding day.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-wedding-burgundy mt-0.5">•</span>
                                    <span><strong>Documents:</strong> Ensure your passport is valid for at least 6 months beyond your travel dates.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* ==================== RESTAURANTS SECTION ==================== */}
                {activeSection === 'restaurants' && (
                    <div className="max-w-6xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl sm:text-4xl font-light text-wedding-burgundy mb-4">Where to Eat</h3>
                            <p className="text-stone-600 max-w-2xl mx-auto">
                                Puebla is one of main Mexico's culinary capitals. From traditional mole to contemporary fusion, here are our favorite spots.
                            </p>
                        </div>

                        {/* Restaurant Grid - ADJUSTED FOR 4 ITEMS */}
                        {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 2 columns (centered with max-width) */}
                        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {restaurants.map((restaurant, idx) => (
                                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-wedding border border-wedding-blush hover:shadow-wedding-lg transition-all duration-300 group">
                                    {/* ACTUAL IMAGE - NOT PLACEHOLDER */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
                                        <Image
                                            src={restaurant.imagePlaceholder}
                                            alt={`${restaurant.name} restaurant`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, 50vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Price range badge */}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-wedding-burgundy shadow-wedding z-10">
                                            {restaurant.priceRange}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-3">
                                        <div>
                                            <h4 className="text-xl font-light text-wedding-burgundy mb-1 group-hover:text-wedding-burgundy-light transition-colors">
                                                {restaurant.name}
                                            </h4>
                                            <p className="text-xs uppercase tracking-wider text-wedding-rose">
                                                {restaurant.cuisine}
                                            </p>
                                        </div>

                                        <p className="text-sm text-stone-600 leading-relaxed">
                                            {restaurant.description}
                                        </p>

                                        <div className="pt-3 border-t border-wedding-blush">
                                            <p className="text-xs uppercase tracking-wider text-wedding-burgundy font-medium mb-1">
                                                Must Try
                                            </p>
                                            <p className="text-sm text-stone-700 italic">
                                                {restaurant.mustTry}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cuisine Note */}
                        <div className="mt-12 bg-gradient-to-br from-wedding-burgundy/5 to-wedding-rose/5 rounded-2xl p-8 border border-wedding-blush max-w-4xl mx-auto">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-wedding-burgundy/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-light text-wedding-burgundy mb-2">Local Specialties</h4>
                                    <p className="text-sm text-stone-600 leading-relaxed mb-3">
                                        Puebla is famous for <strong>mole poblano</strong> (complex chocolate-chile sauce), <strong>chiles en nogada</strong> (seasonal, available July-September), and <strong>cemitas</strong> (unique Puebla sandwiches).
                                    </p>
                                    <p className="text-sm text-stone-600">
                                        Don't leave without trying authentic Puebla-style tacos árabes and chalupas!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== ATTRACTIONS SECTION ==================== */}
                {activeSection === 'attractions' && (
                    <div className="max-w-6xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl sm:text-4xl font-light text-wedding-burgundy mb-4">Explore Puebla</h3>
                            <p className="text-stone-600 max-w-2xl mx-auto">
                                A UNESCO World Heritage city with 365 churches, stunning colonial architecture, and rich cultural heritage.
                            </p>
                        </div>

                        {/* Attractions Grid - ADJUSTED FOR 7 ITEMS */}
                        {/* Mobile: 1 column, Desktop: 2 columns */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {attractions.map((attraction, idx) => (
                                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-wedding border border-wedding-blush hover:shadow-wedding-lg transition-all duration-300 group">
                                    <div className="md:flex">
                                        {/* ACTUAL IMAGE - NOT PLACEHOLDER */}
                                        <div className="relative md:w-48 h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
                                            <Image
                                                src={attraction.imagePlaceholder}
                                                alt={attraction.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 192px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {/* Category badge */}
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-wedding-burgundy shadow-wedding z-10">
                                                {attraction.category}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <h4 className="text-xl font-light text-wedding-burgundy group-hover:text-wedding-burgundy-light transition-colors">
                                                    {attraction.name}
                                                </h4>
                                                <div className="flex items-center gap-1 text-xs text-stone-500 flex-shrink-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {attraction.duration}
                                                </div>
                                            </div>

                                            <p className="text-sm text-stone-600 leading-relaxed">
                                                {attraction.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Planning Tips */}
                        <div className="mt-12 grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-warm-cream to-white rounded-2xl p-6 border border-wedding-blush shadow-wedding">
                                <h4 className="text-lg font-light text-wedding-burgundy mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Best Times to Visit
                                </h4>
                                <ul className="space-y-2 text-sm text-stone-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Weekday mornings:</strong> Less crowded at popular sites</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Late afternoon:</strong> Perfect for strolling the Zócalo</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Sundays:</strong> Many museums offer free admission</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-warm-cream to-white rounded-2xl p-6 border border-wedding-blush shadow-wedding">
                                <h4 className="text-lg font-light text-wedding-burgundy mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    What to Bring Home
                                </h4>
                                <ul className="space-y-2 text-sm text-stone-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Talavera pottery:</strong> Hand-painted ceramics and tiles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Onyx crafts:</strong> Unique stone carvings</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Local sweets:</strong> Camotes, tortitas de Santa Clara</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    )
}