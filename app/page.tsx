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

// Import new components
import EventsSection from '@/components/EventDetails'
import DressCodeSection from '@/components/DressCode'
import TimelineSection from '@/components/Timeline'
// Choose ONE of these:
import RegistrySection from '@/components/RegistrySectionHybrid' // OR RegistrySectionCustom
import RegistrySection2 from '@/components/RegistrySectionCustom'

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

  const isEventDay = countdown.startsWith('¡Hoy es')
  const [days, hours, minutes] = !isEventDay ? countdown.split(/\s+/) : []

  return (
    <main className="min-h-screen text-[#2C2C2C]">
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
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-luxury font-light tracking-tight">
                Susana & Javier
              </h1>
            </div>

            <div className="h-px w-24 mx-auto bg-white/40" />

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

      {/* ==================== HISTORIA SECTION ==================== */}
      <section
        id="historia"
        className="relative py-24 px-4 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Images */}
            <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/historia/1.jpg"
                      alt="Susana y Javier - Momento 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/historia/2.jpg"
                      alt="Susana y Javier - Momento 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/historia/3.jpg"
                      alt="Susana y Javier - Momento 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/historia/4.jpg"
                      alt="Susana y Javier - Momento 4"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Story Text */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">
                  Capítulo 01
                </span>
                <h2 className="text-5xl sm:text-6xl font-light text-[#2C2C2C]">
                  Nuestra
                  <span className="block font-luxury text-6xl sm:text-7xl mt-2">Historia</span>
                </h2>
              </div>

              <div className="space-y-6 text-stone-600 leading-relaxed">
                <p>
                  Todo comenzó en una tarde de otoño cuando nuestros caminos se cruzaron
                  de la manera más inesperada. Lo que empezó como una amistad se convirtió
                  en algo mucho más profundo.
                </p>
                <p>
                  Con cada día que pasaba, descubríamos más razones para sonreír juntos.
                  Las conversaciones se volvieron más largas, las risas más frecuentes, y
                  los silencios más cómodos.
                </p>
                <p>
                  Ahora, después de compartir tantos momentos inolvidables, estamos listos
                  para escribir el siguiente capítulo de nuestra historia. Y queremos que tú
                  seas parte de este momento tan especial.
                </p>
              </div>

              <div className="pt-4">
                <p className="text-2xl sm:text-3xl font-luxury text-[#2C2C2C]">
                  ¡Nos casamos!
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

      {/* ==================== COUNTDOWN SECTION ==================== */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="space-y-4 mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">
              Capítulo 03
            </span>
            <h2 className="text-5xl sm:text-6xl font-light text-[#2C2C2C]">
              Cuenta
              <span className="block font-luxury text-6xl sm:text-7xl mt-2">Regresiva</span>
            </h2>
          </div>

          {typeof days === 'undefined' ? (
            <div className="py-12">
              <p className="text-4xl font-light text-[#2C2C2C]">¡Hoy es el gran día!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-2xl mx-auto">
              {[
                { value: days, label: 'Días' },
                { value: hours, label: 'Horas' },
                { value: minutes, label: 'Minutos' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-5xl sm:text-6xl font-light text-[#2C2C2C] mb-2 tabular-nums">
                    {item.value}
                  </div>
                  <div className="text-sm uppercase tracking-wider text-stone-500 font-light">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== GALLERY SECTION ==================== */}
      <section
        id="galeria"
        className="relative py-24 px-4 bg-gradient-to-b from-white to-stone-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">
              Capítulo 04
            </span>
            <h2 className="text-5xl sm:text-6xl font-light text-[#2C2C2C]">
              Galería         
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div
              ref={sliderRef}
              className="keen-slider rounded-2xl overflow-hidden shadow-xl border border-stone-200"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={num} className="keen-slider__slide flex items-center justify-center bg-stone-100">
                  <div className="relative w-full h-[400px] sm:h-[500px]">
                    <Image
                      src={`/gallery/${num}.jpg`}
                      alt={`Galería ${num}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-stone-200 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Anterior"
            >
              <svg className="w-6 h-6 text-stone-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-stone-200 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6 text-stone-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`
                    transition-all duration-300
                    ${currentSlide === idx
                      ? 'w-8 h-2 bg-[#2C2C2C] rounded-full'
                      : 'w-2 h-2 bg-stone-300 rounded-full hover:bg-stone-400'
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

      <RegistrySection2 />

      {/* ==================== RSVP SECTION ==================== */}
      {showRSVP && (
        <section className="relative py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">
                  Capítulo 06
                </span>
                <h2 className="text-5xl sm:text-6xl font-light text-[#2C2C2C]">
                  ¿Nos
                  <span className="block font-luxury text-6xl sm:text-7xl mt-2">Acompañas?</span>
                </h2>
              </div>

              <p className="text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
                Tu presencia es el mejor regalo. Por favor, haznos saber si podrás
                acompañarnos en este día tan especial.
              </p>

              <Link href={`/rsvp?token=${token}`}>
                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-[#2C2C2C] hover:bg-[#1A1A1A] text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Confirmar asistencia
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
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