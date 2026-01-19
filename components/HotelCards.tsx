/**
 * EDITORIAL HOTEL CARDS - UPDATED WITH ALL RESERVATION FIXES
 * 
 * Features:
 * - Images for all hotels (host + support)
 * - Reservation codes for all hotels
 * - Special handling for each hotel's reservation process:
 *   - Casareyna: Phone call only
 *   - Banyan Tree: Email & WhatsApp
 *   - City Express: Email (with multiple CCs) & Phone
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
        email?: string           // Primary email for reservations
        emailCC?: string[]       // CC emails (for City Express)
        whatsapp?: string        // WhatsApp number (for Banyan Tree)
        reservationMethod: 'phone-only' | 'email-whatsapp' | 'email-phone' | 'online'
    }
    image: string
}

export default function HotelCards() {
    const hotels: Hotel[] = [
        {
            name: "CASAREYNA",
            description: "Hotel boutique ubicado en el centro histórico de Puebla. Para obtener la tarifa especial, es necesario llamar directamente al hotel y mencionar el código de reserva.",
            type: "host",
            amenities: ["Transporte a la hacienda", "Spa", "Restaurante", "Estacionamiento", "WiFi", "Gym"],
            distance: "25 min de la hacienda",
            reservationInfo: {
                code: "BODA SUSANA & JAVIER",
                phone: "+52 222 232 0032",
                website: "https://www.casareyna.com/",
                reservationMethod: 'phone-only'
            },
            image: "/hotels/host-hotel.jpg"
        },
        {
            name: "Banyan Tree Puebla",
            description: "Hotel boutique con encanto colonial y servicios personalizados de lujo. Para reservar con el código especial, es necesario llamar o contactar vía email o WhatsApp.",
            type: "host",
            amenities: ["Transporte a la hacienda", "WiFi", "Room service", "Restaurantes", "Alberca", "Spa", "Gym"],
            distance: "25 min de la hacienda",
            reservationInfo: {
                code: "BODA SUSANA & JAVIER",
                phone: "+52 222 122 2310",
                website: "https://www.banyantree.com/es/mexico/puebla",
                email: "reservations.puebla@banyantree.com",
                whatsapp: "+522215250925",
                reservationMethod: 'email-whatsapp'
            },
            image: "/hotels/banyan-tree.jpg"
        },
        {
            name: "City Express by Marriott Puebla Centro",
            description: "Opción práctica, confortable y económica con excelente relación calidad-precio. Para obtener la tarifa especial, es necesario reservar por email o llamada telefónica mencionando el código.",
            type: "host",
            amenities: ["Transporte a la hacienda", "Desayuno", "WiFi", "Estacionamiento"],
            distance: "25 min de la hacienda",
            reservationInfo: {
                code: "SUYJA",
                phone: "+52 222 324 1062",
                website: "https://www.marriott.com/es/hotels/pbcxc-city-express-puebla-centro/overview/",
                email: "cepue.ventas@norte19.com",
                emailCC: [
                    "cepue.front@norte19.com",
                    "cepue.ayb@norte19.com",
                    "cepue.ventas2@norte19.com"
                ],
                reservationMethod: 'email-phone'
            },
            image: "/hotels/city-express.jpg"
        }
    ]

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
                    Hemos acordado tarifas especiales en estos hoteles para tu comodidad
                </p>
            </div>

            {/* All Hotels - Grid of featured cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {hotels.map((hotel, idx) => {
                    const method = hotel.reservationInfo.reservationMethod

                    return (
                        <div key={idx} className="relative group">
                            {/* "Hotel Sede" badge on all cards */}
                            <div className="absolute -top-3 left-6 z-10">
                                <div className="bg-wedding-burgundy text-white px-4 py-2 rounded-full text-xs uppercase tracking-[0.3em] shadow-wedding-lg">
                                    Hotel Sede
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-white to-warm-cream rounded-3xl overflow-hidden shadow-wedding-lg border border-wedding-blush hover:shadow-wedding-xl transition-all duration-500 h-full flex flex-col">

                                {/* Hotel Image */}
                                <div className="relative h-56 bg-stone-100">
                                    <Image
                                        src={hotel.image}
                                        alt={hotel.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6 sm:p-8 flex flex-col flex-grow space-y-4">
                                    {/* Hotel name with website link */}
                                    <div className="space-y-2">
                                        <h4 className="text-2xl sm:text-3xl font-light text-wedding-burgundy group-hover:text-wedding-burgundy-light transition-colors">
                                            {hotel.name}
                                        </h4>
                                        <a
                                            href={hotel.reservationInfo.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-wedding-rose hover:text-wedding-burgundy transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                            Ver sitio web del hotel
                                        </a>
                                    </div>

                                    {/* Description */}
                                    <p className="text-stone-600 text-sm leading-relaxed flex-grow">
                                        {hotel.description}
                                    </p>

                                    {/* Distance badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-wedding-blush/30 rounded-full self-start">
                                        <svg className="w-4 h-4 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        <span className="text-sm text-wedding-burgundy font-medium">{hotel.distance}</span>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2">
                                        {hotel.amenities.map((amenity, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 bg-white border border-wedding-blush rounded-full text-[11px] text-stone-600"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Reservation info */}
                                    <div className="space-y-2 pt-4 border-t border-wedding-blush">
                                        <p className="text-sm text-stone-600">
                                            <span className="font-medium text-wedding-burgundy">Código:</span> {hotel.reservationInfo.code}
                                        </p>
                                        <p className="text-sm text-stone-600">
                                            <span className="font-medium text-wedding-burgundy">Teléfono:</span> {hotel.reservationInfo.phone}
                                        </p>
                                        {hotel.reservationInfo.email && (
                                            <p className="text-sm text-stone-600">
                                                <span className="font-medium text-wedding-burgundy">Email:</span> {hotel.reservationInfo.email}
                                            </p>
                                        )}
                                        {method === 'phone-only' && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                                <p className="text-xs text-amber-800">
                                                    <span className="font-medium">Importante:</span> Para obtener la tarifa especial, es necesario llamar directamente.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Buttons - Different based on reservation method */}
                                    <div className="flex flex-col gap-2 pt-2">
                                        {method === 'phone-only' ? (
                                            // PHONE ONLY (Casareyna)
                                            <a
                                                href={`tel:${hotel.reservationInfo.phone.replace(/\s/g, '')}`}
                                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white text-xs tracking-wider uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                </svg>
                                                Llamar para Reservar
                                            </a>
                                        ) : method === 'email-whatsapp' ? (
                                            // EMAIL & WHATSAPP (Banyan Tree)
                                            <>
                                                <a
                                                    href={`mailto:${hotel.reservationInfo.email}?subject=${encodeURIComponent(`Reservación código ${hotel.reservationInfo.code}`)}`}
                                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white text-xs tracking-wider uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                    </svg>
                                                    Reservar por Email
                                                </a>
                                                <a
                                                    href={`https://wa.me/${hotel.reservationInfo.whatsapp}?text=${encodeURIComponent(`Hola, me gustaría reservar una habitación utilizando el código ${hotel.reservationInfo.code}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs tracking-wider uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                    Reservar por WhatsApp
                                                </a>
                                                <a
                                                    href={`tel:${hotel.reservationInfo.phone.replace(/\s/g, '')}`}
                                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-warm-cream hover:bg-wedding-blush-light text-wedding-burgundy text-xs tracking-wider uppercase transition-all duration-300 rounded-full border border-wedding-blush hover:border-wedding-burgundy shadow-wedding"
                                                >
                                                    Llamar
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                    </svg>
                                                </a>
                                            </>
                                        ) : method === 'email-phone' ? (
                                            // EMAIL & PHONE (City Express)
                                            <>
                                                <a
                                                    href={`mailto:${hotel.reservationInfo.email}?cc=${hotel.reservationInfo.emailCC?.join(',')}&subject=${encodeURIComponent(`Reservación código ${hotel.reservationInfo.code}`)}`}
                                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white text-xs tracking-wider uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                    </svg>
                                                    Reservar por Email
                                                </a>
                                                <a
                                                    href={`tel:${hotel.reservationInfo.phone.replace(/\s/g, '')}`}
                                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-warm-cream hover:bg-wedding-blush-light text-wedding-burgundy text-xs tracking-wider uppercase transition-all duration-300 rounded-full border border-wedding-blush hover:border-wedding-burgundy shadow-wedding"
                                                >
                                                    Llamar para Reservar
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                    </svg>
                                                </a>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
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
                                Los códigos de reserva están disponibles del <span className="font-medium">5 al 7 de junio de 2026</span>.
                            </p>
                            <ul className="text-sm text-stone-600 space-y-1 mt-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-wedding-burgundy mt-0.5">•</span>
                                    <span><span className="font-medium">Casareyna:</span> Llamar directamente para obtener la tarifa especial</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-wedding-burgundy mt-0.5">•</span>
                                    <span><span className="font-medium">Banyan Tree:</span> Reservar por llamada, email o WhatsApp mencionando el código</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-wedding-burgundy mt-0.5">•</span>
                                    <span><span className="font-medium">City Express:</span> Reservar por email o llamada mencionando el código</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}