'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Header from '@/components/Header'

// Define the form fields as a TypeScript type
type FormFields = {
    nombre: string
    apellido: string
    email: string
    asistentes: string
    alergias: string
}

export default function RSVPForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token') // <-- Read token from URL

    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState<FormFields>({
        nombre: '',
        apellido: '',
        email: '',
        asistentes: '',
        alergias: '',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name as keyof FormFields]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitted(true)
        // TODO: Send data to Supabase or external service, include the token!
        // e.g. send { ...formData, token }
    }

    return (
        <>
            <Header />
            <div className="relative min-h-screen">
                {/* Remove the RSVP background for invite palette look, or use a very subtle overlay */}
                {/* <div
          className="absolute inset-0 bg-cover bg-center opacity-0 animate-fade-in"
          style={{ backgroundImage: "url('/rsvp-bg.jpg')" }}
        /> */}
                {/* Optionally add a soft overlay for contrast */}
                <div className="absolute inset-0 bg-[#E4E0D9] bg-opacity-80 pointer-events-none select-none" />

                <main className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-20">
                    <section className="w-full max-w-2xl bg-[#fffaf5]/90 text-cocoa p-8 border-[3px] border-champagne shadow-xl rounded-xl">
                        <h1 className="text-3xl font-semibold mb-6 text-center font-bodoni text-cocoa">
                            Confirmar asistencia
                        </h1>

                        {/* Display error if no token */}
                        {!token && (
                            <p className="text-center text-xl text-red-600 font-medium mb-4">
                                Esta invitación no es válida o falta el token.
                            </p>
                        )}

                        {token && (submitted ? (
                            <p className="text-center text-xl font-medium text-cocoa">
                                ¡Gracias por confirmar, {formData.nombre}!
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-col">
                                    <label htmlFor="nombre" className="font-medium text-cocoa">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        required
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-champagne rounded bg-white text-cocoa"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="apellido" className="font-medium text-cocoa">Apellido</label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        required
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-champagne rounded bg-white text-cocoa"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="email" className="font-medium text-cocoa">Correo electrónico</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-champagne rounded bg-white text-cocoa"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="asistentes" className="font-medium text-cocoa">¿Cuántas personas asistirán?</label>
                                    <input
                                        type="number"
                                        id="asistentes"
                                        name="asistentes"
                                        required
                                        min="1"
                                        value={formData.asistentes}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-champagne rounded bg-white text-cocoa"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="alergias" className="font-medium text-cocoa">¿Tienes alguna alergia o requerimiento especial?</label>
                                    <textarea
                                        id="alergias"
                                        name="alergias"
                                        value={formData.alergias}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-champagne rounded bg-white text-cocoa"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-cocoa text-champagne py-2 px-4 rounded shadow hover:bg-[#7B4B38] transition font-semibold"
                                >
                                    Enviar confirmación
                                </button>
                            </form>
                        ))}
                    </section>
                </main>
            </div>
        </>
    )
}