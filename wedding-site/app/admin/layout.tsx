import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-[#1B1F3B] text-white flex gap-4 p-4 text-sm font-medium shadow-md overflow-x-auto whitespace-nowrap">
                <div className="flex items-center gap-4 px-4 py-2 min-w-max">
                    <span className="text-base font-semibold mr-6 whitespace-nowrap">S&J Boda – Planner</span>
                    <Link href="/admin/guests" className="hover:underline inline-block min-w-fit">🎫 Invitados</Link>
                    <Link href="/admin/venues/church" className="hover:underline inline-block min-w-fit">🏛️ Iglesia</Link>
                    <Link href="/admin/venues/party" className="hover:underline inline-block min-w-fit">🎉 Fiesta</Link>
                    <Link href="/admin/budget" className="hover:underline inline-block min-w-fit">💰 Presupuesto</Link>
                    <Link href="/admin/payments" className="hover:underline inline-block min-w-fit">💳 Pagos</Link>
                    <Link href="/admin/checklist" className="hover:underline inline-block min-w-fit">📅 Checklist</Link>
                </div>
            </nav>

            <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
    )
}