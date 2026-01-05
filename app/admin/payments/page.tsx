'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Session } from '@supabase/auth-helpers-nextjs'

type Payment = {
    id: string
    vendor_name: string
    category: string
    amount: number
    paid_amount: number
    status: 'pending' | 'partial' | 'paid' | 'overdue'
    due_date: string | null
    payment_date: string | null
    notes: string
    created_at: string
}

type CategoryFilter = 'all' | 'venue' | 'catering' | 'bar' | 'music' | 'photography' | 'decoration' | 'attire' | 'other'
type StatusFilter = 'all' | 'pending' | 'partial' | 'paid' | 'overdue'

const CATEGORIES = [
    { value: 'venue', label: '🏛️ Venue', color: 'bg-purple-100 text-purple-800' },
    { value: 'catering', label: '🍽️ Catering', color: 'bg-orange-100 text-orange-800' },
    { value: 'bar', label: '🍷 Bar/Bebidas', color: 'bg-red-100 text-red-800' },
    { value: 'music', label: '🎵 Música/DJ', color: 'bg-blue-100 text-blue-800' },
    { value: 'photography', label: '📸 Fotografía', color: 'bg-green-100 text-green-800' },
    { value: 'decoration', label: '🎨 Decoración', color: 'bg-pink-100 text-pink-800' },
    { value: 'attire', label: '👗 Vestimenta', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'other', label: '📦 Otros', color: 'bg-gray-100 text-gray-800' },
]

const STATUS_CONFIG = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    partial: { label: 'Parcial', color: 'bg-blue-100 text-blue-800', icon: '⏸️' },
    paid: { label: 'Pagado', color: 'bg-green-100 text-green-800', icon: '✅' },
    overdue: { label: 'Vencido', color: 'bg-red-100 text-red-800', icon: '⚠️' },
}

export default function PaymentsPage() {
    const router = useRouter()
    const [session, setSession] = useState<Session | null>(null)
    const [payments, setPayments] = useState<Payment[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Partial<Payment>>({})
    const [showAddForm, setShowAddForm] = useState(false)
    const [newPayment, setNewPayment] = useState<Partial<Payment>>({
        vendor_name: '',
        category: 'venue',
        amount: 0,
        paid_amount: 0,
        status: 'pending',
        due_date: '',
        payment_date: '',
        notes: '',
    })

    // Filters
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                router.push('/login')
            } else {
                setSession(data.session)
                fetchPayments()
            }
        }
        getSession()
    }, [router])

    const fetchPayments = async () => {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('due_date', { ascending: true, nullsFirst: false })

        if (data) {
            // Update status based on due date
            const updatedPayments = data.map(payment => {
                if (payment.status === 'paid') return payment

                const today = new Date()
                const dueDate = payment.due_date ? new Date(payment.due_date) : null

                if (dueDate && dueDate < today && payment.paid_amount < payment.amount) {
                    return { ...payment, status: 'overdue' }
                }

                return payment
            })
            setPayments(updatedPayments)
        }

        if (error) {
            console.error('Error fetching payments:', error)
        }
    }

    const handleAddPayment = async () => {
        if (!newPayment.vendor_name || !newPayment.amount) {
            alert('❌ Por favor completa los campos obligatorios (Proveedor y Monto)')
            return
        }

        const paymentData = {
            ...newPayment,
            amount: parseFloat(String(newPayment.amount)),
            paid_amount: parseFloat(String(newPayment.paid_amount)) || 0,
            due_date: newPayment.due_date || null,
            payment_date: newPayment.payment_date || null,
        }

        const { error } = await supabase.from('payments').insert([paymentData])

        if (!error) {
            await fetchPayments()
            setShowAddForm(false)
            setNewPayment({
                vendor_name: '',
                category: 'venue',
                amount: 0,
                paid_amount: 0,
                status: 'pending',
                due_date: '',
                payment_date: '',
                notes: '',
            })
            alert('✅ Pago agregado correctamente')
        } else {
            alert('❌ Error al agregar pago: ' + error.message)
        }
    }

    const startEdit = (payment: Payment) => {
        setEditingId(payment.id)
        setEditForm({ ...payment })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({})
    }

    const updateEditField = (field: string, value: any) => {
        setEditForm(prev => ({ ...prev, [field]: value }))
    }

    const saveEdit = async (id: string) => {
        const updateData = {
            vendor_name: editForm.vendor_name,
            category: editForm.category,
            amount: parseFloat(String(editForm.amount)),
            paid_amount: parseFloat(String(editForm.paid_amount)),
            status: editForm.status,
            due_date: editForm.due_date || null,
            payment_date: editForm.payment_date || null,
            notes: editForm.notes || '',
        }

        const { error } = await supabase
            .from('payments')
            .update(updateData)
            .eq('id', id)

        if (!error) {
            await fetchPayments()
            cancelEdit()
            alert('✅ Pago actualizado correctamente')
        } else {
            alert('❌ Error al actualizar: ' + error.message)
        }
    }

    const deletePayment = async (id: string) => {
        if (!window.confirm('¿Eliminar este pago?')) return

        const { error } = await supabase.from('payments').delete().eq('id', id)

        if (!error) {
            setPayments(payments.filter(p => p.id !== id))
            alert('✅ Pago eliminado correctamente')
        } else {
            alert('❌ Error al eliminar: ' + error.message)
        }
    }

    // Filtered payments
    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            const matchesCategory = categoryFilter === 'all' || payment.category === categoryFilter
            const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
            const matchesSearch = searchQuery === '' ||
                payment.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.notes?.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesCategory && matchesStatus && matchesSearch
        })
    }, [payments, categoryFilter, statusFilter, searchQuery])

    // Calculate totals
    const totals = useMemo(() => {
        return filteredPayments.reduce((acc, payment) => ({
            total: acc.total + payment.amount,
            paid: acc.paid + payment.paid_amount,
            pending: acc.pending + (payment.amount - payment.paid_amount),
        }), { total: 0, paid: 0, pending: 0 })
    }, [filteredPayments])

    const getCategoryLabel = (category: string) => {
        return CATEGORIES.find(c => c.value === category)?.label || category
    }

    const getCategoryColor = (category: string) => {
        return CATEGORIES.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-800'
    }

    if (!session) return <p className="p-8">Verificando acceso...</p>

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-light text-wedding-burgundy mb-2">
                    Gestión de <span className="font-luxury">Pagos</span>
                </h1>
                <p className="text-stone-600">Control de pagos a proveedores y servicios</p>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-wedding-blush shadow-wedding">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-stone-500 uppercase tracking-wider">Total Presupuestado</span>
                        <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-3xl font-light text-wedding-burgundy">
                        ${totals.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-wedding-blush shadow-wedding">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-stone-500 uppercase tracking-wider">Total Pagado</span>
                        <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-3xl font-light text-green-600">
                        ${totals.paid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-2 text-xs text-stone-500">
                        {totals.total > 0 ? ((totals.paid / totals.total) * 100).toFixed(1) : 0}% del total
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-wedding-blush shadow-wedding">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-stone-500 uppercase tracking-wider">Pendiente de Pago</span>
                        <span className="text-2xl">⏳</span>
                    </div>
                    <p className="text-3xl font-light text-orange-600">
                        ${totals.pending.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-2 text-xs text-stone-500">
                        {totals.total > 0 ? ((totals.pending / totals.total) * 100).toFixed(1) : 0}% restante
                    </div>
                </div>
            </div>

            {/* Add Payment Button */}
            <div className="mb-6">
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-wedding"
                >
                    {showAddForm ? '❌ Cancelar' : '➕ Agregar Pago'}
                </button>
            </div>

            {/* Add Payment Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl p-6 mb-6 border border-wedding-blush shadow-wedding">
                    <h2 className="text-xl font-light text-wedding-burgundy mb-4">Nuevo Pago</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Proveedor/Servicio *
                            </label>
                            <input
                                type="text"
                                value={newPayment.vendor_name}
                                onChange={(e) => setNewPayment({ ...newPayment, vendor_name: e.target.value })}
                                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                                placeholder="Ej: Hacienda San Juan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Categoría *
                            </label>
                            <select
                                value={newPayment.category}
                                onChange={(e) => setNewPayment({ ...newPayment, category: e.target.value })}
                                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Monto Total *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={newPayment.amount}
                                onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
                                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Monto Pagado
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={newPayment.paid_amount}
                                onChange={(e) => setNewPayment({ ...newPayment, paid_amount: parseFloat(e.target.value) })}
                                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Fecha de Vencimiento
                            </label>
                            <input
                                type="date"
                                value={newPayment.due_date}
                                onChange={(e) => setNewPayment({ ...newPayment, due_date: e.target.value })}
                                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Estado
                            </label>
                            <select
                                value={newPayment.status}
                                onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value as any })}
                                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                            >
                                <option value="pending">⏳ Pendiente</option>
                                <option value="partial">⏸️ Parcial</option>
                                <option value="paid">✅ Pagado</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Notas
                            </label>
                            <textarea
                                value={newPayment.notes}
                                onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                                className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                                rows={3}
                                placeholder="Notas adicionales..."
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={handleAddPayment}
                            className="bg-wedding-burgundy hover:bg-wedding-burgundy-light text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            ✅ Guardar Pago
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="bg-stone-300 hover:bg-stone-400 text-stone-700 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-wedding-blush shadow-wedding">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por proveedor o notas..."
                            className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                        />
                    </div>

                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                            className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                        >
                            <option value="all">📂 Todas las categorías</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                            className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-wedding-burgundy focus:border-transparent"
                        >
                            <option value="all">📊 Todos los estados</option>
                            <option value="pending">⏳ Pendiente</option>
                            <option value="partial">⏸️ Parcial</option>
                            <option value="paid">✅ Pagado</option>
                            <option value="overdue">⚠️ Vencido</option>
                        </select>
                    </div>

                    <button
                        onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all') }}
                        className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Limpiar
                    </button>
                </div>

                <div className="mt-3 text-sm text-stone-600">
                    Mostrando <b>{filteredPayments.length}</b> de <b>{payments.length}</b> pagos
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl overflow-hidden border border-wedding-blush shadow-wedding">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-200">
                        <thead className="bg-wedding-burgundy-light">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Proveedor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Monto Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Pagado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Pendiente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Vencimiento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-stone-200">
                            {filteredPayments.map((payment) => {
                                const isEditing = editingId === payment.id
                                const pending = payment.amount - payment.paid_amount

                                return (
                                    <tr key={payment.id} className="hover:bg-stone-50">
                                        {isEditing ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <input
                                                        value={editForm.vendor_name}
                                                        onChange={(e) => updateEditField('vendor_name', e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={editForm.category}
                                                        onChange={(e) => updateEditField('category', e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        {CATEGORIES.map(cat => (
                                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={editForm.amount}
                                                        onChange={(e) => updateEditField('amount', parseFloat(e.target.value))}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={editForm.paid_amount}
                                                        onChange={(e) => updateEditField('paid_amount', parseFloat(e.target.value))}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    ${(editForm.amount! - editForm.paid_amount!).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={editForm.status}
                                                        onChange={(e) => updateEditField('status', e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        <option value="pending">⏳ Pendiente</option>
                                                        <option value="partial">⏸️ Parcial</option>
                                                        <option value="paid">✅ Pagado</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="date"
                                                        value={editForm.due_date || ''}
                                                        onChange={(e) => updateEditField('due_date', e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => saveEdit(payment.id)}
                                                        className="text-green-600 hover:text-green-800 mr-3 font-medium"
                                                    >
                                                        ✓ Guardar
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        ✕ Cancelar
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-stone-900">
                                                        {payment.vendor_name}
                                                    </div>
                                                    {payment.notes && (
                                                        <div className="text-xs text-stone-500 mt-1">
                                                            {payment.notes}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(payment.category)}`}>
                                                        {getCategoryLabel(payment.category)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-stone-900">
                                                    ${payment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-green-600 font-medium">
                                                    ${payment.paid_amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-orange-600 font-medium">
                                                    ${pending.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_CONFIG[payment.status].color}`}>
                                                        {STATUS_CONFIG[payment.status].icon} {STATUS_CONFIG[payment.status].label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-stone-500">
                                                    {payment.due_date ? new Date(payment.due_date).toLocaleDateString('es-MX') : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => startEdit(payment)}
                                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button
                                                        onClick={() => deletePayment(payment.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>

                        <tfoot className="bg-stone-50">
                            <tr>
                                <td colSpan={2} className="px-6 py-4 text-sm font-medium text-stone-900">
                                    Totales (filtrados)
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-stone-900">
                                    ${totals.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-green-600">
                                    ${totals.paid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-orange-600">
                                    ${totals.pending.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </td>
                                <td colSpan={3}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}