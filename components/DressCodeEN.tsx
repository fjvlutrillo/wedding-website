'use client'

import Image from 'next/image'
import SectionHeader from '@/components/SectionHeader'

interface DressCodeOption {
  gender: 'Men' | 'Women'
  title: string
  description: string
  colors: string[]
  examples: string[]
  icon: string
}

export default function DressCode() {
  const dressCodeOptions: DressCodeOption[] = [
    {
      gender: 'Men',
      title: 'Formal',
      description: 'Suit',
      colors: ['Dark Tones', 'Navy Blue', 'Grey', 'Black'],
        examples: ['Two- or three-piece suit', 'Tie Required', 'No Sneakers'],
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      gender: 'Women',
      title: 'Formal',
      description: 'Long Formal Dress',
      colors: ['Avoid white or beige'],
    examples: ['Long dress', 'The event will take place in a garden setting; please plan to wear comfortable footwear suitable for grass.'],
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    }
  ]

  return (
    <section className="relative py-16 sm:py-20 px-4 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}

        <SectionHeader
          chapter="03"
          title="Dress"
          subtitle="Code"
            description="We want you to feel both comfortable and elegant as you celebrate with us."
          align="center"
        />

        {/* Dress Code Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
          {dressCodeOptions.map((option, index) => (
            <div
              key={index}
              className="bg-warm-cream rounded-3xl overflow-hidden shadow-wedding-lg border border-wedding-blush hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header with Icon */}
              <div className="bg-gradient-to-br from-stone-100 to-stone-50 p-8 text-center border-b border-wedding-blush">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-cream flex items-center justify-center shadow-wedding">
                  <svg className="w-8 h-8 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={option.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-wedding-burgundy mb-1">{option.gender}</h3>
                <p className="text-sm uppercase tracking-wider text-wedding-rose">{option.title}</p>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Description */}
                <div className="text-center pb-6 border-b border-wedding-blush">
                  <p className="text-stone-600 leading-relaxed">{option.description}</p>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-wedding-rose mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Colors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {option.colors.map((color, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-stone-100 text-stone-700 text-sm rounded-full border border-wedding-blush"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-wedding-rose mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Options
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
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-200/50 shadow-wedding">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-light text-wedding-burgundy mb-2">Important Information</h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                        <span>Temperatures may drop in the evening, so we recommend bringing a light jacket or coat.</span>
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