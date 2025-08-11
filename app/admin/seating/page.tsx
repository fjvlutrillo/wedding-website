'use client'

// app/admin/seating/page.tsx
import dynamic from 'next/dynamic'

// Load the Konva component only in the browser
const SeatingCanvas = dynamic(() => import('./SeatingCanvas'), {
    ssr: false,
    loading: () => <div style={{ padding: 24 }}>Cargando mesas…</div>,
})
  

export default function Page() {
    return <SeatingCanvas />
}