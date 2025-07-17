'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface InventoryItem {
    id: string
    type: string
    brand: string
    quantity: number
}

const typeOptions = [
    'Tequila',
    'Mezcal',
    'Vino Tinto',
    'Vino Blanco',
    'Vino Espumoso',
    'Whisky',
    'Ron',
    'Ginebra',
    'Vodka',
]

export default function InventarioPage() {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [type, setType] = useState('')
    const [brand, setBrand] = useState('')
    const [quantity, setQuantity] = useState<number>(1)
    const [search, setSearch] = useState('')
    const [editItem, setEditItem] = useState<InventoryItem | null>(null)
    const [loading, setLoading] = useState(false)

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

        // Get the current authenticated user
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

        // Insert the item into Supabase
        const { error: insertError } = await supabase.from('inventory').insert([
            {
                type,
                brand,
                quantity,
                created_by: user.id, // matches your schema
            },
        ])

        if (insertError) {
            console.error('Insert error:', insertError.message)
            alert('Error al agregar botella: ' + insertError.message)
            return
        }

        // Reset form fields
        setType('')
        setBrand('')
        setQuantity(1)

        // Reload data
        fetchItems()
      }

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('inventory').delete().eq('id', id)
        if (!error) {
            setItems(items.filter(item => item.id !== id))
        }
    }

    const totalBottles = items.reduce((sum, item) => sum + item.quantity, 0)

    const filtered = items.filter(b =>
        b.type.toLowerCase().includes(search.toLowerCase()) ||
        b.brand.toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
        fetchItems()
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">🍷 Inventario de Alcohol</h1>

            {/* Add New Bottle Form */}
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

            {/* Search */}
            <input
                type="text"
                placeholder="Buscar por tipo o marca..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded mb-4 w-full sm:w-1/2"
            />

            {/* Inventory Table */}
            {loading ? (
                <p>Cargando inventario...</p>
            ) : (
                <table className="w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Tipo</th>
                            <th className="p-2 text-left">Marca</th>
                            <th className="p-2 text-left">Cantidad</th>
                            <th className="p-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-2">{item.type}</td>
                                <td className="p-2">{item.brand}</td>
                                <td className="p-2">{item.quantity}</td>
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

            {/* Edit Modal */}
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