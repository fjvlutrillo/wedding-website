'use client'

/**
 * BUS SCHEDULE BANNER
 *
 * A floating, dismissible card that shows the wedding transport schedule.
 * It fades in shortly after the page loads, can be collapsed to a small
 * floating pill (the 🚌 button), and re-opened by tapping that pill.
 *
 * ----------------------------------------------------------------------
 * LEARNING NOTES (backend -> frontend analogies)
 * ----------------------------------------------------------------------
 * - useState(...)  ~ an instance field on an object. It holds a value AND
 *                    re-renders the UI whenever you change it via the setter.
 *                    Think of `const [open, setOpen] = useState(true)` as a
 *                    private boolean field `open` with a setter that ALSO
 *                    schedules a repaint.
 *
 * - useEffect(...) ~ a lifecycle hook. The function inside runs AFTER the
 *                    component is painted to the screen. The `[]` dependency
 *                    array means "run this exactly once, like a constructor
 *                    side-effect". The returned function is the destructor /
 *                    cleanup (here we clear the timer to avoid leaks).
 *
 * - Conditional rendering ( {open ? <A/> : <B/>} ) ~ a normal if/else that
 *                    decides which DOM tree to emit. React diffs the old tree
 *                    against the new one and only mutates what changed.
 * ----------------------------------------------------------------------
 */

import { useEffect, useState } from 'react'

export default function BusScheduleBanner() {
  // Controls the fade-in. Starts false so the card is invisible, then we
  // flip it to true after a short delay so it gracefully fades in.
  const [visible, setVisible] = useState(false)

  // Controls expanded card vs. minimized pill.
  const [open, setOpen] = useState(true)

  // Runs once after the first paint -> trigger the fade-in after 600ms.
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(timer) // cleanup, like a destructor
  }, [])

  return (
    <div
      // `fixed` pins it to the viewport (not the document flow).
      // bottom-4 right-4 on desktop; on mobile we widen it to a bottom sheet.
      className={`
        fixed z-50 transition-all duration-700 ease-smooth
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
        bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px]
      `}
      aria-live="polite"
    >
      {open ? (
        /* ============== EXPANDED CARD ============== */
        <div className="relative rounded-2xl bg-warm-cream shadow-wedding-xl border border-wedding-blush overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-wedding-burgundy via-wedding-rose to-wedding-burgundy" />

          {/* Dismiss (collapse) button */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Minimizar transporte"
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-wedding-burgundy hover:bg-wedding-blush/40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-wedding-burgundy flex items-center justify-center shadow-wedding">
                <span className="text-lg" role="img" aria-label="autobús">🚌</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-wedding-rose font-medium">Logística</p>
                <h3 className="font-bodoni text-xl text-wedding-burgundy leading-none">Transporte</h3>
              </div>
            </div>

            {/* ---- SALIDAS ---- */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-wedding-burgundy font-semibold mb-2 flex items-center gap-2">
                <span className="h-px w-4 bg-wedding-rose" /> Salidas al evento
              </p>

              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex justify-between gap-3 border-b border-wedding-blush/50 pb-2">
                  <span>City Express / Banyan</span>
                  <span className="font-medium text-wedding-burgundy whitespace-nowrap tabular-nums">12:30 &amp; 1:30 PM</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Circuito completo (todos los hoteles) <br className="hidden sm:block" /><span className="text-stone-500 text-xs">desde Casa Reyna</span></span>
                  <span className="font-medium text-wedding-burgundy whitespace-nowrap tabular-nums">1:00 PM</span>
                </li>
              </ul>
            </div>

            {/* ---- REGRESOS ---- */}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-wedding-burgundy font-semibold mb-2 flex items-center gap-2">
                <span className="h-px w-4 bg-wedding-rose" /> Regresos
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                A partir de las <span className="font-medium text-wedding-burgundy tabular-nums">10:00 PM</span>, únicamente a los mismos hoteles. Los camiones salen al llenarse o cada hora en punto
                <span className="text-stone-500"> (10, 11, 12&hellip;)</span>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ============== MINIMIZED PILL ============== */
        <button
          onClick={() => setOpen(true)}
          aria-label="Ver horarios de transporte"
          className="ml-auto flex items-center gap-2 rounded-full bg-wedding-burgundy text-warm-cream pl-3 pr-4 py-2.5 shadow-wedding-lg hover:bg-wedding-burgundy-light transition-colors"
        >
          <span className="text-base" role="img" aria-label="autobús">🚌</span>
          <span className="text-xs uppercase tracking-widest font-medium">Transporte</span>
        </button>
      )}
    </div>
  )
}
