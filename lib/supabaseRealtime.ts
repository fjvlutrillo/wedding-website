// /lib/supabaseRealtime.ts
'use client'
import { supabase } from '@/lib/supabaseClient'

let _channel: ReturnType<typeof supabase.channel> | null = null

export function getWitnessChannel() {
    if (_channel) return _channel
    _channel = supabase.channel('witness:room', { config: { broadcast: { self: true } } })
    _channel.subscribe()
    return _channel
}

export function removeWitnessChannel() {
    if (_channel) {
        supabase.removeChannel(_channel)
        _channel = null
    }
}