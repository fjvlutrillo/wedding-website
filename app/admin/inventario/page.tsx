'use client'

import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabaseClient'

interface InventoryItem {
    id: string
    type: string
    brand: string
    quantity: number
}

const typeOptions = [
    'Ginebra',
    'Licor',
    'Mezcal',
    'Ron',
    'Tequila',
    'Vino Blanco',
    'Vino Espumoso',
    'Vino Tinto',
    'Vodka',
    'Whisky',
]

// Color pill per type — used in both the breakdown strip and the table
const TYPE_COLORS: Record<string, string> = {
    'Ginebra': 'bg-sky-100 text-sky-800',
    'Licor': 'bg-pink-100 text-pink-800',
    'Mezcal': 'bg-amber-100 text-amber-800',
    'Ron': 'bg-orange-100 text-orange-800',
    'Tequila': 'bg-yellow-100 text-yellow-800',
    'Vino Blanco': 'bg-lime-100 text-lime-800',
    'Vino Espumoso': 'bg-emerald-100 text-emerald-800',
    'Vino Tinto': 'bg-rose-100 text-rose-800',
    'Vodka': 'bg-blue-100 text-blue-800',
    'Whisky': 'bg-stone-100 text-stone-800',
}

type SortField = 'type' | 'brand'
type SortDirection = 'asc' | 'desc'

export default function InventarioPage() {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [type, setType] = useState('')
    const [brand, setBrand] = useState('')
    const [quantity, setQuantity] = useState<number>(1)
    const [search, setSearch] = useState('')
    const [editItem, setEditItem] = useState<InventoryItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [sortField, setSortField] = useState<SortField>('type')
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
    // Tracks which row is mid-save so we can show a disabled state
    const [savingId, setSavingId] = useState<string | null>(null)

    const fetchItems = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) setItems(data)
        setLoading(false)
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError) {
            console.error('Error getting user:', userError.message)
            alert('Hubo un problema al obtener el usuario.')
            return
        }

        if (!user) {
            alert('Usuario no autenticado.')
            return
        }

        if (!type || !brand || quantity < 1) {
            alert('Por favor llena todos los campos correctamente.')
            return
        }

        const { error: insertError } = await supabase.from('inventory').insert([
            {
                type,
                brand,
                quantity,
                created_by: user.id,
            },
        ])

        if (insertError) {
            console.error('Insert error:', insertError.message)
            alert('Error al agregar botella: ' + insertError.message)
            return
        }

        setType('')
        setBrand('')
        setQuantity(1)
        fetchItems()
    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('inventory').delete().eq('id', id)
        if (!error) {
            setItems(items.filter(item => item.id !== id))
        }
    }

    // ── Inline quantity adjustment ──────────────────────────────────────────
    // Optimistic update pattern: local state changes immediately for instant
    // feedback, then we persist to Supabase. On error, we roll back.
    const handleQuantityDelta = async (item: InventoryItem, delta: number) => {
        const newQty = Math.max(0, item.quantity + delta)

        // 1. Update local state right away (optimistic)
        setItems(prev =>
            prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
        )

        // 2. Persist to DB
        setSavingId(item.id)
        const { error } = await supabase
            .from('inventory')
            .update({ quantity: newQty })
            .eq('id', item.id)

        if (error) {
            // 3. Roll back if something went wrong
            setItems(prev =>
                prev.map(i => i.id === item.id ? { ...i, quantity: item.quantity } : i)
            )
            alert('Error al actualizar cantidad.')
        }
        setSavingId(null)
    }

    // ── Sort ────────────────────────────────────────────────────────────────
    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>
        return <span className="text-blue-600 ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
    }

    // ── Derived data ────────────────────────────────────────────────────────
    const totalBottles = items.reduce((sum, item) => sum + item.quantity, 0)

    // Breakdown uses ALL items (ignores search filter) so it always shows the full picture
    const breakdown = typeOptions
        .map(t => ({
            type: t,
            total: items.filter(i => i.type === t).reduce((s, i) => s + i.quantity, 0),
        }))
        .filter(b => b.total > 0)

    const filtered = items
        .filter(b =>
            b.type.toLowerCase().includes(search.toLowerCase()) ||
            b.brand.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const valA = a[sortField].toLowerCase()
            const valB = b[sortField].toLowerCase()
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

    // ── Excel export ────────────────────────────────────────────────────────
    // Two-sheet workbook: full inventory (respects current sort) + type summary.
    // Uses the same `xlsx` library already installed for the guest page —
    // no new dependency needed.
    const handleExport = () => {
        const wb = XLSX.utils.book_new()

        // Sheet 1 – inventory in current sort order
        const inventoryRows = filtered.map(item => ({
            Tipo: item.type,
            Marca: item.brand,
            Cantidad: item.quantity,
        }))
        const ws1 = XLSX.utils.json_to_sheet(inventoryRows)
        ws1['!cols'] = [{ wch: 18 }, { wch: 28 }, { wch: 12 }]
        XLSX.utils.book_append_sheet(wb, ws1, 'Inventario')

        // Sheet 2 – breakdown + grand total row
        const breakdownRows = [
            ...breakdown.map(b => ({ Tipo: b.type, 'Total Botellas': b.total })),
            { Tipo: 'TOTAL', 'Total Botellas': totalBottles },
        ]
        const ws2 = XLSX.utils.json_to_sheet(breakdownRows)
        ws2['!cols'] = [{ wch: 18 }, { wch: 16 }]
        XLSX.utils.book_append_sheet(wb, ws2, 'Resumen por Tipo')

        XLSX.writeFile(wb, `inventario_alcohol_${new Date().toISOString().slice(0, 10)}.xlsx`)
    }

    useEffect(() => {
        fetchItems()
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">🍷 Inventario de Alcohol</h1>

            {/* ── Breakdown by type ─────────────────────────────────────────── */}
            {breakdown.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Resumen por tipo
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {breakdown.map(b => (
                            <span
                                key={b.type}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${TYPE_COLORS[b.type] ?? 'bg-gray-100 text-gray-700'}`}
                            >
                                {b.type}
                                <span className="font-bold">{b.total}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Add New Bottle Form ───────────────────────────────────────── */}
            <form onSubmit={handleAddItem} className="mb-6 bg-white p-4 rounded shadow space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Selecciona tipo</option>
                        {typeOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Marca"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border p-2 rounded"
                        min={1}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Agregar botella
                </button>
            </form>

            {/* ── Search + Export ───────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por tipo o marca..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full sm:w-1/2"
                />
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
                >
                    📥 Exportar Excel
                </button>
            </div>

            {/* ── Inventory Table ───────────────────────────────────────────── */}
            {loading ? (
                <p>Cargando inventario...</p>
            ) : (
                <table className="w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="p-2 text-left cursor-pointer select-none hover:bg-gray-200 transition-colors"
                                onClick={() => handleSort('type')}
                            >
                                Tipo <SortIcon field="type" />
                            </th>
                            <th
                                className="p-2 text-left cursor-pointer select-none hover:bg-gray-200 transition-colors"
                                onClick={() => handleSort('brand')}
                            >
                                Marca <SortIcon field="brand" />
                            </th>
                            <th className="p-2 text-left">Cantidad</th>
                            <th className="p-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-2">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[item.type] ?? 'bg-gray-100 text-gray-700'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="p-2">{item.brand}</td>

                                {/* Inline ± quantity controls */}
                                <td className="p-2">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleQuantityDelta(item, -1)}
                                            disabled={item.quantity === 0 || savingId === item.id}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm font-bold transition-colors"
                                            aria-label="Reducir cantidad"
                                        >
                                            −
                                        </button>
                                        <span className={`w-8 text-center tabular-nums text-sm font-medium ${savingId === item.id ? 'opacity-40' : ''}`}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityDelta(item, +1)}
                                            disabled={savingId === item.id}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm font-bold transition-colors"
                                            aria-label="Aumentar cantidad"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>

                                <td className="p-2">
                                    <button
                                        onClick={() => setEditItem(item)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr className="border-t font-bold bg-gray-100">
                            <td colSpan={2} className="p-2">Total de botellas</td>
                            <td className="p-2">{totalBottles}</td>
                            <td />
                        </tr>
                    </tbody>
                </table>
            )}

            {/* ── Edit Modal ────────────────────────────────────────────────── */}
            {editItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg space-y-4 w-full max-w-md">
                        <h2 className="text-lg font-bold">Editar botella</h2>

                        <select
                            value={editItem.type}
                            onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Selecciona tipo</option>
                            {typeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <input
                            className="w-full border p-2 rounded"
                            value={editItem.brand}
                            onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
                        />
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={editItem.quantity}
                            onChange={(e) => setEditItem({ ...editItem, quantity: Number(e.target.value) })}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditItem(null)}
                                className="bg-gray-200 px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    const { error } = await supabase
                                        .from('inventory')
                                        .update({
                                            type: editItem.type,
                                            brand: editItem.brand,
                                            quantity: editItem.quantity,
                                        })
                                        .eq('id', editItem.id)

                                    if (!error) {
                                        fetchItems()
                                        setEditItem(null)
                                    }
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}