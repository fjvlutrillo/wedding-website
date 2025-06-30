import { Suspense } from 'react'
import RSVPForm from './RSVPForm'

export default function RSVPPage() {
    return (
        <main>
            {/* Optionally add a header here */}
            <Suspense fallback={<div>Cargando formulario...</div>}>
                <RSVPForm />
            </Suspense>
        </main>
    )
}