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
    })

    // ---- Filter state ----
    const [q, setQ] = useState('')
    const [confirmFilter, setConfirmFilter] = useState<ConfirmFilter>('all')
    const [tableFilter, setTableFilter] = useState<string>('')
    const [phoneFilter, setPhoneFilter] = useState<PhoneFilter>('all')
    const [whoInvitesFilter, setWhoInvitesFilter] = useState<WhoInvitesFilter>('all')

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
            setManualGuest({ name: '', guest_count: 1, phone_number: '', email: '', whoInvites: 'Susana', dietary_restrictions: '' })
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
        // The problem was that if whoInvites was "Susana" and we're setting it to "Susana",
        // it might not be in editForm properly
        const updateData: any = {
            name: editForm.name,
            guest_count: parseInt(editForm.guest_count) || 0,
            phone_number: editForm.phone_number || '',
            email: editForm.email || '',
            dietary_restrictions: editForm.dietary_restrictions || '',
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

    const getReminderMessage = (guestName: string, token: string) => {
        return `Hola ${guestName},

Solo como recordatorio 😊. ¿Podrías confirmar tu asistencia cuando tengas un momento?

Confirma aquí: https://bodasusanayjavier.com/?token=${token}

¡Gracias! ❤️`
    }

    // ---- Computed filtered list + totals ----
    const filteredGuests = useMemo(() => {
        const ql = q.trim().toLowerCase()
        return guests.filter((g) => {
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

            return textOk && confOk && tableOk && phoneOk && whoInvitesOk
        })
    }, [guests, q, confirmFilter, tableFilter, phoneFilter, whoInvitesFilter])

    const totals = useMemo(() => {
        return {
            invited: filteredGuests.reduce((sum, g) => sum + (parseInt(g.guest_count) || 0), 0),
            confirmed: filteredGuests.reduce((sum, g) => sum + (parseInt(g.number_confirmations) || 0), 0),
        }
    }, [filteredGuests])

    if (!session) return <p className="p-8">Verificando acceso...</p>

    return (
        <main className="min-h-screen bg-paper text-wine p-8">
            <h1 className="text-3xl font-bold mb-6">Gestión de invitados</h1>

            {/* Manual Add Form */}
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

            {/* Filters */}
            <div className="mb-4 bg-white/90 border rounded-md p-4 shadow">
                <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
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

                    <button
                        onClick={() => { setQ(''); setConfirmFilter('all'); setTableFilter(''); setPhoneFilter('all'); setWhoInvitesFilter('all') }}
                        className="mt-2 lg:mt-0 bg-[#C6B89E] hover:bg-[#B9AB93] text-[#173039] font-medium px-4 py-2 rounded"
                    >
                        Limpiar filtros
                    </button>
                </div>

                <div className="mt-3 text-sm text-[#173039]">
                    Mostrando <b>{filteredGuests.length}</b> de <b>{guests.length}</b> invitados
                </div>
            </div>

            {/* Guest Table */}
            <div className="overflow-x-auto border rounded-md bg-white/90 shadow">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-rosewood text-black">
                        <tr>
                            <th className="px-4 py-2">Invitado</th>
                            <th className="px-4 py-2">Invita</th>
                            <th className="px-4 py-2">Invitados</th>
                            <th className="px-4 py-2">Teléfono</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Restricciones Dietéticas</th>
                            <th className="px-4 py-2">Confirmados</th>
                            <th className="px-4 py-2">¿Confirmó?</th>
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

                            return (
                                <tr key={guest.id} className="border-b hover:bg-stone-50">
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
                                            <td className="px-4 py-2">
                                                <div className="max-w-xs">
                                                    {guest.dietary_restrictions ? (
                                                        <span className="text-xs bg-amber-50 border border-amber-200 px-2 py-1 rounded inline-block">
                                                            {guest.dietary_restrictions}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Sin restricciones</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">{guest.number_confirmations}</td>
                                            <td className="px-4 py-2">
                                                {guest.did_confirm === null ? '-' : guest.did_confirm ? 'Sí' : 'No'}
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
                            <td className="px-4 py-2">{totals.invited}</td>
                            <td colSpan={3}></td>
                            <td className="px-4 py-2">{totals.confirmed}</td>
                            <td colSpan={5}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </main>
    )
}