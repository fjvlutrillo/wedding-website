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
      time: '2:30 PM',
      location: 'Capilla de la Hacienda San Juan Bautista Amalucan',
      address: 'Tecamachalco, Bosques Amaluca, Puebla',
      mapUrl: 'https://maps.google.com/?q=Hacienda+San+Juan+Bautista+Amalucan',
      icon: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819',
      description: 'La ceremonia religiosa se realizará en la capilla de la hacienda.'
    },
    reception: {
      title: 'Recepción',
      time: '4:00 PM',
      location: 'Jardín de la hacienda',
      address: 'Mismo lugar - Hacienda San Juan Bautista Amalucan',
      mapUrl: 'https://maps.google.com/?q=Hacienda+San+Juan+Bautista+Amalucan',
      icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      description: 'Después de la ceremonia, te esperamos para celebrar en el jarín de la hacienda.'
    }
  }

  const currentEvent = events[activeTab]

  return (
    <section id="evento" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">
            Capítulo 02
          </span>
          <h2 className="text-5xl sm:text-6xl font-light text-[#2C2C2C]">
            El
            <span className="block font-luxury text-6xl sm:text-7xl mt-2">Evento</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            6 de Junio, 2026 · Puebla, México
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-stone-100 rounded-full p-1.5 gap-2">
            <button
              onClick={() => setActiveTab('ceremony')}
              className={`
                px-6 py-2.5 rounded-full text-sm font-light tracking-wide uppercase transition-all duration-300
                ${activeTab === 'ceremony'
                  ? 'bg-white text-[#2C2C2C] shadow-sm'
                  : 'text-stone-500 hover:text-[#2C2C2C]'
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
                  ? 'bg-white text-[#2C2C2C] shadow-sm'
                  : 'text-stone-500 hover:text-[#2C2C2C]'
                }
              `}
            >
              Recepción
            </button>
          </div>
        </div>

        {/* Event Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white to-stone-50 rounded-3xl overflow-hidden shadow-xl border border-stone-200">
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
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-[#2C2C2C]">{currentEvent.time}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 sm:p-10 space-y-8">
              {/* Title */}
              <div className="text-center space-y-2">
                <h3 className="text-3xl sm:text-4xl font-light text-[#2C2C2C]">
                  {currentEvent.title}
                </h3>
                <p className="text-stone-600 leading-relaxed max-w-xl mx-auto">
                  {currentEvent.description}
                </p>
              </div>

              {/* Location Details */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={currentEvent.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xl font-light text-[#2C2C2C]">{currentEvent.location}</h4>
                    <p className="text-stone-600 text-sm">{currentEvent.address}</p>
                  </div>
                </div>

                {/* Map Button */}
                <a
                  href={currentEvent.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2C2C] hover:bg-[#1A1A1A] text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Ver ubicación
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-stone-50 to-white rounded-2xl p-8 border border-stone-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-light text-[#2C2C2C] mb-2">Hospedaje</h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  Tarifa especial en <span className="font-medium">Placeholder Hotel Puebla</span>
                </p>

                <div className="space-y-2 text-sm text-stone-600">
                  <p><span className="font-medium text-[#2C2C2C]">Fechas:</span> 4 al 8 de junio, 2026</p>
                  <p><span className="font-medium text-[#2C2C2C]">Código:</span> Boda Susana y Javier</p>
                  <p><span className="font-medium text-[#2C2C2C]">Reservación:</span> 222 XXX XXXX</p>
                </div>

                <a
                  href="tel:+52222XXXXXXX"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white hover:bg-stone-50 text-[#2C2C2C] text-sm tracking-wide uppercase transition-colors duration-300 rounded-full border border-stone-200 shadow-sm"
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
