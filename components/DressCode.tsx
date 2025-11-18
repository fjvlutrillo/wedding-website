'use client'

import Image from 'next/image'

interface DressCodeOption {
  gender: 'Hombres' | 'Mujeres'
  title: string
  description: string
  colors: string[]
  examples: string[]
  icon: string
}

export default function DressCode() {
  const dressCodeOptions: DressCodeOption[] = [
    {
      gender: 'Hombres',
      title: 'Formal Elegante',
      description: 'Traje',
      colors: ['Tonos oscuros', 'Azul marino', 'Gris', 'Negro'],
      examples: ['Traje de 2 o 3 piezas', 'Corbata', 'Sin tenis'],
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      gender: 'Mujeres',
      title: 'Largo',
      description: 'Vestido formal de largo',
      colors: ['Colores vibrantes', 'Tonos pasteles', 'Evitar blanco y beige'],
      examples: ['Vestido largo'],
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    }
  ]

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">
            Detalles importantes
          </span>
          <h2 className="text-5xl sm:text-6xl font-light text-[#2C2C2C]">
            Código de
            <span className="block font-luxury text-6xl sm:text-7xl mt-2">Vestimenta</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Queremos que te sientas cómodo y elegante en nuestra celebración
          </p>
        </div>

        {/* Dress Code Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {dressCodeOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header with Icon */}
              <div className="bg-gradient-to-br from-stone-100 to-stone-50 p-8 text-center border-b border-stone-200">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <svg className="w-8 h-8 text-[#2C2C2C]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-[#2C2C2C] mb-1">{option.gender}</h3>
                <p className="text-sm uppercase tracking-wider text-stone-500">{option.title}</p>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Description */}
                <div className="text-center pb-6 border-b border-stone-100">
                  <p className="text-stone-600 leading-relaxed">{option.description}</p>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Colores sugeridos
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {option.colors.map((color, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-stone-100 text-stone-700 text-sm rounded-full border border-stone-200"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Opciones
                  </h4>
                  <ul className="space-y-2">
                    {option.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-600">
                        <span className="text-stone-400 mt-1">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Notes */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-200/50 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-light text-[#2C2C2C] mb-2">Nota importante</h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Por favor evita usar blanco, beige o colores muy claros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>El evento será en jardín, considera calzado cómodo apropiado para pasto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Habrá momentos al aire libre y bajo techo, te recomendamos traer un saco ligero</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
