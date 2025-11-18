'use client'

/**
 * LEARNING NOTE: Registry Section - HYBRID APPROACH (Zola Integration)
 * 
 * This approach:
 * - Links to external registry (Zola, Amazon, Liverpool, etc.)
 * - Maintains your site's design aesthetic
 * - Simplest to implement (no backend needed)
 * - Industry standard approach
 * 
 * Pros:
 * - No need to build shopping cart, payment processing
 * - Guests familiar with these platforms
 * - Built-in wishlists, purchase tracking, shipping
 * - Can integrate multiple registries
 * 
 * Cons:
 * - Takes guests away from your site
 * - Less control over experience
 * - Split between multiple platforms
 */

interface RegistryLink {
  name: string
  description: string
  url: string
  icon: string // SVG path
  color: string // Tailwind classes for brand colors
}

const RegistryCard = ({ 
  name, 
  description, 
  url, 
  icon, 
  color 
}: RegistryLink) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Icon */}
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-6`}>
        <svg 
          className="w-8 h-8 text-white" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>

      {/* Registry Name */}
      <h3 className="text-2xl font-light text-[#2C2C2C] mb-3">
        {name}
      </h3>

      {/* Description */}
      <p className="text-stone-600 leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      {/* Call to Action */}
      <div className="flex items-center gap-2 text-[#2C2C2C] group-hover:text-stone-600 font-medium transition-colors">
        <span>Ver mesa de regalos</span>
        <svg 
          className="w-5 h-5 transition-transform group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </a>
  )
}

/**
 * Main Registry Section - Hybrid Approach
 */
export default function RegistrySectionHybrid() {
  // Registry links - replace with your actual URLs
  const registries: RegistryLink[] = [
    {
      name: "Zola",
      description: "Nuestra mesa principal con artículos para el hogar, experiencias y más opciones personalizadas.",
      url: "https://www.zola.com/registry/franciscojavierandsusana", // Replace with your actual Zola URL
      icon: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z",
      color: "bg-rose-500"
    },
    {
      name: "Amazon",
      description: "Encuentra desde electrodomésticos hasta decoración. Envío directo a nuestra dirección.",
      url: "https://www.amazon.com.mx/wedding/susana-javier", // Replace with your actual Amazon registry
      icon: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
      color: "bg-orange-500"
    },
    {
      name: "Liverpool",
      description: "Mesa de regalos en tienda departamental con amplia variedad de productos y facilidad para invitados nacionales.",
      url: "https://www.liverpool.com.mx/tienda?s=susana-javier", // Replace with your actual Liverpool registry
      icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z",
      color: "bg-red-600"
    }
  ]

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
            hemos creado mesas de regalos en las siguientes tiendas para tu comodidad.
          </p>
        </div>

        {/* Registry Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {registries.map((registry, idx) => (
            <RegistryCard key={idx} {...registry} />
          ))}
        </div>

        {/* Alternative Gift Option */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl p-8 border border-stone-200">
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
                <h3 className="text-xl font-light text-[#2C2C2C] mb-3">
                  Lluvia de sobres
                </h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Si prefieres contribuir con un regalo monetario, habrá un buzón especial 
                  durante la recepción donde podrás depositar tu sobre. También puedes realizar 
                  una transferencia bancaria:
                </p>
                <div className="bg-stone-50 rounded-xl p-4 space-y-2 text-sm">
                  <p className="text-stone-700">
                    <span className="font-medium text-[#2C2C2C]">Banco:</span> BBVA Bancomer
                  </p>
                  <p className="text-stone-700">
                    <span className="font-medium text-[#2C2C2C]">Cuenta:</span> 0123456789
                  </p>
                  <p className="text-stone-700">
                    <span className="font-medium text-[#2C2C2C]">CLABE:</span> 012180001234567890
                  </p>
                  <p className="text-stone-700">
                    <span className="font-medium text-[#2C2C2C]">Titular:</span> Susana Calderón & El viejo sabroso
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-stone-500">
            ¿Tienes problemas accediendo a las mesas de regalos?{' '}
            <a 
              href="https://wa.me/12146002210?text=Hola%20Susana%20y%20Javier%2C%20tengo%20un%20problema%20con%20la%20mesa%20de%20regalos" 
              className="text-[#2C2C2C] hover:text-stone-600 font-medium underline"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
