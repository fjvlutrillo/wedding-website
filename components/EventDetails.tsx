'use client'

import { useState } from 'react'
import Image from 'next/image'
import SectionHeader from '@/components/SectionHeader'
import HotelCards from '@/components/HotelCards'

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
      time: '2:00 PM',
      location: 'Capilla de la Hacienda San Juan Bautista Amalucan',
      address: 'Tecamachalco, Bosques Amaluca, Puebla',
      mapUrl: 'https://maps.google.com/?q=Hacienda+San+Juan+Bautista+Amalucan',
      icon: 'M10 9h4 M12 7v5 M14 21v-3a2 2 0 0 0-4 0v3 m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9 M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14',
      description: 'La ceremonia religiosa se realizará en la capilla de la hacienda. Comienza a las 2:00PM'
    },
    reception: {
      title: 'Recepción',
      time: '4:00 PM',
      location: 'Jardín de la hacienda',
      address: 'Mismo lugar - Hacienda San Juan Bautista Amalucan',
      mapUrl: 'https://maps.google.com/?q=Hacienda+San+Juan+Bautista+Amalucan',
      icon: 'M12 3V2M15.4 17.4l3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5M2 14h12a2 2 0 0 1 0 4h-2M4 10h16M5 10a7 7 0 0 1 14 0M5 14v6a1 1 0 0 1-1 1H2',
      description: 'Después de la ceremonia, te esperamos para celebrar en el jardín de la hacienda.'
    }
  }

  const currentEvent = events[activeTab]

  return (
    <section id="evento" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">

        <SectionHeader
          chapter="02"
          title="El"
          subtitle="Evento"
          description="6 de Junio, 2026 · Puebla, México"
          align="center"
        />

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

        {/* Hotel Information - New Editorial Cards */}
        <div className="mt-16">
          <HotelCards />
        </div>
      </div>
    </section>
  )
}