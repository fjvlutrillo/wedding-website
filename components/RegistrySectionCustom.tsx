'use client'

import { useState } from 'react'
import Image from 'next/image'

/**
 * LEARNING NOTE: Custom Registry Section - ADVANCED APPROACH
 * 
 * This approach:
 * - Keeps everything on your site
 * - Full control over design and UX
 * - Requires backend implementation (Supabase)
 * 
 * Backend needed (we'll build this next):
 * 1. Database table: registry_items
 *    - id, name, description, price, image_url, purchased_by, purchased_at
 * 2. API routes for:
 *    - GET all items
 *    - POST purchase (mark as purchased)
 * 3. Admin panel to add/edit items
 * 
 * Pros:
 * - Beautiful, seamless experience
 * - Full branding control
 * - Can customize everything
 * 
 * Cons:
 * - More development work
 * - Need to handle payment (or just tracking)
 * - Maintenance overhead
 */

interface RegistryItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: 'home' | 'kitchen' | 'experience' | 'other'
  isPurchased: boolean
  purchasedBy?: string
  quantity?: number
  quantityPurchased?: number
}

/**
 * Individual Registry Item Card
 */
const RegistryItemCard = ({ item }: { item: RegistryItem }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handlePurchase = () => {
    // TODO: Implement purchase logic with Supabase
    console.log('Purchase item:', item.id)
    // This will open a modal or redirect to purchase confirmation
  }

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-64 bg-stone-100 overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Purchased Badge */}
        {item.isPurchased && (
          <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
            ✓ Apartado
          </div>
        )}

        {/* Quick View on Hover */}
        {isHovered && !item.isPurchased && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
            <button
              onClick={handlePurchase}
              className="bg-white text-[#2C2C2C] px-6 py-3 rounded-full font-medium hover:bg-stone-100 transition-colors transform hover:scale-105"
            >
              Ver detalles
            </button>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="p-6">
        {/* Category Tag */}
        <span className="text-xs uppercase tracking-wider text-stone-500 font-light">
          {item.category === 'home' && 'Hogar'}
          {item.category === 'kitchen' && 'Cocina'}
          {item.category === 'experience' && 'Experiencia'}
          {item.category === 'other' && 'Otros'}
        </span>

        {/* Name */}
        <h3 className="text-xl font-light text-[#2C2C2C] mt-2 mb-2">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="text-2xl font-light text-[#2C2C2C]">
            ${item.price.toLocaleString('es-MX')} <span className="text-sm text-stone-500">MXN</span>
          </span>
          
          {item.isPurchased ? (
            <span className="text-sm text-emerald-600 font-medium">
              Apartado
            </span>
          ) : (
            <button
              onClick={handlePurchase}
              className="text-sm text-[#2C2C2C] hover:text-stone-600 font-medium underline"
            >
              Apartar
            </button>
          )}
        </div>

        {/* Quantity if applicable */}
        {item.quantity && item.quantity > 1 && (
          <div className="mt-3 text-xs text-stone-500">
            {item.quantityPurchased || 0} de {item.quantity} apartados
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Main Custom Registry Section
 */
export default function RegistrySectionCustom() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // TODO: Replace with actual data from Supabase
  // This would be: const { data: items } = useQuery(...)
  const mockItems: RegistryItem[] = [
    {
      id: '1',
      name: 'Juego de sábanas King',
      description: 'Sábanas de algodón egipcio 400 hilos, color blanco',
      price: 2500,
      imageUrl: '/registry/sheets.jpg',
      category: 'home',
      isPurchased: false
    },
    {
      id: '2',
      name: 'Cafetera Express',
      description: 'Cafetera automática con espumador de leche',
      price: 4500,
      imageUrl: '/registry/coffee.jpg',
      category: 'kitchen',
      isPurchased: true,
      purchasedBy: 'María González'
    },
    {
      id: '3',
      name: 'Luna de Miel - París',
      description: 'Contribución para nuestra luna de miel en París',
      price: 5000,
      imageUrl: '/registry/paris.jpg',
      category: 'experience',
      isPurchased: false,
      quantity: 10,
      quantityPurchased: 3
    }
    // Add more items...
  ]

  const categories = [
    { id: 'all', label: 'Todos', count: mockItems.length },
    { id: 'home', label: 'Hogar', count: mockItems.filter(i => i.category === 'home').length },
    { id: 'kitchen', label: 'Cocina', count: mockItems.filter(i => i.category === 'kitchen').length },
    { id: 'experience', label: 'Experiencias', count: mockItems.filter(i => i.category === 'experience').length }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? mockItems 
    : mockItems.filter(item => item.category === selectedCategory)

  return (
    <section 
      id="registry" 
      className="relative py-24 px-4 bg-gradient-to-b from-stone-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">
            Capítulo 05
          </span>
          <h2 className="text-5xl sm:text-6xl font-light text-[#2C2C2C]">
            Mesa de
            <span className="block font-luxury text-6xl sm:text-7xl mt-2">Regalos</span>
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, 
            hemos seleccionado algunos artículos que nos ayudarán a comenzar nuestra vida juntos.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                ${selectedCategory === cat.id
                  ? 'bg-[#2C2C2C] text-white shadow-lg'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                }
              `}
            >
              {cat.label}
              <span className="ml-2 text-xs opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Registry Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredItems.map((item) => (
            <RegistryItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <svg 
              className="w-16 h-16 text-stone-300 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" 
              />
            </svg>
            <p className="text-stone-500">No hay artículos en esta categoría</p>
          </div>
        )}

        {/* Alternative Options */}
        <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-2 gap-6">
          {/* Cash Gift */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg 
                  className="w-6 h-6 text-emerald-600" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" 
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-light text-[#2C2C2C] mb-2">
                  Lluvia de sobres
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Habrá un buzón especial durante la recepción.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg 
                  className="w-6 h-6 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" 
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-light text-[#2C2C2C] mb-2">
                  ¿Preguntas?
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  <a 
                    href="mailto:regalos@susanayjavier.com" 
                    className="text-[#2C2C2C] hover:text-stone-600 underline"
                  >
                    Contáctanos
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator (optional) */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <p className="text-sm text-stone-500 mb-3">
              Progreso de la mesa de regalos
            </p>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: '35%' }} // Calculate based on purchased items
              />
            </div>
            <p className="text-xs text-stone-500 mt-3">
              {mockItems.filter(i => i.isPurchased).length} de {mockItems.length} artículos apartados
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
