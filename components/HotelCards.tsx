/**
 * EDITORIAL HOTEL CARDS - UPDATED
 * 
 * Features:
 * - Images for all hotels (host + support)
 * - Reservation codes for all hotels
 * - Phone call links for all hotels
 * - Responsive image display with Next.js Image
 */

import Image from 'next/image'

interface Hotel {
    name: string
    description: string
    type: 'host' | 'support'
    amenities: string[]
    distance: string
    reservationInfo: {
        code: string
        phone: string
        website: string
    }
    image: string
}

export default function HotelCards() {
    const hotels: Hotel[] = [
        {
            name: "CASAREYNA",
            description: "Nuestro hotel sede con tarifas preferenciales para nuestros invitados. Ubicado en el centro histórico de Puebla.",
            type: "host",
            amenities: ["Transporte a la hacienda", "Spa", "Restaurante", "Estacionamiento", "WiFi", "Gym"],
            distance: "25 min de la hacienda",
            reservationInfo: {
                code: "BODA-SUSANA-JAVIER",
                phone: "+52 222 232 0032",
                website: "https://www.casareyna.com/es/hotel/#book"
            },
            image: "/hotels/host-hotel.jpg"
        },
        {
            name: "Banyan Tree - Puebla",
            description: "Opción boutique con encanto colonial y servicios personalizados.",
            type: "support",
            amenities: ["Transporte a la hacienda", "WiFi", "Room service", "Restaurantes", "Alberca", "Spa", "Gym"],
            distance: "25 min de la hacienda",
            reservationInfo: {
                code: "BODA-SUSANA-JAVIER",
                phone: "+52 222 122 2300",
                website: "https://www.banyantree.com/es/mexico/puebla"
            },
            image: "/hotels/banyan-tree.jpg"
        },
        {
            name: "City Express by Marriott Puebla Centro",
            description: "Opción práctica y confortable con excelente relación calidad-precio.",
            type: "support",
            amenities: ["Transporte a la hacienda", "Desayuno", "WiFi", "Estacionamiento"],
            distance: "25 min de la hacienda",
            reservationInfo: {
                code: "BODA-SUSANA-JAVIER",
                phone: "+52 222 213 7330",
                website: "https://www.marriott.com/es/hotels/pbcxc-city-express-puebla-centro/overview/"
            },
            image: "/hotels/city-express.jpg"
        }
    ]

    const hostHotel = hotels.find(h => h.type === 'host')!
    const supportHotels = hotels.filter(h => h.type === 'support')

    return (
        <div className="space-y-12">

            {/* Section intro */}
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-px bg-wedding-burgundy/30"></div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-wedding-rose font-light">
                        Hospedaje
                    </span>
                    <div className="w-8 h-px bg-wedding-burgundy/30"></div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-light text-wedding-burgundy">
                    Dónde Hospedarse
                </h3>
                <p className="text-stone-600 max-w-2xl mx-auto">
                    Hemos reservado tarifas especiales en estos hoteles para tu comodidad
                </p>
            </div>

            {/* Host Hotel - Featured large card */}
            <div className="max-w-5xl mx-auto">
                <div className="relative group">
                    {/* "Featured" badge */}
                    <div className="absolute -top-3 left-8 z-10">
                        <div className="bg-wedding-burgundy text-white px-4 py-2 rounded-full text-xs uppercase tracking-[0.3em] shadow-wedding-lg">
                            Hotel Sede
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-warm-cream rounded-3xl overflow-hidden shadow-wedding-lg border border-wedding-blush hover:shadow-wedding-xl transition-all duration-500">
                        <div className="grid md:grid-cols-2 gap-0">

                            {/* Image side */}
                            <div className="relative h-64 md:h-auto min-h-[300px] bg-stone-100">
                                <Image
                                    src={hostHotel.image}
                                    alt={hostHotel.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>

                            {/* Content side */}
                            <div className="p-8 sm:p-10 flex flex-col justify-between">
                                <div className="space-y-6">
                                    {/* Hotel name */}
                                    <div className="space-y-2">
                                        <h4 className="text-3xl sm:text-4xl font-light text-wedding-burgundy">
                                            {hostHotel.name}
                                        </h4>
                                        <p className="text-stone-600 leading-relaxed">
                                            {hostHotel.description}
                                        </p>
                                    </div>

                                    {/* Distance badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-wedding-blush/30 rounded-full">
                                        <svg className="w-4 h-4 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        <span className="text-sm text-wedding-burgundy font-medium">{hostHotel.distance}</span>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2">
                                        {hostHotel.amenities.map((amenity, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-white border border-wedding-blush rounded-full text-xs text-stone-600"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Reservation info */}
                                    <div className="space-y-2 pt-4 border-t border-wedding-blush">
                                        <p className="text-sm text-stone-600">
                                            <span className="font-medium text-wedding-burgundy">Código:</span> {hostHotel.reservationInfo.code}
                                        </p>
                                        <p className="text-sm text-stone-600">
                                            <span className="font-medium text-wedding-burgundy">Teléfono:</span> {hostHotel.reservationInfo.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    <a
                                        href={hostHotel.reservationInfo.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Reservar Online
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                    <a
                                        href={`tel:${hostHotel.reservationInfo.phone.replace(/\s/g, '')}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 text-wedding-burgundy border border-wedding-blush text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding"
                                    >
                                        Llamar
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Hotels - Two column grid with images */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {supportHotels.map((hotel, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl overflow-hidden shadow-wedding border border-wedding-blush hover:shadow-wedding-lg transition-all duration-300 group"
                    >
                        {/* Hotel Image */}
                        <div className="relative h-48 bg-stone-100">
                            <Image
                                src={hotel.image}
                                alt={hotel.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8 space-y-4">
                            {/* Hotel name */}
                            <h5 className="text-2xl font-light text-wedding-burgundy group-hover:text-wedding-burgundy-light transition-colors">
                                {hotel.name}
                            </h5>

                            {/* Description */}
                            <p className="text-stone-600 text-sm leading-relaxed">
                                {hotel.description}
                            </p>

                            {/* Distance */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-wedding-blush/20 rounded-full">
                                <svg className="w-3.5 h-3.5 text-wedding-rose" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span className="text-xs text-wedding-burgundy">{hotel.distance}</span>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {hotel.amenities.map((amenity, i) => (
                                    <span
                                        key={i}
                                        className="px-2.5 py-1 bg-warm-cream border border-wedding-blush rounded-full text-[11px] text-stone-600"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>

                            {/* Reservation info */}
                            <div className="space-y-1 pt-2 text-xs text-stone-600">
                                <p>
                                    <span className="font-medium text-wedding-burgundy">Código:</span> {hotel.reservationInfo.code}
                                </p>
                                <p>
                                    <span className="font-medium text-wedding-burgundy">Teléfono:</span> {hotel.reservationInfo.phone}
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-2 pt-2">
                                <a
                                    href={hotel.reservationInfo.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white text-xs tracking-wider uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Reservar Online
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                                <a
                                    href={`tel:${hotel.reservationInfo.phone.replace(/\s/g, '')}`}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-warm-cream hover:bg-wedding-blush-light text-wedding-burgundy text-xs tracking-wider uppercase transition-all duration-300 rounded-full border border-wedding-blush group-hover:border-wedding-burgundy shadow-wedding"
                                >
                                    Llamar
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional info note */}
            <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-200/50 shadow-wedding">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1 space-y-2">
                            <h4 className="text-base font-medium text-wedding-burgundy">Información importante</h4>
                            <p className="text-sm text-stone-600 leading-relaxed">
                                Los códigos de reserva estan disponibles del <span className="font-medium">4 al 8 de junio, 2026</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}