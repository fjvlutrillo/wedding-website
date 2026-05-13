'use client'

/**
 * SeatingCanvas.tsx  – v2
 *
 * What changed from v1:
 * ──────────────────────────────────────────────────────────────────
 * 1. CLOUD PERSISTENCE
 *    Layout is saved/loaded from Supabase Storage
 *    (bucket "seating", object "layouts/current_layout.json").
 *    localStorage is kept as a fast local cache only.
 *    On mount: tries cloud first, falls back to localStorage.
 *    Auto-saves to cloud 2 s after any change (debounced).
 *
 * 2. NEW SHAPE  'serpentine'
 *    An S-shaped table (two offset rectangles joined visually).
 *    Seats distributed along the outer edges, capped at MAX_SEATS.
 *
 * 3. SEAT LABELS now show first name (≤7 chars) instead of initials.
 *
 * 4. MAX SEATS = 20 per table, enforced in UI and logic.
 *
 * 5. DEFAULT DECOR elements on fresh load:
 *      – Pista de Baile  (centre, large)
 *      – Bar             (upper-left)
 *      – Mesa de Novios  (upper-centre)
 *    All are draggable, resizable via inspector, no seat logic.
 *
 * Nothing else was removed or changed.
 * ──────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva'
import { supabase } from '@/lib/supabaseClient'

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_SEATS = 20
const LS_TABLES = 'sj_seating_tables_v2'
const LS_STATE = 'sj_seating_state_v2'
const CLOUD_KEY = 'layouts/current_layout.json'
const BUCKET = 'seating'

// ─── Types ────────────────────────────────────────────────────────────────────
type TableShape = 'round' | 'rect' | 'serpentine'

type TableModel = {
    id: string
    number: number
    name: string
    type: TableShape
    seats: number
    x: number
    y: number
    rotation: number
    /** Decorative non-seat element (dance floor, bar, etc.) */
    isDecor?: boolean
    decorLabel?: string
    decorColor?: string
    decorWidth?: number
    decorHeight?: number
}

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

type Occupant =
    | { kind: 'guest'; guestId: string; name: string }
    | { kind: 'companion'; guestId: string; name: string; idx: number }

type Seat = { seatNo: number; occupant?: Occupant }
type SeatingState = { [tableNumber: number]: Seat[] }

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
    burgundyDark: '#4D1C20',
    burgundy: '#47091C',
    rose: '#E5AAAE',
    roseMid: '#CC7379',
    sage: '#BDC2AC',
    ivory: '#FCFCFC',
    gray: '#9D9D9D',
    gold: '#C9A96E',
    danceFloor: '#F0E8D6',
    danceBorder: '#C9A96E',
}

// ─── Default decorative elements ─────────────────────────────────────────────
const DEFAULT_DECOR: TableModel[] = [
    {
        id: 'decor-dance', number: 0, name: 'Pista de Baile', type: 'rect',
        seats: 0, x: 500, y: 360, rotation: 0,
        isDecor: true, decorLabel: 'Pista de Baile', decorColor: P.danceFloor,
        decorWidth: 300, decorHeight: 200,
    },
    {
        id: 'decor-bar', number: 0, name: 'Bar', type: 'rect',
        seats: 0, x: 120, y: 90, rotation: 0,
        isDecor: true, decorLabel: 'Bar 🍹', decorColor: '#E8D5B7',
        decorWidth: 150, decorHeight: 60,
    },
    {
        id: 'decor-bride', number: 0, name: 'Mesa de Novios', type: 'rect',
        seats: 0, x: 510, y: 90, rotation: 0,
        isDecor: true, decorLabel: 'Mesa de Novios 💑', decorColor: '#EDD5D8',
        decorWidth: 220, decorHeight: 60,
    },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const genId = () => crypto.randomUUID()
const toInt = (v: unknown, fallback: number) => { const n = Number(v); return Number.isFinite(n) ? Math.floor(n) : fallback }
const clampSeats = (n: number) => Math.min(MAX_SEATS, Math.max(1, n))

function loadLocal<T>(key: string, fallback: T): T {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}
function saveLocal(key: string, val: unknown) {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* storage quota */ }
}

async function loadFromCloud(): Promise<{ tables: TableModel[]; seating: SeatingState } | null> {
    try {
        const { data, error } = await supabase.storage.from(BUCKET).download(CLOUD_KEY)
        // "Object not found" is expected on first use — treat as empty, not an error.
        if (error) {
            const msg = (error as any)?.message ?? ''
            if (msg.includes('not found') || msg.includes('404') || msg.includes('Object not found')) return null
            console.warn('[SeatingCanvas] Cloud load error:', error)
            return null
        }
        if (!data) return null
        const parsed = JSON.parse(await data.text())
        return { tables: parsed.tables ?? [], seating: parsed.seating ?? {} }
    } catch (e) {
        console.warn('[SeatingCanvas] loadFromCloud exception:', e)
        return null
    }
}

async function saveToCloud(tables: TableModel[], seating: SeatingState): Promise<void> {
    const blob = new Blob(
        [JSON.stringify({ version: 2, saved_at: new Date().toISOString(), tables, seating }, null, 2)],
        { type: 'application/json' }
    )
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(CLOUD_KEY, blob, { upsert: true, contentType: 'application/json' })
    if (error) {
        console.error('[SeatingCanvas] saveToCloud error:', error)
        throw error
    }
}

/**
 * Deletes the cloud layout so you can start fresh.
 * Called from the "Reiniciar layout" button in the sidebar.
 */
async function deleteCloudLayout(): Promise<void> {
    const { error } = await supabase.storage.from(BUCKET).remove([CLOUD_KEY])
    if (error) throw error
}

// ─── Seat position calculators ────────────────────────────────────────────────
/** Evenly distributed around a circle */
function circleSeatPos(cx: number, cy: number, r: number, count: number) {
    return Array.from({ length: count }, (_, i) => {
        const a = (2 * Math.PI / count) * i - Math.PI / 2
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
    })
}

/** Seats along top and bottom edge of a rectangle */
function rectSeatPos(cx: number, cy: number, w: number, h: number, count: number) {
    const out: { x: number; y: number }[] = []
    const perSide = Math.ceil(count / 2)
    for (let i = 0; i < perSide && out.length < count; i++)
        out.push({ x: cx - w / 2 + w / (perSide + 1) * (i + 1), y: cy - h / 2 - 18 })
    for (let i = 0; i < perSide && out.length < count; i++)
        out.push({ x: cx - w / 2 + w / (perSide + 1) * (i + 1), y: cy + h / 2 + 18 })
    return out
}

/**
 * S-shaped table: two offset rectangles.
 * Upper half of seats around top rect, lower half around bottom rect.
 */
function serpentineSeatPos(count: number): { x: number; y: number }[] {
    const segW = 155, segH = 52
    const topCX = -28, topCY = -(segH / 2 + 2)
    const botCX = 28, botCY = (segH / 2 + 2)
    const half = Math.ceil(count / 2)
    return [
        ...rectSeatPos(topCX, topCY, segW, segH, half),
        ...rectSeatPos(botCX, botCY, segW, segH, count - half),
    ]
}

/** First name label, max 7 chars */
function seatLabel(fullName: string | null | undefined, fallback: string): string {
    if (!fullName?.trim()) return fallback
    const first = fullName.trim().split(/\s+/)[0]
    return first.length > 7 ? first.slice(0, 6) + '…' : first
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SeatingCanvas() {
    const stageRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const seatingRef = useRef<SeatingState>({})        // stable ref for async callbacks
    const cloudTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [stageSize, setStageSize] = useState({ w: 1000, h: 700 })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [cloudStatus, setCloudStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

    const [guests, setGuests] = useState<Guest[]>([])
    const [tables, setTables] = useState<TableModel[]>([])
    const [seating, _rawSetSeating] = useState<SeatingState>({})

    const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
    const [showNewTable, setShowNewTable] = useState(false)
    const [search, setSearch] = useState('')

    // ── Seating setter: also mirrors to localStorage and cloud ref ────────
    const setSeating = (update: SeatingState | ((p: SeatingState) => SeatingState)) => {
        _rawSetSeating(prev => {
            const next = typeof update === 'function' ? update(prev) : update
            saveLocal(LS_STATE, next)
            seatingRef.current = next
            return next
        })
    }

    // ── Debounced cloud save ───────────────────────────────────────────────
    const scheduleCloudSave = (t: TableModel[], s: SeatingState) => {
        if (cloudTimer.current) clearTimeout(cloudTimer.current)
        setCloudStatus('saving')
        cloudTimer.current = setTimeout(async () => {
            try { await saveToCloud(t, s); setCloudStatus('saved'); setTimeout(() => setCloudStatus('idle'), 2500) }
            catch { setCloudStatus('error') }
        }, 2000)
    }

    // ── Tables setter with persistence ────────────────────────────────────
    const mutateTables = (update: TableModel[] | ((p: TableModel[]) => TableModel[])) => {
        setTables(prev => {
            const next = typeof update === 'function' ? update(prev) : update
            saveLocal(LS_TABLES, next)
            scheduleCloudSave(next, seatingRef.current)
            return next
        })
    }

    // ── Stage resize ──────────────────────────────────────────────────────
    useEffect(() => {
        const fn = () => {
            const el = containerRef.current
            if (el) { const r = el.getBoundingClientRect(); setStageSize({ w: r.width, h: r.height }) }
        }
        fn(); window.addEventListener('resize', fn)
        return () => window.removeEventListener('resize', fn)
    }, [])

    // ── Load guests ───────────────────────────────────────────────────────
    useEffect(() => {
        supabase
            .from('guests')
            .select('id, name, guest_count, number_confirmations, table_number, email, phone_number, did_confirm')
            .order('name', { ascending: true })
            .then(({ data, error }) => { if (!error) setGuests((data ?? []) as Guest[]) })
    }, [])

    // ── Load layout: cloud → localStorage → default decor ─────────────────
    useEffect(() => {
        ; (async () => {
            setLoading(true)
            const cloud = await loadFromCloud()
            if (cloud && cloud.tables.length > 0) {
                setTables(cloud.tables)
                setSeating(cloud.seating)
            } else {
                const local = loadLocal<TableModel[]>(LS_TABLES, [])
                if (local.length > 0) {
                    setTables(local)
                    setSeating(loadLocal<SeatingState>(LS_STATE, {}))
                } else {
                    setTables(DEFAULT_DECOR)   // first-time setup
                }
            }
            setLoading(false)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Auto cloud-save when seating changes (tables handled in mutateTables) ─
    const isFirstSeatingMount = useRef(true)
    useEffect(() => {
        if (isFirstSeatingMount.current) { isFirstSeatingMount.current = false; return }
        if (!loading) scheduleCloudSave(tables, seating)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seating])

    // ─── Derived ──────────────────────────────────────────────────────────
    const seatsFrom = (g: Guest) =>
        (g.number_confirmations ?? 0) > 0 ? g.number_confirmations! : (g.guest_count ?? 1)

    const unassigned = useMemo(
        () => guests
            .filter(g => !g.table_number || g.table_number === 0)
            .filter(g => !search || (g.name ?? '').toLowerCase().includes(search.toLowerCase())),
        [guests, search]
    )

    const countAssigned = (tableNo: number) =>
        (seating[tableNo] ?? []).filter(s => s.occupant).length

    // ─── Drag-and-drop ────────────────────────────────────────────────────
    const handleDragStartGuest = (e: React.DragEvent, guestId: string) => {
        e.dataTransfer.setData('text/plain', guestId)
        e.dataTransfer.effectAllowed = 'move'
    }

    const clientToStage = (cx: number, cy: number) => {
        const stage = stageRef.current as any
        if (!stage) return { x: 0, y: 0 }
        const r = stage.container().getBoundingClientRect()
        return { x: cx - r.left, y: cy - r.top }
    }

    const findTableAt = (x: number, y: number): TableModel | null => {
        for (const t of tables) {
            if (t.isDecor) continue
            if (t.type === 'round') {
                const dx = x - t.x, dy = y - t.y
                if (dx * dx + dy * dy <= 70 * 70) return t
            } else if (t.type === 'serpentine') {
                if (Math.abs(x - t.x) < 105 && Math.abs(y - t.y) < 85) return t
            } else {
                if (x >= t.x - 80 && x <= t.x + 80 && y >= t.y - 50 && y <= t.y + 50) return t
            }
        }
        return null
    }

    const onCanvasDragOver = (e: React.DragEvent) => e.preventDefault()
    const onCanvasDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        const guestId = e.dataTransfer.getData('text/plain')
        if (!guestId) return
        const { x, y } = clientToStage(e.clientX, e.clientY)
        const table = findTableAt(x, y); if (!table) return
        const g = guests.find(gg => gg.id === guestId); if (!g) return
        await placeGuestOnTable(g, table)
    }

    async function placeGuestOnTable(guest: Guest, table: TableModel) {
        const needed = Math.max(1, seatsFrom(guest))
        const tableSeats = seating[table.number] ?? Array.from({ length: table.seats }, (_, i) => ({ seatNo: i + 1 }))
        const free = tableSeats.filter(s => !s.occupant).map(s => s.seatNo)
        if (free.length < needed) { alert(`No hay asientos suficientes en ${table.name}.`); return }

        try {
            setSaving(true)
            const { error } = await supabase.from('guests').update({ table_number: table.number }).eq('id', guest.id)
            if (error) throw error
            setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, table_number: table.number } : g))
        } catch (e) {
            console.error(e); alert('No se pudo asignar en la base de datos.'); setSaving(false); return
        }

        const newSeats = [...tableSeats]
        newSeats[free[0] - 1] = { seatNo: free[0], occupant: { kind: 'guest', guestId: guest.id, name: guest.name || 'Invitado' } }
        for (let i = 1; i < needed; i++) {
            newSeats[free[i] - 1] = { seatNo: free[i], occupant: { kind: 'companion', guestId: guest.id, name: `+${i}`, idx: i } }
        }
        setSeating({ ...seating, [table.number]: newSeats })
        setSaving(false)
    }

    // ─── Tables CRUD ──────────────────────────────────────────────────────
    const addTable = (t: Omit<TableModel, 'id'>) => {
        mutateTables(prev => [...prev, { ...t, id: genId() }])
        setShowNewTable(false)
    }

    const updateTable = (id: string, patch: Partial<TableModel>) => {
        mutateTables(prev => {
            const before = prev.find(t => t.id === id)!
            const norm: Partial<TableModel> = { ...patch }
            if (patch.seats !== undefined) norm.seats = clampSeats(toInt(patch.seats, before.seats))
            if (patch.number !== undefined) norm.number = Math.max(1, toInt(patch.number, before.number))
            if (patch.rotation !== undefined) norm.rotation = toInt(patch.rotation, before.rotation)

            const next = prev.map(t => t.id === id ? { ...t, ...norm } : t)

            // sync seating buckets when table number or capacity changes
            setSeating(prevS => {
                const s = { ...prevS }
                const after = next.find(t => t.id === id)!
                const fromNo = before.number, toNo = after.number
                if (toNo !== fromNo) {
                    s[toNo] = (s[fromNo] ?? []).map((seat, i) => ({ ...seat, seatNo: i + 1 }))
                    delete s[fromNo]
                }
                const existing = s[toNo] ?? []
                const occ = existing.filter(s => !!s.occupant).length
                const cap = Math.max(after.seats, occ)
                const resized = existing.slice(0, cap)
                while (resized.length < cap) resized.push({ seatNo: resized.length + 1 })
                s[toNo] = resized
                return s
            })
            return next
        })
    }

    const deleteTable = (id: string) => {
        mutateTables(prev => {
            const tbl = prev.find(t => t.id === id)
            const next = prev.filter(t => t.id !== id)
            if (tbl && !tbl.isDecor) {
                setSeating(s => { const c = { ...s }; delete c[tbl.number]; return c })
            }
            return next
        })
        if (selectedTableId === id) setSelectedTableId(null)
    }

    // ─── Exporters ────────────────────────────────────────────────────────
    const exportPNG = () => {
        const s = stageRef.current; if (!s) return
        const a = document.createElement('a')
        a.href = s.toDataURL({ pixelRatio: 2 }); a.download = 'plano-mesas.png'; a.click()
    }

    const exportCSV = () => {
        const rows = ['mesa,asiento,tipo,nombre,invitado_id']
        tables.filter(t => !t.isDecor).forEach(t =>
            (seating[t.number] ?? []).forEach(s => {
                if (!s.occupant) return
                const o = s.occupant
                rows.push([t.number, s.seatNo, o.kind, (o.name || '').replace(/"/g, '""'), o.guestId].map(v => `"${v}"`).join(','))
            })
        )
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'asignacion_mesas.csv'; a.click()
        URL.revokeObjectURL(url)
    }

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify({ version: 2, saved_at: new Date().toISOString(), tables, seating }, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'seating_layout.json'; a.click()
        URL.revokeObjectURL(url)
    }

    const uploadJSON = async (file: File) => {
        try {
            const layout = JSON.parse(await file.text())
            setTables(Array.isArray(layout.tables) ? layout.tables : [])
            setSeating(typeof layout.seating === 'object' && layout.seating ? layout.seating : {})
        } catch { alert('Archivo inválido') }
    }

    const manualCloudSave = async () => {
        setSaving(true)
        try { await saveToCloud(tables, seating); setCloudStatus('saved'); setTimeout(() => setCloudStatus('idle'), 2500) }
        catch { setCloudStatus('error') }
        finally { setSaving(false) }
    }

    // ─── Seat renderer ────────────────────────────────────────────────────
    const renderSeat = (t: TableModel, idx: number, pos: { x: number; y: number }, seat: Seat | undefined) => {
        const occ = seat?.occupant
        const label = occ ? seatLabel(occ.name, String(idx + 1)) : String(idx + 1)
        const seatNo = idx + 1

        return (
            <Group key={`seat-${idx}`} x={pos.x} y={pos.y}>
                <Circle radius={15}
                    fill={occ ? P.roseMid : P.sage}
                    stroke={P.burgundyDark} strokeWidth={1} />
                <Text text={label} fontSize={9} align="center"
                    width={30} offsetX={15} offsetY={5}
                    fill={P.ivory} fontStyle={occ ? 'bold' : 'normal'} />
                {/* Invisible hit area */}
                <Rect width={30} height={30} offsetX={15} offsetY={15}
                    fillEnabled={false} listening
                    onClick={() => {
                        if (!occ || occ.kind !== 'companion') return
                        const newName = prompt('Nombre del acompañante:', occ.name) ?? occ.name
                        const s = (seating[t.number] ?? []).slice()
                        s[idx] = { seatNo, occupant: { ...occ, name: newName || occ.name } }
                        setSeating({ ...seating, [t.number]: s })
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
                        const s = current.slice(); s[idx] = { seatNo }
                        setSeating({ ...seating, [t.number]: s })
                    }} />
            </Group>
        )
    }

    // ─── Table renderer ───────────────────────────────────────────────────
    const renderTable = (t: TableModel) => {
        const isSelected = selectedTableId === t.id

        // ── Decorative element (no seats) ──────────────────────────────
        if (t.isDecor) {
            const w = t.decorWidth ?? 200, h = t.decorHeight ?? 80
            return (
                <Group key={t.id} x={t.x} y={t.y} draggable
                    onClick={() => setSelectedTableId(t.id)}
                    onDragEnd={e => updateTable(t.id, { x: e.target.x(), y: e.target.y() })}>
                    <Rect x={-w / 2} y={-h / 2} width={w} height={h} cornerRadius={10}
                        fill={t.decorColor ?? P.danceFloor}
                        stroke={isSelected ? P.burgundy : P.danceBorder}
                        strokeWidth={isSelected ? 3 : 2}
                        dash={[10, 5]}
                        shadowBlur={6} shadowOpacity={0.1} />
                    <Text text={t.decorLabel ?? t.name} align="center"
                        width={w} offsetX={w / 2} y={-7}
                        fill={P.burgundyDark} fontStyle="italic" fontSize={14} />
                </Group>
            )
        }

        const cap = t.seats
        const assigned = countAssigned(t.number)
        let seatsArr: (Seat | undefined)[] = (seating[t.number] ?? []).slice(0, cap)
        while (seatsArr.length < cap) seatsArr.push(undefined)

        const commonGroupProps = {
            key: t.id, x: t.x, y: t.y, draggable: true,
            onClick: () => setSelectedTableId(t.id),
            onDragEnd: (e: any) => updateTable(t.id, { x: e.target.x(), y: e.target.y() }),
        }

        // ── Round ──────────────────────────────────────────────────────
        if (t.type === 'round') {
            const seatPos = circleSeatPos(0, 0, 88, cap)
            return (
                <Group {...commonGroupProps}>
                    <Circle radius={68}
                        fill={P.rose}
                        stroke={isSelected ? P.burgundy : P.burgundyDark}
                        strokeWidth={isSelected ? 3 : 2} shadowBlur={4} />
                    <Text text={`${t.name}\n${assigned}/${cap}`} align="center"
                        width={120} offsetX={60} offsetY={14} y={-8}
                        fontStyle="bold" fontSize={12} fill={P.burgundyDark} />
                    {seatPos.map((pos, idx) => renderSeat(t, idx, pos, seatsArr[idx]))}
                </Group>
            )
        }

        // ── Rectangular ────────────────────────────────────────────────
        if (t.type === 'rect') {
            const w = 160, h = 90
            const seatPos = rectSeatPos(0, 0, w, h, cap)
            return (
                <Group {...commonGroupProps}>
                    <Rect x={-w / 2} y={-h / 2} width={w} height={h} cornerRadius={8}
                        fill={P.rose}
                        stroke={isSelected ? P.burgundy : P.burgundyDark}
                        strokeWidth={isSelected ? 3 : 2} shadowBlur={4} />
                    <Text text={`${t.name}\n${assigned}/${cap}`} align="center"
                        width={w} offsetX={w / 2} offsetY={12} y={-6}
                        fontStyle="bold" fontSize={12} fill={P.burgundyDark} />
                    {seatPos.map((pos, idx) => renderSeat(t, idx, pos, seatsArr[idx]))}
                </Group>
            )
        }

        // ── Serpentine (S-shape) ───────────────────────────────────────
        if (t.type === 'serpentine') {
            const segW = 155, segH = 52
            const topCX = -28, topCY = -(segH / 2 + 2)
            const botCX = 28, botCY = (segH / 2 + 2)
            const seatPos = serpentineSeatPos(cap)
            return (
                <Group {...commonGroupProps}>
                    {/* Upper arm */}
                    <Rect x={topCX - segW / 2} y={topCY - segH / 2} width={segW} height={segH}
                        cornerRadius={[20, 20, 4, 4]}
                        fill={P.rose}
                        stroke={isSelected ? P.burgundy : P.burgundyDark}
                        strokeWidth={isSelected ? 3 : 2} shadowBlur={4} />
                    {/* Lower arm */}
                    <Rect x={botCX - segW / 2} y={botCY - segH / 2} width={segW} height={segH}
                        cornerRadius={[4, 4, 20, 20]}
                        fill={P.rose}
                        stroke={isSelected ? P.burgundy : P.burgundyDark}
                        strokeWidth={isSelected ? 3 : 2} shadowBlur={4} />
                    {/* Connector bridge */}
                    <Rect x={-12} y={-8} width={40} height={16}
                        fill={P.rose} strokeEnabled={false} />
                    <Text text={`${t.name}\n${assigned}/${cap}`} align="center"
                        width={155} offsetX={155 / 2} offsetY={14} y={-10}
                        fontStyle="bold" fontSize={11} fill={P.burgundyDark} />
                    {seatPos.map((pos, idx) => renderSeat(t, idx, pos, seatsArr[idx]))}
                </Group>
            )
        }

        return null
    }

    // ─── New Table Modal ──────────────────────────────────────────────────
    const NewTableModal = () => {
        const existingNums = tables.filter(t => !t.isDecor).map(t => t.number)
        const nextNum = existingNums.length ? Math.max(...existingNums) + 1 : 1
        const [number, setNumber] = useState(nextNum)
        const [name, setName] = useState(`Mesa ${nextNum}`)
        const [type, setType] = useState<TableShape>('round')
        const [seats, setSeats] = useState(8)
        useEffect(() => { setName(`Mesa ${number}`) }, [number])

        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white text-black w-[440px] rounded-xl p-6 shadow-xl space-y-4">
                    <h3 className="text-xl font-semibold">Nueva mesa</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="text-sm">Número
                            <input type="number" value={number}
                                onChange={e => setNumber(toInt(e.target.value, number))}
                                className="mt-1 w-full border rounded px-2 py-1" />
                        </label>
                        <label className="text-sm">Capacidad (máx {MAX_SEATS})
                            <input type="number" value={seats} min={1} max={MAX_SEATS}
                                onChange={e => setSeats(clampSeats(toInt(e.target.value, seats)))}
                                className="mt-1 w-full border rounded px-2 py-1" />
                        </label>
                        <label className="text-sm col-span-2">Nombre
                            <input value={name} onChange={e => setName(e.target.value)}
                                className="mt-1 w-full border rounded px-2 py-1" />
                        </label>
                        <div className="col-span-2">
                            <span className="text-sm block mb-1 font-medium">Forma de mesa</span>
                            <div className="flex gap-2">
                                {(['round', 'rect', 'serpentine'] as TableShape[]).map(s => (
                                    <button key={s} onClick={() => setType(s)}
                                        className={`flex-1 py-2 rounded border text-sm transition-colors ${type === s ? 'bg-[#47091C] text-white border-[#47091C]' : 'hover:bg-gray-50'}`}>
                                        {s === 'round' ? '⭕ Redonda' : s === 'rect' ? '⬛ Rectangular' : '〰️ Serpentina'}
                                    </button>
                                ))}
                            </div>
                            {type === 'serpentine' && (
                                <p className="text-xs text-gray-500 mt-1 pl-1">
                                    Mesa en S para banquetes · hasta {MAX_SEATS} personas
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <button className="px-4 py-1.5 border rounded hover:bg-gray-50"
                            onClick={() => setShowNewTable(false)}>Cancelar</button>
                        <button
                            className="bg-[#E4C3A1] text-[#651D28] font-semibold px-5 py-1.5 rounded hover:bg-[#dbb890] transition-colors"
                            onClick={() => addTable({ number, name, type, seats, x: 320, y: 260, rotation: 0 })}>
                            Crear
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ─── Inspector panel ──────────────────────────────────────────────────
    const InspectorPanel = () => {
        const t = tables.find(x => x.id === selectedTableId)
        if (!t) { setSelectedTableId(null); return null }
        return (
            <div className="absolute right-4 top-4 w-72 bg-white/95 backdrop-blur border rounded-xl p-4 shadow-lg z-10 text-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{t.isDecor ? 'Elemento decorativo' : 'Mesa'}</h3>
                    <button onClick={() => setSelectedTableId(null)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Nombre
                        <input className="mt-1 w-full border rounded px-2 py-1 text-sm" value={t.name}
                            onChange={e => updateTable(t.id, { name: e.target.value })} />
                    </label>

                    {!t.isDecor && (
                        <>
                            <label className="block text-xs font-medium text-gray-600">Número (vincula con invitados)
                                <input type="number" className="mt-1 w-full border rounded px-2 py-1 text-sm" value={t.number}
                                    onChange={e => updateTable(t.id, { number: toInt(e.target.value, t.number) })} />
                            </label>
                            <label className="block text-xs font-medium text-gray-600">Capacidad (máx {MAX_SEATS})
                                <input type="number" min={1} max={MAX_SEATS}
                                    className="mt-1 w-full border rounded px-2 py-1 text-sm" value={t.seats}
                                    onChange={e => updateTable(t.id, { seats: clampSeats(toInt(e.target.value, t.seats)) })} />
                            </label>
                            <div className="flex gap-1 pt-1">
                                {(['round', 'rect', 'serpentine'] as TableShape[]).map(s => (
                                    <button key={s} onClick={() => updateTable(t.id, { type: s })}
                                        className={`flex-1 py-1 rounded border text-xs transition-colors ${t.type === s ? 'bg-[#47091C] text-white' : 'hover:bg-gray-50'}`}>
                                        {s === 'round' ? 'Redonda' : s === 'rect' ? 'Rect' : 'Serpentina'}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {t.isDecor && (
                        <div className="grid grid-cols-2 gap-2">
                            <label className="text-xs font-medium text-gray-600">Ancho
                                <input type="number" className="mt-1 w-full border rounded px-2 py-1 text-sm"
                                    value={t.decorWidth ?? 200}
                                    onChange={e => updateTable(t.id, { decorWidth: toInt(e.target.value, 200) })} />
                            </label>
                            <label className="text-xs font-medium text-gray-600">Alto
                                <input type="number" className="mt-1 w-full border rounded px-2 py-1 text-sm"
                                    value={t.decorHeight ?? 80}
                                    onChange={e => updateTable(t.id, { decorHeight: toInt(e.target.value, 80) })} />
                            </label>
                        </div>
                    )}

                    <label className="block text-xs font-medium text-gray-600">Rotación (°)
                        <input type="number" className="mt-1 w-24 border rounded px-2 py-1 text-sm" value={t.rotation}
                            onChange={e => updateTable(t.id, { rotation: toInt(e.target.value, t.rotation) })} />
                    </label>

                    {!t.isDecor && (
                        <div className="pt-2 border-t">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ocupación</h4>
                            <div className="max-h-40 overflow-auto space-y-1 text-xs">
                                {(seating[t.number] ?? []).filter(s => s.occupant).length === 0
                                    ? <p className="text-gray-400 italic">Sin invitados</p>
                                    : (seating[t.number] ?? []).filter(s => s.occupant).map(s => {
                                        const occ = s.occupant!
                                        return (
                                            <div key={s.seatNo} className="flex items-center justify-between gap-2">
                                                <span className="truncate">{s.seatNo}. {occ.name}</span>
                                                <div className="flex gap-2 shrink-0">
                                                    {occ.kind === 'companion' && (
                                                        <button className="text-indigo-600 underline"
                                                            onClick={() => {
                                                                const n = prompt('Nombre:', occ.name) ?? occ.name
                                                                const copy = (seating[t.number] ?? []).slice()
                                                                copy[s.seatNo - 1] = { seatNo: s.seatNo, occupant: { ...occ, name: n || occ.name } }
                                                                setSeating({ ...seating, [t.number]: copy })
                                                            }}>Renombrar</button>
                                                    )}
                                                    <button className="text-blue-600 underline"
                                                        onClick={async () => {
                                                            const curr = seating[t.number] ?? []
                                                            const o2 = curr[s.seatNo - 1]?.occupant
                                                            if (o2?.kind === 'guest') {
                                                                try {
                                                                    setSaving(true)
                                                                    const { error } = await supabase.from('guests').update({ table_number: null }).eq('id', o2.guestId)
                                                                    if (error) throw error
                                                                    setGuests(prev => prev.map(g => g.id === o2.guestId ? { ...g, table_number: null } : g))
                                                                } finally { setSaving(false) }
                                                            }
                                                            const copy = curr.slice(); copy[s.seatNo - 1] = { seatNo: s.seatNo }
                                                            setSeating({ ...seating, [t.number]: copy })
                                                        }}>Quitar</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    )}

                    <button onClick={() => deleteTable(t.id)}
                        className="w-full mt-2 text-red-700 border border-red-300 py-1.5 rounded hover:bg-red-50 text-xs font-medium">
                        🗑 Eliminar {t.isDecor ? 'elemento' : 'mesa'}
                    </button>
                </div>
            </div>
        )
    }

    // ─── Cloud status toast ───────────────────────────────────────────────
    const cloudLabel = cloudStatus === 'saving' ? '☁️ Auto-guardando…'
        : cloudStatus === 'saved' ? '✅ Guardado en la nube'
            : cloudStatus === 'error' ? '❌ Error al guardar'
                : null

    // ─── Render ───────────────────────────────────────────────────────────
    return (
        <div className="h-[calc(100vh-80px)] flex text-black">

            {/* ── Sidebar ── */}
            <aside className="w-80 border-r bg-[#FBF3F9] p-4 flex flex-col overflow-hidden shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Sin asignar</h2>
                    <span className="text-xs bg-[#47091C] text-white rounded-full px-2 py-0.5">{unassigned.length}</span>
                </div>

                <input placeholder="Buscar por nombre…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="mb-3 w-full border rounded px-2 py-1 text-sm" />

                <div className="flex-1 overflow-auto space-y-2 pr-1 min-h-0">
                    {loading
                        ? <p className="text-sm text-gray-500">Cargando…</p>
                        : unassigned.length === 0
                            ? <p className="text-sm text-gray-500">¡Todos asignados! 🎉</p>
                            : unassigned.map(g => (
                                <div key={g.id} draggable
                                    onDragStart={e => handleDragStartGuest(e, g.id)}
                                    className="bg-white border rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing shadow-sm hover:border-[#47091C] transition-colors select-none">
                                    <div className="font-medium text-sm">{g.name || 'Sin nombre'}</div>
                                    <div className="text-xs text-gray-500">
                                        {seatsFrom(g)} asiento{seatsFrom(g) !== 1 ? 's' : ''}
                                        {g.did_confirm ? ' · ✅' : ''}
                                    </div>
                                </div>
                            ))
                    }
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 shrink-0">
                    <button onClick={() => setShowNewTable(true)}
                        className="col-span-2 bg-[#47091C] text-white font-semibold py-2 rounded text-sm hover:bg-[#651D28] transition-colors">
                        + Nueva mesa
                    </button>
                    <button onClick={exportPNG} className="border py-1.5 rounded text-xs hover:bg-gray-50">📷 PNG</button>
                    <button onClick={exportCSV} className="border py-1.5 rounded text-xs hover:bg-gray-50">📊 CSV</button>
                    <button onClick={manualCloudSave} className="col-span-2 border py-1.5 rounded text-xs hover:bg-gray-50">☁️ Guardar en la nube ahora</button>
                    <button onClick={downloadJSON} className="border py-1.5 rounded text-xs hover:bg-gray-50">⬇ JSON</button>
                    <label className="border py-1.5 rounded text-xs text-center cursor-pointer hover:bg-gray-50">
                        ⬆ Cargar JSON
                        <input type="file" accept="application/json" className="hidden"
                            onChange={e => e.target.files?.[0] && uploadJSON(e.target.files[0])} />
                    </label>
                    {/* Reset: wipes cloud + localStorage and reloads default decor */}
                    <button
                        className="col-span-2 border border-red-300 text-red-700 py-1.5 rounded text-xs hover:bg-red-50 transition-colors"
                        onClick={async () => {
                            if (!window.confirm('¿Reiniciar el plano por completo? Se borrarán todas las mesas y asignaciones de asientos (los invitados en Supabase no se afectan).')) return
                            try {
                                setSaving(true)
                                await deleteCloudLayout()
                            } catch (e) {
                                // File may not exist yet — that is fine
                                console.warn('deleteCloudLayout:', e)
                            } finally {
                                setSaving(false)
                            }
                            saveLocal(LS_TABLES, [])
                            saveLocal(LS_STATE, {})
                            setTables(DEFAULT_DECOR)
                            setSeating({})
                            setSelectedTableId(null)
                        }}>
                        🗑 Reiniciar layout completo
                    </button>
                </div>

                {/* Per-table summary */}
                <div className="mt-3 border-t pt-3 shrink-0">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mesas</h3>
                    <div className="space-y-0.5 text-xs max-h-28 overflow-auto">
                        {tables.filter(t => !t.isDecor).sort((a, b) => a.number - b.number).map(t => {
                            const occ = countAssigned(t.number)
                            const full = occ >= t.seats
                            return (
                                <div key={t.id} className="flex items-center justify-between">
                                    <span className="truncate text-gray-700">{t.name}</span>
                                    <span className={`ml-2 font-mono tabular-nums ${full ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                                        {occ}/{t.seats}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </aside>

            {/* ── Canvas ── */}
            <main ref={containerRef} className="flex-1 relative bg-[#FCFCFC] overflow-hidden"
                onDragOver={onCanvasDragOver} onDrop={onCanvasDrop}>

                <Stage width={stageSize.w} height={stageSize.h} ref={stageRef}>
                    <Layer>
                        <Text x={16} y={14}
                            text="Arrastra invitados a una mesa  ·  Click para seleccionar  ·  Doble click en asiento para quitar"
                            fontSize={12} fill={P.gray} />
                        {tables.map(renderTable)}
                    </Layer>
                </Stage>

                {selectedTableId && <InspectorPanel />}

                {cloudLabel && (
                    <div className="absolute bottom-4 right-4 bg-white border rounded-lg px-4 py-2 text-sm shadow-md pointer-events-none">
                        {cloudLabel}
                    </div>
                )}
                {saving && (
                    <div className="absolute bottom-14 right-4 bg-white border rounded px-3 py-1.5 text-sm shadow pointer-events-none">
                        Guardando asignación…
                    </div>
                )}

                {showNewTable && <NewTableModal />}
            </main>
        </div>
    )
}