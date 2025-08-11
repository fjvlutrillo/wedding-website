'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva'
import { supabase } from '@/lib/supabaseClient'

export default function SeatingCanvas() {
    // ========== Types ==========
    type Guest = {
        id: string
        name: string | null
        guest_count: number | null
        number_confirmations: number | null
        table_number: number | null
        email?: string | null
        phone_number?: string | null
        did_confirm?: boolean | null
    }

    type TableShape = 'round' | 'rect'
    type TableModel = {
        id: string
        number: number
        name: string
        type: TableShape
        seats: number
        x: number
        y: number
        rotation: number
    }
    type Occupant =
        | { kind: 'guest'; guestId: string; name: string }
        | { kind: 'companion'; guestId: string; name: string; idx: number }
    type Seat = { seatNo: number; occupant?: Occupant }
    type SeatingState = { [tableNumber: number]: Seat[] }

    // ========== Constants / helpers ==========
    const LS_TABLES = 'sj_seating_tables_v1'
    const LS_STATE = 'sj_seating_state_v1'
    const genId = () => crypto.randomUUID()
    const seatsFrom = (g: Guest) =>
        (g.number_confirmations ?? 0) > 0 ? g.number_confirmations! : (g.guest_count ?? 1)

    const palette = {
        burgundyDark: '#4D1C20',
        burgundy: '#651D28',
        rose: '#E5AAAE',
        roseMid: '#CC7379',
        sage: '#BDC2AC',
        ivory: '#FCFCFC',
        gray: '#9D9D9D',
        pageBg: '#FBF3F9',
    }

    const toInt = (v: any, fallback: number) => {
        const n = Number(v)
        return Number.isFinite(n) ? Math.floor(n) : fallback
    }

    function circleSeats(cx: number, cy: number, radius: number, seats: number, rotationDeg: number) {
        const count = Math.max(1, seats || 1)
        const rad = (deg: number) => (deg * Math.PI) / 180
        const out: { x: number; y: number }[] = []
        const step = 360 / count
        for (let i = 0; i < count; i++) {
            const a = rad(rotationDeg + i * step - 90)
            out.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) })
        }
        return out
    }

    function renameCompanion(tableNo: number, seatIndex: number) {
        const current = seating[tableNo] ?? []
        const occ = current[seatIndex]?.occupant
        if (!occ || occ.kind !== 'companion') return
        const newName = prompt('Nombre del acompañante:', occ.name)
        if (newName == null) return
        const copy = current.slice()
        copy[seatIndex] = { seatNo: seatIndex + 1, occupant: { ...occ, name: newName || occ.name } }
        setSeating({ ...seating, [tableNo]: copy })
    }

    const loadTables = (): TableModel[] => {
        try { return JSON.parse(localStorage.getItem(LS_TABLES) || '[]') } catch { return [] }
    }
    const saveTables = (t: TableModel[]) => localStorage.setItem(LS_TABLES, JSON.stringify(t))
    const loadSeating = (): SeatingState => {
        try { return JSON.parse(localStorage.getItem(LS_STATE) || '{}') } catch { return {} }
    }
    const saveSeating = (s: SeatingState, set: (s: SeatingState) => void) => {
        localStorage.setItem(LS_STATE, JSON.stringify(s)); set(s)
    }

    // ========== Component state ==========
    const stageRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [stageSize, setStageSize] = useState<{ w: number; h: number }>({ w: 1000, h: 700 })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [guests, setGuests] = useState<Guest[]>([])
    const [tables, setTables] = useState<TableModel[]>([])
    const [seating, _setSeating] = useState<SeatingState>({})
    const setSeating = (s: SeatingState) => saveSeating(s, _setSeating)

    const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
    const [showNewTable, setShowNewTable] = useState(false)
    const [search, setSearch] = useState('')

    // ========== Effects ==========
    useEffect(() => {
        const resize = () => {
            const el = containerRef.current; if (!el) return
            const rect = el.getBoundingClientRect()
            setStageSize({ w: rect.width, h: rect.height })
        }
        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    useEffect(() => {
        (async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('guests')
                .select('id, name, guest_count, number_confirmations, table_number, email, phone_number, did_confirm')
                .order('name', { ascending: true })
            if (error) { console.error(error); setGuests([]) } else { setGuests((data ?? []) as Guest[]) }
            setLoading(false)
        })()
    }, [])

    // initial restore
    useEffect(() => {
        setTables(loadTables())
        setSeating(loadSeating())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 🔁 auto‑save whenever tables or seating change
    useEffect(() => { saveTables(tables) }, [tables])
    useEffect(() => { localStorage.setItem(LS_STATE, JSON.stringify(seating)) }, [seating])

    // ========== Derived ==========
    const unassigned = useMemo(
        () => guests
            .filter(g => (!g.table_number || g.table_number === 0))
            .filter(g => (search ? (g.name || '').toLowerCase().includes(search.toLowerCase()) : true)),
        [guests, search]
    )

    // ========== Drag from sidebar ==========
    const handleDragStartGuest = (e: React.DragEvent, guestId: string) => {
        e.dataTransfer.setData('text/plain', guestId)
        e.dataTransfer.effectAllowed = 'move'
    }
    const clientPointToStage = (clientX: number, clientY: number) => {
        const stage = stageRef.current as any
        if (!stage) return { x: 0, y: 0 }
        const rect = stage.container().getBoundingClientRect()
        return { x: clientX - rect.left, y: clientY - rect.top }
    }
    const findTableAtPoint = (x: number, y: number): TableModel | null => {
        for (const t of tables) {
            if (t.type === 'rect') {
                const w = 160, h = 100
                const within = x >= t.x - w / 2 && x <= t.x + w / 2 && y >= t.y - h / 2 && y <= t.y + h / 2
                if (within) return t
            } else {
                const r = 70, dx = x - t.x, dy = y - t.y
                if (dx * dx + dy * dy <= r * r) return t
            }
        }
        return null
    }
    const onCanvasDragOver = (e: React.DragEvent) => e.preventDefault()

    function firstFreeSeats(tableNo: number, needed: number, tableCapacity: number): number[] | null {
        const seats = seating[tableNo] ?? Array.from({ length: tableCapacity }, (_, i) => ({ seatNo: i + 1 }))
        const free = seats.filter(s => !s.occupant).map(s => s.seatNo)
        if (free.length < needed) return null
        return free.slice(0, needed)
    }

    async function placeGuestBundleOnTable(guest: Guest, table: TableModel) {
        const needed = Math.max(1, seatsFrom(guest))
        const tableSeats = seating[table.number] ?? Array.from({ length: table.seats }, (_, i) => ({ seatNo: i + 1 }))
        const free = firstFreeSeats(table.number, needed, table.seats)
        if (!free) { alert(`No hay asientos suficientes en ${table.name}.`); return }

        try {
            setSaving(true)
            const { error } = await supabase.from('guests').update({ table_number: table.number }).eq('id', guest.id)
            if (error) throw error
            setGuests(prev => prev.map(g => (g.id === guest.id ? { ...g, table_number: table.number } : g)))
        } catch (e) {
            console.error(e); alert('No se pudo asignar en la base de datos.'); setSaving(false); return
        }

        const newSeats = [...tableSeats]
        newSeats[free[0] - 1] = { seatNo: free[0], occupant: { kind: 'guest', guestId: guest.id, name: guest.name || 'Invitado' } }
        for (let i = 1; i < needed; i++) {
            const seatNo = free[i]
            newSeats[seatNo - 1] = { seatNo, occupant: { kind: 'companion', guestId: guest.id, name: `+${i}`, idx: i } }
        }
        setSeating({ ...seating, [table.number]: newSeats })
        setSaving(false)
    }

    const onCanvasDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        const guestId = e.dataTransfer.getData('text/plain')
        if (!guestId) return
        const { x, y } = clientPointToStage(e.clientX, e.clientY)
        const table = findTableAtPoint(x, y); if (!table) return
        const g = guests.find(gg => gg.id === guestId); if (!g) return
        await placeGuestBundleOnTable(g, table)
    }

    // ========== Tables CRUD (with seating sync) ==========
    const addTable = (t: Omit<TableModel, 'id'>) => {
        setTables(prev => [...prev, { ...t, id: genId() }])
        setShowNewTable(false)
    }

    const updateTable = (id: string, patch: Partial<TableModel>) => {
        setTables(prev => {
            const before = prev.find(t => t.id === id)!
            const norm: Partial<TableModel> = { ...patch }
            if (patch.seats !== undefined) norm.seats = Math.max(1, toInt(patch.seats, before.seats))
            if (patch.number !== undefined) norm.number = Math.max(1, toInt(patch.number, before.number))
            if (patch.rotation !== undefined) norm.rotation = toInt(patch.rotation, before.rotation)

            const nextTables = prev.map(t => (t.id === id ? { ...t, ...norm } : t))

            // sync seating
            setSeating(prevS => {
                let s = { ...prevS }
                const after = nextTables.find(t => t.id === id)!
                const fromNo = before.number
                const toNo = after.number

                if (toNo !== fromNo) {
                    s[toNo] = (s[fromNo] ?? []).map((seat, i) => ({ ...seat, seatNo: i + 1 }))
                    delete s[fromNo]
                }

                const cap = Math.max(1, after.seats)
                const bucketNo = toNo
                const existing = s[bucketNo] ?? []
                const resized = existing.slice(0, cap)
                while (resized.length < cap) resized.push({ seatNo: resized.length + 1 })
                s[bucketNo] = resized

                return s
            })

            return nextTables
        })
    }

    const deleteTable = (id: string) => {
        setTables(prev => {
            const tbl = prev.find(t => t.id === id)
            const next = prev.filter(t => t.id !== id)
            if (tbl) {
                const s = { ...seating }
                delete s[tbl.number]
                setSeating(s)
            }
            return next
        })
        if (selectedTableId === id) setSelectedTableId(null)
    }

    // ========== Exporters / Cloud save / Local JSON backup ==========
    const exportPNG = () => {
        const stage = stageRef.current; if (!stage) return
        const dataURL = stage.toDataURL({ pixelRatio: 2 })
        const a = document.createElement('a'); a.href = dataURL; a.download = 'plano-mesas.png'; a.click()
    }

    const exportCSV = () => {
        const headers = ['mesa', 'asiento', 'tipo', 'nombre', 'alergias', 'invitado_id']
        const lines: string[] = [headers.join(',')]
        tables.forEach(t => {
            const seats = seating[t.number] ?? []
            seats.forEach(s => {
                if (!s?.occupant) return
                const o = s.occupant
                const row = [t.number, s.seatNo, o.kind, (o.name || '').replace(/"/g, '""'), '', o.guestId]
                lines.push(row.map(v => `"${String(v)}"`).join(','))
            })
        })
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'asignacion_mesas_detalle.csv'; a.click()
        URL.revokeObjectURL(url)
    }

    async function saveLayoutToStorage() {
        const layout = { version: 1, saved_at: new Date().toISOString(), tables, seating }
        const jsonBlob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' })
        const jsonPath = `layouts/${Date.now()}_layout.json`
        const { error: e1 } = await supabase.storage.from('seating').upload(jsonPath, jsonBlob, {
            upsert: true, contentType: 'application/json'
        })
        if (e1) { alert('No se pudo guardar el JSON: ' + e1.message); return }

        const stage = stageRef.current
        const dataUrl = stage.toDataURL({ pixelRatio: 2 })
        const res = await fetch(dataUrl)
        const pngBlob = await res.blob()
        const pngPath = `layouts/${Date.now()}_layout.png`
        const { error: e2 } = await supabase.storage.from('seating').upload(pngPath, pngBlob, {
            upsert: true, contentType: 'image/png'
        })
        if (e2) { alert('JSON guardado, pero falló el PNG: ' + e2.message); return }
        localStorage.setItem('sj_seating_last_cloud_json', jsonPath)
        alert('Layout guardado en Storage ✅')
    }

    // Local JSON backup (manual)
    const downloadJSON = () => {
        const layout = { version: 1, saved_at: new Date().toISOString(), tables, seating }
        const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'seating_layout.json'; a.click()
        URL.revokeObjectURL(url)
    }
    const uploadJSON = async (file: File) => {
        try {
            const text = await file.text()
            const layout = JSON.parse(text)
            setTables(Array.isArray(layout.tables) ? layout.tables : [])
            setSeating(typeof layout.seating === 'object' && layout.seating ? layout.seating : {})
        } catch {
            alert('Archivo inválido')
        }
    }

    const countAssigned = (tableNo: number) => (seating[tableNo] ?? []).filter(s => s.occupant).length

    // ========== New table modal ==========
    const NewTableModal = () => {
        const nextNum = tables.length ? Math.max(...tables.map(t => t.number)) + 1 : 1
        const [number, setNumber] = useState<number>(nextNum)
        const [name, setName] = useState(`Mesa ${number}`)
        const [type, setType] = useState<TableShape>('round')
        const [seats, setSeats] = useState<number>(8)
        useEffect(() => { setName(`Mesa ${number}`) }, [number])

        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white text-black w-[420px] rounded-xl p-5 space-y-4">
                    <h3 className="text-xl font-semibold">Nueva mesa</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="text-sm">Número
                            <input type="number" value={number}
                                onChange={e => setNumber(toInt(e.target.value, number))}
                                className="mt-1 w-full border rounded px-2 py-1" />
                        </label>
                        <label className="text-sm">Capacidad
                            <input type="number" value={seats}
                                onChange={e => setSeats(Math.max(1, toInt(e.target.value, seats)))}
                                className="mt-1 w-full border rounded px-2 py-1" />
                        </label>
                        <label className="text-sm col-span-2">Nombre
                            <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />
                        </label>
                        <div className="col-span-2 flex gap-3 items-center">
                            <span className="text-sm">Tipo:</span>
                            <button onClick={() => setType('round')} className={`px-3 py-1 rounded border ${type === 'round' ? 'bg-gray-200' : ''}`}>Redonda</button>
                            <button onClick={() => setType('rect')} className={`px-3 py-1 rounded border ${type === 'rect' ? 'bg-gray-200' : ''}`}>Rectangular</button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button className="px-3 py-1" onClick={() => setShowNewTable(false)}>Cancelar</button>
                        <button
                            className="bg-[#E4C3A1] text-[#651D28] px-3 py-1 rounded"
                            onClick={() => addTable({ number, name, type, seats, x: 220, y: 160, rotation: 0 })}
                        >Crear</button>
                    </div>
                </div>
            </div>
        )
    }

    // ========== Render ==========
    return (
        <div className="h-[calc(100vh-80px)] flex text-black">
            {/* Sidebar */}
            <aside className="w-80 border-r bg-[var(--pageBg)] p-4 flex flex-col" style={{ ['--pageBg' as any]: palette.pageBg }}>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">Invitados sin asignar</h2>
                    <span className="text-xs text-gray-600">{unassigned.length}</span>
                </div>

                <input placeholder="Buscar por nombre…" value={search} onChange={e => setSearch(e.target.value)} className="mb-3 w-full border rounded px-2 py-1" />

                <div className="flex-1 overflow-auto space-y-2">
                    {loading ? (
                        <div className="text-sm text-gray-600">Cargando invitados…</div>
                    ) : unassigned.length === 0 ? (
                        <div className="text-sm text-gray-600">Todos asignados 🎉</div>
                    ) : (
                        unassigned.map(g => (
                            <div key={g.id} draggable onDragStart={(e) => handleDragStartGuest(e, g.id)} className="bg-white border rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing shadow-sm" title="Arrastra a una mesa">
                                <div className="font-medium">{g.name || 'Sin nombre'}</div>
                                <div className="text-xs text-gray-600">Asientos: {Math.max(1, seatsFrom(g))}{g.did_confirm ? ' · Confirmado' : ''}</div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button onClick={() => setShowNewTable(true)} className="bg-[#E4C3A1] text-[#651D28] font-semibold py-2 rounded">Nueva mesa</button>
                    <button onClick={exportPNG} className="border py-2 rounded">Exportar PNG</button>
                    <button onClick={exportCSV} className="border py-2 rounded">Exportar CSV</button>
                    <button onClick={saveLayoutToStorage} className="border py-2 rounded col-span-2">Guardar en la nube (JSON+PNG)</button>

                    {/* NEW: Local JSON backup */}
                    <button onClick={downloadJSON} className="border py-2 rounded col-span-2">Descargar JSON</button>
                    <label className="border py-2 rounded col-span-2 text-center cursor-pointer">
                        Cargar JSON
                        <input
                            type="file"
                            accept="application/json"
                            className="hidden"
                            onChange={e => e.target.files?.[0] && uploadJSON(e.target.files[0])}
                        />
                    </label>
                </div>

                <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-1">Resumen</h3>
                    <div className="space-y-1 text-sm">
                        {tables.slice().sort((a, b) => a.number - b.number).map(t => (
                            <div key={t.id} className="flex items-center justify-between">
                                <span>{t.name}</span>
                                <span className="text-gray-600">{countAssigned(t.number)}/{t.seats}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Canvas */}
            <main
                ref={containerRef}
                className="flex-1 relative bg-[var(--ivory)]"
                style={{ ['--ivory' as any]: palette.ivory }}
                onDragOver={onCanvasDragOver}
                onDrop={onCanvasDrop}
            >
                <Stage width={stageSize.w} height={stageSize.h} ref={stageRef}>
                    <Layer>
                        <Text x={20} y={16} text="Arrastra invitados a una mesa. Doble click en asiento para quitar." fontSize={14} fill={palette.gray} />

                        {tables.map((t) => {
                            const assigned = countAssigned(t.number)
                            const over = assigned > t.seats

                            const cap = Math.max(1, t.seats || 1)
                            const seatPositions = circleSeats(0, 0, 86, cap, t.rotation)

                            let seatsArr = (seating[t.number] ?? []).slice(0, cap)
                            while (seatsArr.length < cap) seatsArr.push({ seatNo: seatsArr.length + 1 } as Seat)

                            return (
                                <Group
                                    key={t.id}
                                    x={t.x}
                                    y={t.y}
                                    rotation={t.rotation}
                                    draggable
                                    onClick={() => setSelectedTableId(t.id)}
                                    onDragEnd={(e) => updateTable(t.id, { x: e.target.x(), y: e.target.y() })}
                                >
                                    {t.type === 'rect' ? (
                                        <Rect x={-80} y={-50} width={160} height={100} cornerRadius={12}
                                            fill={over ? '#ffe5e5' : palette.rose}
                                            stroke={selectedTableId === t.id ? palette.burgundy : palette.burgundyDark}
                                            strokeWidth={selectedTableId === t.id ? 3 : 2}
                                            shadowBlur={4}
                                        />
                                    ) : (
                                        <Circle radius={70}
                                            fill={over ? '#ffe5e5' : palette.rose}
                                            stroke={selectedTableId === t.id ? palette.burgundy : palette.burgundyDark}
                                            strokeWidth={selectedTableId === t.id ? 3 : 2}
                                            shadowBlur={4}
                                        />
                                    )}

                                    <Text
                                        text={`${t.name}\n${assigned}/${t.seats}`}
                                        align="center"
                                        width={t.type === 'rect' ? 160 : 140}
                                        offsetX={(t.type === 'rect' ? 160 : 140) / 2}
                                        offsetY={16}
                                        y={-12}
                                        fontStyle="bold"
                                        fill={palette.burgundyDark}
                                    />

                                    {seatsArr.map((seat, idx) => {
                                        const pos = seatPositions[idx]; if (!pos) return null
                                        const occ = seat.occupant
                                        const initials = occ?.name
                                            ? occ.name.trim().split(/\s+/).map(w => w[0]?.toUpperCase()).slice(0, 2).join('')
                                            : String(idx + 1)

                                        return (
                                            <Group key={idx} x={pos.x} y={pos.y}>
                                                <Circle radius={14} fill={occ ? palette.roseMid : palette.sage} stroke={palette.burgundyDark} strokeWidth={1} />
                                                <Text text={initials} fontSize={11} align="center" width={28} offsetX={14} y={-6} fill={palette.ivory} />
                                                <Rect
                                                    width={28} height={28} offsetX={14} offsetY={14} fillEnabled={false} listening
                                                    onClick={() => {
                                                        if (!occ) return
                                                        if (occ.kind === 'companion') {
                                                            const newName = prompt('Nombre del acompañante:', occ.name) ?? occ.name
                                                            const s = (seating[t.number] ?? []).slice()
                                                            s[idx] = { seatNo: idx + 1, occupant: { ...occ, name: newName || occ.name } }
                                                            setSeating({ ...seating, [t.number]: s })
                                                        }
                                                    }}
                                                    onDblClick={async () => {
                                                        const current = seating[t.number] ?? []
                                                        const occ2 = current[idx]?.occupant
                                                        if (occ2?.kind === 'guest') {
                                                            try {
                                                                setSaving(true)
                                                                const { error } = await supabase.from('guests').update({ table_number: null }).eq('id', occ2.guestId)
                                                                if (error) throw error
                                                                setGuests(prev => prev.map(g => g.id === occ2.guestId ? { ...g, table_number: null } : g))
                                                            } finally { setSaving(false) }
                                                        }
                                                        const s = current.slice()
                                                        s[idx] = { seatNo: idx + 1 }
                                                        setSeating({ ...seating, [t.number]: s })
                                                    }}
                                                    title={occ ? (occ.name || '') : 'Asiento libre'}
                                                />
                                            </Group>
                                        )
                                    })}
                                </Group>
                            )
                        })}
                    </Layer>
                </Stage>

                {/* Inspector */}
                {selectedTableId && (
                    <div className="absolute right-4 top-4 w-80 bg-white/95 backdrop-blur border rounded-xl p-4 shadow">
                        {(() => {
                            const t = tables.find(x => x.id === selectedTableId)
                            if (!t) { setSelectedTableId(null); return null }
                            return (
                                <>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Propiedades de la mesa</h3>
                                        <button onClick={() => setSelectedTableId(null)} className="text-sm text-gray-600 hover:underline">Cerrar</button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm block">Nombre
                                            <input className="mt-1 w-full border rounded px-2 py-1" value={t.name}
                                                onChange={e => updateTable(t.id, { name: e.target.value })} />
                                        </label>
                                        <label className="text-sm block">Número (liga con invitados)
                                            <input type="number" className="mt-1 w-full border rounded px-2 py-1" value={t.number}
                                                onChange={e => updateTable(t.id, { number: toInt(e.target.value, t.number) })} />
                                        </label>
                                        <label className="text-sm block">Capacidad
                                            <input type="number" className="mt-1 w-full border rounded px-2 py-1" value={t.seats}
                                                onChange={e => updateTable(t.id, { seats: Math.max(1, toInt(e.target.value, t.seats)) })} />
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Tipo:</span>
                                            <button className={`px-3 py-1 rounded border ${t.type === 'round' ? 'bg-gray-200' : ''}`} onClick={() => updateTable(t.id, { type: 'round' })}>Redonda</button>
                                            <button className={`px-3 py-1 rounded border ${t.type === 'rect' ? 'bg-gray-200' : ''}`} onClick={() => updateTable(t.id, { type: 'rect' })}>Rectangular</button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm block">Rotación
                                                <input type="number" className="mt-1 w-24 border rounded px-2 py-1" value={t.rotation}
                                                    onChange={e => updateTable(t.id, { rotation: toInt(e.target.value, t.rotation) })} />
                                            </label>
                                            <button className="ml-auto text-red-700 border border-red-700 px-3 py-1 rounded" onClick={() => deleteTable(t.id)}>Eliminar</button>
                                        </div>

                                        <div className="pt-2 border-t mt-2">
                                            <h4 className="text-sm font-semibold mb-1">Ocupación</h4>
                                            <div className="max-h-40 overflow-auto space-y-1 text-sm">
                                                {(seating[t.number] ?? []).filter(s => s.occupant).map(s => {
                                                    const occ = s.occupant!
                                                    return (
                                                        <div key={s.seatNo} className="flex items-center justify-between gap-2">
                                                            <span>{s.seatNo}. {occ.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                {occ.kind === 'companion' && (
                                                                    <button className="text-xs text-indigo-700 underline"
                                                                        onClick={() => renameCompanion(t.number, s.seatNo - 1)}>
                                                                        Renombrar
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="text-xs text-blue-700 underline"
                                                                    onClick={async () => {
                                                                        const current = seating[t.number] ?? []
                                                                        const occ2 = current[s.seatNo - 1]?.occupant
                                                                        if (occ2?.kind === 'guest') {
                                                                            try {
                                                                                setSaving(true)
                                                                                const { error } = await supabase.from('guests').update({ table_number: null }).eq('id', occ2.guestId)
                                                                                if (error) throw error
                                                                                setGuests(prev => prev.map(g => g.id === occ2.guestId ? { ...g, table_number: null } : g))
                                                                            } finally { setSaving(false) }
                                                                        }
                                                                        const copy = current.slice()
                                                                        copy[s.seatNo - 1] = { seatNo: s.seatNo }
                                                                        setSeating({ ...seating, [t.number]: copy })
                                                                    }}>
                                                                    Quitar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </div>
                )}

                {showNewTable ? <NewTableModal /> : null}

                {saving && (
                    <div className="absolute bottom-4 right-4 bg-white border rounded px-3 py-1 text-sm shadow">
                        Guardando…
                    </div>
                )}
            </main>
        </div>
    )
}