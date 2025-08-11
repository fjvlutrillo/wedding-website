'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import * as XLSX from 'xlsx'
import { Session } from '@supabase/auth-helpers-nextjs'
import { v4 as uuidv4 } from 'uuid'

type ConfirmFilter = 'all' | 'yes' | 'no' | 'pending'
type PhoneFilter = 'all' | 'with' | 'without'

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
    })

    // ---- NEW: filter state ----
    const [q, setQ] = useState('')
    const [confirmFilter, setConfirmFilter] = useState<ConfirmFilter>('all')
    const [tableFilter, setTableFilter] = useState<string>('') // '' = all
    const [phoneFilter, setPhoneFilter] = useState<PhoneFilter>('all')

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
    }, [router])

    const fetchGuests = async () => {
        const { data } = await supabase.from('guests').select('*')
        if (data) setGuests(data)
    }

    const handleManualAdd = async () => {
        if (!session) return

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
            fetchGuests()
            setManualGuest({ name: '', guest_count: 1, phone_number: '', email: '' })
        } else {
            alert('Error al agregar: ' + error.message)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !session) return

        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet)

        const mapped = jsonData.map((g: any) => ({
            name: g.Invitado || '',
            guest_count: parseInt(g.Invitados) || 0,
            phone_number: g.Teléfono || '',
            invite_token: uuidv4(),
            number_confirmations: 0,
            table_number: null,
            created_by: session.user.id,
            did_confirm: null,
            email: '',
        }))

        const { error } = await supabase.from('guests').insert(mapped)
        if (!error) fetchGuests()
        else alert('Error al importar: ' + error.message)
    }

    const startEdit = (index: number, guest: any) => {
        setEditingIndex(index)
        setEditForm({ ...guest })
    }

    const cancelEdit = () => {
        setEditingIndex(null)
        setEditForm({})
    }

    const updateEditField = (field: string, value: any) => {
        setEditForm((prev: any) => ({ ...prev, [field]: value }))
    }

    const saveEdit = async (id: string) => {
        const updatableFields = [
            'name',
            'guest_count',
            'phone_number',
            'email',
            'table_number',
            'number_confirmations',
            'did_confirm'
        ]
        const updateData: any = {}
        updatableFields.forEach((key) => {
            if (editForm[key] !== undefined) updateData[key] = editForm[key]
        })
        const { error } = await supabase.from('guests').update(updateData).eq('id', id)
        if (!error) {
            const updated = [...guests]
            updated[editingIndex!] = { ...editForm }
            setGuests(updated)
            cancelEdit()
        } else {
            alert('Error al guardar: ' + error.message)
        }
    }

    const deleteGuest = async (id: string) => {
        const confirm = window.confirm('¿Eliminar este invitado?')
        if (!confirm) return
        const { error } = await supabase.from('guests').delete().eq('id', id)
        if (!error) {
            setGuests(guests.filter((g) => g.id !== id))
        } else {
            alert('Error al eliminar: ' + error.message)
        }
    }

    // RSVP base url (use this consistently)
    const rsvpBaseUrl = "https://bodasusanayjavier.com/?token="

    // ---- NEW: computed filtered list + totals ----
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
                            : g.did_confirm === false // 'no'

            const tableOk =
                tableFilter === '' ? true
                    : String(g.table_number ?? '') === tableFilter

            const phoneOk =
                phoneFilter === 'all' ? true
                    : phoneFilter === 'with' ? !!(g.phone_number && g.phone_number.trim() !== '')
                        : !(g.phone_number && g.phone_number.trim() !== '') // 'without'

            return textOk && confOk && tableOk && phoneOk
        })
    }, [guests, q, confirmFilter, tableFilter, phoneFilter])

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
            </div>

            {/* ---- NEW: Filters ---- */}
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

                    <button
                        onClick={() => { setQ(''); setConfirmFilter('all'); setTableFilter(''); setPhoneFilter('all') }}
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
                            <th className="px-4 py-2">Invitados</th>
                            <th className="px-4 py-2">Teléfono</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Confirmados</th>
                            <th className="px-4 py-2">¿Confirmó?</th>
                            <th className="px-4 py-2">Mesa</th>
                            <th className="px-4 py-2">Token</th>
                            <th className="px-4 py-2">WhatsApp</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {guests.map((guest, idx) => (
                            <tr key={guest.id} className="border-b">
                                {editingIndex === idx ? (
                                    <>
                                        <td className="px-4 py-2">
                                            <input
                                                value={editForm.name ?? ''}
                                                onChange={(e) => updateEditField('name', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={editForm.guest_count ?? 0}
                                                onChange={(e) => updateEditField('guest_count', parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                value={editForm.phone_number ?? ''}
                                                onChange={(e) => updateEditField('phone_number', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                value={editForm.email ?? ''}
                                                onChange={(e) => updateEditField('email', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={editForm.number_confirmations ?? 0}
                                                onChange={(e) =>
                                                    updateEditField('number_confirmations', parseInt(e.target.value))
                                                }
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
                                            />
                                        </td>
                                        <td className="px-4 py-2 font-mono text-xs break-all">
                                            {editForm.invite_token}
                                        </td>

                                        {/* WhatsApp cell not needed in edit mode */}
                                        <td className="px-4 py-2" />

                                        {/* ACTIONS (edit mode) */}
                                        <td className="px-4 py-2">
                                            <button onClick={() => saveEdit(guest.id)} className="text-green-600 mr-2">
                                                Guardar
                                            </button>
                                            <button onClick={cancelEdit} className="text-gray-500">
                                                Cancelar
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-2">{guest.name}</td>
                                        <td className="px-4 py-2">{guest.guest_count}</td>
                                        <td className="px-4 py-2">{guest.phone_number}</td>
                                        <td className="px-4 py-2">{guest.email}</td>
                                        <td className="px-4 py-2">{guest.number_confirmations}</td>
                                        <td className="px-4 py-2">
                                            {guest.did_confirm === null ? '-' : guest.did_confirm ? 'Sí' : 'No'}
                                        </td>
                                        <td className="px-4 py-2">{guest.table_number}</td>
                                        <td className="px-4 py-2 font-mono text-xs break-all">{guest.invite_token}</td>

                                        {/* ✅ WhatsApp cell with Enviar + Recordatorio */}
                                        <td className="px-4 py-2">
                                            {guest.phone_number && guest.invite_token ? (
                                                <div className="flex gap-3">
                                                    {/* Enviar (original) */}
                                                    <a
                                                        href={`https://wa.me/${guest.phone_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                                                            `Hola ${guest.name}, \n\nTe compartimos los detalles de nuestra boda civil. Por favor confirma tu asistencia aquí: ${rsvpBaseUrl}${guest.invite_token}\n\nCon cariño,\nSusana & Javier 💍🥳🍾`
                                                        )}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline text-[#173039] hover:text-[#7B4B38] transition"
                                                        title={`Enviar WhatsApp a ${guest.name}`}
                                                    >
                                                        WhatsApp
                                                    </a>

                                                    {/* Recordatorio (solo si no ha confirmado) */}
                                                    {guest.did_confirm !== true && (
                                                        <a
                                                            href={`https://wa.me/${guest.phone_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                                                                `Hola ${guest.name},\n\nSolo como recordatorio 😊. ¿Podrías confirmar tu asistencia cuando tengas un momento?\n\nConfirma aquí: ${rsvpBaseUrl}${guest.invite_token}\n\n¡Gracias! ❤️`
                                                            )}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="underline text-[#173039] hover:text-[#7B4B38] transition"
                                                            title={`Enviar recordatorio a ${guest.name}`}
                                                        >
                                                            Recordatorio
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No phone</span>
                                            )}
                                        </td>

                                        {/* ✅ ACTIONS (view mode) — this is the one that disappeared */}
                                        <td className="px-4 py-2">
                                            <button onClick={() => startEdit(idx, guest)} className="text-blue-600 mr-2">
                                                Editar
                                            </button>
                                            <button onClick={() => deleteGuest(guest.id)} className="text-red-600">
                                                Eliminar
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr className="font-bold bg-[#F7E7D6]">
                            <td className="px-4 py-2 text-right">Totales (filtrados)</td>
                            <td className="px-4 py-2">{totals.invited}</td>
                            <td></td>
                            <td></td>
                            <td className="px-4 py-2">{totals.confirmed}</td>
                            <td colSpan={5}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </main>
    )
}