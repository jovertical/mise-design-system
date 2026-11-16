# The docs site: component API and live anatomy on GitHub Pages

**Date:** 2026-11-10
**Status:** approved in conversation (anatomy, URL layout, examples, authoring, launch scope, Storybook, architecture, the four design sections, the page wireframe)
**Scope:** a new workspace package `site/`, a documentation site built only from mise and published to GitHub Pages at the repository's root; the logistics demo moves to `/demo/`. Rounds 1 to 3 build the framework and six pilot pages; the remaining components get pages in later rounds with their own plans.

## Goal

Someone deciding whether to use mise, or an app author using it, can read what each component is for, see it live, see its parts named on the real component, copy an example that runs, and read its full API, without opening Storybook or the source. The API cannot drift from the Props types, and the anatomy cannot drift from the markup.

## Findings that started it

- GitHub Pages serves one site per repository, and the logistics demo already occupies its root (`.github/workflows/example.yml`).
- `scripts/skill/catalogue.ts` already reads every component folder's exports, Props types, JSDoc and defaults, and renders the consumer skill's catalogue. The data is there; only its output is Markdown.
- Components mark their parts with `data-slot`: 288 distinct values across 312 component files. They are the anchors an anatomy needs, with no new markup.
- `DialogContent` and `SelectContent` already take `portalProps`, so their content can render inline on a page instead of in a portal.
- The logistics demo is a single-page app (`adapter({ fallback: '404.html' })`). Pages honours only the root `404.html`, so once the demo moves under `/demo/`, reloading one of its deep links would get the site's 404 instead of the demo.

## How other projects do it

| Project | What mise takes from it |
| --- | --- |
| shadcn-svelte | An example is a file; a preview renders it live in a Preview tab and shows its source in a Code tab, highlighted at build. Prose in mdsvex |
| bits-ui, Radix Primitives | The page skeleton: overview, structure, examples, an API table per part, keyboard interactions |
| Material 3, IBM Carbon | Anatomy as numbered callouts over the component with a legend below |
| Mantine | API tables generated from the TypeScript; hovering a part's selector outlines it on the live component |
| Ark UI / Zag.js | Anatomy derived from the parts a component declares (`data-part`, here `data-slot`) |

## Decisions

| # | Decision | Ruling |
| --- | --- | --- |
| D1 | Anatomy | Live: the page renders the real component and draws numbered markers, leader lines and a legend over it, anchored on `data-slot`. No images. Rejected: screenshots annotated at build (an image, no dark mode, a Playwright step for every change) and hand-drawn SVGs (drift, about seventy to draw) |
| D2 | Where it lives | Docs at the Pages root, `https://jovertical.github.io/mise-design-system/`; the demo moves to `/demo/`. Rejected: docs at `/docs/` (secondary to the demo) and a separate repository (no access to the Props types) |
| D3 | Examples | Docs-owned `.svelte` files per page, rendered live and shown as source through `?raw`, so the code shown is the code that runs. Rejected: importing stories (review matrices, not teaching) and embedding Storybook (bolted on, slow) |
| D4 | Authoring | mdsvex: each page is Markdown with `<Preview>`, `<Anatomy>` and `<ApiTable>` inline. Rejected: plain `+page.svelte` (prose in markup) and one data-driven route (no room for prose) |
| D5 | Launch scope | The framework, Getting started, Foundations and six pilot pages, in three rounds; the other components follow group by group. The sidebar lists only written pages; there are no generated stub pages |
| D6 | Storybook | Stays local, the review tool. It is not published |
| D7 | Architecture | A workspace package `site/` that consumes the built mise package, like the logistics example. The catalogue's data step is split out of `scripts/skill/catalogue.ts` and served to the site as a Vite virtual module. Rejected: parsing the committed skill Markdown (fragile, loses part structure) and docs routes inside the package (site dependencies in the package, and the site would stop proving the built package works) |
| D8 | Release | No version moves. Site commits are `docs(site)`, the catalogue split is `refactor(skill)`, the workflow change is `ci`, the demo's base path change is `chore(example)` |

## Structure and routes

```
site/                         workspace package "mise-docs", private
  mise.theme.js               the site's theme (mise's default)
  vite.config.ts              SvelteKit (adapter-static, everything prerendered), mdsvex, Tailwind, the mise-api plugin
  vite/mise-api.ts            the virtual:mise-api plugin
  src/
    routes/
      +layout.svelte          the shell
      +page.md                home: what mise is, the install line, where to go next
      getting-started/
        installation/+page.md
        theming/+page.md      mise.theme.js, mise-theme, the presets
        skill/+page.md        the consumer skill for agents
      foundations/
        colour/+page.md       semantic tokens and tones, as live swatches
        typography/+page.md
        geometry/+page.md     radius and spacing
      components/<group>/<name>/
        +page.md
        examples/*.svelte     the page's examples
    modules/
      docs/components/        Preview, Anatomy, ApiTable, CodeBlock
      docs/utils/
      nav/data/               the sidebar, from the route files
```

- Component URLs mirror the source groups of `docs/naming.md` §7: `/components/overlays/dialog/`.
- Folders follow the logistics example: `src/modules/<module>/{components,data,utils}`, imported through `#modules/*`.
- The site is built only from mise, under the same rule as the example: it adds nothing mise should have. A generic need goes to mise first; something only documentation needs (syntax highlighting, the anatomy overlay) stays in `site/src/modules/docs/`.

## The shell

- mise `Sidebar` with `SidebarNav`: Getting started, Foundations, then one section per component group, listing only pages that exist.
- mise `SiteHeader`: the name and the package version, `CommandTrigger` opening ⌘K search over page titles and component names, links to the demo, npm and GitHub, and `ThemeToggle`.
- A right rail, "On this page", from each page's `h2` and `h3`.
- A not-found page for the site's own missing routes (see Deploy for `/demo/`).

## A component page

Top to bottom, as the wireframe drew it:

1. Breadcrumb (`Components / Overlays`), title, summary from the root part's Props JSDoc, the import line with a copy button.
2. A hero `Preview`.
3. **Anatomy**: the live component with numbered parts and a legend.
4. **Examples**: each a heading, a sentence and a `Preview`.
5. **API reference**: `ApiTable` for every part.
6. **Keyboard**, where the component takes keys, written by hand in the page from bits-ui's behaviour.

The pilot pages are Button, Dialog, Select, DataTable, Sidebar and Sonner: a simple part, a compound overlay, a form control, data, layout, and an imperative API.

## API data

- `scripts/skill/component-docs.ts` exports `componentDocs(root)`: for each component folder `{ group, folder, entry, parts, values, types }`, where `entry` is `@jovertical/mise-design-system` or its `/form` entry and each part is `{ name, summary, props, alsoTakes }`, each prop `{ name, type, default, optional, description }` with its type already readable (literal aliases spelled out, `SiblingProps['key']` resolved).
- `scripts/skill/catalogue.ts` renders the skill's Markdown from `componentDocs`. `tests/skill.test.ts` proves the output is byte-identical to the committed catalogue, which guards the split.
- `site/vite/mise-api.ts` serves `componentDocs(repoRoot)` as `virtual:mise-api` and, in dev, invalidates it when `src/lib/components/**` changes. Nothing generated is committed.
- `<ApiTable component="Dialog" />` renders every part (Prop, Type, Default, Description), the "Also takes" line and the exported types; `<ApiTable part="DialogContent" />` renders one part. Each part's heading is an anchor the anatomy legend links to. An unknown name fails the build.

## Anatomy

```svelte
<Anatomy example={examples.anatomy} parts={[
  { slot: 'dialog-content', label: 'Content' },
  { slot: 'dialog-title', label: 'Title' },
  { slot: 'dialog-close', label: 'Close button' },
]} />
```

- Renders the given example (by convention the page's `examples/anatomy.svelte`) on a framed stage. An overlay's example opens it inline: `open` set and `portalProps={{ disabled: true }}`. A pilot part that cannot render inline is fixed in mise first.
- Finds each `[data-slot="…"]` inside the stage, measures it against the stage with `getBoundingClientRect`, and draws a numbered marker and a leader line for it in an SVG layer. A `ResizeObserver` on the stage, and a theme change, redraw them.
- The legend below the stage lists each number, the part's export name, its `data-slot`, and links to its API table. Hovering or focusing a legend row or a marker outlines that part.
- A slot that is not found shows its marker as missing and logs an error in dev; the build check below fails on it.
- It reads the theme's tokens, so dark mode needs nothing extra.
- A part a dependency renders without a `data-slot` (svelte-sonner's toast) is found by `selector` instead, a CSS selector such as `[data-sonner-toast]`. `site/tests/pages.test.ts` checks slots against mise's source; a selector is checked by the smoke run, which fails when a part is not found. (Amended 2026-11-16, round 2's spike.)
- An overlay's anatomy opens it inline, and the stage is `contain: layout paint`, so a `position: fixed` dialog and its backdrop stay inside the stage instead of covering the page. (Amended 2026-11-16, round 2's spike.)

## Examples and code

- An example is a file in its page's `examples/`, imports only from `@jovertical/mise-design-system` and its `/form` entry, and uses generic operations copy (locations, shifts, orders, stock), as the stories do.
- A page imports its examples with `import examples from './examples?examples'`, a Vite plugin that turns the folder into `{ [name]: { component, source, html } }`, and writes `<Preview example={examples.basic} />`. (Amended 2026-11-10 while planning: a shared component cannot call `import.meta.glob` with a page-relative path, and a site-wide eager glob would put every example on every page.)
- `Preview` is a mise `Card` with `Tabs`: Preview (the example, centred on a muted stage) and Code (`CodeBlock`).
- `CodeBlock` is a site component built from mise parts: highlighted source and a copy button (`Button` `iconOnly`, then a `toast`). Highlighting is Shiki at build: mdsvex's highlighter for fenced code, and a small Vite transform for the `?raw` imports, so no Shiki reaches the browser. Shiki's `css-variables` theme maps to mise's semantic tokens in the site's CSS, so there are no palette colours and dark mode follows the theme.
- Prose pages go through an mdsvex layout that adds heading anchors and feeds the "On this page" rail.

## Deploy

- `.github/workflows/example.yml` becomes `pages.yml`. It runs on a push to `main` touching `src/**`, `skills/**`, `scripts/skill/**`, `site/**`, `examples/**`, `package.json`, `pnpm-lock.yaml` or the workflow, and on `workflow_dispatch`.
- Its build job: `pnpm build` (mise); the site with `BASE_PATH=/mise-design-system`; the demo with `BASE_PATH=/mise-design-system/demo`, copied into `site/build/demo/`; one `upload-pages-artifact` of `site/build`; then `deploy-pages`, in the same `pages` concurrency group.
- **The not-found page** is a prerendered `/not-found` route (the same component as `+error.svelte`), copied to the root `404.html` by the assemble step. The site builds with `paths.relative: false`, so that page finds its assets at any depth. (Amended 2026-11-10 while planning.)
- **The demo's shell at `/demo/`.** The demo's build has only a `404.html`, so the assemble step also copies it to `demo/index.html`; without it `/demo/` itself would miss and the redirect below would loop. (Amended 2026-11-10 while planning.)
- **The demo's deep links.** The redirect is a small inline script in the site's `app.html`, so it is in `404.html` with no post-processing. It checks the path: under `/mise-design-system/demo/` it replaces the location with `/mise-design-system/demo/?p=<the rest of the path, query and hash>`; anything else shows the site's not-found page. The demo's `app.html` has a small inline script that, given `?p=`, restores the path with `history.replaceState` before SvelteKit starts. Running the demo locally, without `?p=`, is unchanged.
- Links that move: the README, `docs/handoff.md` and `examples/logistics/README.md` point at the docs and at `/demo/`; `package.json` `homepage` becomes the docs URL.

## Checks

- `site` has `check` (svelte-check), `lint` (Biome), `test:unit` (Vitest) and `test`, mirroring the example.
- Tests: the shape of `componentDocs`; the skill catalogue byte-identical; `Anatomy` in jsdom with stubbed rects (a marker per found slot, a hovered legend row outlining its part, a missing slot reported); `ApiTable` rendering Dialog's parts; and a build-time check that every page's `ApiTable` name exists in `componentDocs` and every `Anatomy` slot exists among the components' `data-slot` values.
- `smoke`: the example's approach reused (headless Chrome `--dump-dom` against a local server that serves `404.html` the way Pages does; no new dependency) over every prerendered route in light and dark, asserting each anatomy draws all its markers and none is missing; plus opening a demo deep link under `/demo/` lands on that page.
- CI's `check` job gains "Site checks" and "Site builds".

## Process

- Branch `docs/site`, a pull request into `main` per round.
- `pnpm dev:site` mirrors `dev:example`: the mise watcher and the site's dev server together.
- New dependencies, installed by the user, all in `site/`: `mdsvex` and `shiki`, plus the toolchain the example already uses (`@sveltejs/kit`, `@sveltejs/adapter-static`, Tailwind, Vitest, Biome, svelte-check).
- `CLAUDE.md` and `AGENTS.md` gain the site's rules (built only from mise, examples are docs-owned, a page per component); the `documents-updates` skill gains "a new component eventually needs its page". Nothing enforces a page per component until every group is written.

## Rounds

| Round | Builds | Review |
| --- | --- | --- |
| 1 | `componentDocs` split; `site/` with the shell, search, theme toggle; `Preview`, `CodeBlock`, `ApiTable`, `Anatomy`; Getting started and Foundations; the Button page; `pages.yml`, the demo at `/demo/` and its deep links | the user, in the browser |
| 2 | Dialog, Select and Sonner pages (overlays inline, portals, an imperative API) | the user |
| 3 | DataTable and Sidebar pages (large compound parts, a page-sized layout) | the user |

Each round starts only on the user's go. Later rounds, one per component group, get their own plans.

## Out of scope

- Publishing Storybook.
- Pages for components outside the six pilots, until their round.
- Versioned docs (one version: what `main` holds).
- A theme playground or editor.
- Full-text search over page bodies; ⌘K searches titles and component names.
