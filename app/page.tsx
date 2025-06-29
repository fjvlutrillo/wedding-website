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

        <div className="relative z-10 flex flex-col items-center h-[85%] w-full max-w-2xl px-4 text-center pt-56 sm:pt-72">
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <p className="text-3xl sm:text-3xl font-bodoni ">¡Nos casamos!</p>
            <h1 className="text-7xl sm:text-6xl font-luxury font-light">
              Susana y Javier
            </h1>
            <p> </p>
            <p className="text-1xl font-bodoni sm:text-2xl ">16 de agosto de 2025</p>
            <p className="text-1xl font-bodoni sm:text-2xl ">Ciudad de México</p>
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
        className="relative flex flex-col items-center justify-center py-20 px-2 min-h-[90vh] bg-gradient-to-br from-[#FDFCF8] via-[#E4E0D9] to-[#E1BFB7] overflow-hidden"
      >
        {/* Top Left Floral Accent */}
        <img
          src="/side_rose.png"
          alt=""
          className="hidden sm:block absolute top-0 left-0 w-44 opacity-70 pointer-events-none select-none"
          aria-hidden="true"
        />

        {/* Bottom Center Floral Accent */}
        <img
          src="/flowers/bottom_flower.png"
          alt=""
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-80 sm:w-[32rem] opacity-80 pointer-events-none select-none"
          aria-hidden="true"
        />

        {/* Desktop Polaroids */}
        <div className="hidden sm:block absolute left-16 top-1/2 -translate-y-1/2 z-10">
          <div className="bg-white rounded-xl shadow-xl rotate-[-8deg] w-44 h-56 flex flex-col items-center pb-6">
            <img
              src="/historia-left1.jpg"
              alt="Recuerdo"
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <span className="text-xs text-gray-500 mt-2">Recuerdo</span>
          </div>
        </div>
        <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 z-10">
          <div className="bg-white rounded-xl shadow-xl rotate-[8deg] w-44 h-56 flex flex-col items-center pb-6">
            <img
              src="/historia-right.jpg"
              alt="Viaje juntos"
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <span className="text-xs text-gray-500 mt-2">Viaje juntos</span>
          </div>
        </div>

        {/* Notebook/Paper Card */}
        <div className="relative z-30 bg-[#FDFCF8] rounded-3xl shadow-xl px-4 sm:px-16 py-12 sm:py-20 min-h-[420px] w-full max-w-xl mx-auto flex flex-col items-center">
          {/* Title */}
          <h2 className="text-6xl sm:text-5xl mb-8 text-[#7B4B38] text-center font-luxury font-bold tracking-wide">
            Nuestra Historia
          </h2>
          {/* Main Text */}
          <div className="text-[#7B4B38] text-lg sm:text-xl font-serif text-center leading-relaxed italic">
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

        {/* Mobile Polaroids */}
        <div className="flex flex-row justify-center gap-4 items-end sm:hidden mt-8 w-full z-20">
          <div className="bg-white rounded-xl shadow-xl rotate-[-6deg] w-36 h-44 flex flex-col items-center pb-4">
            <img
              src="/historia-left1.jpg"
              alt="Recuerdo"
              className="w-full h-32 object-cover rounded-t-xl"
            />
            <span className="text-xs text-gray-500 mt-1">Recuerdo</span>
          </div>
          <div className="bg-white rounded-xl shadow-xl rotate-[6deg] w-36 h-44 flex flex-col items-center pb-4">
            <img
              src="/historia-right.jpg"
              alt="Viaje juntos"
              className="w-full h-32 object-cover rounded-t-xl"
            />
            <span className="text-xs text-gray-500 mt-1">Viaje juntos</span>
          </div>
        </div>
      </section>

      {/* Detalles del Evento */}
      <section
        id="evento"
        className="bg-gradient-to-br from-[#FDFCF8] via-[#E4E0D9] to-[#E1BFB7] py-20 px-4 text-center"
      >
        <h2 className="text-4xl sm:text-5xl mb-8 font-bodoni font-bold text-[#7B4B38] tracking-wide">
          Detalles del Evento
        </h2>
        <div className="text-lg sm:text-xl text-[#7B4B38] font-bodoni mb-4">
          <p className="">Ceremonia y recepción</p>
          <p>16 de agosto de 2025 · 13:30 PM</p>
          <p>Terraza Camino Real · Santa Fe, CDMX</p>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
          <a
            href="https://maps.app.goo.gl/RUdDZqUXfRBK8j4y7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="flex items-center gap-2 px-8 py-3 bg-champagne hover:bg-[#e1bfb7] text-[#7B4B38] font-semibold rounded-xl transition text-base shadow-lg">
              Cómo llegar
            </button>
          </a>
          <div className="flex items-center gap-2 mt-3 text-[#7B4B38]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#7B4B38"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21c-4.97-5.2-7-8.39-7-11A7 7 0 1 1 19 10c0 2.61-2.03 5.8-7 11z"
              />
              <circle cx="12" cy="10" r="3" fill="#7B4B38" />
            </svg>
            <span className="font-bodoni text-base sm:text-lg">
              Terraza Camino Real · Santa Fe, CDMX
            </span>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full max-w-xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=Terraza+Camino+Real+Santa+Fe+CDMX&output=embed"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '1rem' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de la boda"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section
        className="relative py-20 px-4 text-center min-h-[50vh] bg-gradient-to-br from-[#FDFCF8] via-[#E4E0D9] to-[#E1BFB7] text-[#7B4B38]"
      >
        <h2 className="text-5xl sm:text-6xl mb-10 font-bold tracking-wide">
          La Cuenta Regresiva
        </h2>

        <div className="max-w-lg mx-auto bg-[#fffaf5]/90 shadow-xl border-[3px] border-[#E4C3A1] px-8 py-12">
          <p className="text-xl sm:text-2xl mb-6 font-bodoni italic text-[#7B4B38]">
            ¡Falta muy poco para celebrar juntos!
          </p>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide animate-pulse text-[#7B4B38] font-bodoni">
            {countdown}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section
        id="galeria"
        className="relative py-20 px-4 text-center min-h-[70vh] 
    bg-gradient-to-br from-[#FDFCF8] via-[#E4E0D9] to-[#E1BFB7] text-[#7B4B38]"
      >
        <h2 className="text-5xl sm:text-6xl mb-10 tracking-wide text-cocoa drop-shadow">
          Galería
        </h2>

        <div className="relative max-w-[97vw] sm:max-w-3xl mx-auto">
          <div
            ref={sliderRef}
            className="keen-slider rounded-xl overflow-hidden shadow-2xl border-[3px] border-champagne bg-[#fffaf5]/90"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="keen-slider__slide flex items-center justify-center">
                <img
                  src={`/gallery/${num}.jpg`}
                  alt={`Galería ${num}`}
                  className="w-full h-[300px] sm:h-[400px] object-cover rounded-xl"
                  style={{ border: '2px solid #E4C3A1', background: '#fffaf5' }}
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-champagne text-cocoa bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-xl border-[2px] border-cocoa"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-champagne text-cocoa bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-xl border-[2px] border-cocoa"
            aria-label="Siguiente"
          >
            ›
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`
            w-3 h-3 border-[2px] border-champagne rounded-full transition
            ${currentSlide === idx ? 'bg-cocoa' : 'bg-champagne'}
          `}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Confirmar Asistencia Section */}
      <section
        className="relative py-20 px-4 text-center min-h-[50vh] bg-gradient-to-br from-[#FDFCF8] via-[#E4E0D9] to-[#E1BFB7] text-[#7B4B38] flex flex-col justify-center items-center"
      >
        <h2 className="text-5xl sm:text-6xl mb-8 text-[#7B4B38] font-bold tracking-wide">
          ¿Nos acompañas?
        </h2>
        <p className="text-xl sm:text-2xl mb-10 font-bodoni">
          Haznos saber si podrás asistir a nuestra boda.<br />
          ¡Tu presencia es muy importante para nosotros!
        </p>
        <Link href="/rsvp">
          <button className="bg-[#E1BFB7] hover:bg-[#E4C3A1] text-[#7B4B38] font-semibold text-lg px-10 py-4 rounded-xl shadow-lg border-[2px] border-[#E4C3A1] transition-all">
            Confirmar asistencia
          </button>
        </Link>
        {/* Optional subtle accent/decoration */}
        <img
          src="/flowers/bottom_flower.png"
          alt=""
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 sm:w-64 opacity-60 pointer-events-none select-none"
          aria-hidden="true"
        />
      </section>
    </main>
  )
}