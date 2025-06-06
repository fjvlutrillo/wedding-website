'use client'

import { useState } from 'react'
import Header from '@/components/Header'

export default function RSVPPage() {
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        asistentes: '',
        alergias: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitted(true)
        // TODO: Send data to Supabase or external service
    }

    return (
        <>
            <Header />
            <div className="relative min-h-screen">
                {/* RSVP background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-0 animate-fade-in"
                    style={{ backgroundImage: "url('/rsvp-bg.jpg')" }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40" />

                <main className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 text-white">
                    <section className="w-full max-w-2xl bg-white/90 text-wine p-8 rounded shadow-md">
                        <h1 className="text-3xl font-semibold mb-6 text-center">Confirmar asistencia</h1>

                        {submitted ? (
                            <p className="text-center text-xl font-medium">
                                ¡Gracias por confirmar, {formData.nombre}!
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-col">
                                    <label htmlFor="nombre" className="font-medium">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        required
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="apellido" className="font-medium">Apellido</label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        required
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="email" className="font-medium">Correo electrónico</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="asistentes" className="font-medium">¿Cuántas personas asistirán?</label>
                                    <input
                                        type="number"
                                        id="asistentes"
                                        name="asistentes"
                                        required
                                        value={formData.asistentes}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded"
                                        min="1"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="alergias" className="font-medium">¿Tienes alguna alergia o requerimiento especial?</label>
                                    <textarea
                                        id="alergias"
                                        name="alergias"
                                        value={formData.alergias}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-rosewood text-white py-2 px-4 rounded hover:bg-cherry transition"
                                >
                                    Enviar confirmación
                                </button>
                            </form>
                        )}
                    </section>
                </main>
            </div>
        </>
    )
}