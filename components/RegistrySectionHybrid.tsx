'use client'

/**
 * REGISTRY SECTION - BOHO-CHIC MAGAZINE STYLE (SPACING FIXED)
 * 
 * Updates:
 * - Only Zola registry + Cash deposits (removed Amazon & Liverpool)
 * - Centered single card layout for Zola
 * - Magazine-style typography and asymmetric layouts
 * - Burgundy color theme throughout
 * - Decorative geometric elements
 * - Elegant hover animations
 * - REDUCED PADDING to fix bottom spacing issue
 * 
 * Features:
 * - Links to external Zola registry
 * - Bank transfer details for cash gifts
 * - WhatsApp contact for help
 * - Responsive mobile-first design
 */

interface RegistryLink {
  name: string
  description: string
  url: string
  icon: string // SVG path
}

const RegistryCard = ({
  name,
  description,
  url,
  icon,
}: RegistryLink) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative bg-gradient-to-br from-white to-warm-cream rounded-3xl p-8 sm:p-12 border-2 border-wedding-burgundy/20 hover:border-wedding-burgundy/40 shadow-wedding-lg hover:shadow-wedding-xl transition-all duration-500 flex flex-col overflow-hidden"
    >
      {/* Decorative corner accent - magazine style */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-burgundy/5 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-wedding-burgundy/10 transition-colors duration-500" />

      {/* Decorative diagonal line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-wedding-rose/30 to-transparent" />

      {/* Icon - Burgundy gradient */}
      <div className="relative mb-8 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-wedding-burgundy to-wedding-burgundy-light flex items-center justify-center shadow-wedding-md group-hover:scale-110 transition-transform duration-500">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>

      {/* Registry Name - Magazine-style typography */}
      <h3 className="text-3xl sm:text-4xl font-light text-wedding-burgundy mb-4 text-center tracking-tight">
        {name}
      </h3>

      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px w-12 bg-wedding-rose/40" />
        <svg className="w-3 h-3 text-wedding-rose/60" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <div className="h-px w-12 bg-wedding-rose/40" />
      </div>

      {/* Description */}
      <p className="text-stone-600 leading-relaxed mb-8 text-center flex-grow text-base sm:text-lg">
        {description}
      </p>

      {/* Call to Action - Burgundy button */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-wedding-burgundy to-wedding-burgundy-light text-white font-light tracking-wide uppercase text-sm rounded-full shadow-wedding-lg group-hover:shadow-wedding-xl transition-all duration-500 group-hover:-translate-y-1">
          <span>Ver mesa de regalos</span>
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-2 duration-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>

      {/* Floating decorative element - bottom left */}
      <div className="absolute -bottom-6 -left-6 w-24 h-24 border-2 border-wedding-rose/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </a>
  )
}

/**
 * Main Registry Section - Hybrid Approach with Boho-Chic Styling
 * SPACING FIXED: Reduced from py-24 to py-16 sm:py-20
 */
export default function RegistrySectionHybrid() {
  // Registry link - Only Zola
  const registries: RegistryLink[] = [
    {
      name: "Zola",
      description: "Nuestra mesa principal está en Zola, con diferentes aportaciones para hacer realidad nuestra luna de miel.",
      url: "https://www.zola.com/registry/franciscojavierandsusana",
      icon: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z",
    }
  ]

  return (
    <section
      id="registry"
      className="relative py-16 sm:py-20 px-4 bg-gradient-to-b from-stone-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header - REDUCED mb-16 to mb-12 */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-wedding-rose font-light">
            Capítulo 07
          </span>
          <h2 className="text-4xl sm:text-5xl font-light text-charcoal">
            Mesa de
            <span className="block font-luxury text-5xl sm:text-6xl mt-2 text-wedding-burgundy">Regalos</span>
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Tu presencia es nuestro mejor regalo, pero si quieres tener un detalle con nosotros,
            ponemos estas opciones a tu disposición:
          </p>
        </div>

        {/* Registry Card - Centered single card for Zola - REDUCED mb-16 to mb-10 */}
        <div className="max-w-2xl mx-auto mb-10">
          {registries.map((registry, idx) => (
            <RegistryCard key={idx} {...registry} />
          ))}
        </div>

        {/* Alternative Gift Option - Cash deposits with boho-chic styling - REDUCED mt-12 to mt-8 */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative bg-gradient-to-br from-warm-cream to-white rounded-3xl p-8 sm:p-10 border-2 border-wedding-burgundy/20 shadow-wedding-lg overflow-hidden">

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-wedding-rose/5 rounded-br-[80px] -ml-12 -mt-12" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-wedding-burgundy/5 rounded-tl-[100px] -mr-16 -mb-16" />

            <div className="relative flex flex-col sm:flex-row items-start gap-6">
              {/* Icon with burgundy gradient */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wedding-burgundy/10 to-wedding-rose/10 flex items-center justify-center flex-shrink-0 border-2 border-wedding-burgundy/20">
                <svg
                  className="w-8 h-8 text-wedding-burgundy"
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
                {/* Title with magazine typography */}
                <h3 className="text-2xl sm:text-3xl font-light text-wedding-burgundy mb-3 tracking-tight">
                  Regalos en efectivo
                </h3>

                {/* Decorative divider */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-8 bg-wedding-rose/40" />
                  <div className="w-1 h-1 rounded-full bg-wedding-rose/60" />
                </div>

                <p className="text-stone-600 leading-relaxed mb-6">
                  Si prefieres contribuir con dinero en efectivo, también puedes realizar
                  una transferencia bancaria aquí:
                </p>

                {/* Bank details card - elegant styling */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-wedding-blush shadow-wedding">
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex items-start gap-3">
                      <span className="font-light text-wedding-burgundy min-w-[80px]">Banco:</span>
                      <span className="text-stone-700 font-light">BanBajío</span>
                    </div>
                    <div className="h-px bg-wedding-blush/50" />

                    <div className="flex items-start gap-3">
                      <span className="font-light text-wedding-burgundy min-w-[80px]">Cuenta:</span>
                      <span className="text-stone-700 font-mono text-sm sm:text-base">498341530201</span>
                    </div>
                    <div className="h-px bg-wedding-blush/50" />

                    <div className="flex items-start gap-3">
                      <span className="font-light text-wedding-burgundy min-w-[80px]">CLABE:</span>
                      <span className="text-stone-700 font-mono text-sm sm:text-base">030180900046901593</span>
                    </div>
                    <div className="h-px bg-wedding-blush/50" />

                    <div className="flex items-start gap-3">
                      <span className="font-light text-wedding-burgundy min-w-[80px]">Titular:</span>
                      <span className="text-stone-700 font-light">Susana Calderón y Francisco Javier Vazquez</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text - Updated with burgundy theme - REDUCED mt-8 to mt-6 */}
        <div className="text-center mt-6">
          <p className="text-sm text-stone-500">
            ¿Tienes problemas accediendo a la mesa de regalos?{' '}
            <a
              href="https://wa.me/12146002210?text=Hola%20Susana%20y%20Javier%2C%20tengo%20un%20problema%20con%20la%20mesa%20de%20regalos"
              className="text-wedding-burgundy hover:text-wedding-burgundy-light font-medium underline transition-colors"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}