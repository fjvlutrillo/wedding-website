'use client'

/**
 * BOHO-CHIC EDITORIAL RSVP FORM - WITH DIETARY RESTRICTIONS & ADULTS-ONLY NOTE
 * 
 * Features:
 * - Guest count selector
 * - Dietary restrictions text area
 * - Kind adults-only event notice
 * - All previous functionality maintained
 * - Saves to Supabase guests table
 */

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RSVPFormBohoChic() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    // Status logic
    const [status, setStatus] = useState<'loading' | 'ready' | 'submitted' | 'already' | 'error'>('loading')
    const [guestName, setGuestName] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [confirming, setConfirming] = useState<boolean | null>(null)
    const [guestCount, setGuestCount] = useState(1)
    const [dietaryRestrictions, setDietaryRestrictions] = useState('')

    useEffect(() => {
        const fetchGuest = async () => {
            if (!token) {
                setStatus('error')
                return
            }
            const { data, error } = await supabase
                .from('guests')
                .select('name, guest_count, number_confirmations, did_confirm, email, phone_number, dietary_restrictions')
                .eq('invite_token', token)
                .single()

            if (error || !data) {
                setStatus('error')
                return
            }
            setGuestName(data.name || '')
            setMaxGuests(data.guest_count || 1)
            setDietaryRestrictions(data.dietary_restrictions || '')
            if (data.did_confirm !== null) {
                setStatus('already')
            } else {
                setStatus('ready')
            }
        }
        fetchGuest()
    }, [token])

    // Handle confirm/decline
    const handleConfirm = () => setConfirming(true)
    const handleDecline = async () => {
        if (!token) return
        setStatus('loading')
        await supabase
            .from('guests')
            .update({
                did_confirm: false,
                number_confirmations: 0,
                dietary_restrictions: null
            })
            .eq('invite_token', token)
        setStatus('submitted')
        setConfirming(false)
    }

    // Submit confirmation with dietary restrictions
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return
        setStatus('loading')
        await supabase
            .from('guests')
            .update({
                did_confirm: true,
                number_confirmations: guestCount,
                dietary_restrictions: dietaryRestrictions.trim() || null
            })
            .eq('invite_token', token)
        setStatus('submitted')
        setConfirming(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-20">
            <div className="w-full max-w-2xl">

                {/* Main Card */}
                <div className="bg-warm-cream rounded-3xl overflow-hidden shadow-wedding-xl border border-wedding-blush">

                    {/* Header Section - Editorial Style */}
                    <div className="bg-gradient-to-br from-wedding-burgundy to-wedding-burgundy-light p-8 sm:p-12 text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative space-y-4">
                            {/* Chapter label */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-8 h-px bg-white/30"></div>
                                <span className="text-[10px] uppercase tracking-[0.4em] text-white/70 font-light">
                                    RSVP
                                </span>
                                <div className="w-8 h-px bg-white/30"></div>
                            </div>

                            {/* Main heading */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight">
                                RSVP
                            </h1>

                            {/* Date reminder */}
                            <p className="text-white/90 text-sm sm:text-base">
                                June 6th, 2026 · Puebla, México
                            </p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 sm:p-12">

                        {/* Loading State */}
                        {status === 'loading' && (
                            <div className="text-center py-12 space-y-4">
                                <div className="inline-block w-12 h-12 border-3 border-wedding-burgundy border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-stone-600 font-light">Loading...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {status === 'error' && (
                            <div className="text-center py-12 space-y-6">
                                <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-light text-wedding-burgundy">Invalid Invitation</h2>
                                    <p className="text-stone-600 leading-relaxed">
                                        The invitation link is invalid or has expired.
                                        <br />
                                        Please contact the couple.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Already Submitted State */}
                        {status === 'already' && (
                            <div className="text-center py-12 space-y-6">
                                <div className="w-20 h-20 mx-auto rounded-full bg-wedding-blush flex items-center justify-center">
                                    <svg className="w-10 h-10 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-light text-wedding-burgundy">Thank you, {guestName}!</h2>
                                    <p className="text-stone-600 leading-relaxed text-lg">
                                        You have already confirmed your attendance.
                                        <br />
                                        We look forward to seeing you!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Submitted State */}
                        {status === 'submitted' && (
                            <div className="text-center py-12 space-y-6">
                                <div className="w-20 h-20 mx-auto rounded-full bg-wedding-burgundy flex items-center justify-center">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-light text-wedding-burgundy">
                                        {confirming === false ? '¡Gracias!' : '¡Confirmado!'}
                                    </h2>
                                    <p className="text-stone-600 leading-relaxed text-lg">
                                        {confirming === false
                                            ? 'Sentimos que no puedas acompañarnos. ¡Esperamos verte pronto!'
                                            : `¡Nos vemos el 6 de junio, ${guestName}!`}
                                    </p>
                                </div>
                                {confirming === true && (
                                    <div className="mt-8 p-6 bg-white rounded-2xl border border-wedding-blush">
                                        <p className="text-sm text-stone-600 leading-relaxed">
                                            Hemos registrado tu confirmación. Si tienes alguna duda, no dudes en contactarnos.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Initial Question - Ready State */}
                        {status === 'ready' && confirming === null && (
                            <div className="space-y-8 py-6">
                                {/* Greeting */}
                                <div className="text-center space-y-3">
                                    <h2 className="text-3xl sm:text-4xl font-light text-wedding-burgundy">
                                        Hi, <span className="font-luxury text-4xl sm:text-5xl">{guestName}</span>
                                    </h2>
                                    <p className="text-lg text-stone-600 leading-relaxed max-w-md mx-auto">
                                        Will you be able to join us on this special day?
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 group inline-flex items-center justify-center gap-2 px-8 py-4 bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Yes, I will attend
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-stone-50 text-wedding-burgundy border-2 border-wedding-blush hover:border-wedding-burgundy text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding"
                                    >
                                        I won’t be able to attend
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Guest Count + Dietary Restrictions Form */}
                        {status === 'ready' && confirming === true && (
                            <form onSubmit={handleSubmit} className="space-y-8 py-6">
                                {/* Form header */}
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl sm:text-3xl font-light text-wedding-burgundy">
                                        Great!
                                    </h2>
                                    <p className="text-stone-600">
                                        Please complete the following details:
                                    </p>
                                </div>

                                <div className="max-w-md mx-auto space-y-6">

                                    {/* Guest count selector */}
                                    <div className="space-y-3">
                                        <label htmlFor="guestCount" className="block text-sm font-medium text-wedding-burgundy uppercase tracking-wider">
                                            Number of guests
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="guestCount"
                                                name="guestCount"
                                                required
                                                value={guestCount}
                                                onChange={e => setGuestCount(Number(e.target.value))}
                                                className="w-full px-6 py-4 bg-white border-2 border-wedding-blush rounded-2xl text-wedding-burgundy font-medium text-lg appearance-none cursor-pointer hover:border-wedding-burgundy focus:border-wedding-burgundy focus:ring-2 focus:ring-wedding-burgundy/20 transition-all duration-300"
                                            >
                                                {[...Array(maxGuests)].map((_, idx) => (
                                                    <option key={idx + 1} value={idx + 1}>
                                                        {idx + 1} {idx + 1 === 1 ? 'guest' : 'guests'}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Custom dropdown arrow */}
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-5 h-5 text-wedding-burgundy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-xs text-stone-500">
                                            Maximum  {maxGuests} {maxGuests === 1 ? 'guest' : 'guests'} guest(s) per your invitation
                                        </p>
                                    </div>

                                    {/* Dietary Restrictions */}
                                    <div className="space-y-3">
                                        <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-wedding-burgundy uppercase tracking-wider">
                                            Dietary restrictions <span className="text-stone-400 normal-case text-xs">(Optional)</span>
                                        </label>
                                        <textarea
                                            id="dietaryRestrictions"
                                            name="dietaryRestrictions"
                                            value={dietaryRestrictions}
                                            onChange={e => setDietaryRestrictions(e.target.value)}
                                            rows={3}
                                            placeholder="Example: Vegetarian, nut allergy, shellfish allergy, gluten-free..."
                                            className="w-full px-6 py-4 bg-white border-2 border-wedding-blush rounded-2xl text-stone-700 placeholder:text-stone-400 hover:border-wedding-burgundy focus:border-wedding-burgundy focus:ring-2 focus:ring-wedding-burgundy/20 transition-all duration-300 resize-none"
                                        />
                                        <p className="text-xs text-stone-500 flex items-start gap-2">
                                            <svg className="w-4 h-4 text-wedding-rose flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>We want to make sure you enjoy the menu. Please let us know if you have any dietary restrictions.</span>
                                        </p>
                                    </div>

                                    {/* Adults-Only Event Note */}
                                    <div className="relative bg-gradient-to-br from-amber-50 to-warm-cream rounded-2xl p-6 border-2 border-amber-200/50 shadow-wedding overflow-hidden">
                                        {/* Decorative corner accent */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/30 rounded-bl-[60px] -mr-10 -mt-10"></div>

                                        <div className="relative flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <p className="text-sm text-stone-600 leading-relaxed">
                                                    This celebration has been thoughtfully planned as an adults-only event.
                                                    We appreciate your understanding and hope this evening is an opportunity to relax and celebrate with us.
                                                </p>
                                                <p className="text-xs text-stone-500 italic mt-2">
                                                    With love,
                                                    Susana & Javier
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="group inline-flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-wedding-burgundy to-wedding-burgundy-light hover:opacity-90 text-white text-sm tracking-wide uppercase transition-all duration-300 rounded-full shadow-wedding-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Confirm attendance
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Back to site link */}
                <div className="text-center mt-8">
                    <a
                        href={token ? `en/?token=${token}` : '/'} 
                        className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-wedding-burgundy transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to the invitation
                    </a>
                </div>
            </div>
        </div>
    )
}