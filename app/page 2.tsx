import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="text-center py-20 bg-pink-100">
        <h1 className="text-5xl font-bold">Susana & Javier</h1>
        <p className="mt-4 text-xl">¡Nos casamos!</p>
        <p className="mt-1 text-md">Sabado 26 de Julio del 2025 – Ciudad de México</p>
        <Link href="/rsvp">
          <button className="mt-6 px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition">
            Por favor confirma tu asistencia.
          </button>
        </Link>
      </section>

      <section className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-semibold mb-4 text-center">Our Story</h2>
        <p className="text-lg text-gray-700">
          We met over 10 years ago, shared unforgettable adventures, drifted apart, and found our way back to each other.
          In October 2022, we reunited — and now, we're tying the knot surrounded by love, laughter, and all of you.
        </p>
      </section>

      <section className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-4">Event Details</h2>
        <p className="text-lg">Ceremonia y recepción</p>
        <p>Sabado 26 de Julio del 2025 · 1:00 PM</p>
        <p>Lugar TBD · Ciudad de mexico, CDMX</p>

        {/* Replace this iframe with a custom component later */}
        <div className="mt-6">
          <iframe
            className="w-full h-64 rounded-md"
            src="https://maps.google.com/maps?q=casa%20xico%20coyoacan&t=&z=15&ie=UTF8&iwloc=&output=embed"
            allowFullScreen
          />
        </div>
      </section>
    </main>
  )
}