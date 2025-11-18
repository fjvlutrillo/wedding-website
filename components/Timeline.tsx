'use client'

import { useState } from 'react'

interface TimelineEvent {
  time: string
  title: string
  description: string
  icon: string
  location?: string
}

export default function Timeline() {
  const timelineEvents: TimelineEvent[] = [
    
    {
      time: '2:00 PM',
      title: 'Ceremonia Religiosa',
      description: 'Nos uniremos en matrimonio ante Dios, familia y amigos en la hermosa capilla de la hacienda',
      icon: 'M10 9h4 M12 7v5 M14 21v-3a2 2 0 0 0-4 0v3 m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9 M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14',
      location: 'Capilla'
    },
    {
      time: '3:30 PM',
      title: 'Cóctel de Bienvenida',
      description: 'Disfruta de canapés, bebidas y música mientras nos preparamos para la gran recepción',
      icon: 'M8 22h8M12 11v11M19 3l-7 8-7-8Z',
      location: 'Terraza'
    },
    {
      time: '5:30 PM',
      title: 'Cena de Gala',
      description: 'Disfruta de un exquisito menú de tres tiempos preparado especialmente para esta noche',
      icon: 'M12 3V2M15.4 17.4l3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5M2 14h12a2 2 0 0 1 0 4h-2M4 10h16M5 10a7 7 0 0 1 14 0M5 14v6a1 1 0 0 1-1 1H2',
      location: 'Jardin'
    },
    {
      time: '8:00 PM',
      title: 'Party time',
      description: '¡Es hora de bailar! La pista estará abierta toda la noche con música en vivo y DJ',
      icon: 'M5.8 11.3 2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10M22 13l-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17M11 2l.33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z',
      location: 'Jardín'
    },
    {
      time: 'TBD',
      title: 'After Party',
      description: 'Para los mas duros, nos vemos en el after :p',
      icon: 'M12 2v8M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M8 6l4-4 4 4M16 18a4 4 0 0 0-8 0',
      location: 'Bunker'
    }
  ]

  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">
            Itinerario del día
          </span>
          <h2 className="text-5xl sm:text-6xl font-light text-[#2C2C2C]">
            Agenda de la
            <span className="block font-luxury text-6xl sm:text-7xl mt-2">Celebración</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Así será nuestro día especial.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 sm:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-stone-200 via-stone-300 to-stone-200" />

          {/* Events */}
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className="relative pl-20 sm:pl-28 group"
              >
                {/* Time Badge */}
                <div className="absolute left-0 top-0 flex items-center gap-3">
                  {/* Icon Circle */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 border-stone-300 group-hover:border-[#2C2C2C] flex items-center justify-center transition-all duration-300 shadow-sm z-10">
                    <svg 
                      className="w-7 h-7 sm:w-8 sm:h-8 text-stone-600 group-hover:text-[#2C2C2C] transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={event.icon} />
                    </svg>
                  </div>
                </div>

                {/* Event Card */}
                <div 
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200 hover:shadow-lg hover:border-stone-300 transition-all duration-300 cursor-pointer"
                  onClick={() => setExpandedEvent(expandedEvent === index ? null : index)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-stone-100 text-[#2C2C2C] text-xs font-medium rounded-full">
                          {event.time}
                        </span>
                        {event.location && (
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-light text-[#2C2C2C]">
                        {event.title}
                      </h3>
                    </div>
                    
                    {/* Expand Icon */}
                    <button 
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                      aria-label={expandedEvent === index ? "Colapsar" : "Expandir"}
                    >
                      <svg 
                        className={`w-4 h-4 text-stone-600 transition-transform duration-300 ${
                          expandedEvent === index ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Description - Expandable */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedEvent === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                      {event.description}
                    </p>
                  </div>

                  {/* Collapsed preview */}
                  {expandedEvent !== index && (
                    <p className="text-stone-500 text-sm line-clamp-1">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-stone-50 rounded-full border border-stone-200">
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-stone-600">
              Los horarios son aproximados y pueden variar ligeramente
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
