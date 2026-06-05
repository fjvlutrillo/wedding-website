'use client'

/**
 * MAIN WEDDING INVITATION PAGE
 *
 * Structure:
 * 1. Hero Section
 * 2. Historia Section
 * 3. Events Section (ceremony + reception)
 * 4. Dress Code Section
 * 5. Timeline Section          <-- NEW: rendered inside the token-gated block
 * 6. Countdown
 * 7. Gallery
 * 8. Registry
 * 9. RSVP (when token is present)
 *
 * Also added: BusScheduleBanner (floating, dismissible transport schedule).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Image from 'next/image'

// Import components
import TravelGuide from '@/components/TravelGuideES'
import HeaderBohoChic from '@/components/HeaderBohoChic'
import SectionHeader from '@/components/SectionHeader'
import HeroSectionBohoChic from '@/components/HeroSectionBohoChic'
import EventsSection from '@/components/EventDetails'
import DressCodeSection from '@/components/DressCode'
import RegistrySection from '@/components/RegistrySectionHybrid'
import TimelineSection from '@/components/Timeline'          // <-- NEW
import BusScheduleBanner from '@/components/BusScheduleBanner' // <-- NEW

export default function Home() {
  const [showRSVP, setShowRSVP] = useState(false)
  const [token, setToken] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Keen Slider setup for gallery
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
    },
    [
      (slider) => {
        let timeout: NodeJS.Timeout
        let mouseOver = false

        const clearNextTimeout = () => clearTimeout(timeout)

        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 3000)
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })

        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      },
    ]
  )

  // Countdown timer logic
  useEffect(() => {
    const weddingDate = new Date('2026-06-06T14:00:00')
    const updateCountdown = () => {
      const now = new Date()
      const diff = weddingDate.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown('¡Hoy es el gran día!')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)

      setCountdown(`${days} \t ${hours} \t ${minutes}`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Check for RSVP token in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const t = urlParams.get('token')
      if (t) {
        setShowRSVP(true)
        setToken(t)
      }
    }
  }, [])

  const isEventDay = countdown.startsWith('¡Hoy es')
  const [days, hours, minutes] = !isEventDay ? countdown.split(/\s+/) : []

  return (
    <main className="min-h-screen text-[#2C2C2C] bg-warm-cream">

      {/* Floating transport schedule — fixed position, so it overlays the
          whole site regardless of where it sits in the tree. */}
      <BusScheduleBanner />

      <HeroSectionBohoChic />

      <HeaderBohoChic />

      {/* ==================== HISTORIA - BOLD MAGAZINE LAYOUT ==================== */}
      <section id="historia" className="relative py-16 sm:py-24 lg:py-32 px-4 bg-warm-cream overflow-hidden">

        {/* GIANT background text - "AMOR" - hidden on mobile */}
        <div className="hidden lg:block absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.025]">
          <span className="text-[420px] font-light text-wedding-burgundy whitespace-nowrap leading-none">
            AMOR
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative">

          <SectionHeader
            chapter="01"
            title="Nuestra"
            subtitle="Historia"
            description="Conoce un poco de nuestra aventura juntos..."
            align="center"
          />

          {/* MAGAZINE-STYLE GRID - better mobile stacking */}
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">

            {/* LEFT SIDE - 7 columns - FEATURED CONTENT */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 lg:space-y-10">

              {/* HERO IMAGE - responsive heights with terracotta accent */}
              <div className="relative group">
                {/* Image container - better mobile heights */}
                <div className="relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
                  <Image
                    src="/historia/1.jpg"
                    alt="Susana y Javier"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* TERRACOTTA CORNER ACCENT - responsive sizes */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-wedding-terracotta"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
                />
              </div>

              {/* STORY TEXT - better mobile readability, NO drop cap on mobile */}
              <div className="lg:pr-8">
                <div className="space-y-4 sm:space-y-6">
                  {/* First paragraph - drop cap only on desktop */}
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-stone-700 
                    lg:first-letter:text-8xl lg:first-letter:font-light lg:first-letter:text-wedding-burgundy 
                    lg:first-letter:float-left lg:first-letter:mr-4 lg:first-letter:leading-none lg:first-letter:mt-2">
                    Nuestra historia empezó hace 12 años cuando nos conocimos sin imaginar todo lo que vendría después. Compartimos momentos, crecimos, tomamos caminos distintos y aprendimos mucho en el proceso. El tiempo hizo su parte y cuando volvimos a encontrarnos, supimos que esta vez sería para siempre.
                  </p>

                  {/* Second paragraph */}
                  <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-stone-600">
                    Desde entonces hemos construido una vida juntos basada en el apoyo, la complicidad y la seguridad que te dá caminar a lado de tu mejor amigo. Hoy no solo celebramos el amor, sino el camino que nos trajo hasta aquí.
                  </p>

                  {/* Decorative terracotta dots */}
                  <div className="hidden sm:flex items-center gap-2 pt-2 sm:pt-4">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-wedding-terracotta" />
                    <div className="w-2 h-2 rounded-full bg-wedding-burgundy" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-wedding-terracotta" />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - 5 columns - SIDEBAR CONTENT */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">

              {/* Secondary photo - responsive heights */}
              <div className="relative h-[240px] sm:h-[280px] md:h-[320px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl group">
                <Image
                  src="/historia/2.jpeg"
                  alt="Momento especial"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* PULL QUOTE CARD - responsive padding and text */}
              <div className="bg-wedding-burgundy rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-warm-cream relative overflow-hidden shadow-xl sm:shadow-2xl">
                {/* Giant quotation mark background - hidden on small mobile */}
                <div className="hidden sm:block absolute -top-4 -left-2 text-[120px] sm:text-[140px] lg:text-[160px] font-light text-wedding-terracotta/20 leading-none select-none">
                  "
                </div>

                {/* Quote text - responsive */}
                <div className="relative z-10">
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-4 sm:mb-6">
                    She said yes!
                  </p>

                  {/* Date with terracotta accent */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 sm:w-10 lg:w-12 h-0.5 sm:h-1 bg-wedding-terracotta" />
                    <p className="text-xs sm:text-sm lg:text-base uppercase tracking-widest text-wedding-terracotta font-medium">
                      3 de Mayo, 2025
                    </p>
                  </div>
                </div>
              </div>

              {/* Small photo grid - 2x2 responsive */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative h-[140px] sm:h-[180px] md:h-[200px] rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg group">
                  <Image
                    src="/historia/3.jpg"
                    alt="Momento 3"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Terracotta hover overlay */}
                  <div className="absolute inset-0 bg-wedding-terracotta/0 group-hover:bg-wedding-terracotta/10 transition-colors duration-300" />
                </div>

                <div className="relative h-[140px] sm:h-[180px] md:h-[200px] rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg group">
                  <Image
                    src="/historia/4.jpg"
                    alt="Momento 4"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Terracotta hover overlay */}
                  <div className="absolute inset-0 bg-wedding-terracotta/0 group-hover:bg-wedding-terracotta/10 transition-colors duration-300" />
                </div>
              </div>

              {/* Final text snippet - responsive */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md sm:shadow-lg border-l-4 border-wedding-terracotta">
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-stone-700 italic">
                  "Ahora damos el siguiente paso comenzando esta nueva etapa juntos."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 🔒 SECURED SECTIONS - ONLY WITH TOKEN ==================== */}
      {showRSVP && (
        <>
          <EventsSection />
          <DressCodeSection />
          <TimelineSection />
          <TravelGuide />
        </>
      )}

      {/* ==================== COUNTDOWN - BOLD GRAPHIC DESIGN ==================== */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 bg-wedding-terracotta overflow-hidden">

        {/* Large background numbers */}
        <div className="absolute inset-0 pointer-events-none opacity-10 select-none overflow-hidden">
          <span className="absolute top-10 -right-20 text-[300px] font-light text-white">06</span>
          <span className="absolute bottom-10 -left-20 text-[300px] font-light text-white">26</span>
        </div>

        <div className="max-w-6xl mx-auto relative">

          {/* Bold centered title */}
          <SectionHeader
            chapter="05"
            title="Cuenta"
            subtitle="Regresiva"
            align="center"
          />

          {typeof days === 'undefined' ? (
            <div className="text-center py-20">
              <p className="text-6xl sm:text-7xl font-light text-white">
                ¡Hoy es el gran día!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-8 lg:gap-12">
              {[
                { value: days, label: 'Días', bg: 'bg-white', text: 'text-wedding-burgundy' },
                { value: hours, label: 'Horas', bg: 'bg-wedding-burgundy', text: 'text-white' },
                { value: minutes, label: 'Minutos', bg: 'bg-white', text: 'text-wedding-burgundy' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.bg} rounded-3xl p-10 lg:p-12 shadow-2xl transform hover:scale-105 transition-transform duration-300`}
                >
                  <div className={`text-8xl sm:text-9xl font-light ${item.text} leading-none mb-4 tabular-nums`}>
                    {item.value}
                  </div>
                  <div className={`text-lg uppercase tracking-[0.3em] ${item.text} font-medium`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ==================== GALLERY SECTION ==================== */}
      <section id="galeria" className="relative py-16 sm:py-20 px-4 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-6xl mx-auto">

          {/* Editorial Section Header */}
          <SectionHeader
            chapter="06"
            title=""
            subtitle="Galería"
            align="center"
          />

          <div className="relative max-w-4xl mx-auto">
            <div ref={sliderRef} className="keen-slider rounded-2xl overflow-hidden shadow-xl border border-wedding-blush">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={num} className="keen-slider__slide flex items-center justify-center bg-stone-100">
                  <div className="relative w-full h-[400px] sm:h-[500px]">
                    <Image src={`/gallery/${num}.jpg`} alt={`Galería ${num}`} fill className="object-cover" />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-warm-cream/95 backdrop-blur-sm hover:bg-wedding-blush shadow-wedding border border-wedding-blush flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Anterior"
            >
              <svg className="w-6 h-6 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-warm-cream/95 backdrop-blur-sm hover:bg-wedding-blush shadow-wedding border border-wedding-blush flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`
                    transition-all duration-300
                    ${currentSlide === idx
                      ? 'w-8 h-2 bg-wedding-burgundy rounded-full'
                      : 'w-2 h-2 bg-wedding-blush rounded-full hover:bg-wedding-rose'
                    }
                  `}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== REGISTRY SECTION ==================== */}
      <RegistrySection />

      {/* ==================== RSVP SECTION ==================== */}
      {showRSVP && (
        <section className="relative py-24 px-4">
          <div className="max-w-2xl mx-auto">

            {/* Editorial Section Header */}
            <SectionHeader
              chapter="08"
              title="¿Nos"
              subtitle="Acompañas?"
              description="Tu presencia es el mejor regalo. Por favor, haznos saber si podrás acompañarnos en este día tan especial."
              align="center"
            />

            {/* CTA Button */}
            <div className="flex justify-center mt-12">
              <Link href={`/rsvp?token=${token}`}>
                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-wedding-burgundy to-wedding-burgundy-light hover:opacity-90 text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-wedding-xl hover:-translate-y-0.5">
                  Confirmar asistencia
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}