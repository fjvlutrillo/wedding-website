'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Event {
  title: string
  time: string
  location: string
  address: string
  mapUrl: string
  icon: string
  description: string
}

export default function EventDetails() {
  const [activeTab, setActiveTab] = useState<'ceremony' | 'reception'>('ceremony')

  const events: Record<'ceremony' | 'reception', Event> = {
    ceremony: {
      title: 'Ceremonia Religiosa',
      time: '1:00 PM',
      location: 'Capilla de la Hacienda San Juan Bautista Amalucan',
      address: 'Tecamachalco, Bosques Amaluca, Puebla',
      mapUrl: 'https://maps.google.com/?q=Hacienda+San+Juan+Bautista+Amalucan',
      icon: 'M10 9h4 M12 7v5 M14 21v-3a2 2 0 0 0-4 0v3 m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9 M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14',
      description: 'La ceremonia religiosa se realizará en la capilla de la hacienda. Comienza a la 1:00PM'
    },
    reception: {
      title: 'Recepción',
      time: '3:00 PM',
      location: 'Jardín de la hacienda',
      address: 'Mismo lugar - Hacienda San Juan Bautista Amalucan',
      mapUrl: 'https://maps.google.com/?q=Hacienda+San+Juan+Bautista+Amalucan',
      icon: 'M12 3V2M15.4 17.4l3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5M2 14h12a2 2 0 0 1 0 4h-2M4 10h16M5 10a7 7 0 0 1 14 0M5 14v6a1 1 0 0 1-1 1H2',
      description: 'Después de la ceremonia, te esperamos para celebrar en el jarín de la hacienda.'
    }
  }

  const currentEvent = events[activeTab]

  return (
    <section id="evento" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-wedding-rose font-light">
            Capítulo 02
          </span>
          <h2 className="text-5xl sm:text-6xl font-light text-charcoal">
            El
            <span className="block font-luxury text-6xl sm:text-7xl mt-2 text-wedding-burgundy">Evento</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            6 de Junio, 2026 · Puebla, México
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-wedding-burgundy-light rounded-full p-1.5 gap-2">
            <button
              onClick={() => setActiveTab('ceremony')}
              className={`
                px-6 py-2.5 rounded-full text-sm font-light tracking-wide uppercase transition-all duration-300
                ${activeTab === 'ceremony'
                  ? 'bg-warm-cream text-wedding-burgundy shadow-wedding'
                  : 'text-wedding-rose hover:text-wedding-burgundy'
                }
              `}
            >
              Ceremonia
            </button>
            <button
              onClick={() => setActiveTab('reception')}
              className={`
                px-6 py-2.5 rounded-full text-sm font-light tracking-wide uppercase transition-all duration-300
                ${activeTab === 'reception'
                  ? 'bg-warm-cream text-wedding-burgundy shadow-wedding'
                  : 'text-wedding-rose hover:text-wedding-burgundy'
                }
              `}
            >
              Recepción
            </button>
          </div>
        </div>

        {/* Event Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white to-stone-50 rounded-3xl overflow-hidden shadow-xl border border-wedding-blush">
            {/* Image Header */}
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <Image
                src={activeTab === 'ceremony' ? '/ceremony-venue.jpg' : '/reception-venue.jpg'}
                alt={currentEvent.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Time Badge */}
              <div className="absolute bottom-6 left-6 bg-warm-cream/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-wedding-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-wedding-burgundy">{currentEvent.time}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 sm:p-10 space-y-8">
              {/* Title */}
              <div className="text-center space-y-2">
                <h3 className="text-3xl sm:text-4xl font-light text-wedding-burgundy">
                  {currentEvent.title}
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-xl mx-auto">
                  {currentEvent.description}
                </p>
              </div>

              {/* Location Details */}
              <div className="bg-warm-cream rounded-2xl p-6 border border-wedding-blush">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={currentEvent.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xl font-light text-wedding-burgundy">{currentEvent.location}</h4>
                    <p className="text-stone-600 text-sm">{currentEvent.address}</p>
                  </div>
                </div>

                {/* Map Button */}
                <a
                  href={currentEvent.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Ver ubicación
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0 M12 7a3 3 0 1 1 0 6a3 3 0 1 1 0-6'
 />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-stone-50 to-white rounded-2xl p-8 border border-wedding-blush">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-warm-cream flex items-center justify-center flex-shrink-0 shadow-wedding">
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-light text-wedding-burgundy mb-2">Hospedaje</h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  Tarifa especial en <span className="font-medium">Placeholder Hotel Puebla</span>
                </p>

                <div className="space-y-2 text-sm text-stone-600">
                  <p><span className="font-medium text-wedding-burgundy">Fechas:</span> 4 al 8 de junio, 2026</p>
                  <p><span className="font-medium text-wedding-burgundy">Código:</span> Boda Susana y Javier</p>
                  <p><span className="font-medium text-wedding-burgundy">Reservación:</span> 222 XXX XXXX</p>
                </div>

                <a
                  href="tel:+52222XXXXXXX"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-warm-cream hover:bg-stone-50 text-wedding-burgundy text-sm tracking-wide uppercase transition-colors duration-300 rounded-full border border-wedding-blush shadow-wedding"
                >
                  Llamar para reservar
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
