'use client'

/**
 * UPDATED MAIN PAGE - Wedding Invitation
 *
 * Structure:
 * 1. Hero Section (existing)
 * 2. Historia Section (existing)
 * 3. Events Section (NEW - ceremony + reception)
 * 4. Dress Code Section (NEW)
 * 5. Timeline Section (NEW)
 * 6. Countdown (existing)
 * 7. Gallery (existing)
 * 8. Registry (NEW - choose Hybrid or Custom)
 * 9. RSVP (existing)
 */

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Image from 'next/image'
import RedirectWrapper from '@/components/RedirectWrapper'

// Import new components
import HeroSectionBohoChic from '@/components/HeroSectionBohoChic'
import EventsSection from '@/components/EventDetails'
import DressCodeSection from '@/components/DressCode'
import TimelineSection from '@/components/Timeline'
// Choose ONE of these:
import RegistrySection from '@/components/RegistrySectionHybrid' // OR RegistrySectionCustom
import RegistrySection2 from '@/components/RegistrySectionCustom'

function MainPageContent() {
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
    const weddingDate = new Date('2026-06-06T14:30:00')
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

  // ==================== REDIRECT GATE (ONLY CHANGE) ====================
  // Redirect everyone to /save-the-date unless you add ?dev=1 to the URL
  useEffect(() => {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams(window.location.search)
    const devAllowed = urlParams.get('dev') === '1'
    if (devAllowed) return

    // Prevent redirect loop if you're already on the save-the-date route
    if (window.location.pathname !== '/save-the-date') {
      window.location.replace('/save-the-date')
    }
  }, [])
  // ====================================================================

  const isEventDay = countdown.startsWith('¡Hoy es')
  const [days, hours, minutes] = !isEventDay ? countdown.split(/\s+/) : []

  return (
    <main className="min-h-screen text-[#2C2C2C] bg-warm-cream">

      <HeroSectionBohoChic />
      
     
     {/* ==================== HERO SECTION ==================== */}
           <section
             id="inicio"
             className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden"
           >
             {/* Placeholder background */}
             <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-white" />
     
             {/* Hero image with fade-in */}
             <div
               className={`absolute inset-0 transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                 }`}
             >
               <Image
                 src="/hero.jpg"
                 alt="Susana y Javier"
                 fill
                 priority
                 quality={90}
                 className="object-cover object-center sm:object-[center_30%]"
                 onLoad={() => setImageLoaded(true)}
               />
             </div>
     
             {/* Elegant overlay */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
     
             <div className="relative z-10 flex flex-col items-center h-[85%] w-full max-w-2xl px-4 text-center pt-56 sm:pt-72">
               <div className="flex-1 flex flex-col justify-center space-y-6">
                 <div className="space-y-2">
                   <p className="text-sm sm:text-base font-light tracking-[0.3em] uppercase text-white/90">
                     save the date
                   </p>
                   <h1 className="text-6xl sm:text-7xl md:text-8xl font-light font-light tracking-tight text-white">
                     Susana & Javier
                   </h1>
                 </div>
     
                 <div className="h-px w-24 mx-auto bg-warm-cream/40" />
     
                 <div className="space-y-1">
                   <p className="text-3xl sm:text-4xl font-light tracking-wide">Boda</p>
                   <p className="text-base sm:text-lg font-light text-white/90">6 de Junio, 2026</p>
                   <p className="text-base sm:text-lg font-light text-white/90">Puebla, México</p>
                 </div>
               </div>
     
               {/* Scroll indicator */}
               <button
                 onClick={() => {
                   const target = document.getElementById('historia')
                   if (target) {
                     const headerHeight = 64
                     const targetPosition =
                       target.getBoundingClientRect().top + window.scrollY - headerHeight
                     window.scrollTo({ top: targetPosition, behavior: 'smooth' })
                   }
                   const header = document.querySelector('.main-header') as HTMLElement
                   if (header) header.style.display = 'flex'
                 }}
                 className="group mb-12 animate-fade-pulse hover:scale-110 transition-transform duration-300"
                 aria-label="Ir a historia"
               >
                 <div className="flex flex-col items-center gap-2">
                   <span className="text-xs uppercase tracking-widest text-white/70 font-light">
                     Descubre nuestra historia
                   </span>
                   <svg
                     className="w-8 h-8 text-white/90 group-hover:text-white transition-colors"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="1.5"
                     viewBox="0 0 24 24"
                   >
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                   </svg>
                 </div>
               </button>
             </div>
           </section>
     
           {/* Header appears after scroll */}

      <Header />

      {/* ==================== HISTORIA - BOLD MAGAZINE LAYOUT ==================== */}
      <section id="historia" className="relative py-16 sm:py-24 lg:py-32 px-4 bg-warm-cream overflow-hidden">

        {/* GIANT background text - "AMOR" - hidden on mobile */}
        <div className="hidden lg:block absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.025]">
          <span className="text-[420px] font-light text-wedding-burgundy whitespace-nowrap leading-none">
            AMOR
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative">

          {/* BOLD header - better mobile */}
          <div className="mb-12 sm:mb-16 lg:mb-24">
            <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-12">

              {/* Vertical chapter number - simplified for mobile */}
              <div className="lg:pt-4">
                <div className="flex lg:block items-center gap-3">
                  <div className="w-1 h-16 sm:h-20 lg:h-32 bg-wedding-terracotta" />
                  <p className="lg:[writing-mode:vertical-lr] text-xs sm:text-sm uppercase tracking-[0.25em] text-wedding-terracotta font-bold">
                    Capítulo 01
                  </p>
                </div>
              </div>

              {/* Title - responsive sizes */}
              <div className="flex-1">
                <div className="space-y-2 sm:space-y-3">
                  {/* "Nuestra" - responsive from 5xl to 9xl */}
                  <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-wedding-burgundy leading-none">
                    Nuestra
                  </h2>

                  {/* Thick terracotta underline - responsive width */}
                  <div className="w-48 sm:w-64 md:w-80 lg:w-full max-w-xl h-2 sm:h-3 bg-wedding-terracotta rounded-full" />

                  {/* "Historia" below - responsive */}
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-charcoal pt-1 sm:pt-2">
                    Historia
                  </h2>
                </div>
              </div>
            </div>
          </div>

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
                    Todo comenzó en una tarde de otoño cuando nuestros caminos se cruzaron de la manera más inesperada. Lo que empezó como una amistad se convirtió en algo mucho más profundo.
                  </p>

                  {/* Second paragraph */}
                  <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-stone-600">
                    Con cada día que pasaba, descubríamos más razones para sonreír juntos. Las conversaciones se volvieron más largas, las risas más frecuentes, y los silencios más cómodos.
                  </p>

                  {/* Decorative terracotta dots */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-4">
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
                  src="/historia/2.jpg"
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
                    ¡Nos casamos!
                  </p>

                  {/* Date with terracotta accent */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 sm:w-10 lg:w-12 h-0.5 sm:h-1 bg-wedding-terracotta" />
                    <p className="text-xs sm:text-sm lg:text-base uppercase tracking-widest text-wedding-terracotta font-medium">
                      6 de Junio, 2026
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
                  Ahora, después de compartir tantos momentos inolvidables, estamos listos para escribir el siguiente capítulo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEW SECTIONS ==================== */}
      <EventsSection />
      <DressCodeSection />
      <TimelineSection />

      {/* ==================== COUNTDOWN - BOLD GRAPHIC DESIGN ==================== */}
      <section className="relative py-24 lg:py-32 px-4 bg-wedding-terracotta overflow-hidden">
        

        {/* Large background numbers */}
        <div className="absolute inset-0 pointer-events-none opacity-10 select-none overflow-hidden">
          <span className="absolute top-10 -right-20 text-[300px] font-light text-white">06</span>
          <span className="absolute bottom-10 -left-20 text-[300px] font-light text-white">26</span>
        </div>

        <div className="max-w-6xl mx-auto relative">

          {/* Bold centered title */}
          <div className="text-center mb-20">
            <h2 className="text-7xl sm:text-8xl lg:text-9xl font-light text-charcoal leading-none mb-6">
              Faltan
            </h2>
            <div className="flex justify-center">
              <div className="w-48 h-2 bg-charcoal/40" />
            </div>
          </div>

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
      <section id="galeria" className="relative py-24 px-4 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-wedding-rose font-light">
              Capítulo 04
            </span>
            <h2 className="text-5xl sm:text-6xl font-light text-wedding-burgundy">Galería</h2>
          </div>

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
          <div className="max-w-2xl mx-auto text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.3em] text-wedding-rose font-light">
                  Capítulo 06
                </span>
                <h2 className="text-5xl sm:text-6xl font-light text-charcoal">
                  ¿Nos
                  <span className="block font-light text-6xl sm:text-7xl mt-2 text-wedding-burgundy">
                    Acompañas?
                  </span>
                </h2>
              </div>

              <p className="text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
                Tu presencia es el mejor regalo. Por favor, haznos saber si podrás acompañarnos en este día tan especial.
              </p>

              <Link href={`/rsvp?token=${token}`}>
                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-burgundy hover:opacity-90 text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-wedding-xl hover:-translate-y-0.5">
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

// Export the wrapped version
export default function Home() {
  return (
    <RedirectWrapper>
      <MainPageContent />
    </RedirectWrapper>
  )
}
