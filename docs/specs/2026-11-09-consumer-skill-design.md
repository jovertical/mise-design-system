# The consumer skill: teaching agents in other apps to use mise

Date: 2026-11-09. Status: implemented 2026-11-09. Differences from this text are noted where they arose; see the plan's spike results for the alias and install-command findings.

## Problem

mise 1.0 is on npm, and the first app to use it is a Laravel, Inertia and
Svelte operations app. An agent working in such an app has no way to know what
mise offers except reading `node_modules`. It writes its own badge, card or
table where mise already has one, or uses a mise component with props it
guessed.

The agent tooling in this repo (`.claude/skills/`, `.ai/guidelines/`,
`CLAUDE.md`) is for working *on* mise. Nothing is written for an agent working
*with* it.

## Goal

An agent in a consuming app:

1. reaches for a mise component before writing UI of its own;
2. picks the right one among near neighbours (StatTile, MetricRow, MetricGrid);
3. uses real props, values and defaults, for the version the app has installed;
4. can set mise up in a new app, theme it, and compose a whole screen from it.

## Decisions

| # | Decision | Ruling |
| --- | --- | --- |
| C1 | Audience | Agents in consuming apps. The repo's contributor tooling changes only to keep the new skill current |
| C2 | Distribution | The skill lives in `skills/mise/` in this repo. Apps install it with the `skills` CLI (`npx skills add jovertical/mise-design-system --skill mise`, tracked in `skills-lock.json`), as the client portal installs shadcn's. The same folder ships in the npm tarball |
| C3 | Structure | A short hand-written `SKILL.md` with reference files read on demand (approach A). Not one large file, not an MCP server |
| C4 | Catalogue | Generated from each component's exported Props type and JSDoc, one file per group, with a test that fails when it is stale |
| C5 | Coverage | Rules, the component index, setup per stack, theming, composition recipes, and live project context |
| C6 | Live context | A new read-only `mise-theme info --json` subcommand, run by `SKILL.md` on load |
| C7 | Version | When the installed skill and `node_modules/@jovertical/mise-design-system/skills/mise/` disagree, the copy in `node_modules` wins: it matches the installed version |

## Layout

```
skills/mise/
  SKILL.md              hand-written, about 150 lines
  setup.md              SvelteKit; Laravel + Inertia + Svelte; plain Vite
  theming.md            presets, brand, radius, fonts, dark mode, mise-theme
  recipes/
    dashboard-page.md   + dashboard-page.svelte
    form.md             + form.svelte
    data-table.md       + data-table.svelte
  components/           generated, one file per group
    actions.md  data-display.md  feedback.md  forms.md
    layout.md  navigation.md  overlays.md  typography.md
```

`package.json` `files` gains `"skills"`. The six contributor skills stay in
`.claude/skills/`; `--skill mise` keeps the `skills` CLI from offering them to
an app. How the CLI discovers skills in a repository is confirmed before the
layout is relied on (plan, first phase).

## SKILL.md

Frontmatter in the format the client portal's skills use: `name: mise`, and a
description that ends "Activates when …; or when the user mentions …",
triggering on Svelte UI work in an app that depends on mise.

The body, in order:

1. **Live context.** `` !`npx --no-install mise-theme info --json` `` (`--no-install`, so a missing install fails instead of fetching an unrelated package of that name). If it fails, mise is
   not installed: follow `setup.md`.
2. **Which copy to trust.** C7, in one paragraph.
3. **Rules.** Use a mise component before writing UI. Reach for `tone`,
   `variant` and `size` before custom classes. Colours come from the semantic
   tokens, never raw palette classes or `dark:` overrides. `class` is for
   layout, not for restyling a component. Copy, money formatting and statuses
   belong to the app.
4. **The index.** About 35 jobs, each mapped to the component that does it,
   with near neighbours told apart ("one KPI with a trend: StatTile; several
   labelled figures in a row: MetricRow; a grid of bars: MetricGrid"). Each
   entry links to its group file in `components/`.
5. **Where to read next.** `setup.md`, `theming.md`, `recipes/`.

## The generated catalogue

`scripts/build-skill.ts`, run as `pnpm build:skill`, writes
`skills/mise/components/<group>.md`. For each component folder, in the order
`docs/naming.md` §7 gives the groups and alphabetically within one:

- the public names, from the folder's `index.ts`: the root part and its parts;
- for each part, its exported `<Part>Props` type, read from the module script
  with the TypeScript compiler:
  - the members declared on it: name, type text, optional or not, and the
    first paragraph of the member's JSDoc;
  - the other operands of an intersection, summarised rather than expanded:
    `HTMLAttributes<HTMLDivElement>` becomes "every `<div>` attribute",
    a bits-ui root becomes "bits-ui `Select.Root` props", another mise part
    becomes "everything `NumberInputField` takes";
- the defaults, from the instance script's `$props()` destructuring;
- the summary, the first paragraph of the JSDoc on the root's Props type.

Each component renders as a heading, an import line with its parts, the
summary, a props table (prop, type, default, description) and an "Also takes"
line. Output is deterministic, so it can be compared byte for byte.

## Recipes

Each recipe is prose in a `.md` file and code in a sibling `.svelte` file. The
`.svelte` files import from `@jovertical/mise-design-system` (and
`/form`), exactly as an app would, and `svelte-check` checks them, so a recipe
that uses a prop or a part that no longer exists fails `pnpm test`.

The package's `exports` point at `dist/`, which does not exist when CI runs
`pnpm test` before `pnpm build`. So `tsconfig.json` maps `@jovertical/mise-design-system` to
`src/lib/index.ts` and `/form` to `src/lib/form.ts` through `paths`, and
includes `skills`. Only type-checking reads `paths`, so the packaged output is
byte-identical. (The first draft used `kit.alias`; `svelte-package` applied it
to a string in a doc comment and changed the output, so it was dropped.)

- **dashboard-page:** Sidebar, PageLayout, PageHeader, a row of StatTiles, a
  Chart and a MetricBar list.
- **form:** Field, inputs, NumberInput, Select and validation messages; with
  `mise/form` in SvelteKit, and with plain bound state in Inertia.
- **data-table:** DataTable with filters, pagination and row actions.

## mise-theme info

A subcommand of the existing CLI in `src/lib/tokens/cli.ts`.
`mise-theme <config> -o <output>` is unchanged. `mise-theme info --json`, run
from an app's root, prints:

| Field | Value |
| --- | --- |
| `version` | the installed mise version, from its own `package.json` |
| `stack` | `sveltekit` if `@sveltejs/kit` is a dependency, else `inertia` if `@inertiajs/svelte` is, else `vite` |
| `svelte`, `tailwind` | the versions declared in the app's `package.json`, or `null` |
| `themeConfig` | the path of `mise.theme.js`, `.mjs` or `.ts` in the app root, or `null` |
| `stylesheet` | the first CSS file that imports mise, or `null`; `node_modules`, `vendor`, `public`, `storage`, `dist`, `build` and dot-folders are skipped, so a Laravel app's compiled assets do not match |
| `form` | whether `formsnap` and `sveltekit-superforms` are both installed |

It reads files and writes nothing. Without `--json` it prints the same facts
as lines. It is named `mise-theme info`, not `mise info`, because a `mise`
binary would clash with the widely used `mise` dev-tools CLI.

## Checks

In `tests/skill.test.ts`, run by `pnpm test`:

1. The generator's output equals the committed `components/*.md`.
2. Every name a component folder's `index.ts` exports appears in the catalogue (utilities
   outside component folders, such as `cn` and the tone maps, are covered in `SKILL.md`'s
   rules), and
   every component folder is named in `SKILL.md`'s index.
3. Every relative link in `skills/mise/**/*.md` resolves to a file.
4. The frontmatter `name` equals the folder name, and the description ends
   with the activation sentence.

`tests/theme-cli.test.ts` gains `info` cases
against fixture apps under `.tmp/`: SvelteKit, Inertia, plain Vite, no theme
config, and mise not installed.

## Upkeep inside mise

- The authors-components and documents-updates skills: run
  `pnpm build:skill` after changing a Props type or its JSDoc, and add a new
  component to `SKILL.md`'s index.
- `CLAUDE.md` and `AGENTS.md` list `skills/mise/` and `pnpm build:skill`.
- The README gains an "AI agents" section with the `skills add` line and the
  path inside the package.
- A change to the skill alone is a `docs(skill)` commit. It cuts no release by
  itself; the next release ships it.

## Out of scope

- An MCP server.
- Hosting Storybook or human-facing guides; a later sub-project if wanted.
- Mirroring the skill into `.cursor/` or `.github/` inside apps: the `skills`
  CLI places it for each agent.
- Installing the skill into the first consuming app; that happens in that
  app's repo.
