'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

export default function Home() {
  const [countdown, setCountdown] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

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

  useEffect(() => {
    const weddingDate = new Date('2025-08-16T12:00:00')
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
      const seconds = Math.floor((diff / 1000) % 60)

      setCountdown(`${days} días, ${hours} hrs, ${minutes} min, ${seconds} seg`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-paper text-wine">
      {/* Hero Section */}
      <section
        id="inicio"
        className="relative h-screen flex items-center justify-center text-center text-white"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-0 animate-fade-in"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />

        <div className="relative z-10 flex flex-col items-center h-[85%] w-full max-w-2xl px-4 text-center">
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <h1 className="text-6xl sm:text-6xl font-light font-[var(--font-great-vibes)]">
              Susana & Javier
            </h1>
            <p className="text-xl sm:text-3xl font-light italic">¡Nos casamos!</p>
            <p className="text-lg sm:text-2xl">16 de agosto, 2025 · Ciudad de México</p>
          </div>

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
            className="mt-10 sm:mt-16 animate-fade-pulse  hover:bg-mist text-cocoa px-6 py-2 rounded-full shadow-lg transition"
            aria-label="Ir a historia"
          >
            <svg
              className="w-14 h-14 sm:w-16 sm:h-16 text-white opacity-90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Header */}
      <Header />

      {/* Nuestra Historia */}
      <section
        id="historia"
        className="relative flex flex-col items-center justify-center py-24 px-2 min-h-[90vh] 
             bg-gradient-to-br from-[#F8F8F8] via-[#E4E0D9] to-[#E1BFB7] overflow-hidden"
      >
        {/* Top Left Floral Accent (optional) */}
        <img
          src="/side_rose.png"
          alt=""
          className="hidden sm:block absolute top-0 left-0 w-44 opacity-70 pointer-events-none select-none"
          aria-hidden="true"
        />

        {/* Bottom Center Floral Accent (optional) */}
        <img
          src="flowers/bottom_flower.png"
          alt=""
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-64 sm:w-80 opacity-70 pointer-events-none select-none"
          aria-hidden="true"
        />

        {/* Desktop polaroid photos */}
        <div className="hidden sm:block absolute left-12 top-1/2 -translate-y-1/2 z-10">
          <img
            src="/historia-left1.jpg"
            alt="Recuerdo"
            className="w-40 h-44 object-cover rounded-xl shadow-xl border-4 border-white rotate-[-8deg]"
          />
        </div>
        <div className="hidden sm:block absolute right-12 top-1/2 -translate-y-1/2 z-10">
          <img
            src="/historia-right.jpg"
            alt="Viaje juntos"
            className="w-40 h-44 object-cover rounded-xl shadow-xl border-4 border-white rotate-[8deg]"
          />
        </div>

        {/* Notebook Card */}
        <div className="relative z-30 bg-white/95 rounded-3xl shadow-2xl px-3 sm:px-12 py-8 sm:py-16 min-h-[390px] max-w-lg sm:max-w-2xl mx-auto border-[3px] border-[#E4C3A1] notebook-paper flex flex-col items-center">
          {/* Decorative dashed line */}
          <div className="mb-2 flex justify-center w-full">
            <span className="block w-24 border-t-4 border-dashed border-[#E4C3A1]"></span>
          </div>
          {/* Title */}
          <h2 className="text-4xl sm:text-5xl mb-6 text-[#7B4B38] text-center font-[var(--font-great-vibes)] font-bold tracking-wide">
            Nuestra historia
          </h2>
          {/* Main Text */}
          <div className="text-[#7B4B38] text-lg sm:text-xl font-serif text-center leading-relaxed">
            <p>
              Nos conocimos hace más de 10 años, compartimos aventuras inolvidables, tomamos caminos distintos,
              y nos reencontramos en octubre de 2022. Desde entonces, nuestra historia ha estado llena de momentos
              mágicos, risas y complicidad.
            </p>
            <p className="mt-6">
              Ahora, comenzamos este nuevo capítulo rodeados del amor de quienes más queremos. Gracias por ser
              parte de este viaje con nosotros.
            </p>
          </div>
        </div>

        {/* Mobile polaroids (stacked below card) */}
        <div className="flex flex-col gap-4 items-center sm:hidden mt-8 w-full z-20">
          <img
            src="/historia-left1.jpg"
            alt="Recuerdo"
            className="w-64 max-w-xs h-44 object-cover rounded-xl shadow-xl border-4 border-white"
          />
          <img
            src="/historia-right.jpg"
            alt="Viaje juntos"
            className="w-64 max-w-xs h-44 object-cover rounded-xl shadow-xl border-4 border-white"
          />
        </div>
      </section>

      {/* Detalles del Evento */}
      <section id="evento" className="bg-linen py-20 px-4 text-center text-wine">
        <h2 className="text-4xl sm:text-5xl mb-6 font-[var(--font-great-vibes)] text-rosewood">
          Detalles del evento
        </h2>
        <p className="text-lg">Ceremonia y recepción</p>
        <p>16 de agosto de 2025 · 13:30 PM</p>
        <p>Terraza Camino Real · Santa Fe, CDMX</p>

        <div className="mt-6 flex justify-center">
          <a
            href="https://maps.app.goo.gl/RUdDZqUXfRBK8j4y7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-6 py-2 bg-rosewood hover:bg-cherry text-white font-medium rounded transition text-sm sm:text-base">
              Cómo llegar
            </button>
          </a>
        </div>
      </section>

      {/* Countdown */}
      <section className="bg-rosewood py-24 px-6 text-center text-white">
        <h2 className="text-4xl sm:text-5xl font-semibold mb-8 font-[var(--font-great-vibes)]">
          La cuenta regresiva
        </h2>

        <div className="max-w-lg mx-auto bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-10 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl mb-4 font-light">
            ¡Falta muy poco para celebrar juntos!
          </p>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide animate-pulse">
            {countdown}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="py-16 px-4 text-center bg-linen text-wine">
        <h2 className="text-4xl sm:text-5xl mb-8 font-[var(--font-great-vibes)] text-rosewood">
          Galería
        </h2>

        <div className="relative max-w-[90%] sm:max-w-3xl mx-auto">
          <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden shadow-lg">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="keen-slider__slide">
                <img
                  src={`/gallery/${num}.jpg`}
                  alt={`Galería ${num}`}
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-100 p-2 rounded-full shadow-md"
          >
            ‹
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-100 p-2 rounded-full shadow-md"
          >
            ›
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-rosewood' : 'bg-silver'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Confirmar Asistencia Section */}
      <section className="bg-rosewood text-white py-20 px-6 text-center">
        <h2 className="text-4xl sm:text-5xl mb-6 font-[var(--font-great-vibes)]">
          ¿Nos acompañas?
        </h2>
        <p className="text-lg mb-8">
          Haznos saber si podrás asistir a nuestra boda. ¡Tu presencia es muy importante para nosotros!
        </p>
        <Link href="/rsvp">
          <button className="bg-white text-rosewood font-semibold text-lg px-8 py-3 rounded shadow-lg hover:bg-pinkish transition">
            Confirmar asistencia
          </button>
        </Link>
      </section>
    </main>
  )
}