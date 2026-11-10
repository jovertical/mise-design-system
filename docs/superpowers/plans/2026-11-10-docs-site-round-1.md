# Docs site, round 1: the framework and the Button page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A docs site in `site/`, published at the GitHub Pages root with the logistics demo at `/demo/`, with the shell, Getting started, Foundations, and a Button page showing a live preview, a live anatomy and a generated API table.

**Architecture:** `site/` is a SvelteKit 3 workspace package, prerendered by adapter-static, with pages in mdsvex. It consumes the built mise package, as `examples/logistics` does. Three Vite plugins feed it: `virtual:mise-api` serves `componentDocs()` (split out of the skill catalogue), `./examples?examples` turns a page's example folder into components with Shiki-highlighted source, and a remark plugin puts the base path on Markdown links. One workflow builds both apps into one Pages artifact.

**Tech Stack:** Svelte 5, SvelteKit 3 (config in `vite.config.ts`), `@sveltejs/adapter-static` 4, mdsvex 0.12, Shiki 4, Tailwind 4, mise, Vitest 5 with Testing Library, Biome 2.6, headless Chrome for the smoke run.

**Spec:** `docs/specs/2026-11-10-docs-site-design.md`

## Global Constraints

- Branch `docs/site`; one pull request into `main` per phase gate the user approves. Never push to `main`.
- Commit types never move the version: `refactor(skill)`, `docs(site)`, `chore(example)`, `ci`, `docs`. Never `feat` or `fix`.
- Dependencies are installed by the user. Write `package.json`, then ask the user to run `pnpm install`, and wait.
- The site is built only from mise: it imports from `@jovertical/mise-design-system` and adds nothing mise should have. Only docs-specific parts (`Preview`, `Anatomy`, `ApiTable`, `CodeBlock`, the shell's composition) live in `site/src/modules/`.
- Colours come from mise's semantic tokens (`bg-muted`, `text-muted-foreground`, `bg-primary`, `var(--border)`), never palette classes or hex.
- The clean-code guide (`.ai/guidelines/clean-code/guide.md`) holds in `site/`: no abbreviated or single-letter names, `.svelte` ≤ 250 lines, `.ts` ≤ 300 lines, functions ≤ 40 lines, statements separated by blank lines (`pnpm fix:spacing`, then `pnpm format`).
- Example copy is generic operations: locations, shifts, orders, stock.
- Relative imports in `.ts` files end in `.js`.
- Pages URL: `https://jovertical.github.io/mise-design-system/`; base path `/mise-design-system`; demo base `/mise-design-system/demo`.
- Commit only when the gate exits 0: `pnpm test` and `pnpm build:storybook` for mise, plus `pnpm --filter mise-docs test` once `site/` exists. Check exit codes, not output.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Refinements to the spec

Found while planning; the spec is amended in the same commit as this plan.

- `Preview` and `Anatomy` take the example itself, not its name: a page imports `examples from './examples?examples'` and writes `<Preview example={examples.basic} />`. A Vite `import.meta.glob` cannot be called from a shared component with a page-relative path, and a global eager glob would put every example on every page.
- The demo's build has no `index.html` (an SPA with only a `404.html` fallback), so the assemble step copies `demo/404.html` to `demo/index.html`; otherwise `/demo/?p=` would itself miss and loop.
- The site's not-found page is a prerendered `/not-found` route copied to `404.html`, with `paths.relative: false` so its assets load from any depth. `+error.svelte` renders the same component.
- The demo redirect lives in the site's `app.html` (it only acts under `/demo/`), so `404.html` needs no post-processing.

## Phases

| Phase | Tasks | Gate |
| --- | --- | --- |
| A | 1 `componentDocs` split · 2 `site/` scaffold · 3 Vite plugins · 4 the shell · 5 `CodeBlock`, `Preview`, `ApiTable` | Stop. Report, push, open the PR, wait for the user |
| B | 6 `Anatomy` · 7 Getting started and Foundations · 8 the Button page and the page checks · 9 Pages deploy and smoke · 10 docs and links | Stop. Report, wait for the user's review in the browser |

## File map

| Path | Responsibility |
| --- | --- |
| `scripts/skill/component-docs.ts` | `componentDocs(root)`: every component folder's parts, props (readable types), values, types |
| `scripts/skill/catalogue.ts` | renders the skill Markdown from `componentDocs` |
| `scripts/conventions/files.ts` | the clean-code check also reads `site/` |
| `site/package.json`, `vite.config.ts`, `tsconfig.json`, `biome.json`, `mise.theme.js` | the package |
| `site/vite/mise-api.ts` | `virtual:mise-api` |
| `site/vite/examples.ts` | `./examples?examples` modules |
| `site/vite/highlight.ts` | Shiki with the `css-variables` theme, shared by mdsvex and the examples plugin |
| `site/vite/markdown.ts` | remark plugins: base path on links, ids on headings |
| `site/src/app.html`, `app.css`, `mise-theme.css`, `ambient.d.ts` | document, styles, module types |
| `site/src/routes/**` | pages |
| `site/src/modules/shell/` | sidebar, header, search, scheme from URL, on-this-page, not-found |
| `site/src/modules/nav/data/` | pages and sections from the route files' frontmatter |
| `site/src/modules/docs/components/` | `PageLayout` (mdsvex layout), `CodeBlock`, `Preview`, `ApiTable`, `Anatomy` |
| `site/src/modules/docs/data/` | `Example` type, API lookups |
| `site/src/modules/docs/utils/` | anatomy marker layout, anchors |
| `site/scripts/` | assemble Pages, local Pages server, smoke |
| `site/tests/` | unit and component tests, page checks |
| `.github/workflows/pages.yml` | replaces `example.yml` |
| `examples/logistics/src/app.html` | restores a `?p=` deep link |

---

## Phase A

### Task 1: Split `componentDocs` out of the catalogue

**Files:**
- Create: `scripts/skill/component-docs.ts`
- Modify: `scripts/skill/catalogue.ts` (whole file: rendering only)
- Test: `tests/component-docs.test.ts`; `tests/skill.test.ts` unchanged, it guards the split

**Interfaces:**
- Produces:
  ```ts
  export const PACKAGE = '@jovertical/mise-design-system'
  export type PartDoc = { name: string; documented: boolean; summary: string; props: PropDoc[]; alsoTakes: string[] }
  export type NamedType = { name: string; literals: string | null }
  export type FolderDoc = {
    group: string; folder: string; name: string; entry: string
    imports: string[]; parts: PartDoc[]; values: string[]; types: NamedType[]
  }
  export function componentDocs(root: string): FolderDoc[]  // sorted by group, then folder
  ```
  `PropDoc` is the existing type from `scripts/skill/props.ts`; in a `PartDoc` its `type` is already readable (literal aliases spelled out, `SiblingProps['key']` resolved).

- [ ] **Step 1: Write the failing test**

`tests/component-docs.test.ts`:

```ts
// @vitest-environment node
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { componentDocs, PACKAGE } from '../scripts/skill/component-docs.js'
import { componentFolders } from './groups.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docs = componentDocs(root)
const folderNamed = (name: string) => docs.find((doc) => doc.name === name)

describe('componentDocs', () => {
  it('has one entry per component folder, in group then folder order', () => {
    const paths = docs.map((doc) => `${doc.group}/${doc.folder}`)

    expect(paths).toEqual(componentFolders().map(({ path }) => path).toSorted())
  })

  it('puts the root part first and spells literal types out', () => {
    const button = folderNamed('Button')

    expect(button?.entry).toBe(PACKAGE)

    expect(button?.parts[0].name).toBe('Button')

    const variant = button?.parts[0].props.find((prop) => prop.name === 'variant')

    expect(variant?.type).toBe("'solid' | 'soft' | 'outline' | 'ghost' | 'link'")

    expect(variant?.default).toBe("'solid'")
  })

  it('lists every part of a compound component with its defaults', () => {
    const dialog = folderNamed('Dialog')
    const content = dialog?.parts.find((part) => part.name === 'DialogContent')

    expect(dialog?.group).toBe('overlays')

    expect(content?.documented).toBe(true)

    expect(content?.props.find((prop) => prop.name === 'showCloseButton')?.default).toBe('true')
  })

  it('gives a form folder the /form entry', () => {
    expect(docs.filter((doc) => doc.entry === `${PACKAGE}/form`).length).toBeGreaterThan(0)
  })
})
```

Check `componentFolders()` in `tests/groups.ts` returns `{ path }` objects with `group/folder` paths (it does: `tests/skill.test.ts` uses `componentFolders().map(({ path }) => …)`).

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/component-docs.test.ts`
Expected: FAIL, cannot find module `../scripts/skill/component-docs.js`.

- [ ] **Step 3: Create `scripts/skill/component-docs.ts`**

Move `subfolders`, `typeSources`, the old `partDoc` (renamed `rawPart`) and `readableType` here from `catalogue.ts`, unchanged, and add:

```ts
/**
 * What the skill catalogue and the docs site know about each component
 * folder: its entry point, its parts with their props (types made readable),
 * its other runtime exports and its named types. Reads the source; renders
 * nothing.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { literalAliases } from './aliases.js'
import { type ExportDoc, folderExports } from './exports.js'
import { type PropDoc, type PropsDoc, propDefaults, propsDoc } from './props.js'
import { scripts } from './svelte-source.js'

export const PACKAGE = '@jovertical/mise-design-system'

export type PartDoc = {
  name: string
  /** False when the part has no `<Name>Props` type to read. */
  documented: boolean
  summary: string
  props: PropDoc[]
  alsoTakes: string[]
}

export type NamedType = { name: string; literals: string | null }

export type FolderDoc = {
  group: string
  folder: string
  /** The root part's export name, or the folder's when it has no component. */
  name: string
  entry: string
  imports: string[]
  parts: PartDoc[]
  values: string[]
  types: NamedType[]
}

type FolderInput = {
  root: string
  group: string
  folder: string
  formFolders: Set<string>
  aliases: Map<string, string>
}

export function componentDocs(root: string): FolderDoc[] {
  const componentsDir = join(root, 'src', 'lib', 'components')
  const formFolders = formEntryFolders(root)
  const aliases = literalAliases(typeSources(join(root, 'src', 'lib')))

  return subfolders(componentsDir).flatMap((group) =>
    subfolders(join(componentsDir, group)).map((folder) =>
      folderDoc({ root, group, folder, formFolders, aliases }),
    ),
  )
}

function formEntryFolders(root: string) {
  const formEntry = readFileSync(join(root, 'src', 'lib', 'form.ts'), 'utf8')

  return new Set(
    [...formEntry.matchAll(/components\/([\w-]+\/[\w-]+)\/index\.js/g)].map((match) => match[1]),
  )
}

function folderDoc({ root, group, folder, formFolders, aliases }: FolderInput): FolderDoc {
  const folderPath = join(root, 'src', 'lib', 'components', group, folder)
  const entries = folderExports(readFileSync(join(folderPath, 'index.ts'), 'utf8'))
  const components = entries.filter((entry) => entry.component)
  const rootPart = components.find((entry) => entry.from === `./${folder}.svelte`) ?? components[0]
  const values = entries.filter((entry) => !entry.component && !entry.typeOnly)
  const types = entries.filter((entry) => entry.typeOnly && !entry.name.endsWith('Props'))
  const ordered = rootPart ? [rootPart, ...components.filter((part) => part !== rootPart)] : []

  return {
    group,
    folder,
    name: rootPart?.name ?? folder,
    entry: formFolders.has(`${group}/${folder}`) ? `${PACKAGE}/form` : PACKAGE,
    imports: [...components, ...values].map((part) => part.name),
    parts: partDocs(folderPath, ordered, aliases),
    values: values.map((value) => value.name),
    types: types.map((type) => ({ name: type.name, literals: aliases.get(type.name) ?? null })),
  }
}

function partDocs(folderPath: string, ordered: ExportDoc[], aliases: Map<string, string>) {
  const raw = new Map(ordered.map((part) => [part.name, rawPart(folderPath, part)]))

  const siblings = new Map(
    [...raw].filter((pair): pair is [string, PropsDoc & { name: string }] => pair[1] !== null),
  )

  return ordered.map((part): PartDoc => {
    const doc = raw.get(part.name) ?? null

    if (!doc) return { name: part.name, documented: false, summary: '', props: [], alsoTakes: [] }

    return {
      name: part.name,
      documented: true,
      summary: doc.summary,
      alsoTakes: doc.alsoTakes,
      props: doc.props.map((prop) => ({
        ...prop,
        type: readableType(prop.type, aliases, siblings),
      })),
    }
  })
}
```

`rawPart` is the old `partDoc` body exactly. `readableType` is unchanged.

- [ ] **Step 4: Reduce `catalogue.ts` to rendering**

Keep `HEADER`, `skillDir`, `title`, `cell`. Replace `renderFolder`, `renderParts`, `renderPart`, `renderExports` and `catalogue` with:

```ts
import type { FolderDoc, PartDoc } from './component-docs.js'
import { componentDocs } from './component-docs.js'

function renderPart(part: PartDoc, heading: string): string[] {
  const lines = [heading, '']

  if (part.summary) lines.push(part.summary, '')

  if (part.props.length > 0) {
    lines.push('| Prop | Type | Default | Description |', '| --- | --- | --- | --- |')

    for (const prop of part.props) {
      const name = `\`${prop.name}\`${prop.optional ? '' : ' (required)'}`
      const fallback = prop.default === null ? '' : `\`${cell(prop.default)}\``

      lines.push(`| ${name} | \`${cell(prop.type)}\` | ${fallback} | ${cell(prop.description)} |`)
    }

    lines.push('')
  }

  if (part.alsoTakes.length > 0) lines.push(`Also takes: ${part.alsoTakes.join('; ')}.`, '')

  return lines
}

/** Each part's heading and props table, the root part's without its heading. */
function renderParts(parts: PartDoc[]) {
  return parts.flatMap((part, index) => {
    const heading = index === 0 ? '' : `### \`${part.name}\``

    if (!part.documented) return [heading, '']

    const rendered = renderPart(part, heading)

    return index === 0 ? rendered.slice(2) : rendered
  })
}

/** The folder's runtime values and named types, after its parts. */
function renderExports(doc: FolderDoc) {
  const lines: string[] = []

  if (doc.values.length > 0) {
    lines.push(`Also exports: ${doc.values.map((value) => `\`${value}\``).join(', ')}.`, '')
  }

  if (doc.types.length > 0) {
    const named = doc.types.map((type) =>
      type.literals ? `\`${type.name}\` (\`${type.literals}\`)` : `\`${type.name}\``,
    )

    lines.push(`Types: ${named.join(', ')}.`, '')
  }

  return lines
}

function renderFolder(doc: FolderDoc) {
  const lines = [`## ${doc.name}`, '']

  if (doc.imports.length > 0) {
    lines.push(`\`import { ${doc.imports.join(', ')} } from '${doc.entry}'\``, '')
  }

  lines.push(...renderParts(doc.parts), ...renderExports(doc))

  return lines
}

export function catalogue(root: string): Map<string, string> {
  const files = new Map<string, string[]>()

  for (const doc of componentDocs(root)) {
    const lines = files.get(doc.group) ?? [HEADER, '', `# ${title(doc.group)}`, '']

    lines.push(...renderFolder(doc))

    files.set(doc.group, lines)
  }

  return new Map(
    [...files].map(([group, lines]) => [
      group,
      `${lines
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trimEnd()}\n`,
    ]),
  )
}
```

Drop the imports `catalogue.ts` no longer uses (`existsSync`, `readdirSync`, `readFileSync`, `literalAliases`, `folderExports`, `propsDoc`, `propDefaults`, `scripts`); keep `join` for `skillDir`.

- [ ] **Step 5: Run the tests**

Run: `pnpm vitest run tests/component-docs.test.ts tests/skill.test.ts tests/skill-props.test.ts`
Expected: PASS. `skill.test.ts` passing proves the catalogue is byte-identical. If it fails, diff `pnpm build:skill`'s output (`git diff skills/`) to find the drift and fix the renderer, never the committed files.

- [ ] **Step 6: Gate and commit**

```bash
pnpm fix:spacing && pnpm format
pnpm test > /tmp/mise-gate.log 2>&1; g=$?
pnpm build:storybook > /tmp/mise-sb.log 2>&1; s=$?
git status --short   # only scripts/skill/*, tests/component-docs.test.ts
[ $g -eq 0 ] && [ $s -eq 0 ] && git add scripts/skill tests/component-docs.test.ts && git commit -m "refactor(skill): split componentDocs from the catalogue renderer

The docs site needs the catalogue's data, not its Markdown. componentDocs
reads every folder's parts, props with readable types, values and types;
catalogue renders the skill from it, byte-identical (tests/skill.test.ts).

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Scaffold `site/`

**Files:**
- Create: `site/package.json`, `site/vite.config.ts`, `site/tsconfig.json`, `site/biome.json`, `site/mise.theme.js`, `site/src/app.html`, `site/src/app.css`, `site/src/ambient.d.ts`, `site/src/routes/+layout.ts`, `site/src/routes/+layout.svelte` (minimal, replaced in Task 4), `site/src/routes/+page.md` (placeholder home, rewritten in Task 7), `site/tests/setup.ts`, `site/tests/markdown-pages.test.ts`
- Modify: `pnpm-workspace.yaml`, root `package.json` (scripts), `scripts/conventions/files.ts`, `biome.json` (root ignores `site/` like `examples/` if it does; check), `.gitignore` (`site/build`, `site/.svelte-kit`, `site/.smoke`)

**Interfaces:**
- Produces: package `mise-docs`; `#modules/*` → `site/src/modules/*`; `pnpm dev:site`; `BASE_PATH` env read in `site/vite.config.ts`.

- [ ] **Step 1: Workspace and package**

`pnpm-workspace.yaml` `packages:` becomes `['examples/*', 'site']`.

`site/package.json`, versions copied from `examples/logistics/package.json` where shared:

```json
{
  "name": "mise-docs",
  "private": true,
  "type": "module",
  "imports": {
    "#modules/*": "./src/modules/*"
  },
  "scripts": {
    "dev": "vite dev --port 5190",
    "build": "vite build",
    "theme": "mise-theme mise.theme.js -o src/mise-theme.css",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --fail-on-warnings",
    "lint": "biome check .",
    "test:unit": "vitest run",
    "test": "pnpm check && pnpm lint && pnpm test:unit",
    "assemble": "tsx scripts/assemble-pages.ts",
    "smoke": "tsx scripts/smoke.ts"
  },
  "dependencies": {
    "@jovertical/mise-design-system": "workspace:*",
    "@tabler/icons-svelte-runes": "^3.51.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.6.6",
    "@sveltejs/adapter-static": "^4.0.1",
    "@sveltejs/kit": "^3.1.1",
    "@sveltejs/vite-plugin-svelte": "^7.3.1",
    "@tailwindcss/vite": "^4.3.5",
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/svelte": "^5.4.2",
    "@testing-library/user-event": "^14.6.8",
    "@types/node": "^26.6.6",
    "jsdom": "^31.0.0",
    "mdsvex": "^0.12.8",
    "shiki": "^4.6.0",
    "svelte": "^5.57.3",
    "svelte-check": "^4.7.8",
    "tailwindcss": "^4.3.5",
    "tsx": "^4.23.15",
    "tw-animate-css": "^1.4.0",
    "typescript": "^6.0.3",
    "vite": "^8.3.6",
    "vitest": "^5.1.0"
  }
}
```

- [ ] **Step 2: Ask the user to install**

Say: "`site/package.json` is written. Please run `pnpm install` at the repository root." Wait for the user. Then confirm `site/node_modules/mdsvex` and `site/node_modules/shiki` exist.

- [ ] **Step 3: Config files**

`site/vite.config.ts` (plugins from Task 3 are added there; for now mdsvex only):

```ts
import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { mdsvex } from 'mdsvex'
import { defineConfig } from 'vitest/config'

/**
 * Every page is prerendered by adapter-static. BASE_PATH is the repository's
 * Pages path in CI. Paths are absolute so the not-found page, served at any
 * depth as 404.html, still finds its assets. Links into /demo/ belong to the
 * other app, so the prerender crawl does not follow them.
 */
const base = (process.env.BASE_PATH ?? '') as '' | `/${string}`

const markdownOrDependency = (filename: string) =>
  filename.endsWith('.md') || filename.split(/[/\\]/).includes('node_modules')

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      extensions: ['.svelte', '.md'],
      preprocess: [mdsvex({ extensions: ['.md'] })],
      // mdsvex output is legacy-mode Svelte ($$props), so .md files are not forced into runes.
      compilerOptions: { runes: ({ filename }) => (markdownOrDependency(filename) ? undefined : true) },
      adapter: adapter(),
      paths: { base, relative: false },
      prerender: {
        entries: ['*', '/not-found'],
        handleHttpError: ({ path, message }) => {
          if (path.startsWith(`${base}/demo`)) return

          throw new Error(message)
        },
      },
    }),
    svelteTesting(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
  },
})
```

`/not-found` does not exist until Task 4; until then, drop it from `entries` and add it back in Task 4.

`site/tsconfig.json`:

```json
{
  "extends": "$app/tsconfig",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["$app/types", "node", "vitest/globals", "@testing-library/jest-dom/vitest"]
  },
  "include": ["src", "tests", "scripts", "vite", "vite.config.ts"]
}
```

`site/biome.json`:

```json
{
  "$schema": "../node_modules/@biomejs/biome/configuration_schema.json",
  "root": false,
  "extends": "//",
  "files": {
    "includes": ["src/**", "tests/**", "scripts/**", "vite/**", "*.ts", "*.js", "!**/*.css", "!src/app.html", "!**/*.md"]
  }
}
```

`site/mise.theme.js`:

```js
import { defineTheme } from '@jovertical/mise-design-system/tokens'

/** The docs wear mise's own default theme, so what a page shows is what an app gets. */
export default defineTheme({})
```

Check `defineTheme({})` resolves to the default (`src/lib/tokens/config.ts`); if it needs a preset name, use `defaultTheme`'s preset. Then run `pnpm --filter mise-docs theme` to write `site/src/mise-theme.css`.

`site/src/app.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import './mise-theme.css';
@source '../node_modules/@jovertical/mise-design-system/dist';
```

`site/src/app.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>mise</title>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

`site/src/routes/+layout.ts`:

```ts
export const prerender = true
```

`site/src/routes/+layout.svelte` (temporary):

```svelte
<script lang="ts">
  import '../app.css'

  let { children } = $props()
</script>

{@render children()}
```

`site/src/routes/+page.md` (temporary):

```md
---
title: mise
---

# mise

Svelte 5 components for operations dashboards.
```

`site/src/ambient.d.ts`: empty for now except a comment line; Task 3 fills it.

`site/tests/setup.ts`: copy mise's `tests/setup.ts` (the jsdom stubs and `@testing-library/jest-dom/vitest`), with its header saying it is copied from mise's.

- [ ] **Step 4: The repository's scripts and checks**

Root `package.json` scripts, after `dev:example`:

```json
"dev:site": "pnpm build && concurrently -k -n mise,site \"svelte-package --watch\" \"pnpm --filter mise-docs dev\"",
```

`scripts/conventions/files.ts`: add `const SITE_ROOTS = ['site/src', 'site/tests', 'site/scripts', 'site/vite']` and return `[...MISE_ROOTS, ...examples, ...SITE_ROOTS]`; update the header to say "mise's sources, the examples' and the docs site's". `.md` pages are not `.ts`/`.svelte`, so the check skips them.

`.gitignore`: add `site/build`, `site/.svelte-kit`, `site/.smoke` if the existing patterns (`build`, `.svelte-kit`) do not already match nested folders (check with `git check-ignore -v site/build/x`).

- [ ] **Step 5: A test that a Markdown page compiles**

`site/tests/markdown-pages.test.ts`:

```ts
// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { compile } from 'mdsvex'
import { describe, expect, it } from 'vitest'

const routes = join(import.meta.dirname, '..', 'src', 'routes')

describe('the home page', () => {
  it('compiles through mdsvex with its frontmatter as metadata', async () => {
    const source = readFileSync(join(routes, '+page.md'), 'utf8')
    const compiled = await compile(source)

    expect(compiled?.code).toContain('export const metadata')

    expect(compiled?.code).toContain('"title":"mise"')
  })
})
```

- [ ] **Step 6: Run it and build**

Run: `pnpm --filter mise-docs test && pnpm --filter mise-docs build`
Expected: PASS, and `site/build/index.html` contains `Svelte 5 components for operations dashboards`. If svelte-check fails on `.md` imports, that is expected only from Task 3 on; at this step it should pass.

- [ ] **Step 7: Gate and commit**

```bash
pnpm fix:spacing && pnpm format
pnpm test > /tmp/mise-gate.log 2>&1; g=$?
pnpm build:storybook > /tmp/mise-sb.log 2>&1; s=$?
pnpm --filter mise-docs test > /tmp/site-gate.log 2>&1; d=$?
git status --short
[ $g -eq 0 ] && [ $s -eq 0 ] && [ $d -eq 0 ] && git add site pnpm-workspace.yaml pnpm-lock.yaml package.json scripts/conventions/files.ts .gitignore && git commit -m "docs(site): scaffold the docs site package

SvelteKit 3 with adapter-static and mdsvex, prerendered, on mise's default
theme, consuming the built package like the logistics example. The
clean-code check reads site/ too.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The Vite plugins: API data, examples, highlighting, Markdown

**Files:**
- Create: `site/vite/mise-api.ts`, `site/vite/examples.ts`, `site/vite/highlight.ts`, `site/vite/markdown.ts`
- Modify: `site/vite.config.ts`, `site/src/ambient.d.ts`
- Create: `site/src/modules/docs/data/example.ts`
- Test: `site/tests/vite-plugins.test.ts`

**Interfaces:**
- Consumes: `componentDocs(root): FolderDoc[]` from `scripts/skill/component-docs.ts` (Task 1).
- Produces:
  - `import docs from 'virtual:mise-api'` → `FolderDoc[]`
  - `import examples from './examples?examples'` → `Record<string, Example>`, keyed by file name without `.svelte`
  - `export type Example = { component: Component; source: string; html: string }` in `#modules/docs/data/example.js`
  - `highlightCode(code: string, language: string): Promise<string>` in `site/vite/highlight.ts` (Shiki HTML, `css-variables` theme)
  - `exampleModuleSource(entries: ExampleEntry[]): string`, `ExampleEntry = { name: string; path: string; source: string; html: string }`
  - `baseLinks(base: string)` and `headingIds()`: remark attachers
  - `slugOf(text: string): string` in `site/vite/markdown.ts`, reused by the rail and `ApiTable` anchors through `#modules/docs/utils/anchors.js` (Task 5 re-exports it there; keep the function pure and dependency-free so the browser can import it)

- [ ] **Step 1: Write the failing tests**

`site/tests/vite-plugins.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { exampleModuleSource } from '../vite/examples.js'
import { highlightCode } from '../vite/highlight.js'
import { baseLinks, headingIds, slugOf } from '../vite/markdown.js'

type MarkdownNode = {
  type: string
  url?: string
  depth?: number
  value?: string
  data?: { hProperties?: Record<string, string> }
  children?: MarkdownNode[]
}

describe('exampleModuleSource', () => {
  it('imports each example and exports it with its source and highlighted html', () => {
    const code = exampleModuleSource([
      { name: 'basic', path: '/abs/basic.svelte', source: '<Button />', html: '<pre>x</pre>' },
    ])

    expect(code).toContain('import example0 from "/abs/basic.svelte"')

    expect(code).toContain('"basic": { component: example0, source: "<Button />", html: "<pre>x</pre>" }')
  })
})

describe('highlightCode', () => {
  it('emits Shiki html coloured by css variables, not fixed colours', async () => {
    const html = await highlightCode("const order = 'OR-2041'", 'ts')

    expect(html).toContain('<pre class="shiki')

    expect(html).toContain('var(--shiki-')

    expect(html).not.toMatch(/color:#[0-9a-f]{3,6}/i)
  })

  it('falls back to plain text for an unknown language', async () => {
    expect(await highlightCode('anything', 'cobol')).toContain('anything')
  })
})

describe('the remark plugins', () => {
  it('puts the base path on root-relative links only', () => {
    const tree: MarkdownNode = {
      type: 'root',
      children: [
        { type: 'link', url: '/getting-started/theming' },
        { type: 'link', url: 'https://github.com' },
        { type: 'link', url: '#anatomy' },
      ],
    }

    baseLinks('/mise-design-system')()(tree)

    expect(tree.children?.map((node) => node.url)).toEqual([
      '/mise-design-system/getting-started/theming',
      'https://github.com',
      '#anatomy',
    ])
  })

  it('gives h2 and h3 an id from their text', () => {
    const heading: MarkdownNode = {
      type: 'heading',
      depth: 2,
      children: [{ type: 'text', value: 'API reference' }],
    }

    headingIds()()({ type: 'root', children: [heading] })

    expect(heading.data?.hProperties?.id).toBe('api-reference')
  })

  it('slugs text the same way everywhere', () => {
    expect(slugOf('With a form & a footer')).toBe('with-a-form-a-footer')
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `pnpm --filter mise-docs vitest run tests/vite-plugins.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: `site/vite/highlight.ts`**

```ts
/**
 * Shiki, once per build, with the css-variables theme: each token is coloured
 * by a `--shiki-*` variable that app.css maps onto mise's semantic tokens, so
 * code follows the theme and dark mode with no colours of its own.
 */
import { createCssVariablesTheme, createHighlighter, type Highlighter } from 'shiki'

const THEME = createCssVariablesTheme({ name: 'mise', variablePrefix: '--shiki-', fontStyle: true })
const LANGUAGES = ['svelte', 'ts', 'js', 'css', 'html', 'json', 'sh']

let highlighter: Promise<Highlighter> | null = null

export async function highlightCode(code: string, language: string): Promise<string> {
  highlighter ??= createHighlighter({ themes: [THEME], langs: LANGUAGES })

  const loaded = await highlighter

  return loaded.codeToHtml(code, {
    lang: LANGUAGES.includes(language) ? language : 'text',
    theme: 'mise',
  })
}
```

If Shiki 4 moved `createCssVariablesTheme` (check `site/node_modules/shiki/dist/*.d.mts`), import it from where it lives (`shiki/core` in earlier majors); the test pins the behaviour.

- [ ] **Step 4: `site/vite/markdown.ts`**

```ts
/**
 * Two remark plugins for the pages. `baseLinks` puts the Pages base path on a
 * Markdown link to a page (`/getting-started/theming`), which mdsvex would
 * otherwise leave pointing at the domain's root. `headingIds` gives h2 and h3
 * the id the "On this page" rail links to.
 */
type MarkdownNode = {
  type: string
  url?: string
  depth?: number
  value?: string
  data?: { hProperties?: Record<string, string> }
  children?: MarkdownNode[]
}

export function slugOf(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function baseLinks(base: string) {
  return () => (tree: MarkdownNode) => visit(tree, (node) => prefixLink(node, base))
}

export function headingIds() {
  return () => (tree: MarkdownNode) => visit(tree, giveId)
}

function prefixLink(node: MarkdownNode, base: string) {
  if (node.type !== 'link' || !node.url?.startsWith('/') || node.url.startsWith('//')) return

  node.url = `${base}${node.url}`
}

function giveId(node: MarkdownNode) {
  if (node.type !== 'heading' || (node.depth !== 2 && node.depth !== 3)) return

  node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: slugOf(textOf(node)) } }
}

function textOf(node: MarkdownNode): string {
  return node.value ?? (node.children ?? []).map(textOf).join('')
}

function visit(node: MarkdownNode, action: (node: MarkdownNode) => void) {
  action(node)

  for (const child of node.children ?? []) visit(child, action)
}
```

- [ ] **Step 5: `site/vite/examples.ts`**

```ts
/**
 * `import examples from './examples?examples'` in a page: every `.svelte` file
 * in that folder, as `{ [name]: { component, source, html } }`. The source is
 * the file itself, so the code a page shows is the code that runs; `html` is
 * it highlighted at build, so no highlighter reaches the browser.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

import type { Plugin } from 'vite'

import { highlightCode } from './highlight.js'

export type ExampleEntry = { name: string; path: string; source: string; html: string }

const QUERY = '?examples'
const PREFIX = '\0examples:'

export function examples(): Plugin {
  return {
    name: 'mise-docs-examples',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!id.endsWith(QUERY) || !importer) return null

      const from = dirname(importer.split('?')[0])

      return `${PREFIX}${resolve(from, id.slice(0, -QUERY.length))}`
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) return null

      const directory = id.slice(PREFIX.length)

      this.addWatchFile(directory)

      const entries = await Promise.all(
        exampleFiles(directory).map(async (file) => {
          const path = join(directory, file)
          const source = readFileSync(path, 'utf8')

          this.addWatchFile(path)

          return { name: file.replace(/\.svelte$/, ''), path, source, html: await highlightCode(source, 'svelte') }
        }),
      )

      return exampleModuleSource(entries)
    },
  }
}

export function exampleModuleSource(entries: ExampleEntry[]): string {
  const imports = entries.map((entry, index) => `import example${index} from ${JSON.stringify(entry.path)}`)

  const fields = entries.map(
    (entry, index) =>
      `  ${JSON.stringify(entry.name)}: { component: example${index}, source: ${JSON.stringify(entry.source)}, html: ${JSON.stringify(entry.html)} },`,
  )

  return [...imports, '', 'export default {', ...fields, '}', ''].join('\n')
}

function exampleFiles(directory: string) {
  return readdirSync(directory)
    .filter((file) => file.endsWith('.svelte'))
    .toSorted()
}
```

- [ ] **Step 6: `site/vite/mise-api.ts`**

```ts
/**
 * `import docs from 'virtual:mise-api'`: componentDocs() over mise's source,
 * the data the skill catalogue renders, so a page's API table cannot drift
 * from the Props types. In dev, a change under src/lib/components reloads it.
 */
import { join } from 'node:path'

import type { Plugin } from 'vite'

import { componentDocs } from '../../scripts/skill/component-docs.js'

const ID = 'virtual:mise-api'
const RESOLVED = `\0${ID}`
const REPOSITORY = join(import.meta.dirname, '..', '..')

export function miseApi(root = REPOSITORY): Plugin {
  const components = join(root, 'src', 'lib', 'components')

  return {
    name: 'mise-docs-api',
    resolveId: (id) => (id === ID ? RESOLVED : null),
    load(id) {
      if (id !== RESOLVED) return null

      return `export default ${JSON.stringify(componentDocs(root))}`
    },
    configureServer(server) {
      server.watcher.add(components)

      server.watcher.on('change', (file) => {
        if (!file.startsWith(components)) return

        const module = server.moduleGraph.getModuleById(RESOLVED)

        if (module) server.reloadModule(module)
      })
    },
  }
}
```

- [ ] **Step 7: Wire them in**

`site/vite.config.ts`: import `examples`, `miseApi`, `baseLinks`, `headingIds`, `highlightCode`, and `escapeSvelte` from `mdsvex`; plugins become `[tailwindcss(), miseApi(), examples(), sveltekit({ … }), svelteTesting()]`; mdsvex becomes:

```ts
mdsvex({
  extensions: ['.md'],
  remarkPlugins: [baseLinks(base), headingIds()],
  highlight: {
    highlighter: async (code, language) =>
      `{@html \`${escapeSvelte(await highlightCode(code, language ?? 'text'))}\`}`,
  },
}),
```

`site/src/modules/docs/data/example.ts`:

```ts
import type { Component } from 'svelte'

/** One file in a page's examples/ folder: the component, its source, and the source highlighted. */
export type Example = { component: Component; source: string; html: string }
```

`site/src/ambient.d.ts`:

```ts
declare module '*?examples' {
  import type { Example } from '#modules/docs/data/example.js'

  const examples: Record<string, Example>

  export default examples
}

declare module 'virtual:mise-api' {
  import type { FolderDoc } from '../../scripts/skill/component-docs.js'

  const docs: FolderDoc[]

  export default docs
}
```

`site/src/app.css`, after the imports, maps Shiki onto the tokens:

```css
/* Shiki's css-variables theme, on mise's semantic tokens. */
:root {
  --shiki-foreground: var(--foreground);
  --shiki-background: transparent;
  --shiki-token-keyword: var(--primary);
  --shiki-token-string: var(--success);
  --shiki-token-string-expression: var(--success);
  --shiki-token-comment: var(--muted-foreground);
  --shiki-token-function: var(--info);
  --shiki-token-constant: var(--warning);
  --shiki-token-parameter: var(--foreground);
  --shiki-token-punctuation: var(--muted-foreground);
  --shiki-token-link: var(--primary);
}

pre.shiki {
  @apply overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-relaxed;
}
```

- [ ] **Step 8: Run the tests**

Run: `pnpm --filter mise-docs test:unit`
Expected: PASS.

- [ ] **Step 9: Prove a fence highlights in a real build**

Add to the temporary `+page.md` a fenced block:

````md
```sh
pnpm add @jovertical/mise-design-system
```
````

Run: `pnpm --filter mise-docs build && grep -c 'class="shiki' site/build/index.html`
Expected: `1` or more. If mdsvex emits the html escaped (`&lt;pre`), the `{@html …}` wrapping is wrong; fix before going on.

- [ ] **Step 10: Gate and commit**

Same gate as Task 2, then:

```bash
git add site && git commit -m "docs(site): API data, examples and highlighting as Vite plugins

virtual:mise-api serves componentDocs; ./examples?examples turns a page's
example folder into components with their source highlighted at build;
remark plugins put the base path on links and ids on headings. Shiki's
css-variables theme maps onto mise's semantic tokens.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The shell

**Files:**
- Create: `site/src/modules/nav/data/navigation.ts` (pure), `site/src/modules/nav/data/pages.ts` (the glob)
- Create: `site/src/modules/shell/components/docs-sidebar.svelte`, `docs-header.svelte`, `search-palette.svelte`, `scheme-from-url.svelte`, `on-this-page.svelte`, `not-found.svelte`
- Create: `site/src/routes/+error.svelte`, `site/src/routes/not-found/+page.svelte`
- Modify: `site/src/routes/+layout.svelte`, `site/vite.config.ts` (add `/not-found` back to `entries`)
- Test: `site/tests/navigation.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type PageMeta = { title: string; description?: string; section?: string; order?: number }
  export type DocsPage = PageMeta & { href: string }          // href without base, e.g. '/components/actions/button'
  export const SECTIONS: string[]                              // sidebar order
  export function docsPages(modules: Record<string, PageMeta>): DocsPage[]
  export function navSections(pages: DocsPage[]): { label: string; items: { label: string; href: string }[] }[]
  ```
  in `#modules/nav/data/navigation.js`; `PAGES: DocsPage[]` in `#modules/nav/data/pages.js`.
- Every `+page.md` has frontmatter `title`, `description`, `section` (one of `SECTIONS`) and `order` (number within the section). Home has `title` and `description` only and stays out of the sidebar.

- [ ] **Step 1: Write the failing test**

`site/tests/navigation.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { docsPages, navSections, SECTIONS } from '../src/modules/nav/data/navigation.js'

const modules = {
  '/src/routes/+page.md': { title: 'mise' },
  '/src/routes/components/actions/button/+page.md': { title: 'Button', section: 'Actions', order: 1 },
  '/src/routes/getting-started/theming/+page.md': { title: 'Theming', section: 'Getting started', order: 2 },
  '/src/routes/getting-started/installation/+page.md': { title: 'Installation', section: 'Getting started', order: 1 },
}

describe('docsPages', () => {
  it('turns route files into hrefs', () => {
    expect(docsPages(modules).map((page) => page.href)).toEqual([
      '/',
      '/components/actions/button',
      '/getting-started/theming',
      '/getting-started/installation',
    ])
  })
})

describe('navSections', () => {
  it('groups pages by section in SECTIONS order, ordered within, without the home page', () => {
    expect(navSections(docsPages(modules))).toEqual([
      {
        label: 'Getting started',
        items: [
          { label: 'Installation', href: '/getting-started/installation' },
          { label: 'Theming', href: '/getting-started/theming' },
        ],
      },
      { label: 'Actions', items: [{ label: 'Button', href: '/components/actions/button' }] },
    ])
  })

  it('starts with the guides, then follows the component groups', () => {
    expect(SECTIONS.slice(0, 3)).toEqual(['Getting started', 'Foundations', 'Typography'])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm --filter mise-docs vitest run tests/navigation.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: `navigation.ts` and `pages.ts`**

`site/src/modules/nav/data/navigation.ts`:

```ts
/**
 * The sidebar and the search palette, from the pages' frontmatter: a page is
 * listed once it exists, so the navigation never links to a page not written.
 * Component groups follow mise's own order (tests/groups.ts in mise).
 */
export type PageMeta = { title: string; description?: string; section?: string; order?: number }
export type DocsPage = PageMeta & { href: string }
export type NavSection = { label: string; items: { label: string; href: string }[] }

export const SECTIONS = [
  'Getting started',
  'Foundations',
  'Typography',
  'Actions',
  'Forms',
  'Navigation',
  'Layout',
  'Overlays',
  'Feedback',
  'Data display',
]

export function docsPages(modules: Record<string, PageMeta>): DocsPage[] {
  return Object.entries(modules).map(([file, meta]) => ({ ...meta, href: hrefOf(file) }))
}

export function navSections(pages: DocsPage[]): NavSection[] {
  return SECTIONS.map((label) => ({
    label,
    items: pages
      .filter((page) => page.section === label)
      .toSorted((first, second) => (first.order ?? 0) - (second.order ?? 0))
      .map((page) => ({ label: page.title, href: page.href })),
  })).filter((section) => section.items.length > 0)
}

function hrefOf(file: string) {
  const path = file.replace(/^\/src\/routes/, '').replace(/\/\+page\.md$/, '')

  return path === '' ? '/' : path
}
```

`site/src/modules/nav/data/pages.ts`:

```ts
import { docsPages, type PageMeta } from './navigation.js'

/** Every page's frontmatter, read at build. */
const modules = import.meta.glob<PageMeta>('/src/routes/**/+page.md', {
  eager: true,
  import: 'metadata',
})

export const PAGES = docsPages(modules)
```

- [ ] **Step 4: Run the test**

Run: `pnpm --filter mise-docs vitest run tests/navigation.test.ts`
Expected: PASS.

- [ ] **Step 5: The shell components**

Activate the `mise` skill (`skills/mise/SKILL.md` in this repository) before writing them. Model each on the logistics example's file of the same job, read first:

- `docs-sidebar.svelte` ← `examples/logistics/src/modules/shell/components/app-sidebar.svelte`: `Sidebar collapsible="icon"`, header row with the `m` square, "mise" and a `Badge variant="outline"` with the package version, `SidebarNav sections={…} current={page.url.pathname}`, sections from `navSections(PAGES)` with each `href` through `resolve()`. The version comes from the root `package.json`, read in `site/vite.config.ts` (`JSON.parse(readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8')).version`) and exposed with `define: { __MISE_VERSION__: JSON.stringify(version) }`, declared in `ambient.d.ts` as `declare const __MISE_VERSION__: string`. The package does not export its `package.json`.
- `docs-header.svelte` ← `app-header.svelte`: `SiteHeader` with `SidebarTrigger`, `SiteHeaderSeparator`, `SearchPalette`, then a row of `Button variant="ghost" size="sm"` links: "Demo" (`href={`${base}/demo/`}` with `base` from `$app/paths`; a plain string, not `resolve()`, since `/demo/` is not a route of this app), "npm" (`https://www.npmjs.com/package/@jovertical/mise-design-system`), "GitHub" (`https://github.com/jovertical/mise-design-system`), then `ThemeToggle`.
- `search-palette.svelte` ← `search-palette.svelte`: `CommandTrigger` and `CommandDialog title="Search" description="Find a page or a component."`, one `CommandGroup` per nav section, each `CommandItem value="{section} {page.title} {page.description}"` going to `resolve(page.href)`.
- `scheme-from-url.svelte`: the example's file, with its header saying it lets the smoke run pick a scheme.
- `on-this-page.svelte`: a `nav` with `Text size="sm" weight="medium"` "On this page" and links to every `h2[id]` and `h3[id]` inside `[data-docs-page]`, read in an `$effect` keyed on `page.url.pathname`; `h3` rows indented (`pl-3`); hidden below `xl` (`hidden xl:block`); sticky (`sticky top-20`). Uses only `text-muted-foreground` / `hover:text-foreground`.
- `not-found.svelte`: `ErrorState status={404} title="No page here" description="That address is not part of the docs. The sidebar lists every page."` with `homeLink` a `Button href={resolve('/')}` "Back to the docs".

`site/src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '../app.css'

  import { SidebarInset, SidebarProvider, ThemeProvider, Toaster } from '@jovertical/mise-design-system'
  import DocsHeader from '#modules/shell/components/docs-header.svelte'
  import DocsSidebar from '#modules/shell/components/docs-sidebar.svelte'
  import OnThisPage from '#modules/shell/components/on-this-page.svelte'
  import SchemeFromUrl from '#modules/shell/components/scheme-from-url.svelte'

  let { children } = $props()
</script>

<ThemeProvider storageKey="mise-docs-theme">
  <SchemeFromUrl />
  <SidebarProvider>
    <DocsSidebar />
    <SidebarInset>
      <DocsHeader />
      <div class="mx-auto flex w-full max-w-content min-w-0 flex-1 gap-10 px-6 py-8">
        <main class="min-w-0 flex-1">{@render children()}</main>
        <OnThisPage />
      </div>
    </SidebarInset>
  </SidebarProvider>
  <Toaster />
</ThemeProvider>
```

`site/src/routes/+error.svelte` and `site/src/routes/not-found/+page.svelte` both render `<NotFound />`.

Add `'/not-found'` back to `prerender.entries` in `site/vite.config.ts`.

- [ ] **Step 6: Check it in the browser**

Run: `pnpm dev:site`, open `http://localhost:5190/`. Expected: sidebar (empty sections hidden; only the home page exists so far, so no sections), header with search, Demo, npm, GitHub, theme toggle; dark mode toggles; ⌘K opens the palette; `/nope` shows the not-found page. Run `pnpm --filter mise-docs build` and check `site/build/not-found.html` exists.

- [ ] **Step 7: Gate and commit**

Same gate as Task 2, then `git add site && git commit -m "docs(site): the shell, from mise's sidebar, header and command palette …"` with a body naming the navigation-from-frontmatter rule and the trailer.

---

### Task 5: `CodeBlock`, `Preview`, `ApiTable` and the page layout

**Files:**
- Create: `site/src/modules/docs/components/code-block.svelte`, `preview.svelte`, `api-table.svelte`, `api-part.svelte`, `page-layout.svelte`, `index.ts`
- Create: `site/src/modules/docs/data/api.ts`, `site/src/modules/docs/utils/anchors.ts`
- Modify: `site/vite.config.ts` (mdsvex `layout`), `site/src/app.css` (prose styles)
- Test: `site/tests/api.test.ts`, `site/tests/docs-components.test.ts`, `site/tests/fixtures/example-basic.svelte`

**Interfaces:**
- Consumes: `Example` (Task 3), `virtual:mise-api` (Task 3), `slugOf` (Task 3), `PageMeta` (Task 4).
- Produces:
  ```ts
  // #modules/docs/data/api.js
  export function folderNamed(name: string, docs?: FolderDoc[]): FolderDoc      // throws `No component named ${name} in mise`
  export function partNamed(name: string, docs?: FolderDoc[]): { folder: FolderDoc; part: PartDoc }  // throws `No part named ${name} in mise`
  // #modules/docs/utils/anchors.js
  export const slugOf: (text: string) => string                                // re-export of site/vite/markdown.ts's
  export function apiAnchor(partName: string): string                         // 'DialogContent' → 'api-dialog-content'
  ```
  Components, all exported from `#modules/docs/components/index.js`:
  - `CodeBlock`: `{ html: string; source: string; class?: string }`
  - `Preview`: `{ example: Example; class?: string }`
  - `ApiTable`: `{ component?: string; part?: string }`, exactly one given
  - `PageLayout`: the mdsvex layout; receives `PageMeta` fields and `children`

- [ ] **Step 1: Write the failing tests**

`site/tests/api.test.ts`:

```ts
// @vitest-environment node
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { componentDocs } from '../../scripts/skill/component-docs.js'
import { folderNamed, partNamed } from '../src/modules/docs/data/api.js'
import { apiAnchor } from '../src/modules/docs/utils/anchors.js'

const docs = componentDocs(join(import.meta.dirname, '..', '..'))

describe('the API lookups', () => {
  it('finds a folder by its root part', () => {
    expect(folderNamed('Dialog', docs).group).toBe('overlays')
  })

  it('finds a part in any folder', () => {
    expect(partNamed('DialogContent', docs).folder.name).toBe('Dialog')
  })

  it('throws on a name mise does not have, so the build fails', () => {
    expect(() => folderNamed('Dialogue', docs)).toThrow('No component named Dialogue in mise')

    expect(() => partNamed('DialogBody', docs)).toThrow('No part named DialogBody in mise')
  })

  it('anchors a part in kebab case', () => {
    expect(apiAnchor('DialogContent')).toBe('api-dialog-content')
  })
})
```

`api.ts` imports `virtual:mise-api` for its default `docs` argument; in this node test the argument is passed, but the import still has to resolve. Give `site/vite.config.ts`'s `test` block the plugin too (it does, since `plugins` apply to Vitest) — `miseApi()` is in `plugins`, so `virtual:mise-api` resolves under Vitest.

`site/tests/fixtures/example-basic.svelte`:

```svelte
<script lang="ts">
  import { Button } from '@jovertical/mise-design-system'
</script>

<Button>Open shift</Button>
```

`site/tests/docs-components.test.ts`:

```ts
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ApiTable from '../src/modules/docs/components/api-table.svelte'
import Preview from '../src/modules/docs/components/preview.svelte'
import ExampleBasic from './fixtures/example-basic.svelte'

const example = {
  component: ExampleBasic,
  source: '<Button>Open shift</Button>',
  html: '<pre class="shiki"><code>&lt;Button&gt;Open shift&lt;/Button&gt;</code></pre>',
}

describe('Preview', () => {
  it('shows the example live, and its source on the Code tab', async () => {
    render(Preview, { example })

    expect(screen.getByRole('button', { name: 'Open shift' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: 'Code' }))

    expect(screen.getByText('<Button>Open shift</Button>')).toBeInTheDocument()
  })
})

describe('ApiTable', () => {
  it("renders every part of a component, each under its anchor", () => {
    const { container } = render(ApiTable, { component: 'Dialog' })

    expect(container.querySelector('#api-dialog-content')).not.toBeNull()

    expect(screen.getAllByText('showCloseButton').length).toBeGreaterThan(0)
  })

  it('renders one part when asked for a part', () => {
    const { container } = render(ApiTable, { part: 'DialogContent' })

    expect(container.querySelectorAll('[data-api-part]')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `pnpm --filter mise-docs vitest run tests/api.test.ts tests/docs-components.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: `api.ts` and `anchors.ts`**

`site/src/modules/docs/data/api.ts`:

```ts
/**
 * Looks components and parts up in mise's API data. A name mise does not
 * have throws, so a page that names one fails the prerender instead of
 * showing an empty table.
 */
import type { FolderDoc, PartDoc } from '../../../../../scripts/skill/component-docs.js'
import allDocs from 'virtual:mise-api'

export function folderNamed(name: string, docs: FolderDoc[] = allDocs): FolderDoc {
  const folder = docs.find((candidate) => candidate.name === name)

  if (!folder) throw new Error(`No component named ${name} in mise`)

  return folder
}

export function partNamed(name: string, docs: FolderDoc[] = allDocs) {
  for (const folder of docs) {
    const part: PartDoc | undefined = folder.parts.find((candidate) => candidate.name === name)

    if (part) return { folder, part }
  }

  throw new Error(`No part named ${name} in mise`)
}
```

`site/src/modules/docs/utils/anchors.ts`:

```ts
import { slugOf } from '../../../../vite/markdown.js'

export { slugOf }

/** The id of a part's API table, which the anatomy legend links to. */
export function apiAnchor(partName: string): string {
  return `api-${partName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`
}
```

- [ ] **Step 4: The components**

`code-block.svelte`: a `div` with `relative`, the `{@html html}` (trusted: highlighted at build from files in this repository), and a copy `Button variant="ghost" size="sm" iconOnly aria-label="Copy code"` in the top right with `IconCopy` (`@tabler/icons-svelte-runes/icons/copy`), whose click does `navigator.clipboard.writeText(source)` then `toast.success('Copied')` (`toast` from mise). Under 60 lines.

`preview.svelte`:

```svelte
<!--
  An example live on a muted stage, and its own source on the Code tab.
-->
<script lang="ts" module>
  import type { Example } from '#modules/docs/data/example.js'

  export type PreviewProps = { example: Example; class?: string }
</script>

<script lang="ts">
  import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@jovertical/mise-design-system'

  import CodeBlock from './code-block.svelte'

  let { example, class: className }: PreviewProps = $props()

  if (!example) throw new Error('Preview: no such example in this page\'s examples/ folder')

  let tab = $state('preview')
</script>

<Card class={['my-6 gap-0 overflow-hidden py-0', className]}>
  <Tabs bind:value={tab}>
    <div class="border-b px-3 py-2">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="preview">
      <div class="bg-muted/40 flex min-h-40 items-center justify-center gap-3 p-8">
        <example.component />
      </div>
    </TabsContent>
    <TabsContent value="code">
      <CodeBlock html={example.html} source={example.source} class="[&_pre]:rounded-none" />
    </TabsContent>
  </Tabs>
</Card>
```

Check `Card`'s `class` accepts an array (Svelte 5 `class` takes clsx values only on elements; if `Card` passes `class` to `cn()` as a string, join it yourself: `class="my-6 gap-0 overflow-hidden py-0 {className ?? ''}"`).

`api-part.svelte`: one part. Props `{ part: PartDoc; heading: boolean }`. When `heading`, an `h3` with `id={apiAnchor(part.name)}` and the name in `code`; the summary as `Text muted`; if `part.props.length`, mise `Table` (`Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`) with Prop (`code`, plus a `Badge variant="outline"` "required" when not `optional`), Type (`code`, `text-muted-foreground`), Default (`code` or empty), Description; then "Also takes: …" as `Text size="sm" muted` if any. The root `div` carries `data-api-part={part.name}` and, when no heading, the `id` itself so every part has its anchor. Undocumented parts (`documented: false`) render only the heading and "Takes no props of its own."

`api-table.svelte`:

```svelte
<script lang="ts" module>
  export type ApiTableProps = { component?: string; part?: string }
</script>

<script lang="ts">
  import { folderNamed, partNamed } from '#modules/docs/data/api.js'

  import ApiPart from './api-part.svelte'

  let { component, part }: ApiTableProps = $props()

  const parts = $derived(
    part ? [partNamed(part).part] : component ? folderNamed(component).parts : [],
  )

  const types = $derived(component ? folderNamed(component).types : [])
</script>

<div class="my-6 flex flex-col gap-8">
  {#each parts as entry (entry.name)}
    <ApiPart part={entry} heading={parts.length > 1 || Boolean(part)} />
  {/each}
  {#if types.length > 0}
    <p class="text-muted-foreground text-sm">
      Types:
      {#each types as type, index (type.name)}
        <code>{type.name}</code>{#if type.literals}&nbsp;(<code>{type.literals}</code>){/if}{index < types.length - 1 ? ', ' : ''}
      {/each}
    </p>
  {/if}
</div>
```

Throw when neither prop is given: `if (!component && !part) throw new Error('ApiTable: give component or part')`.

`page-layout.svelte` (mdsvex layout; legacy-mode parents pass the default slot as `children`):

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'

  import { PageHeader } from '@jovertical/mise-design-system'

  let {
    title,
    description,
    section,
    children,
  }: { title: string; description?: string; section?: string; children: Snippet } = $props()
</script>

<svelte:head><title>{title === 'mise' ? 'mise' : `${title} · mise`}</title></svelte:head>

<article data-docs-page class="docs-prose">
  <PageHeader {title} {description} eyebrow={section} />
  {@render children()}
</article>
```

Register it in `site/vite.config.ts`: `mdsvex({ …, layout: { _: join(import.meta.dirname, 'src/modules/docs/components/page-layout.svelte') } })` (import `join` from `node:path`).

The home page and Getting started pages also go through it; the home page's `PageHeader` shows title "mise" and its description.

`index.ts`:

```ts
export { default as ApiTable } from './api-table.svelte'
export { default as CodeBlock } from './code-block.svelte'
export { default as Preview } from './preview.svelte'
```

Prose styles in `site/src/app.css`, so Markdown elements read like mise text without local components:

```css
.docs-prose > :where(h2) { @apply mt-12 mb-3 scroll-mt-20 text-xl font-semibold; }
.docs-prose > :where(h3) { @apply mt-8 mb-2 scroll-mt-20 text-base font-semibold; }
.docs-prose > :where(p, ul, ol) { @apply my-3 max-w-prose leading-relaxed; }
.docs-prose > :where(ul) { @apply list-disc pl-5; }
.docs-prose > :where(ol) { @apply list-decimal pl-5; }
.docs-prose :where(p, li, td) > code { @apply rounded bg-muted px-1 py-0.5 text-[0.85em]; }
.docs-prose :where(p, li) > a { @apply text-primary underline underline-offset-2; }
.docs-prose > :where(table) { @apply my-4 w-full text-sm; }
.docs-prose > :where(table) :where(th, td) { @apply border-b px-2 py-1.5 text-left; }
```

- [ ] **Step 5: Run the tests**

Run: `pnpm --filter mise-docs test:unit`
Expected: PASS.

- [ ] **Step 6: Gate and commit**

Same gate as Task 2, then `git add site && git commit -m "docs(site): Preview, CodeBlock, ApiTable and the page layout …"` with a body (examples shown as their own source; API tables from componentDocs, a wrong name failing the build) and the trailer.

### Phase A gate

STOP. Report in the phase-gates format: tasks 1–5 and their outcomes, anything that differed from this plan. Ask the user to approve pushing `docs/site` and opening the pull request into `main` ("docs: the docs site, phase A"). Push and open it only on their yes (`git push -u origin docs/site`, `gh pr create --base main --fill`, `gh pr checks --watch`; CI does not yet run the site's checks, which is Task 9). Wait for approval before Phase B.

---

## Phase B

### Task 6: `Anatomy`

**Files:**
- Create: `site/src/modules/docs/utils/anatomy-layout.ts`, `site/src/modules/docs/components/anatomy.svelte`, `anatomy-legend.svelte`
- Modify: `site/src/modules/docs/components/index.ts`
- Test: `site/tests/anatomy-layout.test.ts`, `site/tests/anatomy.test.ts`, `site/tests/fixtures/anatomy-example.svelte`

**Interfaces:**
- Consumes: `Example` (Task 3), `apiAnchor` (Task 5).
- Produces:
  ```ts
  // #modules/docs/utils/anatomy-layout.js
  export type Box = { x: number; y: number; width: number; height: number }
  export type Marker = { index: number; x: number; y: number; lineTo: { x: number; y: number }; box: Box }
  export const MARKER_SIZE = 20
  export const MARKER_GAP = 6
  export function relativeBox(rect: DOMRect | Box, stage: DOMRect | Box): Box
  export function layoutMarkers(stage: Box, boxes: (Box | null)[]): Marker[]   // one per non-null box, index = position in `boxes`
  ```
  `Anatomy` props: `{ example: Example; parts: AnatomyPart[] }`, `AnatomyPart = { slot: string; label: string; part?: string }` (`part` is the export name for the legend's API link).
  DOM contract the smoke run reads: the stage has `data-anatomy-stage` and `data-anatomy-count={parts.length}`; each drawn marker has `data-anatomy-marker`; each part not found has `data-anatomy-missing={slot}`; the hover outline has `data-anatomy-outline`.

- [ ] **Step 1: Write the failing layout test**

`site/tests/anatomy-layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { layoutMarkers, MARKER_GAP, MARKER_SIZE, relativeBox } from '../src/modules/docs/utils/anatomy-layout.js'

const stage = { x: 0, y: 0, width: 600, height: 300 }

describe('relativeBox', () => {
  it('measures a part from the stage corner', () => {
    expect(relativeBox({ x: 150, y: 120, width: 40, height: 20 }, { x: 100, y: 100, width: 600, height: 300 })).toEqual({
      x: 50,
      y: 20,
      width: 40,
      height: 20,
    })
  })
})

describe('layoutMarkers', () => {
  it('puts a part left of centre on the left gutter, right of centre on the right', () => {
    const [left, right] = layoutMarkers(stage, [
      { x: 100, y: 100, width: 80, height: 40 },
      { x: 400, y: 100, width: 80, height: 40 },
    ])

    expect(left.x).toBe(MARKER_GAP)

    expect(left.lineTo).toEqual({ x: 100, y: 120 })

    expect(right.x).toBe(600 - MARKER_GAP - MARKER_SIZE)

    expect(right.lineTo).toEqual({ x: 480, y: 120 })
  })

  it('skips a part that was not found but keeps the others numbered by position', () => {
    const markers = layoutMarkers(stage, [null, { x: 100, y: 100, width: 80, height: 40 }])

    expect(markers.map((marker) => marker.index)).toEqual([1])
  })

  it('pushes markers on one side apart so they never overlap', () => {
    const [first, second] = layoutMarkers(stage, [
      { x: 100, y: 100, width: 80, height: 10 },
      { x: 100, y: 104, width: 80, height: 10 },
    ])

    expect(second.y - first.y).toBeGreaterThanOrEqual(MARKER_SIZE + MARKER_GAP)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm --filter mise-docs vitest run tests/anatomy-layout.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: `anatomy-layout.ts`**

```ts
/**
 * Where an anatomy's numbered markers go: a part left of the stage's centre
 * gets its marker in the left gutter, otherwise the right, level with the
 * part's middle, with a line to the part's near edge. Markers on one side are
 * pushed down so they never overlap. Pure: boxes in, positions out.
 */
export type Box = { x: number; y: number; width: number; height: number }
export type Marker = { index: number; x: number; y: number; lineTo: { x: number; y: number }; box: Box }

export const MARKER_SIZE = 20
export const MARKER_GAP = 6

export function relativeBox(rect: Box, stage: Box): Box {
  return { x: rect.x - stage.x, y: rect.y - stage.y, width: rect.width, height: rect.height }
}

export function layoutMarkers(stage: Box, boxes: (Box | null)[]): Marker[] {
  const placed = boxes.flatMap((box, index) => (box ? [place(stage, box, index)] : []))

  const sides = [
    placed.filter((marker) => marker.x === MARKER_GAP),
    placed.filter((marker) => marker.x !== MARKER_GAP),
  ]

  for (const side of sides) spreadDown(side)

  return placed.toSorted((first, second) => first.index - second.index)
}

function place(stage: Box, box: Box, index: number): Marker {
  const middle = box.y + box.height / 2
  const onLeft = box.x + box.width / 2 < stage.width / 2

  return {
    index,
    box,
    x: onLeft ? MARKER_GAP : stage.width - MARKER_GAP - MARKER_SIZE,
    y: middle - MARKER_SIZE / 2,
    lineTo: { x: onLeft ? box.x : box.x + box.width, y: middle },
  }
}

function spreadDown(side: Marker[]) {
  const byHeight = side.toSorted((first, second) => first.y - second.y)

  byHeight.forEach((marker, position) => {
    const above = byHeight[position - 1]

    if (above && marker.y < above.y + MARKER_SIZE + MARKER_GAP) {
      marker.y = above.y + MARKER_SIZE + MARKER_GAP
    }
  })
}
```

`relativeBox` takes `Box`; a `DOMRect` has `x`, `y`, `width`, `height`, so it passes as one.

- [ ] **Step 4: Run it**

Run: `pnpm --filter mise-docs vitest run tests/anatomy-layout.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing component test**

`site/tests/fixtures/anatomy-example.svelte`:

```svelte
<div data-slot="part-one">One</div>
<div data-slot="part-two">Two</div>
```

`site/tests/anatomy.test.ts`:

```ts
import { fireEvent, render, screen } from '@testing-library/svelte'
import { tick } from 'svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Anatomy from '../src/modules/docs/components/anatomy.svelte'
import AnatomyExample from './fixtures/anatomy-example.svelte'

const RECTS: Record<string, { x: number; y: number; width: number; height: number }> = {
  stage: { x: 0, y: 0, width: 600, height: 300 },
  'part-one': { x: 100, y: 100, width: 80, height: 40 },
  'part-two': { x: 400, y: 100, width: 80, height: 40 },
}

beforeEach(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const key = this.hasAttribute('data-anatomy-stage') ? 'stage' : (this.getAttribute('data-slot') ?? '')
    const rect = RECTS[key] ?? { x: 0, y: 0, width: 0, height: 0 }

    return { ...rect, top: rect.y, left: rect.x, right: rect.x + rect.width, bottom: rect.y + rect.height, toJSON: () => rect } as DOMRect
  })

  vi.spyOn(console, 'error').mockImplementation(() => {})
})

const example = { component: AnatomyExample, source: '', html: '' }

const parts = [
  { slot: 'part-one', label: 'First', part: 'PartOne' },
  { slot: 'part-two', label: 'Second' },
  { slot: 'part-gone', label: 'Gone' },
]

describe('Anatomy', () => {
  it('draws a marker for each part it finds and reports the one it does not', async () => {
    const { container } = render(Anatomy, { example, parts })

    await tick()

    expect(container.querySelectorAll('[data-anatomy-marker]')).toHaveLength(2)

    expect(container.querySelector('[data-anatomy-missing="part-gone"]')).not.toBeNull()

    expect(container.querySelector('[data-anatomy-stage]')?.getAttribute('data-anatomy-count')).toBe('3')
  })

  it('outlines a part while its legend row is hovered', async () => {
    const { container } = render(Anatomy, { example, parts })

    await tick()

    await fireEvent.mouseEnter(screen.getByText('First'))

    const outline = container.querySelector<HTMLElement>('[data-anatomy-outline]')

    expect(outline?.style.left).toBe('100px')

    expect(outline?.style.width).toBe('80px')
  })

  it('links a legend row to its part API table', () => {
    render(Anatomy, { example, parts })

    expect(screen.getByRole('link', { name: 'PartOne' }).getAttribute('href')).toBe('#api-part-one')
  })
})
```

- [ ] **Step 6: Run it to see it fail**

Run: `pnpm --filter mise-docs vitest run tests/anatomy.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 7: `anatomy.svelte` and `anatomy-legend.svelte`**

`anatomy.svelte`:

```svelte
<!--
  The live component on a stage, with a numbered marker and a line to each
  part, found by its data-slot. Hovering or focusing a marker or a legend row
  outlines the part. Redraws on resize and on a theme change. A part not found
  is shown as missing, and the smoke run fails on it.
-->
<script lang="ts" module>
  import type { Example } from '#modules/docs/data/example.js'

  export type AnatomyPart = { slot: string; label: string; part?: string }
  export type AnatomyProps = { example: Example; parts: AnatomyPart[] }
</script>

<script lang="ts">
  import { layoutMarkers, MARKER_SIZE, type Marker, relativeBox } from '#modules/docs/utils/anatomy-layout.js'

  import AnatomyLegend from './anatomy-legend.svelte'

  let { example, parts }: AnatomyProps = $props()

  let stage: HTMLDivElement | null = $state(null)
  let markers: Marker[] = $state([])
  let missing: string[] = $state([])
  let active: number | null = $state(null)

  const outlined = $derived(markers.find((marker) => marker.index === active)?.box ?? null)

  function measure() {
    if (!stage) return

    const frame = stage.getBoundingClientRect()
    const elements = parts.map((part) => stage?.querySelector(`[data-slot="${part.slot}"]`) ?? null)

    markers = layoutMarkers(
      relativeBox(frame, frame),
      elements.map((element) => (element ? relativeBox(element.getBoundingClientRect(), frame) : null)),
    )

    missing = parts.filter((_part, index) => !elements[index]).map((part) => part.slot)

    for (const slot of missing) console.error(`Anatomy: no [data-slot="${slot}"] in the example`)
  }

  $effect(() => {
    if (!stage) return

    measure()

    const resizes = new ResizeObserver(measure)
    const themes = new MutationObserver(measure)

    resizes.observe(stage)

    themes.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      resizes.disconnect()

      themes.disconnect()
    }
  })
</script>

<figure class="bg-card ring-foreground/5 my-6 overflow-hidden rounded-2xl ring-1">
  <div
    bind:this={stage}
    data-anatomy-stage
    data-anatomy-count={parts.length}
    class="bg-muted/40 relative flex min-h-64 items-center justify-center px-16 py-10"
  >
    <example.component />
    <svg class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      {#each markers as marker (marker.index)}
        <line
          x1={marker.x + MARKER_SIZE / 2}
          y1={marker.y + MARKER_SIZE / 2}
          x2={marker.lineTo.x}
          y2={marker.lineTo.y}
          class="stroke-primary"
          stroke-width="1"
        />
      {/each}
    </svg>
    {#each markers as marker (marker.index)}
      <button
        type="button"
        data-anatomy-marker
        aria-label="{marker.index + 1}: {parts[marker.index].label}"
        class="bg-primary text-primary-foreground absolute grid place-items-center rounded-full text-[11px] font-semibold"
        style:left="{marker.x}px"
        style:top="{marker.y}px"
        style:width="{MARKER_SIZE}px"
        style:height="{MARKER_SIZE}px"
        onmouseenter={() => (active = marker.index)}
        onmouseleave={() => (active = null)}
        onfocus={() => (active = marker.index)}
        onblur={() => (active = null)}
      >
        {marker.index + 1}
      </button>
    {/each}
    {#if outlined}
      <div
        data-anatomy-outline
        class="ring-primary pointer-events-none absolute rounded-md ring-2 ring-offset-2 ring-offset-transparent"
        style:left="{outlined.x}px"
        style:top="{outlined.y}px"
        style:width="{outlined.width}px"
        style:height="{outlined.height}px"
      ></div>
    {/if}
    {#each missing as slot (slot)}
      <span data-anatomy-missing={slot} class="sr-only">{slot} not found</span>
    {/each}
  </div>
  <AnatomyLegend {parts} {missing} bind:active />
</figure>
```

`anatomy-legend.svelte`: props `{ parts: AnatomyPart[]; missing: string[]; active: number | null (bindable) }`. A `figcaption` with an `ol` in two columns (`grid gap-1 p-4 sm:grid-cols-2`); each `li` is focusable (`tabindex="0"`) and sets `active` on `mouseenter`/`focus`, clears it on `mouseleave`/`blur`; it shows the number in a `bg-primary text-primary-foreground` circle, the `label`, then, when `part` is given, an `a href="#{apiAnchor(part)}"` with the part name in `code`, and the `slot` in `code` with `text-muted-foreground ml-auto`. A missing slot's row shows `Badge tone="critical" variant="soft"` "not found". The active row gets `bg-muted`.

Add `export { default as Anatomy } from './anatomy.svelte'` to `index.ts`.

- [ ] **Step 8: Run the tests**

Run: `pnpm --filter mise-docs test:unit`
Expected: PASS. If the `mouseEnter` on the label text does not reach the `li`, fire it on `screen.getByText('First').closest('li')`.

- [ ] **Step 9: Gate and commit**

Same gate as Task 2, then `git add site && git commit -m "docs(site): live anatomy, markers drawn over the real component …"` with a body (anchored on data-slot, redraws on resize and theme, missing parts reported) and the trailer.

---

### Task 7: Home, Getting started and Foundations

**Files:**
- Modify: `site/src/routes/+page.md`
- Create: `site/src/routes/getting-started/installation/+page.md`, `getting-started/theming/+page.md`, `getting-started/skill/+page.md`, `foundations/colour/+page.md`, `foundations/typography/+page.md`, `foundations/geometry/+page.md`
- Create: `site/src/modules/docs/components/token-swatches.svelte`, `type-scale.svelte`, `radius-scale.svelte`
- Test: `site/tests/foundations.test.ts`

**Interfaces:**
- Consumes: `PageLayout` (Task 5), `SECTIONS` (Task 4).
- Produces: six routes with frontmatter; three foundation components exported from `#modules/docs/components/index.js`.
  - `TokenSwatches`: `{ tokens: readonly string[] }`, a grid of `div`s each `style:background="var({token})"` with the token name in `code`.
  - `TypeScale`: no props; one row per `Heading` size (`sm`, `md`, `lg`) and `Text` size, each showing the component and its prop.
  - `RadiusScale`: `{ steps: string[] }`, one square per Tailwind radius class token (`rounded-sm` … `rounded-4xl`), from `radiusScale` in mise's tokens.

- [ ] **Step 1: Write the failing test**

`site/tests/foundations.test.ts`:

```ts
import { render } from '@testing-library/svelte'
import { SEMANTIC_TOKENS } from '@jovertical/mise-design-system/tokens'
import { describe, expect, it } from 'vitest'

import TokenSwatches from '../src/modules/docs/components/token-swatches.svelte'

describe('TokenSwatches', () => {
  it('draws every semantic token from its variable', () => {
    const { container } = render(TokenSwatches, { tokens: SEMANTIC_TOKENS })
    const swatches = container.querySelectorAll<HTMLElement>('[data-token]')

    expect(swatches).toHaveLength(SEMANTIC_TOKENS.length)

    expect(swatches[0].style.background).toBe('var(--background)')
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm --filter mise-docs vitest run tests/foundations.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: The three components**

Write them to the interfaces above, each under 80 lines, using only mise tokens for chrome (`ring-foreground/10`, `text-muted-foreground`). `TokenSwatches` puts `data-token={token}` on each swatch. Check what `radiusScale` exports (`src/lib/tokens/geometry.ts`) and draw its keys.

- [ ] **Step 4: Run the test**

Run: `pnpm --filter mise-docs vitest run tests/foundations.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the pages**

Each page opens with frontmatter (`title`, `description`, `section`, `order`) and imports the components it uses in a `<script>`. Content comes from the repository's own docs, rewritten for a reader rather than an agent; link between pages with root-relative Markdown links (`/getting-started/theming`), which `baseLinks` prefixes.

| Page | Frontmatter | Content, from |
| --- | --- | --- |
| `+page.md` | `title: mise`, `description: Svelte 5 components and a Tailwind v4 theme for operations dashboards.` | What mise is (README's opening), the install fence, three links: Installation, Theming, Button; a line pointing at the demo (`/demo/` written as a plain HTML `<a>` with the base: use `<script>import { base } from '$app/paths'</script>` and `<a href="{base}/demo/">`, since `/demo/` is not a route and must not be prefixed twice) |
| `getting-started/installation` | section `Getting started`, order 1 | `skills/mise/setup.md`: Install, What the app imports itself, The stylesheet, SvelteKit, Laravel with Inertia and Svelte, Plain Svelte with Vite, Dark mode |
| `getting-started/theming` | order 2 | `skills/mise/theming.md` and README's theming section: `mise.theme.js`, `defineTheme`, presets, `mise-theme` CLI and `pnpm theme`, `mise-theme info` |
| `getting-started/skill` | order 3 | `skills/mise/SKILL.md`'s purpose and the install line `npx skills add jovertical/mise-design-system --skill mise` |
| `foundations/colour` | section `Foundations`, order 1 | the semantic tokens (`<TokenSwatches tokens={SEMANTIC_TOKENS} />`), tones and what each means (from `src/lib/utils/tone.ts`'s comments), the rule "a component never writes a colour of its own" |
| `foundations/typography` | order 2 | `<TypeScale />`; `Heading` for sections, `PageHeader` for a page's title, `Text` for body copy |
| `foundations/geometry` | order 3 | `<RadiusScale steps={…} />`, spacing and the `max-w-content` cap |

Read each source file before writing its page; copy facts, not wording you have not checked against the code.

- [ ] **Step 6: Check them**

Run: `pnpm --filter mise-docs build` (fails on a broken internal link, through the prerender crawl), then `pnpm dev:site` and read each page in light and dark.

- [ ] **Step 7: Gate and commit**

Same gate as Task 2, then `git add site && git commit -m "docs(site): home, Getting started and Foundations …"` with the trailer.

---

### Task 8: The Button page, and the page checks

**Files:**
- Create: `site/src/routes/components/actions/button/+page.md`
- Create: `site/src/routes/components/actions/button/examples/basic.svelte`, `variants.svelte`, `tones.svelte`, `with-icon.svelte`, `loading.svelte`, `anatomy.svelte`
- Test: `site/tests/pages.test.ts`

**Interfaces:**
- Consumes: `Preview`, `Anatomy`, `ApiTable` (Tasks 5–6); `componentDocs` (Task 1).
- Produces: the page checks every later page is held to.

- [ ] **Step 1: Write the failing page checks**

`site/tests/pages.test.ts`:

```ts
// @vitest-environment node
/**
 * Every component page against mise's source: an ApiTable names a component
 * or part mise has, an Anatomy names data-slot values mise renders, and every
 * example a page uses exists. Runs before a build, so a typo fails here first.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { componentDocs } from '../../scripts/skill/component-docs.js'

const repository = join(import.meta.dirname, '..', '..')
const routes = join(import.meta.dirname, '..', 'src', 'routes')
const docs = componentDocs(repository)

const pageFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) return pageFiles(path)

    return entry.name === '+page.md' ? [path] : []
  })

const sourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) return sourceFiles(path)

    return entry.name.endsWith('.svelte') ? [path] : []
  })

const slots = new Set(
  sourceFiles(join(repository, 'src', 'lib', 'components')).flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/data-slot="([a-z0-9-]+)"/g)].map((match) => match[1]),
  ),
)

const components = new Set(docs.map((doc) => doc.name))
const parts = new Set(docs.flatMap((doc) => doc.parts.map((part) => part.name)))
const pages = pageFiles(routes).map((file) => ({ file, text: readFileSync(file, 'utf8') }))
const relative = (file: string) => file.slice(routes.length)

describe('the component pages', () => {
  it('name only components and parts mise has', () => {
    const unknown = pages.flatMap(({ file, text }) => [
      ...[...text.matchAll(/<ApiTable component="(\w+)"/g)]
        .filter((match) => !components.has(match[1]))
        .map((match) => `${relative(file)}: component ${match[1]}`),
      ...[...text.matchAll(/<ApiTable part="(\w+)"/g)]
        .filter((match) => !parts.has(match[1]))
        .map((match) => `${relative(file)}: part ${match[1]}`),
    ])

    expect(unknown).toEqual([])
  })

  it('anchor anatomy only on data-slot values mise renders', () => {
    const unknown = pages.flatMap(({ file, text }) =>
      [...text.matchAll(/slot: '([a-z0-9-]+)'/g)]
        .filter((match) => !slots.has(match[1]))
        .map((match) => `${relative(file)}: ${match[1]}`),
    )

    expect(unknown).toEqual([])
  })

  it('use only examples that exist', () => {
    // examples.basic, or examples['with-icon'] for a kebab-case file name.
    const missing = pages.flatMap(({ file, text }) =>
      [...text.matchAll(/examples(?:\.([a-zA-Z0-9]+)|\['([a-z0-9-]+)'\])/g)]
        .map((match) => match[1] ?? match[2])
        .filter((name) => !existsSync(join(dirname(file), 'examples', `${name}.svelte`)))
        .map((name) => `${relative(file)}: examples/${name}.svelte`),
    )

    expect(missing).toEqual([])
  })

  it('every component page has an Anatomy and an ApiTable', () => {
    const incomplete = pages
      .filter(({ file }) => file.includes('/components/'))
      .filter(({ text }) => !text.includes('<Anatomy') || !text.includes('<ApiTable'))
      .map(({ file }) => relative(file))

    expect(incomplete).toEqual([])
  })
})
```

Example files are kebab-case like every file in the repository; a page reaches a one-word one as `examples.basic` and any other as `examples['with-icon']`.

- [ ] **Step 2: Write the page and its examples**

Each example imports only from `@jovertical/mise-design-system` and Tabler icons, with operations copy:

- `basic.svelte`: `<Button>Open shift</Button>`
- `variants.svelte`: one `Button` per `variant` (`solid`, `soft`, `outline`, `ghost`, `link`), labels "Save", "Assign", "Export", "Skip", "View order"
- `tones.svelte`: `variant="soft"` with each `tone` (`neutral`, `primary`, `info`, `success`, `warning`, `critical`), labels like "Hold", "Dispatch", "Details", "Mark ready", "Delay", "Cancel order"
- `with-icon.svelte`: a label with `IconTruck` before it, and an `iconOnly` button with `IconDots` and `aria-label="More actions"`
- `loading.svelte`: `<Button loading>Saving stock count</Button>`
- `anatomy.svelte`: a row with `<Button><IconTruck /> Dispatch</Button>` and `<Button loading variant="outline">Saving</Button>`

Check each prop name against `src/lib/components/actions/button/button.svelte` before using it (`loading` arrived in 1.6.0).

`+page.md`:

````md
---
title: Button
description: An action a person takes. One per decision; the page's main one is solid.
section: Actions
order: 1
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'button', label: 'Button', part: 'Button' },
  { slot: 'button-spinner', label: 'Loading spinner' },
]} />

## Examples

### Variants

`solid` is the page's main action, `soft` and `outline` the ones beside it, `ghost` a quiet one in a toolbar, `link` an action that reads as a link.

<Preview example={examples.variants} />

### Tones

`tone` says what the action does to the work: `critical` for something that cannot be taken back.

<Preview example={examples.tones} />

### With an icon

<Preview example={examples['with-icon']} />

An `iconOnly` button needs an `aria-label`.

### Loading

<Preview example={examples.loading} />

## API reference

<ApiTable component="Button" />

## Keyboard

| Key | Does |
| --- | --- |
| `Enter`, `Space` | Runs the action |
| `Tab` | Moves focus to the next control |
````

Take the description from Button's Props JSDoc if it has one (`skills/mise/components/actions.md`); the line above is a fallback to replace with it.

- [ ] **Step 3: Run the checks and build**

Run: `pnpm --filter mise-docs test:unit && pnpm --filter mise-docs build`
Expected: PASS, and `site/build/components/actions/button.html` exists.

- [ ] **Step 4: Look at it**

`pnpm dev:site`, open `/components/actions/button`, light and dark: the anatomy draws two markers, hovering a legend row outlines its part, the Code tab shows the example's file, the API table matches `skills/mise/components/actions.md`'s Button section.

- [ ] **Step 5: Gate and commit**

Same gate as Task 2, then `git add site && git commit -m "docs(site): the Button page, and checks every component page is held to …"` with the trailer.

---

### Task 9: Pages: the demo at `/demo/`, one artifact, the smoke run, CI

**Files:**
- Create: `site/scripts/assemble-pages.ts`, `site/scripts/serve.ts`, `site/scripts/routes.ts`, `site/scripts/smoke.ts`
- Create: `.github/workflows/pages.yml`; delete `.github/workflows/example.yml`
- Modify: `site/src/app.html` (demo redirect), `examples/logistics/src/app.html` (restore), root `package.json` (`build:pages`), `.github/workflows/ci.yml`
- Test: `site/tests/pages-server.test.ts`

**Interfaces:**
- Produces:
  - `pnpm build:pages`: builds mise, the site at `/mise-design-system`, the demo at `/mise-design-system/demo`, and assembles `site/build/`
  - `serve(root: string, port: number, base: string): Promise<Server>` and `resolveRequest(root: string, base: string, url: string): { file: string; status: 200 | 404 }` in `site/scripts/serve.ts`, serving like Pages: the file, `<path>.html`, `<path>/index.html`, else `404.html` with status 404
  - `siteRoutes(build: string): string[]` in `site/scripts/routes.ts`: every page's URL path without base, from the build's `.html` files, excluding `demo/`, `404.html`, `not-found.html`

- [ ] **Step 1: Write the failing server test**

`site/tests/pages-server.test.ts`:

```ts
// @vitest-environment node
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { beforeAll, describe, expect, it } from 'vitest'

import { siteRoutes } from '../scripts/routes.js'
import { resolveRequest } from '../scripts/serve.js'

const BASE = '/mise-design-system'
let root = ''

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'pages-'))

  mkdirSync(join(root, 'components', 'actions'), { recursive: true })

  mkdirSync(join(root, 'demo'), { recursive: true })

  for (const file of ['index.html', '404.html', 'not-found.html', 'components/actions/button.html', 'demo/index.html', 'demo/404.html']) {
    writeFileSync(join(root, file), file)
  }
})

describe('resolveRequest', () => {
  it('serves a page from its .html file, as Pages does', () => {
    expect(resolveRequest(root, BASE, `${BASE}/components/actions/button`)).toEqual({
      file: join(root, 'components/actions/button.html'),
      status: 200,
    })
  })

  it('serves a folder from its index.html', () => {
    expect(resolveRequest(root, BASE, `${BASE}/demo/?p=%2Forders`).file).toBe(join(root, 'demo/index.html'))
  })

  it('serves the root 404.html for anything else, including a demo deep link', () => {
    expect(resolveRequest(root, BASE, `${BASE}/demo/orders/OR-2041`)).toEqual({
      file: join(root, '404.html'),
      status: 404,
    })
  })
})

describe('siteRoutes', () => {
  it('lists the docs pages only', () => {
    expect(siteRoutes(root).toSorted()).toEqual(['/', '/components/actions/button'])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm --filter mise-docs vitest run tests/pages-server.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: `serve.ts` and `routes.ts`**

`site/scripts/serve.ts`: start from `examples/logistics/scripts/serve.ts` (read it), with `resolveRequest` pulled out and exported:

```ts
export function resolveRequest(root: string, base: string, url: string) {
  const pathname = decodeURIComponent(url.split('?')[0].split('#')[0])

  if (!pathname.startsWith(base)) return { file: join(root, '404.html'), status: 404 as const }

  const path = normalize(pathname.slice(base.length) || '/')

  const candidates = [join(root, path), `${join(root, path)}.html`, join(root, path, 'index.html')]
  const found = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile())

  return found ? { file: found, status: 200 as const } : { file: join(root, '404.html'), status: 404 as const }
}
```

and `serve(root, port, base)` writing `resolveRequest`'s file with its status and the content type map from the example's server. Its CLI block serves `site/build` at `/mise-design-system` on `process.argv[2] ?? 5191`.

`site/scripts/routes.ts`:

```ts
/** Every docs page in a build, as a path without the base: from its .html files. */
import { readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const SKIPPED = new Set(['404.html', 'not-found.html'])

export function siteRoutes(build: string): string[] {
  return htmlFiles(build)
    .map((file) => relative(build, file).split(sep).join('/'))
    .filter((file) => !file.startsWith('demo/') && !SKIPPED.has(file))
    .map((file) => (file === 'index.html' ? '/' : `/${file.replace(/(\/index)?\.html$/, '')}`))
}

function htmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) return htmlFiles(path)

    return entry.name.endsWith('.html') ? [path] : []
  })
}
```

- [ ] **Step 4: Run the test**

Run: `pnpm --filter mise-docs vitest run tests/pages-server.test.ts`
Expected: PASS.

- [ ] **Step 5: The redirect and the restore**

`site/src/app.html`, in `<head>` before `%sveltekit.head%`:

```html
<script>
  // GitHub Pages serves this site's 404.html for a demo deep link it has no
  // file for; hand the path to the demo's shell, which puts it back.
  ;(function () {
    var demo = '%sveltekit.assets%/demo/'
    var path = location.pathname
    if (path.indexOf(demo) !== 0 || path === demo) return
    location.replace(demo + '?p=' + encodeURIComponent(path.slice(demo.length - 1) + location.search + location.hash))
  })()
</script>
```

Check `%sveltekit.assets%` renders as the base with `paths.relative: false` (`grep demo/ site/build/index.html`). If it renders a relative path, write the base in at build with Vite's `transformIndexHtml`-free route: replace the placeholder with a literal `__BASE__` and have `assemble-pages.ts` replace it in every `.html` file; prefer `%sveltekit.assets%` if it works.

`examples/logistics/src/app.html`, in `<head>` before `%sveltekit.head%`:

```html
<script>
  // On GitHub Pages the docs site's 404.html sends a deep link here as ?p=;
  // put the path back before SvelteKit reads the URL. Without ?p= it does nothing.
  ;(function () {
    var target = new URLSearchParams(location.search).get('p')
    if (target === null) return
    history.replaceState(null, '', location.pathname.replace(/\/$/, '') + target)
  })()
</script>
```

- [ ] **Step 6: `assemble-pages.ts` and `build:pages`**

`site/scripts/assemble-pages.ts`:

```ts
/**
 * Lays the two builds out as Pages serves them: the docs at the root, the
 * demo under demo/ with its single-page shell also as demo/index.html (its
 * build has only 404.html, and /demo/ itself must load), and the docs'
 * not-found page as the root 404.html, which Pages serves for any miss.
 */
import { copyFileSync, cpSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const site = join(import.meta.dirname, '..', 'build')
const demo = join(import.meta.dirname, '..', '..', 'examples', 'logistics', 'build')

for (const required of [join(site, 'not-found.html'), join(demo, '404.html')]) {
  if (!existsSync(required)) throw new Error(`Missing ${required}; run pnpm build:pages`)
}

rmSync(join(site, 'demo'), { recursive: true, force: true })

cpSync(demo, join(site, 'demo'), { recursive: true })

copyFileSync(join(site, 'demo', '404.html'), join(site, 'demo', 'index.html'))

copyFileSync(join(site, 'not-found.html'), join(site, '404.html'))

console.log('site/build: the docs, demo/ and 404.html')
```

Root `package.json` scripts:

```json
"build:pages": "pnpm build && BASE_PATH=/mise-design-system pnpm --filter mise-docs build && BASE_PATH=/mise-design-system/demo pnpm --filter mise-logistics-example build && pnpm --filter mise-docs assemble",
```

- [ ] **Step 7: The smoke run**

`site/scripts/smoke.ts`: start from `examples/logistics/scripts/smoke.ts` (read it; same Chrome path, flags and `open()`), serving `site/build` at `/mise-design-system` on port 5198, opening:

- every `siteRoutes(build)` route in light and dark (`?scheme=`), failing when `<main>` is empty, the page is SvelteKit's error page, or a page with `data-anatomy-stage` has fewer `data-anatomy-marker` than its `data-anatomy-count` or any `data-anatomy-missing`;
- `/mise-design-system/nope`, which must render `data-slot="error-state"`;
- `/mise-design-system/demo/orders/OR-2041`, which must land on the order (its `<main>` not empty, no `data-slot="error-state"`), proving the redirect and restore.

Keep the verdict functions small and below the run loop; split into `smoke.ts` and `smoke-verdicts.ts` if `smoke.ts` passes 150 lines. Screenshots go to `site/.smoke/`.

- [ ] **Step 8: Run it end to end**

Run: `pnpm build:pages && pnpm --filter mise-docs smoke`
Expected: every line `✓`, "All routes rendered." Then `pnpm --filter mise-logistics-example smoke` still passes (the restore script is inert without `?p=`).

- [ ] **Step 9: The workflows**

`.github/workflows/pages.yml`, from `example.yml` (read it) with:

```yaml
name: Pages

# Builds mise, the docs site and the logistics demo, and publishes them as one
# GitHub Pages site: the docs at /mise-design-system/, the demo at /demo/.

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'skills/**'
      - 'scripts/skill/**'
      - 'site/**'
      - 'examples/**'
      - 'package.json'
      - 'pnpm-lock.yaml'
      - '.github/workflows/pages.yml'
  workflow_dispatch:
```

the same `permissions` and `concurrency`, and the build job's steps: checkout, pnpm, node 24 with pnpm cache, `pnpm install --frozen-lockfile`, `pnpm build:pages`, `actions/upload-pages-artifact@v3` with `path: site/build`; the `deploy` job unchanged. Delete `example.yml` (`git rm`).

`.github/workflows/ci.yml`, after "Example builds":

```yaml
      - name: Site checks
        run: pnpm --filter mise-docs test
      - name: Site builds
        run: pnpm --filter mise-docs build
```

- [ ] **Step 10: Gate and commit, in three commits**

Same gate as Task 2, plus the smoke runs from Step 8. Then:

```bash
git add examples/logistics/src/app.html && git commit -m "chore(example): restore a deep link handed over as ?p= …"   # body + trailer
git add site package.json && git commit -m "docs(site): assemble the docs and the demo as Pages serves them, with a smoke run …"
git rm .github/workflows/example.yml && git add .github/workflows && git commit -m "ci: publish the docs site with the demo at /demo/, and check the site …"
```

---

### Task 10: The written record and the links

**Files:**
- Modify: `CLAUDE.md` then `cp CLAUDE.md AGENTS.md`, `.claude/skills/documents-updates/SKILL.md`, `README.md`, `examples/logistics/README.md`, `docs/handoff.md`, `package.json` (`homepage`), `site/README.md` (create: running, building, adding a page)

- [ ] **Step 1: `CLAUDE.md`**

Add under Rules:

```md
- `site/` is the docs site, published at the Pages root with the demo at
  `/demo/`. Like the example it is built only from mise and consumes the built
  package. A component page is `site/src/routes/components/<group>/<name>/+page.md`
  with its own `examples/`; its API table comes from `componentDocs()`
  (`scripts/skill/component-docs.ts`) and its anatomy from the components'
  `data-slot` values, both checked by `site/tests/pages.test.ts`. Its commits
  are `docs(site)` so they never move mise's version.
```

Under Commands add `pnpm dev:site`, `pnpm build:pages`, `pnpm --filter mise-docs test` / `smoke`. Then `cp CLAUDE.md AGENTS.md`.

- [ ] **Step 2: `documents-updates`**

Add rows to the map:

```md
| A Props type, its JSDoc or a default, for a component with a docs page | nothing by hand: the page's API table reads it; check the page still reads true |
| A new or renamed `data-slot` | the anatomy of that component's docs page, if it has one |
| A new component | a docs page in its group's round (not yet enforced) |
```

- [ ] **Step 3: Links**

- `README.md`: the "See it in an app" line points at `https://jovertical.github.io/mise-design-system/demo/`; add a line before it: "**Docs:** <https://jovertical.github.io/mise-design-system/>".
- `examples/logistics/README.md`: "Live at <https://jovertical.github.io/mise-design-system/demo/>." and its deploying section names `pages.yml` and `pnpm build:pages`.
- `package.json` `homepage`: `https://jovertical.github.io/mise-design-system/`.
- `docs/handoff.md`: a "Where it stands" entry for branch `docs/site` (spec, this plan, round 1 done, rounds 2–3 next), and the demo's URL updated.
- Search for anything else: `rg -n 'jovertical.github.io/mise-design-system/?[)>]' --glob '!node_modules' .`

- [ ] **Step 4: `site/README.md`**

Running (`pnpm dev:site`), building (`pnpm build:pages`, `smoke`), adding a component page (folder, frontmatter, `examples/`, `Preview`, `Anatomy` with slots, `ApiTable`, what `pages.test.ts` checks), and the Shiki-to-token mapping in `app.css`.

- [ ] **Step 5: Gate and commit**

Same gate as Task 2, then:

```bash
git add CLAUDE.md AGENTS.md .claude/skills/documents-updates README.md examples/logistics/README.md docs/handoff.md package.json site/README.md && git commit -m "docs: the docs site's rules, and links to the docs and the demo's new home …"   # body + trailer
```

`homepage` in `package.json` is not a version change; release-please ignores a `docs` commit.

### Phase B gate

STOP. Report in the phase-gates format: tasks 6–10, the smoke output, anything that differed. Push the branch to the open pull request on the user's yes, watch `check`. Ask the user to review in the browser: `pnpm build:pages && node --import tsx site/scripts/serve.ts` then `http://localhost:5191/mise-design-system/`, or `pnpm dev:site`. Merge only on the user's word (`gh pr merge --squash --delete-branch`), then confirm `CI` and `Pages` ran on `main` and the docs load at the Pages URL with the demo at `/demo/`. Round 2 (Dialog, Select, Sonner) gets its own plan after that review.
