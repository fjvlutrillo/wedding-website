'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import * as XLSX from 'xlsx'
import { Session } from '@supabase/auth-helpers-nextjs'
import { v4 as uuidv4 } from 'uuid'

type ConfirmFilter = 'all' | 'yes' | 'no' | 'pending'
type PhoneFilter = 'all' | 'with' | 'without'
type WhoInvitesFilter = 'all' | 'Susana' | 'Javier'
// ── NEW ──────────────────────────────────────────────────────────────────────
type CommentsFilter = 'all' | 'with'
type AllergyFilter = 'all' | 'with'
type SortField = 'name' | 'guest_count' | 'did_confirm' | 'none'
type SortDir = 'asc' | 'desc'
// ─────────────────────────────────────────────────────────────────────────────

export default function GuestUploadPage() {
    const router = useRouter()
    const [session, setSession] = useState<Session | null>(null)
    const [guests, setGuests] = useState<any[]>([])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editForm, setEditForm] = useState<any>({})
    const [manualGuest, setManualGuest] = useState({
        name: '',
        guest_count: 1,
        phone_number: '',
        email: '',
        whoInvites: 'Susana', // default value
        dietary_restrictions: '',
        comments: '',
    })

    // ---- Filter state ----
    const [q, setQ] = useState('')
    const [confirmFilter, setConfirmFilter] = useState<ConfirmFilter>('all')
    const [tableFilter, setTableFilter] = useState<string>('')
    const [phoneFilter, setPhoneFilter] = useState<PhoneFilter>('all')
    const [whoInvitesFilter, setWhoInvitesFilter] = useState<WhoInvitesFilter>('all')
    // ── NEW filter state ──────────────────────────────────────────────────────
    const [commentsFilter, setCommentsFilter] = useState<CommentsFilter>('all')
    const [allergyFilter, setAllergyFilter] = useState<AllergyFilter>('all')
    // ── NEW sort state (default: A→Z by name) ─────────────────────────────────
    const [sortField, setSortField] = useState<SortField>('name')
    const [sortDir, setSortDir] = useState<SortDir>('asc')
    // ─────────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                router.push('/login')
            } else {
                setSession(data.session)
                fetchGuests()
            }
        }
        getSession()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchGuests = async () => {
        const { data } = await supabase.from('guests').select('*')
        if (data) setGuests(data)
    }

    const handleManualAdd = async () => {
        if (!session) return

        // Basic validation
        if (!manualGuest.name.trim()) {
            alert('❌ Por favor ingresa el nombre del invitado')
            return
        }

        if (manualGuest.guest_count < 1) {
            alert('❌ El número de invitados debe ser al menos 1')
            return
        }

        const { error } = await supabase.from('guests').insert([{
            ...manualGuest,
            guest_count: parseInt(String(manualGuest.guest_count)),
            number_confirmations: 0,
            table_number: null,
            created_by: session.user.id,
            did_confirm: null,
            invite_token: uuidv4(),
        }])

        if (!error) {
            await fetchGuests()
            setManualGuest({ name: '', guest_count: 1, phone_number: '', email: '', whoInvites: 'Susana', dietary_restrictions: '', comments: '' })
            alert(`✅ Invitado "${manualGuest.name}" agregado correctamente`)
        } else {
            alert('❌ Error al agregar: ' + error.message)
        }
    }

    // 🔧 FIX #1: Flexible column name matching for Excel uploads
    // This handles variations in column names (with/without accents, different cases)
    const findColumnValue = (row: any, possibleNames: string[]): string => {
        for (const name of possibleNames) {
            if (row[name] !== undefined && row[name] !== null) {
                return String(row[name]).trim()
            }
        }
        return ''
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !session) return

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet)

            console.log('📊 Excel columns detected:', Object.keys(jsonData[0] || {}))
            console.log('📊 First row sample:', jsonData[0])

            const mapped = jsonData.map((g: any) => {
                // 🔧 FIX: Try multiple column name variations
                const guestData = {
                    name: findColumnValue(g, ['Invitado', 'invitado', 'Nombre', 'nombre', 'Name', 'name']),
                    guest_count: parseInt(findColumnValue(g, ['Invitados', 'invitados', 'Numero', 'numero', 'Number', 'number', 'Número', 'número'])) || 1,
                    // 🔧 FIX: Handle phone with AND without accent
                    phone_number: findColumnValue(g, ['Teléfono', 'Telefono', 'teléfono', 'telefono', 'Phone', 'phone', 'Celular', 'celular', 'WhatsApp', 'whatsapp']),
                    email: findColumnValue(g, ['Email', 'email', 'Correo', 'correo', 'E-mail', 'e-mail']),
                    dietary_restrictions: findColumnValue(g, ['Restricciones', 'restricciones', 'Dietary', 'dietary', 'Dieta', 'dieta']),
                    whoInvites: findColumnValue(g, ['Invita', 'invita', 'QuienInvita', 'quien_invita']) || 'Susana',
                    invite_token: uuidv4(),
                    number_confirmations: 0,
                    table_number: null,
                    created_by: session.user.id,
                    did_confirm: null,
                }

                console.log('✅ Mapped guest:', guestData)
                return guestData
            })

            console.log(`📤 Uploading ${mapped.length} guests to Supabase...`)

            const { error, data: insertedData } = await supabase.from('guests').insert(mapped).select()

            if (!error) {
                await fetchGuests()
                console.log('✅ Upload successful!', insertedData)
                alert(`✅ ${mapped.length} invitados importados correctamente\n\n` +
                    `Nombres: ${mapped.map(g => g.name).join(', ')}`)
            } else {
                console.error('❌ Upload error:', error)
                alert('❌ Error al importar: ' + error.message)
            }
        } catch (err) {
            console.error('❌ File processing error:', err)
            alert('❌ Error al procesar el archivo: ' + err)
        }
    }

    const startEdit = (index: number, guest: any) => {
        setEditingIndex(index)
        setEditForm({ ...guest })
        console.log('🔧 Editing guest:', guest)
        console.log('🔧 whoInvites value:', guest.whoInvites)
    }

    const cancelEdit = () => {
        setEditingIndex(null)
        setEditForm({})
    }

    const updateEditField = (field: string, value: any) => {
        console.log(`🔧 Updating field "${field}" to:`, value)
        setEditForm((prev: any) => ({ ...prev, [field]: value }))
    }

    const saveEdit = async (id: string) => {
        // Validation
        if (!editForm.name?.trim()) {
            alert('❌ El nombre no puede estar vacío')
            return
        }

        if (editForm.guest_count && editForm.guest_count < 1) {
            alert('❌ El número de invitados debe ser al menos 1')
            return
        }

        // 🔧 FIX #2: Always include all fields in update, don't skip if undefined
        const updateData: any = {
            name: editForm.name,
            guest_count: parseInt(editForm.guest_count) || 0,
            phone_number: editForm.phone_number || '',
            email: editForm.email || '',
            dietary_restrictions: editForm.dietary_restrictions || '',
            comments: editForm.comments || '',
            table_number: editForm.table_number ? parseInt(editForm.table_number) : null,
            number_confirmations: parseInt(editForm.number_confirmations) || 0,
            did_confirm: editForm.did_confirm === null ? null : editForm.did_confirm,
            whoInvites: editForm.whoInvites || 'Susana', // 🔧 CRITICAL FIX: Always set this field
        }

        console.log('💾 Saving to Supabase:', updateData)
        console.log('💾 Guest ID:', id)

        const { error, data } = await supabase
            .from('guests')
            .update(updateData)
            .eq('id', id)
            .select() // 🔧 FIX: Add .select() to see what was actually saved

        if (!error) {
            console.log('✅ Supabase update successful:', data)
            await fetchGuests() // Refetch to ensure UI matches database
            cancelEdit()
            alert('✅ Cambios guardados correctamente')
        } else {
            console.error('❌ Supabase update error:', error)
            alert('❌ Error al guardar: ' + error.message)
        }
    }

    const deleteGuest = async (id: string) => {
        const confirm = window.confirm('¿Eliminar este invitado?')
        if (!confirm) return
        const { error } = await supabase.from('guests').delete().eq('id', id)
        if (!error) {
            setGuests(guests.filter((g) => g.id !== id))
            alert('✅ Invitado eliminado correctamente')
        } else {
            alert('❌ Error al eliminar: ' + error.message)
        }
    }

    // ---- WhatsApp Message Templates ----

    const getSaveTheDateMessageES = (guestName: string) => {
        return `¡Hola ${guestName}! 👋

Queremos compartir contigo una noticia muy especial: ¡Nos casamos! 💍

Save the date
📅 6 de Junio, 2026
📍 Puebla, México

¡Pronto recibirás la invitación formal!

https://bodasusanayjavier.com/save-the-date

Con cariño,
Susana & Javier ❤️`
    }

    const getSaveTheDateMessageEN = (guestName: string) => {
        return `Hi ${guestName}! 👋

We want to share some very special news with you: We're getting married! 💍

Save the date
📅 June 6, 2026
📍 Puebla, Mexico

You'll receive the formal invitation soon!

https://bodasusanayjavier.com/en

With love,
Susana & Javier ❤️`
    }

    const getFormalInviteMessage = (guestName: string, token: string) => {
        return `Hola ${guestName}, 

Te compartimos los detalles de nuestra boda. Por favor confirma tu asistencia aquí:

https://bodasusanayjavier.com/?token=${token}

Con cariño,
Susana & Javier 💑🥳🍾`
    }

    const getReminderMessage = (guestName: string, token: string, guestCount?: number) => {
        const boletosLine = guestCount !== undefined
            ? `\nNúmero de boletos: ${guestCount} ${guestCount === 1 ? 'boleto' : 'boletos'}`
            : ''
        return `Hola ${guestName},

Solo como recordatorio 😊. ¿Podrías confirmar tu asistencia cuando tengas un momento?

Confirma aquí: https://bodasusanayjavier.com/?token=${token}${boletosLine}

¡Gracias! ❤️`
    }

    // ---- Export to Excel ----
    const exportToExcel = () => {
        const rows = filteredGuests.map((g) => {
            const phone = (g.phone_number || '').replace(/[^\d]/g, '')
            const confirmLabel =
                g.did_confirm === true ? 'Sí' :
                    g.did_confirm === false ? 'No' : 'Pendiente'

            // Minimal message for Excel hyperlink — keeps URL under 255 chars for HYPERLINK() formula
            const count = g.guest_count || 1
            const minimalMsg = `https://bodasusanayjavier.com/?token=${g.invite_token} Boletos: ${count}`
            const whatsappUrl = phone && g.invite_token
                ? `https://wa.me/${phone}?text=${encodeURIComponent(minimalMsg)}`
                : ''

            return {
                'Nombre del Invitado': g.name || '',
                'Boletos Asignados': g.guest_count || 0,
                'Boletos Confirmados': g.number_confirmations || 0,
                'Teléfono': g.phone_number || '',
                'Invita': g.whoInvites || '',
                '¿Confirmó?': confirmLabel,
                'Restricciones Dietéticas': g.dietary_restrictions || '',
                'Comentarios': g.comments || '',
                'WhatsApp Recordatorio': whatsappUrl,
            }
        })

        const ws = XLSX.utils.json_to_sheet(rows)

        // Column widths for readability
        ws['!cols'] = [
            { wch: 30 }, // Nombre
            { wch: 18 }, // Boletos Asignados
            { wch: 20 }, // Boletos Confirmados
            { wch: 18 }, // Teléfono
            { wch: 12 }, // Invita
            { wch: 14 }, // ¿Confirmó?
            { wch: 30 }, // Restricciones
            { wch: 30 }, // Comentarios
            { wch: 80 }, // WhatsApp URL
        ]

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Invitados')

        const date = new Date().toISOString().slice(0, 10)
        XLSX.writeFile(wb, `invitados_${date}.xlsx`)
    }

    // ── NEW: sort toggle helper ────────────────────────────────────────────────
    // Clicking the same column flips direction; clicking a new column resets to asc.
    const handleSortClick = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDir('asc')
        }
    }
    // ─────────────────────────────────────────────────────────────────────────────

    // ---- Computed filtered + sorted list + totals ----
    const filteredGuests = useMemo(() => {
        const ql = q.trim().toLowerCase()

        const filtered = guests.filter((g) => {
            const textOk =
                ql === '' ||
                [g.name, g.phone_number, g.email]
                    .map((v: string) => (v || '').toLowerCase())
                    .some((v: string) => v.includes(ql))

            const confOk =
                confirmFilter === 'all' ? true
                    : confirmFilter === 'pending' ? g.did_confirm === null
                        : confirmFilter === 'yes' ? g.did_confirm === true
                            : g.did_confirm === false

            const tableOk =
                tableFilter === '' ? true
                    : String(g.table_number ?? '') === tableFilter

            const phoneOk =
                phoneFilter === 'all' ? true
                    : phoneFilter === 'with' ? !!(g.phone_number && g.phone_number.trim() !== '')
                        : !(g.phone_number && g.phone_number.trim() !== '')

            const whoInvitesOk =
                whoInvitesFilter === 'all' ? true
                    : g.whoInvites === whoInvitesFilter

            // ── NEW filters ──────────────────────────────────────────────────
            const commentsOk =
                commentsFilter === 'all' ? true
                    : !!(g.comments && g.comments.trim() !== '')

            const allergyOk =
                allergyFilter === 'all' ? true
                    : !!(g.dietary_restrictions && g.dietary_restrictions.trim() !== '')
            // ─────────────────────────────────────────────────────────────────

            return textOk && confOk && tableOk && phoneOk && whoInvitesOk && commentsOk && allergyOk
        })

        // ── NEW sort ──────────────────────────────────────────────────────────
        if (sortField === 'none') return filtered

        return [...filtered].sort((a, b) => {
            let valA: any, valB: any

            if (sortField === 'name') {
                valA = (a.name || '').toLowerCase()
                valB = (b.name || '').toLowerCase()
            } else if (sortField === 'guest_count') {
                valA = parseInt(a.guest_count) || 0
                valB = parseInt(b.guest_count) || 0
            } else if (sortField === 'did_confirm') {
                // Ascending: Confirmados(1) → Pendientes(0) → No(-1)
                const rank = (v: boolean | null) => v === true ? 1 : v === null ? 0 : -1
                valA = rank(a.did_confirm)
                valB = rank(b.did_confirm)
            }

            if (valA < valB) return sortDir === 'asc' ? -1 : 1
            if (valA > valB) return sortDir === 'asc' ? 1 : -1
            return 0
        })
        // ─────────────────────────────────────────────────────────────────────
    }, [guests, q, confirmFilter, tableFilter, phoneFilter, whoInvitesFilter,
        commentsFilter, allergyFilter, sortField, sortDir])

    const totals = useMemo(() => {
        return {
            invited: filteredGuests.reduce((sum, g) => sum + (parseInt(g.guest_count) || 0), 0),
            confirmed: filteredGuests.reduce((sum, g) => sum + (parseInt(g.number_confirmations) || 0), 0),
        }
    }, [filteredGuests])

    if (!session) return <p className="p-8">Verificando acceso...</p>

    // ---- RSVP badge helper ----
    const rsvpBadge = (did_confirm: boolean | null) => {
        if (did_confirm === true)
            return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">✅ Sí</span>
        if (did_confirm === false)
            return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800">❌ No</span>
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">⏳ Pendiente</span>
    }

    // ---- Stats summary ----
    const rsvpSummary = (() => {
        const yes = filteredGuests.filter(g => g.did_confirm === true)
        const no = filteredGuests.filter(g => g.did_confirm === false)
        const pending = filteredGuests.filter(g => g.did_confirm === null)
        const yesTickets = yes.reduce((s, g) => s + (parseInt(g.guest_count) || 0), 0)
        const noTickets = no.reduce((s, g) => s + (parseInt(g.guest_count) || 0), 0)
        const pendingTickets = pending.reduce((s, g) => s + (parseInt(g.guest_count) || 0), 0)
        const totalTickets = yesTickets + noTickets + pendingTickets
        const confirmationRate = totalTickets > 0 ? Math.round((yesTickets / totalTickets) * 100) : 0
        return {
            yesCount: yes.length, yesTickets,
            noCount: no.length, noTickets,
            pendingCount: pending.length, pendingTickets,
            totalGroups: filteredGuests.length,
            totalTickets,
            confirmationRate,
        }
    })()

    // ---- KPI card definitions ----
    const pct = (n: number, d: number) => Math.round((n / (d || 1)) * 100)
    const totalGroups = rsvpSummary.totalGroups || 1
    const totalTickets = rsvpSummary.totalTickets || 1

    const kpiCards = [
        {
            label: 'Confirmados', sublabel: 'Asistirán',
            tickets: rsvpSummary.yesTickets, groups: rsvpSummary.yesCount,
            pctTickets: pct(rsvpSummary.yesTickets, totalTickets),
            pctGroups: pct(rsvpSummary.yesCount, totalGroups),
            filter: 'yes' as ConfirmFilter,
            accent: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
            bar: '#4ade80', textPrimary: '#14532d', textSecondary: '#15803d', icon: '✅',
        },
        {
            label: 'No Asisten', sublabel: 'Declinaron',
            tickets: rsvpSummary.noTickets, groups: rsvpSummary.noCount,
            pctTickets: pct(rsvpSummary.noTickets, totalTickets),
            pctGroups: pct(rsvpSummary.noCount, totalGroups),
            filter: 'no' as ConfirmFilter,
            accent: '#dc2626', bg: '#fff1f2', border: '#fecdd3',
            bar: '#f87171', textPrimary: '#7f1d1d', textSecondary: '#b91c1c', icon: '❌',
        },
        {
            label: 'Pendientes', sublabel: 'Sin respuesta',
            tickets: rsvpSummary.pendingTickets, groups: rsvpSummary.pendingCount,
            pctTickets: pct(rsvpSummary.pendingTickets, totalTickets),
            pctGroups: pct(rsvpSummary.pendingCount, totalGroups),
            filter: 'pending' as ConfirmFilter,
            accent: '#ca8a04', bg: '#fefce8', border: '#fef08a',
            bar: '#facc15', textPrimary: '#713f12', textSecondary: '#a16207', icon: '⏳',
        },
    ]

    // Confirmation rate banner color
    const rate = rsvpSummary.confirmationRate
    const rateColor = rate >= 70 ? '#16a34a' : rate >= 40 ? '#ca8a04' : '#dc2626'
    const rateBg = rate >= 70 ? '#f0fdf4' : rate >= 40 ? '#fefce8' : '#fff1f2'
    const rateText = rate >= 70 ? '#14532d' : rate >= 40 ? '#713f12' : '#7f1d1d'

    // ── NEW: badge counts for special-needs guests ────────────────────────────
    const withCommentsCount = guests.filter(g => g.comments && g.comments.trim() !== '').length
    const withAllergyCount = guests.filter(g => g.dietary_restrictions && g.dietary_restrictions.trim() !== '').length
    // ─────────────────────────────────────────────────────────────────────────────

    return (
        <main className="min-h-screen bg-paper text-wine p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Gestión de invitados</h1>
                <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium px-5 py-2.5 rounded-lg shadow transition"
                    title="Exporta la lista filtrada actual a Excel"
                >
                    📥 Exportar Excel
                    <span className="text-xs opacity-75">({filteredGuests.length} invitados)</span>
                </button>
            </div>

            {/* ── KPI Cards ── */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {kpiCards.map((c) => {
                    const isActive = confirmFilter === c.filter
                    return (
                        <button
                            key={c.filter}
                            onClick={() => setConfirmFilter(isActive ? 'all' : c.filter)}
                            style={{
                                background: c.bg,
                                borderColor: isActive ? c.accent : c.border,
                                borderWidth: isActive ? '2px' : '1px',
                                borderStyle: 'solid',
                                boxShadow: isActive
                                    ? `0 0 0 3px ${c.accent}33`
                                    : '0 1px 3px rgba(0,0,0,0.08)',
                            }}
                            className="relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                        >
                            <div style={{ background: c.accent }} className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" />
                            <div className="pl-2">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p style={{ color: c.textSecondary }} className="text-xs font-bold uppercase tracking-widest">{c.label}</p>
                                        <p style={{ color: c.accent }} className="text-xs mt-0.5 opacity-75">{c.sublabel}</p>
                                    </div>
                                    <span className="text-2xl leading-none">{c.icon}</span>
                                </div>
                                <p style={{ color: c.textPrimary }} className="text-5xl font-extrabold leading-none tracking-tight">
                                    {c.tickets}
                                </p>
                                <p style={{ color: c.textSecondary }} className="text-sm font-semibold mb-1">
                                    {c.tickets === 1 ? 'boleto' : 'boletos'}
                                </p>
                                <p style={{ color: c.textSecondary }} className="text-xs opacity-60 mb-4">
                                    {c.groups} {c.groups === 1 ? 'grupo' : 'grupos'}
                                </p>
                                <div className="mb-2">
                                    <div className="flex justify-between text-xs mb-1" style={{ color: c.textSecondary }}>
                                        <span>Boletos</span>
                                        <span className="font-semibold">{c.pctTickets}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                                        <div style={{ width: `${c.pctTickets}%`, background: c.bar }} className="h-full rounded-full transition-all duration-500" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1" style={{ color: c.textSecondary }}>
                                        <span>Grupos</span>
                                        <span className="font-semibold">{c.pctGroups}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                                        <div style={{ width: `${c.pctGroups}%`, background: c.bar }} className="h-full rounded-full transition-all duration-500" />
                                    </div>
                                </div>
                                {isActive && (
                                    <p style={{ color: c.accent }} className="text-xs font-semibold mt-3 text-right">
                                        Filtrando tabla ✕
                                    </p>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* ── Confirmation Rate Banner ── */}
            <div
                style={{ background: rateBg, border: `1px solid ${rateColor}33` }}
                className="mb-8 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
                <div className="flex-1">
                    <p style={{ color: rateText }} className="text-sm font-bold uppercase tracking-widest mb-1">
                        🎟️ Tasa de confirmación de boletos
                    </p>
                    <p style={{ color: rateText }} className="text-xs opacity-70">
                        {rsvpSummary.yesTickets} confirmados
                        {' · '}
                        {rsvpSummary.pendingTickets} pendientes
                        {' · '}
                        {rsvpSummary.noTickets} declinados
                        {' · '}
                        {rsvpSummary.totalTickets} total
                    </p>
                </div>
                <div className="flex items-center gap-4 sm:w-64">
                    <div className="flex-1">
                        <div className="h-3 rounded-full bg-white/70 overflow-hidden">
                            <div
                                style={{ width: `${rate}%`, background: rateColor }}
                                className="h-full rounded-full transition-all duration-700"
                            />
                        </div>
                    </div>
                    <p style={{ color: rateColor }} className="text-3xl font-extrabold tracking-tight w-16 text-right">
                        {rate}%
                    </p>
                </div>
            </div>

            {/* ── Manual Add ── */}
            <div className="mb-8 space-y-2 bg-[#C6B89E] p-4 rounded shadow max-w-xl">
                <h2 className="text-xl font-semibold mb-2">Agregar invitado manualmente</h2>
                <input
                    type="text"
                    placeholder="Nombre del invitado"
                    value={manualGuest.name}
                    onChange={(e) => setManualGuest({ ...manualGuest, name: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Número de invitados"
                    value={manualGuest.guest_count}
                    onChange={(e) => setManualGuest({ ...manualGuest, guest_count: parseInt(e.target.value) })}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Teléfono / WhatsApp"
                    value={manualGuest.phone_number}
                    onChange={(e) => setManualGuest({ ...manualGuest, phone_number: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={manualGuest.email}
                    onChange={(e) => setManualGuest({ ...manualGuest, email: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                />
                <textarea
                    placeholder="Restricciones dietéticas (opcional)"
                    value={manualGuest.dietary_restrictions}
                    onChange={(e) => setManualGuest({ ...manualGuest, dietary_restrictions: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                    rows={2}
                />
                <textarea
                    placeholder="Comentarios (opcional)"
                    value={manualGuest.comments}
                    onChange={(e) => setManualGuest({ ...manualGuest, comments: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                    rows={2}
                />
                <select
                    value={manualGuest.whoInvites}
                    onChange={(e) => setManualGuest({ ...manualGuest, whoInvites: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="Susana">Susana</option>
                    <option value="Javier">Javier</option>
                </select>
                <button
                    onClick={handleManualAdd}
                    className="bg-rosewood text-white px-4 py-2 rounded hover:bg-cherry transition"
                >
                    Agregar invitado
                </button>
            </div>

            {/* Excel Upload */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="border rounded px-4 py-2 bg-white"
                />
                <div className="text-sm text-gray-600">
                    <p className="font-medium">💡 Columnas aceptadas en el Excel:</p>
                    <ul className="text-xs mt-1 ml-4 space-y-1">
                        <li>• Nombre: "Invitado" o "Nombre"</li>
                        <li>• Cantidad: "Invitados" o "Numero"</li>
                        <li>• Teléfono: "Telefono" (con o sin acento)</li>
                        <li>• Restricciones: "Restricciones" o "Dietary"</li>
                        <li>• Invita: "Invita" → debe ser "Susana" o "Javier"</li>
                    </ul>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="mb-4 bg-white/90 border rounded-md p-4 shadow">
                <div className="flex flex-col lg:flex-row gap-3 lg:items-end flex-wrap">

                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Buscar</label>
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Nombre, teléfono o email"
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">¿Confirmó?</label>
                        <select
                            value={confirmFilter}
                            onChange={(e) => setConfirmFilter(e.target.value as ConfirmFilter)}
                            className="border px-3 py-2 rounded w-full"
                        >
                            <option value="all">Todos</option>
                            <option value="yes">Sí</option>
                            <option value="no">No</option>
                            <option value="pending">Pendiente</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Mesa</label>
                        <input
                            type="text"
                            value={tableFilter}
                            onChange={(e) => setTableFilter(e.target.value)}
                            placeholder="Ej. 5"
                            className="border px-3 py-2 rounded w-28"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">WhatsApp</label>
                        <select
                            value={phoneFilter}
                            onChange={(e) => setPhoneFilter(e.target.value as PhoneFilter)}
                            className="border px-3 py-2 rounded w-full"
                        >
                            <option value="all">Todos</option>
                            <option value="with">Con teléfono</option>
                            <option value="without">Sin teléfono</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Invita</label>
                        <select
                            value={whoInvitesFilter}
                            onChange={(e) => setWhoInvitesFilter(e.target.value as WhoInvitesFilter)}
                            className="border px-3 py-2 rounded w-full"
                        >
                            <option value="all">Todos</option>
                            <option value="Susana">Susana</option>
                            <option value="Javier">Javier</option>
                        </select>
                    </div>

                    {/* ── NEW: Allergy filter ────────────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            🥜 Alergias / Dieta
                            {allergyFilter === 'with' && (
                                <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {withAllergyCount}
                                </span>
                            )}
                        </label>
                        <select
                            value={allergyFilter}
                            onChange={(e) => setAllergyFilter(e.target.value as AllergyFilter)}
                            className={`border px-3 py-2 rounded w-full ${allergyFilter === 'with' ? 'border-amber-500 bg-amber-50 font-semibold' : ''}`}
                        >
                            <option value="all">Todos</option>
                            <option value="with">Con restricciones ({withAllergyCount})</option>
                        </select>
                    </div>

                    {/* ── NEW: Comments filter ───────────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            💬 Comentarios
                            {commentsFilter === 'with' && (
                                <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {withCommentsCount}
                                </span>
                            )}
                        </label>
                        <select
                            value={commentsFilter}
                            onChange={(e) => setCommentsFilter(e.target.value as CommentsFilter)}
                            className={`border px-3 py-2 rounded w-full ${commentsFilter === 'with' ? 'border-blue-500 bg-blue-50 font-semibold' : ''}`}
                        >
                            <option value="all">Todos</option>
                            <option value="with">Con comentarios ({withCommentsCount})</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setQ('')
                            setConfirmFilter('all')
                            setTableFilter('')
                            setPhoneFilter('all')
                            setWhoInvitesFilter('all')
                            // ── NEW: also reset new filters ──
                            setAllergyFilter('all')
                            setCommentsFilter('all')
                        }}
                        className="mt-2 lg:mt-0 bg-[#C6B89E] hover:bg-[#B9AB93] text-[#173039] font-medium px-4 py-2 rounded"
                    >
                        Limpiar filtros
                    </button>
                </div>

                {/* ── NEW: Sort controls ─────────────────────────────────────────────── */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 mr-1">Ordenar por:</span>
                    {([
                        { field: 'name' as SortField, label: 'Nombre' },
                        { field: 'guest_count' as SortField, label: '# Boletos' },
                        { field: 'did_confirm' as SortField, label: 'Estado RSVP' },
                    ]).map(({ field, label }) => (
                        <button
                            key={field}
                            onClick={() => handleSortClick(field)}
                            className={`
                                flex items-center px-3 py-1.5 rounded border text-sm transition-colors
                                ${sortField === field
                                    ? 'bg-[#47091C] text-white border-[#47091C] font-semibold'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
                            `}
                        >
                            {label}
                            {sortField === field
                                ? <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                                : <span className="ml-1 opacity-30">↕</span>
                            }
                        </button>
                    ))}
                    <span className="text-xs text-gray-400 ml-2">
                        (haz click de nuevo en el mismo botón para invertir el orden)
                    </span>
                </div>
                {/* ─────────────────────────────────────────────────────────────────────── */}

                <div className="mt-3 text-sm text-[#173039]">
                    Mostrando <b>{filteredGuests.length}</b> de <b>{guests.length}</b> invitados
                    {allergyFilter === 'with' && (
                        <span className="ml-2 text-amber-700 font-medium">· 🥜 {withAllergyCount} con restricciones dietéticas</span>
                    )}
                    {commentsFilter === 'with' && (
                        <span className="ml-2 text-blue-700 font-medium">· 💬 {withCommentsCount} con comentarios</span>
                    )}
                </div>
            </div>

            {/* ── Guest Table ── */}
            <div className="overflow-x-auto border rounded-md bg-white/90 shadow">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-rosewood text-black">
                        <tr>
                            {/* ── Sortable column headers ── */}
                            <th
                                className="px-4 py-2 cursor-pointer hover:bg-rosewood/80 select-none whitespace-nowrap"
                                onClick={() => handleSortClick('name')}
                            >
                                Invitado {sortField === 'name'
                                    ? (sortDir === 'asc' ? '↑' : '↓')
                                    : <span className="opacity-30 text-xs">↕</span>}
                            </th>
                            <th className="px-4 py-2">Invita</th>
                            <th
                                className="px-4 py-2 cursor-pointer hover:bg-rosewood/80 select-none whitespace-nowrap"
                                onClick={() => handleSortClick('guest_count')}
                            >
                                Invitados {sortField === 'guest_count'
                                    ? (sortDir === 'asc' ? '↑' : '↓')
                                    : <span className="opacity-30 text-xs">↕</span>}
                            </th>
                            <th className="px-4 py-2">Teléfono</th>
                            <th className="px-4 py-2">Email</th>
                            {/* Allergy col header — turns amber when filter active */}
                            <th className={`px-4 py-2 ${allergyFilter === 'with' ? 'bg-amber-200 text-amber-900' : ''}`}>
                                🥜 Restricciones Dietéticas
                            </th>
                            {/* Comments col header — turns blue when filter active */}
                            <th className={`px-4 py-2 ${commentsFilter === 'with' ? 'bg-blue-200 text-blue-900' : ''}`}>
                                💬 Comentarios
                            </th>
                            <th className="px-4 py-2">Confirmados</th>
                            <th
                                className="px-4 py-2 cursor-pointer hover:bg-rosewood/80 select-none whitespace-nowrap"
                                onClick={() => handleSortClick('did_confirm')}
                            >
                                ¿Confirmó? {sortField === 'did_confirm'
                                    ? (sortDir === 'asc' ? '↑' : '↓')
                                    : <span className="opacity-30 text-xs">↕</span>}
                            </th>
                            <th className="px-4 py-2">Mesa</th>
                            <th className="px-4 py-2">Token</th>
                            <th className="px-4 py-2">WhatsApp</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredGuests.map((guest) => {
                            const globalIdx = guests.findIndex(g => g.id === guest.id)
                            const isEditing = editingIndex === globalIdx

                            // ── Row highlight flags ──────────────────────────────────────
                            const hasAllergy = !!(guest.dietary_restrictions && guest.dietary_restrictions.trim() !== '')
                            const hasComments = !!(guest.comments && guest.comments.trim() !== '')
                            // ─────────────────────────────────────────────────────────────

                            return (
                                <tr
                                    key={guest.id}
                                    className={`border-b hover:bg-stone-50 ${hasAllergy && hasComments ? 'bg-orange-50'
                                            : hasAllergy ? 'bg-amber-50'
                                                : hasComments ? 'bg-blue-50'
                                                    : ''
                                        }`}
                                >
                                    {isEditing ? (
                                        <>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editForm.name ?? ''}
                                                    onChange={(e) => updateEditField('name', e.target.value)}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    value={editForm.whoInvites ?? 'Susana'}
                                                    onChange={(e) => {
                                                        console.log('🔧 Dropdown changed to:', e.target.value)
                                                        updateEditField('whoInvites', e.target.value)
                                                    }}
                                                    className="border px-2 py-1 rounded w-full bg-white"
                                                >
                                                    <option value="Susana">Susana</option>
                                                    <option value="Javier">Javier</option>
                                                </select>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Actual: {editForm.whoInvites}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={editForm.guest_count ?? 0}
                                                    onChange={(e) => updateEditField('guest_count', parseInt(e.target.value))}
                                                    className="border px-2 py-1 rounded w-20"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editForm.phone_number ?? ''}
                                                    onChange={(e) => updateEditField('phone_number', e.target.value)}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editForm.email ?? ''}
                                                    onChange={(e) => updateEditField('email', e.target.value)}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <textarea
                                                    value={editForm.dietary_restrictions ?? ''}
                                                    onChange={(e) => updateEditField('dietary_restrictions', e.target.value)}
                                                    className="border px-2 py-1 rounded w-full"
                                                    rows={2}
                                                    placeholder="Sin restricciones"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <textarea
                                                    value={editForm.comments ?? ''}
                                                    onChange={(e) => updateEditField('comments', e.target.value)}
                                                    className="border px-2 py-1 rounded w-full"
                                                    rows={2}
                                                    placeholder="Sin comentarios"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={editForm.number_confirmations ?? 0}
                                                    onChange={(e) => updateEditField('number_confirmations', parseInt(e.target.value))}
                                                    className="border px-2 py-1 rounded w-20"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    value={editForm.did_confirm ?? ''}
                                                    onChange={(e) =>
                                                        updateEditField(
                                                            'did_confirm',
                                                            e.target.value === '' ? null : e.target.value === 'true'
                                                        )
                                                    }
                                                    className="border px-2 py-1 rounded"
                                                >
                                                    <option value="">-</option>
                                                    <option value="true">Sí</option>
                                                    <option value="false">No</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={editForm.table_number ?? ''}
                                                    onChange={(e) =>
                                                        updateEditField(
                                                            'table_number',
                                                            e.target.value === '' ? null : parseInt(e.target.value)
                                                        )
                                                    }
                                                    className="border px-2 py-1 rounded w-20"
                                                />
                                            </td>
                                            <td className="px-4 py-2 font-mono text-xs break-all">
                                                {editForm.invite_token}
                                            </td>
                                            <td className="px-4 py-2" />
                                            <td className="px-4 py-2">
                                                <button onClick={() => saveEdit(guest.id)} className="text-green-600 mr-2 font-medium">
                                                    ✓ Guardar
                                                </button>
                                                <button onClick={cancelEdit} className="text-gray-500">
                                                    ✕ Cancelar
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-2">{guest.name}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${guest.whoInvites === 'Susana' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {guest.whoInvites || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">{guest.guest_count}</td>
                                            <td className="px-4 py-2">{guest.phone_number}</td>
                                            <td className="px-4 py-2">{guest.email}</td>

                                            {/* ── Allergy cell: highlighted when non-empty ── */}
                                            <td className="px-4 py-2">
                                                <div className="max-w-xs">
                                                    {hasAllergy ? (
                                                        <span className="text-xs bg-amber-100 border border-amber-400 text-amber-900 font-semibold px-2 py-1 rounded inline-flex items-center gap-1">
                                                            ⚠️ {guest.dietary_restrictions}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Sin restricciones</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* ── Comments cell: highlighted when non-empty ── */}
                                            <td className="px-4 py-2">
                                                <div className="max-w-xs">
                                                    {hasComments ? (
                                                        <span className="text-xs bg-blue-100 border border-blue-400 text-blue-900 font-semibold px-2 py-1 rounded inline-flex items-center gap-1">
                                                            💬 {guest.comments}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">—</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-2">{guest.number_confirmations}</td>
                                            <td className="px-4 py-2">
                                                {rsvpBadge(guest.did_confirm)}
                                            </td>
                                            <td className="px-4 py-2">{guest.table_number}</td>
                                            <td className="px-4 py-2 font-mono text-xs break-all">{guest.invite_token}</td>

                                            <td className="px-4 py-2">
                                                {guest.phone_number && guest.invite_token ? (
                                                    <div className="flex flex-col gap-2">
                                                        <a
                                                            href={`https://wa.me/${guest.phone_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(getSaveTheDateMessageES(guest.name))}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded text-xs transition text-center"
                                                            title="Save the Date - Español"
                                                        >
                                                            📅 Save the Date 🇲🇽
                                                        </a>

                                                        <a
                                                            href={`https://wa.me/${guest.phone_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(getSaveTheDateMessageEN(guest.name))}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition text-center"
                                                            title="Save the Date - English"
                                                        >
                                                            📅 Save the Date 🇺🇸
                                                        </a>

                                                        <a
                                                            href={`https://wa.me/${guest.phone_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(getFormalInviteMessage(guest.name, guest.invite_token))}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition text-center"
                                                            title="Invitación Formal con RSVP"
                                                        >
                                                            💌 Invitación
                                                        </a>

                                                        {guest.did_confirm !== true && (
                                                            <a
                                                                href={`https://wa.me/${guest.phone_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(getReminderMessage(guest.name, guest.invite_token))}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs transition text-center"
                                                                title="Recordatorio"
                                                            >
                                                                🔔 Recordatorio
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Sin teléfono</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                <button onClick={() => startEdit(globalIdx, guest)} className="text-blue-600 mr-2 text-sm">
                                                    ✏️ Editar
                                                </button>
                                                <button onClick={() => deleteGuest(guest.id)} className="text-red-600 text-sm">
                                                    🗑️ Eliminar
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>

                    <tfoot>
                        <tr className="font-bold bg-[#F7E7D6]">
                            <td className="px-4 py-2 text-right" colSpan={2}>Totales (filtrados)</td>
                            <td className="px-4 py-2">{totals.invited} boletos</td>
                            <td colSpan={4}></td>
                            <td className="px-4 py-2">{totals.confirmed} confirmados</td>
                            <td colSpan={5}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </main>
    )
}