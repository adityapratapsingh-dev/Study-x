# AGENTS.md — RankForge

JEE / NEET competitive-exam prep hub. React 19 + TypeScript + Vite + Tailwind CSS v4, with an Express `server.ts` (`@google/genai`) for AI features.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (`tsx server.ts`)
- `npm run build` — production build
- `npx tsc --noEmit` — type check (must stay clean)

## Design system — "Obsidian & Ember"

The theme lives entirely in `src/index.css` under Tailwind v4's `@theme`. **Do not hardcode hex values in components**; use the token-backed utility classes so the palette stays coherent.

Palette (token name → role):

- `slate-*` — warm obsidian surfaces & ink (replaces the old cool slate)
- `amber-*` / `orange-*` / `yellow-*` — "Ember", the signature accent
- `blue-*` / `indigo-*` / `violet-*` / `purple-*` / `fuchsia-*` — "Iris", interactive accent
- `emerald-*` / `teal-*` / `green-*` — "Jade", success
- `rose-*` / `red-*` — "Coral", danger
- `cyan-*` / `sky-*` — "Glacier", info

Typography: `font-display` (Bricolage Grotesque) for headings/wordmarks, body is Instrument Sans, `font-mono` (JetBrains Mono) for data/formulas.

Helper utilities: `edge-ember` (top hairline), `glow-ember` / `glow-iris`, `surface-lift`, `animate-rise`, `no-scrollbar`.

### Gotcha: don't gradient between two families that share a scale

Because several color families are aliased to the same scale, a gradient like `from-blue-600 to-indigo-600` renders as a **flat** color. Use two different scales for visible gradients, e.g. `from-blue-600 to-cyan-500` (iris → glacier) or `from-amber-400 to-rose-500` (ember → coral).
