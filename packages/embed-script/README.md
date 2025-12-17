# Embed script

Lemnity embed script is built here as a standalone IIFE bundle (`dist/embed.js`) that can be dropped on third‑party sites.

## Commands

- `pnpm --filter @lemnity/embed-script dev` — run Vite dev server (uses client code via path aliases).
- `pnpm --filter @lemnity/embed-script build` — build `dist/embed.js`.
- `pnpm --filter @lemnity/embed-script typecheck` — project references type-check.
- `pnpm --filter @lemnity/embed-script lint` — lint sources.

## Notes

- The embed code reuses client stores/layouts through TS path aliases pointing to `../client/src`.
- Output is a single file with inlined CSS; see `src/embed/index.tsx` for the public API.
