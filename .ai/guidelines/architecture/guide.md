# Architecture

## Entries

| Entry | File | What it is |
|---|---|---|
| `.` | `src/lib/index.ts` | Components and utilities. Svelte, so it carries the `svelte` export condition |
| `./tokens` | `src/lib/tokens.ts` | Pure TypeScript: theme config, presets, emitters. No Svelte |
| `./theme.css` | `dist/theme.css` | Written by `scripts/build-theme.ts`, never by hand |
| `mise-theme` | `bin/mise-theme.js` → `src/lib/tokens/cli.ts` | Node only, so it is not exported from `./tokens` |

SvelteKit 3 is build tooling only. Its config is the argument to `sveltekit()`
in `vite.config.ts`; there is no `svelte.config.js`, no route and no adapter.
`src/app.html` exists only because `svelte-kit sync` wants one.

## Where a file goes

- A component lives in `src/lib/components/<group>/<name>/`, the group chosen
  by `docs/naming.md` §7, with:
  - one `.svelte` file per part (`card.svelte`, `card-header.svelte`, …);
  - an `index.ts` that re-exports the parts under their flat names (`Card`, `CardHeader`);
  - a `<name>.stories.svelte`;
  - a `<name>-variants.ts` when the cva map is worth importing on its own.
- A part's Props type is exported from its `<script module>` block as `<Part>Props`.
- Shared helpers go in `src/lib/utils/`. Token code goes in `src/lib/tokens/`.
  Hand-written CSS goes in `src/lib/styles/components.css`.
- Tests go in `tests/`, named after what they guard. Fixtures that compose
  several parts go in `tests/fixtures/`. Files a test writes go under `.tmp/`.
- Foundation stories (palette, geometry, theming) go in `stories/foundations/`.
  Shared story helpers such as `on-a-card.svelte` stay in `stories/`.

## Adding a component

1. Read the sibling components in its group and, if there is one, the
   shadcn-svelte component of the same name.
2. Take names, values and defaults from `docs/naming.md`. Take the bits-ui
   wiring, snippets and `bind:` from shadcn-svelte.
3. Record anything that departs from a ported module on its `Diverged:` line.

The `authors-components` skill has the full procedure.
