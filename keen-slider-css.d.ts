/**
 * TYPE DECLARATION FOR CSS SIDE-EFFECT IMPORTS
 *
 * Why this file exists
 * --------------------
 * TypeScript (specifically error ts(2882)) doesn't know what a line like
 *
 *     import 'keen-slider/keen-slider.min.css'
 *
 * means, because a `.css` file has no TypeScript types. Next.js/webpack
 * handles this import perfectly fine at BUILD time — this is ONLY the editor's
 * type-checker complaining. The fix is to declare these modules as "untyped"
 * so the compiler stops worrying about them.
 *
 * Analogy: it's like a forward declaration / extern in C++ — you're telling
 * the compiler "this symbol exists, trust me, the linker (webpack) will
 * resolve it." You're not implementing anything; you're just satisfying the
 * type system.
 *
 * Where to put this file
 * ----------------------
 * Anywhere TypeScript already scans. The safest spot is your project ROOT
 * (next to tsconfig.json / next-env.d.ts), or inside a `types/` folder.
 * Make sure `tsconfig.json`'s "include" covers it — the default Next.js
 * config (`"include": ["**\/*.ts", "**\/*.tsx", ...]`) already does.
 *
 * After adding it you may need to restart the TS server in your editor:
 *   VS Code -> Cmd/Ctrl+Shift+P -> "TypeScript: Restart TS Server"
 */

// Specific declaration for the keen-slider stylesheet:
declare module 'keen-slider/keen-slider.min.css'

// Broad fallback so any future `import './something.css'` is also fine:
declare module '*.css'
