'use client'

/**
 * GUÍA DE VIAJE - VERSIÓN EN ESPAÑOL
 * 
 * CORRECCIONES APLICADAS:
 * ✅ Tab activo por defecto (restaurants) — antes era undefined
 * ✅ Traducción completa al español
 * ✅ Imágenes reales con Next.js Image
 * ✅ Grid ajustado para 4 restaurantes y 7 atracciones
 * ✅ Diseño responsivo móvil
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

export default function TravelGuide() {
    // ✅ FIX: Se establece 'restaurants' como valor por defecto.
    // Antes: useState<...>() → valor inicial undefined → nada se renderizaba
    // Ahora: useState('restaurants') → la sección de restaurantes se muestra al cargar
    const [activeSection, setActiveSection] = useState<'restaurants' | 'attractions'>('restaurants')

    // Recomendaciones de restaurantes
    const restaurants: Restaurant[] = [
        {
            name: "La Noria",
            cuisine: "Mexicana Tradicional",
            description: "Elegante restaurante estilo hacienda que sirve auténtica cocina poblana en un entorno histórico.",
            priceRange: "$$$",
            mustTry: "Mole poblano, chiles en nogada (en temporada)",
            imagePlaceholder: "/travel/restaurant-1.jpg"
        },
        {
            name: "El Mural de los Poblanos",
            cuisine: "Mexicana Contemporánea",
            description: "Versión moderna de platillos tradicionales con impresionantes vistas a la catedral.",
            priceRange: "$$$",
            mustTry: "Cemita poblana, molotes",
            imagePlaceholder: "/travel/restaurant-2.jpg"
        },
        {
            name: "Casa Reyna Restaurant",
            cuisine: "Alta Cocina",
            description: "Una experiencia gastronómica de lujo en una hermosa mansión colonial restaurada.",
            priceRange: "$$$$",
            mustTry: "Menú de degustación, vinos locales",
            imagePlaceholder: "/travel/restaurant-3.jpg"
        },
        {
            name: "Fonda de Santa Clara",
            cuisine: "Cocina Poblana Tradicional",
            description: "Restaurante familiar conocido por sus sabores regionales auténticos desde 1965.",
            priceRange: "$$",
            mustTry: "Chalupas, mole, tamales",
            imagePlaceholder: "/travel/restaurant-4.jpg"
        }
    ]

    // Atracciones en Puebla
    const attractions: Attraction[] = [
        {
            name: "Centro Histórico (Zócalo)",
            category: "Arquitectura y Cultura",
            description: "Patrimonio de la Humanidad por la UNESCO con impresionante arquitectura colonial, la catedral y una animada vida callejera.",
            duration: "Medio día",
            imagePlaceholder: "/travel/zocalo.jpg"
        },
        {
            name: "Biblioteca Palafoxiana",
            category: "Historia",
            description: "Primera biblioteca pública de América, con más de 45,000 libros antiguos en un impresionante entorno barroco.",
            duration: "1-2 horas",
            imagePlaceholder: "/travel/library.jpg"
        },
        {
            name: "Pirámide de Cholula",
            category: "Zona Arqueológica",
            description: "La pirámide más grande del mundo por volumen, coronada por una iglesia colonial. Pueblo colorido con mercados de artesanías.",
            duration: "Medio día",
            imagePlaceholder: "/travel/cholula.jpg"
        },
        {
            name: "Estrella de Puebla",
            category: "Vistas y Entretenimiento",
            description: "Gran rueda de observación con vistas panorámicas de la ciudad y los volcanes que la rodean.",
            duration: "1 hora",
            imagePlaceholder: "/travel/estrella.jpg"
        },
        {
            name: "Barrio del Artista",
            category: "Arte y Compras",
            description: "Pintoresco barrio de artistas con galerías, pintores en vivo y artesanías tradicionales.",
            duration: "2-3 horas",
            imagePlaceholder: "/travel/barrio.jpg"
        },
        {
            name: "Museo Amparo",
            category: "Museo",
            description: "Museo de clase mundial con arte mexicano prehispánico, colonial y contemporáneo.",
            duration: "2-3 horas",
            imagePlaceholder: "/travel/museo.jpg"
        },
        {
            name: "Talleres de Talavera",
            category: "Experiencia Artesanal",
            description: "Visita talleres de alfarería tradicional para ver a maestros artesanos crear los famosos azulejos y cerámica poblana.",
            duration: "2 horas",
            imagePlaceholder: "/travel/talavera.jpg"
        }
    ]

    return (
        <section id="guia" className="relative py-16 sm:py-24 px-4 bg-gradient-to-b from-warm-cream to-stone-50">
            <div className="max-w-7xl mx-auto">

                {/* Encabezado de sección */}
                <SectionHeader
                    chapter="04"
                    title="Guía de viaje"
                    subtitle=""
                    description="Todo lo que necesitas saber para tu visita a Puebla"
                    align="center"
                />

                {/* Navegación por pestañas */}
                <div className="flex justify-center mb-12 overflow-x-auto">
                    <div className="inline-flex bg-white rounded-full p-2 gap-2 shadow-wedding border border-wedding-blush min-w-max">
                        {[
                            {
                                id: 'restaurants',
                                label: 'Restaurantes',
                                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                            },
                            {
                                id: 'attractions',
                                label: 'Qué Visitar',
                                icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id as 'restaurants' | 'attractions')}
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

                {/* ==================== SECCIÓN RESTAURANTES ==================== */}
                {activeSection === 'restaurants' && (
                    <div className="max-w-6xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl sm:text-4xl font-light text-wedding-burgundy mb-4">Dónde Comer</h3>
                            <p className="text-stone-600 max-w-2xl mx-auto">
                                Puebla es una de las principales capitales culinarias de México. Desde el mole tradicional hasta la fusión contemporánea, aquí están nuestros lugares favoritos.
                            </p>
                        </div>

                        {/* Grid de restaurantes — 2 columnas en tablet/desktop */}
                        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {restaurants.map((restaurant, idx) => (
                                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-wedding border border-wedding-blush hover:shadow-wedding-lg transition-all duration-300 group">
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
                                        <Image
                                            src={restaurant.imagePlaceholder}
                                            alt={`Restaurante ${restaurant.name}`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, 50vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-wedding-burgundy shadow-wedding z-10">
                                            {restaurant.priceRange}
                                        </div>
                                    </div>

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
                                                No te pierdas
                                            </p>
                                            <p className="text-sm text-stone-700 italic">
                                                {restaurant.mustTry}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Nota sobre la gastronomía local */}
                        <div className="mt-12 bg-gradient-to-br from-wedding-burgundy/5 to-wedding-rose/5 rounded-2xl p-8 border border-wedding-blush max-w-4xl mx-auto">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-wedding-burgundy/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-light text-wedding-burgundy mb-2">Especialidades Locales</h4>
                                    <p className="text-sm text-stone-600 leading-relaxed mb-3">
                                        Puebla es famosa por el <strong>mole poblano</strong> (salsa compleja de chocolate y chile), los <strong>chiles en nogada</strong> (de temporada, disponibles de julio a septiembre) y las <strong>cemitas</strong> (los únicos sándwiches al estilo Puebla).
                                    </p>
                                    <p className="text-sm text-stone-600">
                                        ¡No te vayas sin probar los auténticos tacos árabes y las chalupas al estilo poblano!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== SECCIÓN ATRACCIONES ==================== */}
                {activeSection === 'attractions' && (
                    <div className="max-w-6xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl sm:text-4xl font-light text-wedding-burgundy mb-4">Explora Puebla</h3>
                            <p className="text-stone-600 max-w-2xl mx-auto">
                                Ciudad Patrimonio de la Humanidad con 365 iglesias, impresionante arquitectura colonial y un rico patrimonio cultural.
                            </p>
                        </div>

                        {/* Grid de atracciones — 2 columnas en desktop */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {attractions.map((attraction, idx) => (
                                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-wedding border border-wedding-blush hover:shadow-wedding-lg transition-all duration-300 group">
                                    <div className="md:flex">
                                        <div className="relative md:w-48 h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
                                            <Image
                                                src={attraction.imagePlaceholder}
                                                alt={attraction.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 192px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-wedding-burgundy shadow-wedding z-10">
                                                {attraction.category}
                                            </div>
                                        </div>

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

                        {/* Consejos de planificación */}
                        <div className="mt-12 grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-warm-cream to-white rounded-2xl p-6 border border-wedding-blush shadow-wedding">
                                <h4 className="text-lg font-light text-wedding-burgundy mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Mejores Horarios para Visitar
                                </h4>
                                <ul className="space-y-2 text-sm text-stone-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Mañanas entre semana:</strong> Menos afluencia en los lugares populares</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Al atardecer:</strong> Perfecto para pasear por el Zócalo</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Domingos:</strong> Muchos museos ofrecen entrada gratuita</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-warm-cream to-white rounded-2xl p-6 border border-wedding-blush shadow-wedding">
                                <h4 className="text-lg font-light text-wedding-burgundy mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Qué Llevar de Recuerdo
                                </h4>
                                <ul className="space-y-2 text-sm text-stone-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Talavera:</strong> Cerámica y azulejos pintados a mano</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Artesanías de ónix:</strong> Tallas únicas en piedra</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-wedding-burgundy mt-0.5">•</span>
                                        <span><strong>Dulces típicos:</strong> Camotes, tortitas de Santa Clara</span>
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