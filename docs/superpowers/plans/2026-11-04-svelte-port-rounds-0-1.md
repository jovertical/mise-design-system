# mise-design-system Rounds 0–1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the `jovertical/mise-design-system` repository (private for now) with a configurable Tailwind v4 theme pipeline, Storybook, tests, CI and AI tooling (round 0), then port the core sample: `Card`, `Button`, `Badge`, `Input`, `Label`, `Checkbox`, `Dialog` (round 1). The work ends at a Storybook review with the user.

**Architecture:** A SvelteKit library project in which SvelteKit is only build tooling. Everything shipped lives in `src/lib`: plain Svelte 5 components (bits-ui underneath), and a pure-TypeScript token pipeline that turns a theme config into one `theme.css`. Component APIs and classes come from the React package. shadcn-svelte supplies the Svelte and bits-ui mechanics only.

**Tech Stack:** Svelte 5.57, SvelteKit 3.1 + `@sveltejs/package` 3, Vite 8, TypeScript 6.0, Tailwind CSS 4.3, bits-ui 2.20, class-variance-authority, tailwind-merge 3, `@lucide/svelte`, Vitest 5 + `@testing-library/svelte` in jsdom, Storybook 10.6 (`@storybook/sveltekit`, `addon-svelte-csf` 5), Biome 2.6, pnpm 12.

**Spec:** `docs/specs/2026-11-04-svelte-port-design.md` (approved 2026-11-04). Read it before starting any task.

## Global Constraints

- **The React package is read-only.** `<react-package>` (the React package 2.23.0) is the reference. Never write to it.
- **shadcn-svelte** is the second reference, for bits-ui wiring only. Clone it once with `git clone --depth 1 https://github.com/huntabyte/shadcn-svelte.git /tmp/shadcn-svelte-ref`. Its components are under `/tmp/shadcn-svelte-ref/docs/src/lib/registry/ui/<name>/`. It is MIT.
- **API parity.** Every prop name, value and default matches the React component. Translate the mechanics using the spec's "Component API translation" table. Classes are copied character for character.
- **No `$app/*` imports** anywhere under `src/lib` (D6).
- **Relative imports in `src/lib` `.ts` files end in `.js`** (`'./tokens/config.js'`, `'../../utils/cn.js'`). `svelte-package` does not rewrite specifiers, and Node ESM (the `mise-theme` CLI) needs the extension. `.svelte` imports keep `.svelte`.
- **Icons:** `@lucide/svelte`, imported per icon: `import CheckIcon from '@lucide/svelte/icons/check'` (D8).
- **No React package palette, fonts or brand.** Story copy describes generic operations: locations, shifts, orders, stock. When porting React story copy, "branch" becomes "location", "Makati" becomes "Riverside", "terminals" become "registers", and any product name or portal is removed.
- **Dependencies are installed by the user.** When a step needs `pnpm install` or `pnpm add`, stop, give the user the exact command, and wait.
- **Publishing is deferred (D10).** `package.json` stays `"private": true`. There is no release-please and no `npm publish`.
- **Commits:** conventional and component-scoped (`feat(button): …`, `feat(tokens): …`, `chore: …`, `test: …`, `docs: …`). End every commit message with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, after a blank line.
- **Push** to `origin main` only at a phase gate, after the user approves the phase. Task 1's initial push is the one exception.
- **Phase gates:** stop after Tasks 5, 9 and 14. Report in the phase-gates format (completed tasks, issues, next phase) and wait for an explicit go.

## File map

| Path | Responsibility | Task |
|---|---|---|
| `.gitignore`, `LICENSE`, `LICENSES/*.txt` | Repository basics and third-party notices | 1, 4 |
| `package.json`, `vite.config.ts` (SvelteKit 3 config lives here), `tsconfig.json`, `biome.json` | Toolchain | 2 |
| `tests/setup.ts`, `tests/toolchain.test.ts`, `tests/fixtures/probe.svelte` | jsdom stubs and the wiring smoke test | 2 |
| `src/lib/utils/cn.ts`, `tone.ts`, `types.ts` | Class merging, the shared `Tone`/`Size` scale, prop helper types | 3 |
| `src/lib/index.ts`, `tests/barrel.test.ts` | Public entry and its shape check | 3, extended in 10–15 |
| `scripts/copy-tailwind-palette.ts`, `src/lib/tokens/tailwind-palette.ts` | Tailwind v4's default ramps as literals | 4 |
| `src/lib/tokens/presets.ts`, `config.ts` | Bases, default theme, presets, `defineTheme`, `resolveTheme` | 4 |
| `src/lib/tokens/semantic.ts`, `geometry.ts`, `emit-web.ts`, `src/lib/tokens.ts` | Semantic contract and the CSS emitter, `/tokens` entry | 5 |
| `src/lib/styles/components.css`, `scripts/build-theme.ts` | Hand-written overrides, `dist/theme.css` writer | 5 |
| `src/lib/tokens/cli.ts`, `bin/mise-theme.js` | Consumer CLI | 6 |
| `.storybook/*`, `stories/*.stories.svelte`, `stories/on-a-card.svelte` | Storybook and foundation stories | 7, 10 |
| `.github/workflows/ci.yml`, `README.md` | CI and consumer docs | 8 |
| `CLAUDE.md`, `AGENTS.md`, `.ai/guidelines/*`, `.claude/skills/*`, `docs/naming.md` | AI tooling | 9 |
| `src/lib/components/<name>/` | One folder per component: parts, `index.ts`, stories | 10–15 |
| `tests/provenance.test.ts`, `tests/<component>.test.ts`, `tests/fixtures/*.svelte` | Structural and behaviour tests | 10–15 |

Each component folder has an `index.ts` that re-exports its parts under their flat names. `src/lib/index.ts` re-exports each folder's `index.js`. The spec's tree omits `index.ts`, but the root entry still stays flat (D5).

---

# Phase A — Round 0: repository, scaffold, tokens (Tasks 1–5)

### Task 1: Repository

**Files:**
- Create: `.gitignore`, `LICENSE`, `LICENSES/shadcn-ui.txt`, `LICENSES/shadcn-svelte.txt`

**Interfaces:**
- Produces: a git repository on `main` with remote `origin` = `github.com/jovertical/mise-design-system` (private until the user makes it public).

- [ ] **Step 1: Initialise git on `main`**

```bash
cd /Volumes/External/Code/mise-design-system
git init -b main
```

- [ ] **Step 2: Write `.gitignore`**

```gitignore
node_modules/
dist/
.svelte-kit/
storybook-static/
*.log
.DS_Store
.env*
!.env.example
```

- [ ] **Step 3: Write `LICENSE` (MIT)**

```text
MIT License

Copyright (c) 2026 Jovert Palonpon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 4: Copy the third-party notices**

The component classes descend from shadcn/ui, and the Svelte mechanics from shadcn-svelte. Both are MIT, and both notices ship with the package.

```bash
mkdir -p LICENSES
test -d /tmp/shadcn-svelte-ref || git clone --depth 1 https://github.com/huntabyte/shadcn-svelte.git /tmp/shadcn-svelte-ref
cp /tmp/shadcn-svelte-ref/LICENSE.md LICENSES/shadcn-svelte.txt
curl -fsSL https://raw.githubusercontent.com/shadcn-ui/ui/main/LICENSE.md -o LICENSES/shadcn-ui.txt
head -3 LICENSES/shadcn-svelte.txt LICENSES/shadcn-ui.txt
```

Expected: both files start with `MIT License`.

- [ ] **Step 5: Commit**

```bash
git add .gitignore LICENSE LICENSES docs
git commit -m "chore: initialise the repository with the spec, the plan and the licence" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Create the private GitHub repository and push**

The user approved creating it with `gh`, private for now (D3).

```bash
gh repo create jovertical/mise-design-system --private --source . --remote origin \
  --description "Svelte 5 components and a configurable Tailwind v4 theme for operations dashboards" --push
gh repo view jovertical/mise-design-system --json visibility,defaultBranchRef --jq '.visibility + " " + .defaultBranchRef.name'
```

Expected: `PRIVATE main`. If `gh repo create` fails, stop and report the error. Do not retry with other flags.

---

### Task 2: Toolchain scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `biome.json`, `tests/setup.ts`, `tests/fixtures/probe.svelte`, `tests/toolchain.test.ts`, `.ai/guidelines/style/guide.md` (the lint decision only; Task 9 completes it)

**Interfaces:**
- Produces: the scripts `pnpm check`, `pnpm lint`, `pnpm test:unit`, `pnpm test`, `pnpm build`, `pnpm build:theme`, `pnpm storybook`, `pnpm build:storybook`. Later tasks run these.

- [ ] **Step 1: Generate a reference scaffold outside the repository**

Several of these majors are newer than this plan's author knows (SvelteKit 3, Vite 8). Generate the official library template, and let its framework wiring win wherever it differs from the files below.

```bash
cd /tmp && rm -rf mise-scaffold
npx sv@latest create mise-scaffold --template library --types ts --no-add-ons --no-install
ls /tmp/mise-scaffold
```

If the CLI prompts despite the flags, choose: library template, TypeScript, no add-ons, no install. Read its `svelte.config.js`, `vite.config.ts`, `tsconfig.json` and `package.json`.

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "@jovertical/mise-design-system",
  "version": "0.0.0",
  "private": true,
  "description": "Svelte 5 components and a configurable Tailwind v4 theme for operations dashboards",
  "license": "MIT",
  "type": "module",
  "packageManager": "pnpm@12.3.4",
  "sideEffects": ["**/*.css"],
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
    "./tokens": { "types": "./dist/tokens.d.ts", "default": "./dist/tokens.js" },
    "./theme.css": "./dist/theme.css"
  },
  "bin": { "mise-theme": "./bin/mise-theme.js" },
  "files": ["dist", "bin", "LICENSES", "!dist/**/*.stories.svelte", "!dist/**/*.stories.svelte.d.ts"],
  "repository": { "type": "git", "url": "https://github.com/jovertical/mise-design-system.git" },
  "scripts": {
    "prepare": "svelte-kit sync || echo ''",
    "build": "svelte-kit sync && svelte-package && pnpm build:theme && publint",
    "build:theme": "tsx scripts/build-theme.ts",
    "storybook": "pnpm build:theme && storybook dev -p 6006",
    "build:storybook": "pnpm build:theme && storybook build",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --fail-on-warnings",
    "lint": "biome check .",
    "format": "biome format --write .",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test": "pnpm check && pnpm lint && pnpm test:unit"
  },
  "peerDependencies": {
    "svelte": "^5.0.0",
    "tailwindcss": "^4.1.0",
    "tw-animate-css": "^1.0.0"
  },
  "dependencies": {
    "@internationalized/date": "^3.12.4",
    "@lucide/svelte": "^1.67.0",
    "bits-ui": "^2.20.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.7.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.6.4",
    "@storybook/addon-a11y": "^10.6.5",
    "@storybook/addon-docs": "^10.6.5",
    "@storybook/addon-svelte-csf": "^5.1.6",
    "@storybook/svelte": "^10.6.5",
    "@storybook/sveltekit": "^10.6.5",
    "@sveltejs/kit": "^3.1.1",
    "@sveltejs/package": "^3.0.2",
    "@sveltejs/vite-plugin-svelte": "^7.3.1",
    "@tailwindcss/cli": "^4.3.4",
    "@tailwindcss/vite": "^4.3.4",
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/svelte": "^5.4.2",
    "@testing-library/user-event": "^14.6.8",
    "@types/node": "^24.19.2",
    "jsdom": "^30.1.3",
    "publint": "^0.3.25",
    "storybook": "^10.6.5",
    "svelte": "^5.57.3",
    "svelte-check": "^4.7.8",
    "tailwindcss": "^4.3.4",
    "tsx": "^4.23.15",
    "tw-animate-css": "^1.4.0",
    "typescript": "~6.0.3",
    "vite": "^8.3.5",
    "vitest": "^5.1.0"
  }
}
```

TypeScript is pinned to `~6.0`. SvelteKit 3, `@sveltejs/package` 3 and `svelte-check` 4 all peer on `^6.0.0`, so TypeScript 7 is out for now. `@internationalized/date` is a peer of bits-ui. It is listed as a dependency so that strict installs resolve it.

- [ ] **Step 3: SvelteKit 3 has no `svelte.config.js`**

The scaffold from Step 1 shows that SvelteKit 3 takes its config as the
argument to `sveltekit()` in `vite.config.ts`, and that the tsconfig extends
`$app/tsconfig`. So there is no `svelte.config.js`, and no adapter, since
nothing is deployed. `@sveltejs/package` 3 reads the same config through
`@sveltejs/load-config`. (Amended 2026-11-04, after the scaffold was generated.)

- [ ] **Step 4: Write `vite.config.ts`**

```ts
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config'

/**
 * SvelteKit 3 takes its config here; there is no svelte.config.js. It is
 * build tooling only: `svelte-package` builds `src/lib`, and Storybook reads
 * this file. There are no routes and no adapter, because nothing is deployed.
 */
export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Runes everywhere except dependencies. Can go in Svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
      },
    }),
    svelteTesting(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
})
```

- [ ] **Step 5: Write `tsconfig.json` and `src/app.html`**

```json
{
  "extends": "$app/tsconfig",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["$app/types", "node", "vitest/globals", "@testing-library/jest-dom/vitest"]
  },
  "include": ["src", "tests", "scripts", "stories", ".storybook", "vite.config.ts"]
}
```

SvelteKit generates `$app/tsconfig` with `moduleResolution: bundler`. The
`NodeNext` override is what makes an extensionless relative import an error;
a probe confirmed it on 2026-11-04. `types` must keep `$app/types`, or
`svelte-kit sync` warns. Under `NodeNext`, import user-event by name:
`import { userEvent } from '@testing-library/user-event'`.

`svelte-kit sync` also warns without an app template, so add a minimal
`src/app.html` (the scaffold's, minus the favicon) and a placeholder
`src/lib/index.ts` (`export {}`), which Task 3 replaces.

- [ ] **Step 6: Write `tests/setup.ts`**

Copied from the React package's `tests/setup.ts`, with the jest-dom matchers added. bits-ui, like Radix, reads these APIs when it positions floating content.

```ts
import '@testing-library/jest-dom/vitest'

/**
 * Browser APIs jsdom does not implement, stubbed so component tests can run.
 * Deliberately inert: nothing asserts on them. They exist so the components
 * under test get far enough to be asserted on.
 *
 * Copied from the React package 2.23.0 tests/setup.ts.
 */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

class DOMRectStub {
  x = 0
  y = 0
  width = 0
  height = 0
  top = 0
  left = 0
  right = 0
  bottom = 0
  toJSON() {
    return this
  }
}

globalThis.DOMRect ??= DOMRectStub as unknown as typeof DOMRect

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}
```

- [ ] **Step 7: Write the wiring smoke test**

`tests/fixtures/probe.svelte`:

```svelte
<script lang="ts">
  let { label = 'probe' }: { label?: string } = $props()
  let count = $state(0)
</script>

<button type="button" onclick={() => count++}>{label}: {count}</button>
```

`tests/toolchain.test.ts`:

```ts
import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import Probe from './fixtures/probe.svelte'

/**
 * Proves the Svelte compiler, jsdom, Testing Library and jest-dom are wired
 * together. Every other component test depends on this chain.
 */
describe('toolchain', () => {
  it('renders a Svelte 5 component and reacts to an event', async () => {
    render(Probe, { props: { label: 'Orders' } })
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('Orders: 1')
  })
})
```

- [ ] **Step 8: Ask the user to install dependencies**

Stop and tell the user:

> Please run `pnpm install` in `/Volumes/External/Code/mise-design-system` and tell me when it's done.

Wait for confirmation.

- [ ] **Step 9: Run the smoke test**

Run: `pnpm test:unit`
Expected: PASS, 1 test.

- [ ] **Step 10: Decide how `.svelte` files are linted and formatted**

Write `biome.json`:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "includes": ["src/**", "tests/**", "scripts/**", "stories/**", ".storybook/**", "bin/**", "*.ts", "*.js", "!**/*.css"]
  },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2, "lineWidth": 100 },
  "javascript": {
    "formatter": { "quoteStyle": "single", "semicolons": "asNeeded", "trailingCommas": "all" }
  },
  "html": {
    "experimentalFullSupportEnabled": true,
    "formatter": { "enabled": true, "indentScriptAndStyle": true }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "preset": "recommended",
      "style": { "useConst": "error" },
      "suspicious": { "noArrayIndexKey": "off" }
    }
  }
}
```

Run `pnpm lint`. If Biome rejects the `html` keys, check the installed schema (`node_modules/@biomejs/biome/configuration_schema.json`) for the 2.6 names of Svelte support, and use them.

Then copy the spec's `Button` example into `/tmp/biome-probe/button.svelte` and run `pnpm biome check /tmp/biome-probe/button.svelte`. Biome counts as **reliable** if it reports no unused-variable or unused-import errors for names that are only used in markup, and `biome format` leaves the markup's meaning unchanged (diff it).

- If reliable: keep the config as written.
- If not: remove the `html` block, add `"!**/*.svelte"` to `files.includes`, ask the user to run `pnpm add -D prettier@^3.9.10 prettier-plugin-svelte@^4.1.1`, write `.prettierrc` as `{ "plugins": ["prettier-plugin-svelte"], "useTabs": false, "tabWidth": 2, "singleQuote": true, "semi": false, "printWidth": 100, "trailingComma": "all" }`, and change the scripts to `"lint": "biome check . && prettier --check \"**/*.svelte\""` and `"format": "biome format --write . && prettier --write \"**/*.svelte\""`.

Record the outcome in `.ai/guidelines/style/guide.md`:

```markdown
# Style

## Lint and format

<!-- One of the two paragraphs below, whichever Step 10 chose. -->
Biome lints and formats `.ts`, `.js` and `.svelte`. Its Svelte support is
experimental; it was checked against the Button component on 2026-11-04 and
did not misreport markup-only names or change markup.

Biome lints and formats `.ts` and `.js`. `.svelte` files are formatted by
Prettier with `prettier-plugin-svelte`, because Biome's experimental Svelte
support <reason seen in Step 10, quoted from its output>.
```

Keep only the paragraph that applies, and fill in the reason if it is the second.

- [ ] **Step 11: Run the full gate**

Run: `pnpm test`
Expected: `svelte-check` reports 0 errors and 0 warnings, lint is clean, 1 test passes.

- [ ] **Step 12: Commit**

```bash
git add -A
git status --short   # node_modules, dist and .svelte-kit must not appear
git commit -m "chore: scaffold the SvelteKit library toolchain" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Utilities and the public barrel

**Files:**
- Create: `src/lib/utils/cn.ts`, `src/lib/utils/tone.ts`, `src/lib/utils/types.ts`, `src/lib/index.ts`
- Test: `tests/barrel.test.ts`, `tests/cn.test.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string`; `type Tone`, `type Size`, `TONES`, `TONE_SOFT_CLASS`, `TONE_SOLID_CLASS`, `TONE_OUTLINE_CLASS`, `TONE_TEXT_CLASS`, `TONE_HOVER_CLASS`, `TONE_FILL_CLASS`, `TONE_STROKE_CLASS`, `TONE_INDICATOR_CLASS`, `TONE_CSS_VAR` (all `Record<Tone, string>`); `type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null }`, `WithoutChild<T>`, `WithoutChildren<T>`, `WithoutChildrenOrChild<T>`; `EXPECTED_EXPORTS` in `tests/barrel.test.ts`, which every component task extends.

- [ ] **Step 1: Write the failing tests**

`tests/cn.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { cn } from '../src/lib/utils/cn.js'

describe('cn', () => {
  it('lets a later utility beat an earlier one in the same group', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('drops falsy values and flattens arrays and objects', () => {
    expect(cn('a', false, null, undefined, ['b', { c: true, d: false }])).toBe('a b c')
  })
})
```

`tests/barrel.test.ts`:

```ts
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import * as entry from '../src/lib/index.js'

/**
 * The barrel is the package's whole public surface, and the type checker does
 * not catch an omission: a missing re-export is a missing name, not a type
 * error. So this checks the shape directly. Every component folder is
 * re-exported, nothing else is, and the named exports really resolve at runtime.
 *
 * Ported from the React package 2.23.0 tests/barrel.test.ts.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const barrel = readFileSync(join(root, 'src', 'lib', 'index.ts'), 'utf8')
const componentsDir = join(root, 'src', 'lib', 'components')

const folders = existsSync(componentsDir)
  ? readdirSync(componentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : []

/** Every runtime name the root entry must provide. Component tasks append to this. */
export const EXPECTED_EXPORTS = [
  'cn',
  'TONES',
  'TONE_SOFT_CLASS',
  'TONE_SOLID_CLASS',
  'TONE_OUTLINE_CLASS',
  'TONE_TEXT_CLASS',
  'TONE_HOVER_CLASS',
  'TONE_FILL_CLASS',
  'TONE_STROKE_CLASS',
  'TONE_INDICATOR_CLASS',
  'TONE_CSS_VAR',
]

describe('public barrel', () => {
  it('re-exports every component folder, and nothing that does not exist', () => {
    const referenced = [
      ...barrel.matchAll(/export \* from '\.\/components\/([a-z-]+)\/index\.js'/g),
    ].map((match) => match[1])
    expect(referenced.sort()).toEqual(folders)
  })

  it('provides every expected runtime export', () => {
    const missing = EXPECTED_EXPORTS.filter((name) => !(name in entry))
    expect(missing).toEqual([])
  })

  it.each(['Tone', 'Size'])('exports the %s type by name', (name) => {
    expect(barrel).toMatch(new RegExp(`\\btype ${name}\\b`))
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `pnpm vitest run tests/cn.test.ts tests/barrel.test.ts`
Expected: FAIL with `Failed to resolve import "../src/lib/utils/cn.js"` (and the same for `index.js`).

- [ ] **Step 3: Write `src/lib/utils/cn.ts`**

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names, with later Tailwind utilities beating earlier ones in the
 * same group: `cn('p-2', 'p-4')` is `'p-4'`, not both.
 *
 * `clsx` first, so Svelte 5's array and object `class` values work as they do
 * on a plain element.
 *
 * Copied from the React package 2.23.0 src/lib/cn.ts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Copy `tone.ts`**

```bash
cp <react-package>/src/lib/tone.ts src/lib/utils/tone.ts
```

Then add this line above the existing first comment, and change nothing else:

```ts
// Copied verbatim from the React package 2.23.0 src/lib/tone.ts.
```

- [ ] **Step 5: Write `src/lib/utils/types.ts`**

```ts
/**
 * Prop helpers for wrapping elements and bits-ui primitives.
 *
 * From shadcn-svelte's `utils.ts` (MIT; see LICENSES/shadcn-svelte.txt).
 */

/** Adds a bindable `ref` to an element's props. */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null }

/** bits-ui's `child` snippet, removed where a wrapper renders its own element. */
// biome-ignore lint/suspicious/noExplicitAny: matches any snippet signature
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T

// biome-ignore lint/suspicious/noExplicitAny: matches any snippet signature
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T

export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>
```

- [ ] **Step 6: Write `src/lib/index.ts`**

```ts
/**
 * The public entry. Components are re-exported folder by folder, under the
 * flat names the React package uses (D5). Utilities are listed by name.
 */

export { cn } from './utils/cn.js'
export {
  type Size,
  TONE_CSS_VAR,
  TONE_FILL_CLASS,
  TONE_HOVER_CLASS,
  TONE_INDICATOR_CLASS,
  TONE_OUTLINE_CLASS,
  TONE_SOFT_CLASS,
  TONE_SOLID_CLASS,
  TONE_STROKE_CLASS,
  TONE_TEXT_CLASS,
  TONES,
  type Tone,
} from './utils/tone.js'
export type {
  WithElementRef,
  WithoutChild,
  WithoutChildren,
  WithoutChildrenOrChild,
} from './utils/types.js'
```

- [ ] **Step 7: Run the tests to see them pass**

Run: `pnpm vitest run tests/cn.test.ts tests/barrel.test.ts`
Expected: PASS. The folder check compares two empty lists.

- [ ] **Step 8: Run the gate and commit**

Run: `pnpm test`. Expected: all green.

```bash
git add src/lib tests
git commit -m "feat(utils): cn, the shared tone scale and the public barrel" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Palette, presets and theme config

**Files:**
- Create: `scripts/copy-tailwind-palette.ts`, `src/lib/tokens/tailwind-palette.ts` (generated), `src/lib/tokens/presets.ts`, `src/lib/tokens/config.ts`, `LICENSES/tailwindcss.txt`
- Test: `tests/theme-config.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces, from `tailwind-palette.ts`: `STEPS` (`[50, 100, …, 900, 950]`), `type Step`, `type Ramp = Readonly<Record<Step, string>>`, `tailwindPalette`, `type HueName`.
- Produces, from `presets.ts`: `BASES`, `type BaseName`, `defaultTheme`, `presets`, `type PresetName`.
- Produces, from `config.ts`: `STATUS_ROLES` (`['info','success','warning','critical']`), `type StatusRole`, `RAMP_ROLES` (`['base','primary','info','success','warning','critical']`), `type RampRole`, `type HueOrRamp`, `interface ThemeFonts { sans; heading; mono }`, `type TokenOverrides = Record<\`--${string}\`, string>`, `interface ThemeConfig`, `interface ResolvedTheme { ramps: Record<RampRole, Ramp>; charts: readonly [Ramp, Ramp, Ramp, Ramp, Ramp]; radius: string; fonts: ThemeFonts; light: TokenOverrides; dark: TokenOverrides }`, `defineTheme(config: ThemeConfig): ThemeConfig`, `resolveRamp(role: string, value: HueOrRamp): Ramp`, `resolveTheme(config?: ThemeConfig): ResolvedTheme`.

- [ ] **Step 1: Write the palette generator**

`scripts/copy-tailwind-palette.ts`:

```ts
/**
 * Writes src/lib/tokens/tailwind-palette.ts from the installed Tailwind's
 * theme.css. The values are Tailwind's (MIT); this only reshapes them.
 *
 * Run: pnpm tsx scripts/copy-tailwind-palette.ts && pnpm biome format --write src/lib/tokens
 */
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tailwind = join(root, 'node_modules', 'tailwindcss')
const { version } = JSON.parse(readFileSync(join(tailwind, 'package.json'), 'utf8'))
const css = readFileSync(join(tailwind, 'theme.css'), 'utf8')

const palette: Record<string, Record<string, string>> = {}
for (const [, hue, step, value] of css.matchAll(/--color-([a-z]+)-(\d+):\s*(oklch\([^)]*\));/g)) {
  palette[hue] ??= {}
  palette[hue][step] = value
}

const ramps = Object.entries(palette)
  .map(([hue, ramp]) => {
    const steps = Object.entries(ramp).map(([step, value]) => `    ${step}: '${value}',`)
    return `  ${hue}: {\n${steps.join('\n')}\n  },`
  })
  .join('\n')

const source = `/**
 * Tailwind CSS v4's default colour palette, as literal oklch() values.
 *
 * Generated from tailwindcss@${version} theme.css by
 * scripts/copy-tailwind-palette.ts. Do not edit by hand; rerun the script.
 * Copyright (c) Tailwind Labs, Inc. MIT License; the full notice is in
 * LICENSES/tailwindcss.txt.
 *
 * Literals rather than var(--color-zinc-…) references, because Tailwind
 * prunes theme variables a consumer never uses.
 */
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type Step = (typeof STEPS)[number]

/** One hue, light to dark: eleven oklch() values. */
export type Ramp = Readonly<Record<Step, string>>

export const tailwindPalette = {
${ramps}
} as const satisfies Record<string, Ramp>

export type HueName = keyof typeof tailwindPalette
`

writeFileSync(join(root, 'src', 'lib', 'tokens', 'tailwind-palette.ts'), source)
copyFileSync(join(tailwind, 'LICENSE'), join(root, 'LICENSES', 'tailwindcss.txt'))
console.log(`tailwind-palette.ts: ${Object.keys(palette).length} hues from tailwindcss@${version}`)
```

- [ ] **Step 2: Generate the palette**

```bash
mkdir -p src/lib/tokens
pnpm tsx scripts/copy-tailwind-palette.ts && pnpm biome format --write src/lib/tokens
```

Expected: `tailwind-palette.ts: N hues from tailwindcss@4.3.x`, where N is at least 22. Tailwind 4.2 added more neutrals, so 26 is likely. Open the file and check that `zinc[950]` is an `oklch(` string.

- [ ] **Step 3: Write the failing tests**

`tests/theme-config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { defineTheme, RAMP_ROLES, resolveTheme } from '../src/lib/tokens/config.js'
import { BASES, presets } from '../src/lib/tokens/presets.js'
import { STEPS, tailwindPalette } from '../src/lib/tokens/tailwind-palette.js'

const SPEC_HUES = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
  'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone',
]

describe('tailwind palette', () => {
  it('carries every Tailwind v4 hue the spec relies on', () => {
    const missing = SPEC_HUES.filter((hue) => !(hue in tailwindPalette))
    expect(missing).toEqual([])
  })

  it('gives every hue all eleven steps as oklch literals', () => {
    for (const [hue, ramp] of Object.entries(tailwindPalette)) {
      for (const step of STEPS) expect(ramp[step], `${hue}-${step}`).toMatch(/^oklch\(/)
    }
  })
})

describe('resolveTheme', () => {
  it('defaults to a zinc base, an indigo brand and the spec statuses (D11)', () => {
    const theme = resolveTheme()
    expect(theme.ramps.base).toBe(tailwindPalette.zinc)
    expect(theme.ramps.primary).toBe(tailwindPalette.indigo)
    expect(theme.ramps.info).toBe(tailwindPalette.sky)
    expect(theme.ramps.success).toBe(tailwindPalette.emerald)
    expect(theme.ramps.warning).toBe(tailwindPalette.amber)
    expect(theme.ramps.critical).toBe(tailwindPalette.red)
    expect(theme.radius).toBe('0.625rem')
    expect(theme.charts).toHaveLength(5)
  })

  it('resolves a ramp for every role', () => {
    expect(Object.keys(resolveTheme().ramps).sort()).toEqual([...RAMP_ROLES].sort())
  })

  it('takes a base, a brand hue and one status from the config', () => {
    const theme = resolveTheme({ base: 'stone', primary: 'teal', status: { warning: 'orange' } })
    expect(theme.ramps.base).toBe(tailwindPalette.stone)
    expect(theme.ramps.primary).toBe(tailwindPalette.teal)
    expect(theme.ramps.warning).toBe(tailwindPalette.orange)
    expect(theme.ramps.success).toBe(tailwindPalette.emerald)
  })

  it('accepts a custom 50–950 ramp for the brand', () => {
    const ramp = Object.fromEntries(STEPS.map((step) => [step, `oklch(0.5 0.1 ${step})`]))
    expect(resolveTheme({ primary: ramp as never }).ramps.primary).toEqual(ramp)
  })

  it('names the missing steps of an incomplete custom ramp', () => {
    const ramp = { 50: 'oklch(0.9 0.1 200)', 500: 'oklch(0.5 0.1 200)' }
    expect(() => resolveTheme({ primary: ramp as never })).toThrow(
      'The primary ramp is missing steps: 100, 200, 300, 400, 600, 700, 800, 900, 950',
    )
  })

  it('rejects an unknown hue name', () => {
    expect(() => resolveTheme({ primary: 'chartreuse' as never })).toThrow(
      'Unknown hue "chartreuse" for primary',
    )
  })

  it('rejects a base that is not one of the neutrals', () => {
    expect(() => resolveTheme({ base: 'red' as never })).toThrow('Unknown base "red"')
  })

  it('merges fonts one face at a time', () => {
    const fonts = resolveTheme({ fonts: { sans: "'Inter', sans-serif" } }).fonts
    expect(fonts.sans).toBe("'Inter', sans-serif")
    expect(fonts.mono).toMatch(/ui-monospace/)
  })

  it('carries the light and dark escape hatches through untouched', () => {
    const theme = resolveTheme({ light: { '--sidebar': 'white' }, dark: { '--sidebar': 'black' } })
    expect(theme.light).toEqual({ '--sidebar': 'white' })
    expect(theme.dark).toEqual({ '--sidebar': 'black' })
  })
})

describe('defineTheme', () => {
  it('returns the config unchanged; it exists for the types', () => {
    const config = { base: 'slate' as const }
    expect(defineTheme(config)).toBe(config)
  })
})

describe('presets', () => {
  it('offers one preset per neutral base, plus a worked custom one', () => {
    expect(Object.keys(presets)).toEqual([...BASES, 'teal-on-stone'])
  })

  it.each(Object.entries(presets))('resolves the %s preset', (_name, preset) => {
    expect(() => resolveTheme(preset)).not.toThrow()
  })
})
```

- [ ] **Step 4: Run them to see them fail**

Run: `pnpm vitest run tests/theme-config.test.ts`
Expected: FAIL with `Failed to resolve import "../src/lib/tokens/config.js"`.

- [ ] **Step 5: Write `src/lib/tokens/presets.ts`**

```ts
import type { StatusRole, ThemeConfig, ThemeFonts } from './config.js'
import type { HueName } from './tailwind-palette.js'

/** The neutral ramps a theme can sit on. `zinc` is the default. */
export const BASES = ['zinc', 'slate', 'gray', 'neutral', 'stone'] as const

export type BaseName = (typeof BASES)[number]

/**
 * System stacks, so a consumer loads no web font by default. Numbers line up
 * through `tabular-nums` where a component needs it, not through a mono base
 * face. Mono-as-base was the React package's identity choice and did not come over.
 */
const SYSTEM_SANS =
  "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
const SYSTEM_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"

/**
 * The theme mise ships (D4, D11): zinc neutrals, an indigo brand, and the four
 * statuses on hues that read as their meaning. The five chart hues are picked
 * to stay apart from each other and from the indigo brand.
 */
export const defaultTheme = {
  base: 'zinc',
  primary: 'indigo',
  status: { info: 'sky', success: 'emerald', warning: 'amber', critical: 'red' },
  charts: ['teal', 'orange', 'fuchsia', 'lime', 'sky'],
  radius: '0.625rem',
  fonts: { sans: SYSTEM_SANS, heading: SYSTEM_SANS, mono: SYSTEM_MONO },
} as const satisfies {
  base: BaseName
  primary: HueName
  status: Record<StatusRole, HueName>
  charts: readonly [HueName, HueName, HueName, HueName, HueName]
  radius: string
  fonts: ThemeFonts
}

/**
 * What Storybook's preset switcher offers: each base under the default brand,
 * and one worked custom theme that changes the base, the brand and the radius
 * together.
 */
export const presets = {
  zinc: {},
  slate: { base: 'slate' },
  gray: { base: 'gray' },
  neutral: { base: 'neutral' },
  stone: { base: 'stone' },
  'teal-on-stone': { base: 'stone', primary: 'teal', radius: '0.5rem' },
} as const satisfies Record<string, ThemeConfig>

export type PresetName = keyof typeof presets
```

- [ ] **Step 6: Write `src/lib/tokens/config.ts`**

```ts
import { BASES, type BaseName, defaultTheme } from './presets.js'
import { type HueName, type Ramp, STEPS, tailwindPalette } from './tailwind-palette.js'

export const STATUS_ROLES = ['info', 'success', 'warning', 'critical'] as const

export type StatusRole = (typeof STATUS_ROLES)[number]

/** Every ramp the theme emits into `:root`, as `--color-<role>-<step>`. */
export const RAMP_ROLES = ['base', 'primary', ...STATUS_ROLES] as const

export type RampRole = (typeof RAMP_ROLES)[number]

/** A Tailwind hue name, or a custom ramp with all eleven steps. */
export type HueOrRamp = HueName | Ramp

export interface ThemeFonts {
  sans: string
  heading: string
  mono: string
}

/** Single-token escape hatches, written last so they win. */
export type TokenOverrides = Record<`--${string}`, string>

export interface ThemeConfig {
  base?: BaseName
  primary?: HueOrRamp
  status?: Partial<Record<StatusRole, HueOrRamp>>
  charts?: readonly [HueName, HueName, HueName, HueName, HueName]
  radius?: string
  fonts?: Partial<ThemeFonts>
  light?: TokenOverrides
  dark?: TokenOverrides
}

/** A config with every default filled in and every hue looked up. */
export interface ResolvedTheme {
  ramps: Record<RampRole, Ramp>
  charts: readonly [Ramp, Ramp, Ramp, Ramp, Ramp]
  radius: string
  fonts: ThemeFonts
  light: TokenOverrides
  dark: TokenOverrides
}

/** Identity, for type-checking a `mise.theme.js` the way `defineConfig` does for Vite. */
export function defineTheme(config: ThemeConfig): ThemeConfig {
  return config
}

export function resolveRamp(role: string, value: HueOrRamp): Ramp {
  if (typeof value === 'string') {
    const ramp = (tailwindPalette as Record<string, Ramp | undefined>)[value]
    if (!ramp) {
      throw new Error(
        `Unknown hue "${value}" for ${role}. Use a Tailwind hue name or a 50–950 ramp.`,
      )
    }

    return ramp
  }

  const missing = STEPS.filter((step) => !value[step])
  if (missing.length > 0) {
    throw new Error(`The ${role} ramp is missing steps: ${missing.join(', ')}`)
  }

  return value
}

export function resolveTheme(config: ThemeConfig = {}): ResolvedTheme {
  const base = config.base ?? defaultTheme.base
  if (!(BASES as readonly string[]).includes(base)) {
    throw new Error(`Unknown base "${base}". Use one of: ${BASES.join(', ')}.`)
  }

  const status = { ...defaultTheme.status, ...config.status }
  const [c1, c2, c3, c4, c5] = (config.charts ?? defaultTheme.charts).map((hue) =>
    resolveRamp('charts', hue),
  )

  return {
    ramps: {
      base: tailwindPalette[base],
      primary: resolveRamp('primary', config.primary ?? defaultTheme.primary),
      info: resolveRamp('status.info', status.info),
      success: resolveRamp('status.success', status.success),
      warning: resolveRamp('status.warning', status.warning),
      critical: resolveRamp('status.critical', status.critical),
    },
    charts: [c1, c2, c3, c4, c5],
    radius: config.radius ?? defaultTheme.radius,
    fonts: { ...defaultTheme.fonts, ...config.fonts },
    light: { ...config.light },
    dark: { ...config.dark },
  }
}
```

The runtime imports go one way only: `config.ts` imports `presets.ts`. `presets.ts` imports types from `config.ts`, and those are erased at compile time, so there is no runtime cycle.

- [ ] **Step 7: Run the tests to see them pass**

Run: `pnpm vitest run tests/theme-config.test.ts`
Expected: PASS.

- [ ] **Step 8: Run the gate and commit**

Run: `pnpm test`. Expected: all green.

```bash
git add scripts src/lib/tokens tests LICENSES
git commit -m "feat(tokens): Tailwind palette, presets and the theme config" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Semantic tokens, the emitter and `theme.css`

**Files:**
- Create: `src/lib/tokens/geometry.ts`, `src/lib/tokens/semantic.ts`, `src/lib/tokens/emit-web.ts`, `src/lib/tokens.ts`, `src/lib/styles/components.css`, `scripts/build-theme.ts`
- Test: `tests/theme.test.ts`

**Interfaces:**
- Consumes: `resolveTheme`, `ResolvedTheme`, `ThemeConfig`, `RAMP_ROLES`, `RampRole` (Task 4); `STEPS`, `Step` (Task 4).
- Produces: `SEMANTIC_TOKENS`, `type SemanticToken`, `lightTokens(theme: ResolvedTheme)`, `darkTokens(theme: ResolvedTheme)` (both `Record<SemanticToken, string>`); `sizing`, `radiusScale`, `layout`, `geometryRules`; `emitThemeCss(config?: ThemeConfig): string`, `emitThemeVariables(config?: ThemeConfig): string` (`:root` + `.dark` only, for runtime swaps), `themeStylesheet(config: ThemeConfig, componentsCss: string): string`. The `/tokens` entry re-exports all of these plus Task 4's.

- [ ] **Step 1: Write the failing test**

`tests/theme.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import {
  emitThemeCss,
  emitThemeVariables,
  presets,
  RAMP_ROLES,
  SEMANTIC_TOKENS,
  STEPS,
  tailwindPalette,
} from '../src/lib/tokens.js'

/** The body of the first `<selector> {` block, without its braces. */
function block(css: string, selector: string): string {
  const start = css.indexOf(`\n${selector} {\n`)
  if (start === -1) throw new Error(`no "${selector}" block`)
  const end = css.indexOf('\n}', start + 1)
  return css.slice(start + selector.length + 4, end)
}

/** Declarations in order, duplicates kept, so a test can catch a token declared twice. */
function declarations(body: string): Array<[string, string]> {
  return [...body.matchAll(/^\s*(--[\w-]+):\s*(.+);$/gm)].map((match) => [match[1], match[2]])
}

const tokenValue = (body: string, token: string) =>
  declarations(body).find(([name]) => name === token)?.[1]

const COLOR_PREFIXED = new Set(['--color-table-header'])

describe.each(Object.keys(presets))('preset %s', (name) => {
  const css = emitThemeCss(presets[name as keyof typeof presets])

  it('declares every semantic token in :root and in .dark', () => {
    for (const selector of [':root', '.dark']) {
      const declared = new Set(declarations(block(css, selector)).map(([token]) => token))
      const missing = SEMANTIC_TOKENS.filter((token) => !declared.has(token))
      expect(missing, selector).toEqual([])
    }
  })

  it('writes every ramp step of every role into :root as a literal', () => {
    const root = block(css, ':root')
    for (const role of RAMP_ROLES) {
      for (const step of STEPS) {
        expect(tokenValue(root, `--color-${role}-${step}`), `${role}-${step}`).toMatch(/^oklch\(/)
      }
    }
  })
})

describe('@theme inline bridge', () => {
  const bridge = block(emitThemeCss(), '@theme inline')

  it('routes every semantic utility through its own variable', () => {
    for (const token of SEMANTIC_TOKENS) {
      if (COLOR_PREFIXED.has(token)) continue
      expect(tokenValue(bridge, `--color-${token.slice(2)}`), token).toBe(`var(${token})`)
    }
  })

  it('never points a utility at a ramp step directly, except a ramp at itself', () => {
    const frozen = declarations(bridge).filter(([name, value]) => {
      const target = value.match(/^var\((--color-[a-z]+-\d+)\)$/)?.[1]
      return target !== undefined && target !== name
    })
    expect(frozen).toEqual([])
  })

  it('derives the radius scale from the single --radius', () => {
    expect(tokenValue(bridge, '--radius-lg')).toBe('var(--radius)')
    expect(tokenValue(bridge, '--radius-4xl')).toBe('calc(var(--radius) + 16px)')
  })

  it('washes each tone from its own ink', () => {
    expect(tokenValue(bridge, '--color-primary-soft')).toBe(
      'color-mix(in oklab, var(--primary) 10%, transparent)',
    )
    expect(tokenValue(bridge, '--color-destructive-soft')).toBe(
      'color-mix(in oklab, var(--destructive) 10%, transparent)',
    )
  })

  it('leaves the faces to :root, so a consumer can override them in CSS', () => {
    expect(tokenValue(bridge, '--font-sans')).toBe('var(--font-sans)')
  })
})

describe('config reaches the output', () => {
  it('emits the default theme when no config is given', () => {
    const root = block(emitThemeCss(), ':root')
    expect(tokenValue(root, '--color-primary-600')).toBe(tailwindPalette.indigo[600])
    expect(tokenValue(root, '--color-base-950')).toBe(tailwindPalette.zinc[950])
    expect(tokenValue(root, '--primary')).toBe('var(--color-primary-600)')
  })

  it('takes the base, brand, statuses, radius and fonts from a config', () => {
    const css = emitThemeCss({
      base: 'stone',
      primary: 'teal',
      status: { warning: 'orange' },
      radius: '0.5rem',
      fonts: { sans: "'Inter', sans-serif" },
    })
    const root = block(css, ':root')
    expect(tokenValue(root, '--color-base-100')).toBe(tailwindPalette.stone[100])
    expect(tokenValue(root, '--color-primary-600')).toBe(tailwindPalette.teal[600])
    expect(tokenValue(root, '--color-warning-600')).toBe(tailwindPalette.orange[600])
    expect(tokenValue(root, '--radius')).toBe('0.5rem')
    expect(tokenValue(root, '--font-sans')).toBe("'Inter', sans-serif")
  })

  it('replaces an overridden token in place rather than declaring it twice', () => {
    const css = emitThemeCss({ light: { '--sidebar': 'white' }, dark: { '--sidebar': 'black' } })
    const light = declarations(block(css, ':root')).filter(([name]) => name === '--sidebar')
    const dark = declarations(block(css, '.dark')).filter(([name]) => name === '--sidebar')
    expect(light).toEqual([['--sidebar', 'white']])
    expect(dark).toEqual([['--sidebar', 'black']])
  })

  it('appends an override for a token the contract does not have', () => {
    const root = block(emitThemeCss({ light: { '--brand-glow': 'pink' } }), ':root')
    expect(tokenValue(root, '--brand-glow')).toBe('pink')
  })
})

describe('emitThemeVariables', () => {
  it('emits only :root and .dark, for swapping a theme at runtime', () => {
    const css = emitThemeVariables(presets.stone)
    expect(css).not.toContain('@theme')
    expect(css).not.toContain('@layer')
    expect(tokenValue(block(`\n${css}`, ':root'), '--color-base-50')).toBe(tailwindPalette.stone[50])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/theme.test.ts`
Expected: FAIL with `Failed to resolve import "../src/lib/tokens.js"`.

- [ ] **Step 3: Write `src/lib/tokens/geometry.ts`**

Adapted from the React package's `geometry.ts` and the `sizing` export of its `semantic.ts`. The faces moved to the config, and `--radius` comes from the config too.

```ts
/**
 * Everything in the theme that is not a colour and not configurable: the
 * radius scale's shape, the shell's structural measurements, and the control
 * geometry components hard-code.
 *
 * Adapted from the React package 2.23.0 src/tokens/geometry.ts.
 */

/** Structural measurements, declared in `:root`. `--spacing` drives every spacing utility. */
export const sizing = {
  '--sidebar-width': 'calc(var(--spacing) * 20)',
  '--header-height': '64px',
  '--spacing': '0.25rem',
} as const

/**
 * Derived from the single `--radius`, so one edit moves the whole scale in
 * step. `--radius-4xl` is what cards and dialogs use, clamped to 24px by
 * `rounded-[min(var(--radius-4xl),24px)]`.
 */
export const radiusScale = {
  '--radius-sm': 'calc(var(--radius) - 4px)',
  '--radius-md': 'calc(var(--radius) - 2px)',
  '--radius-lg': 'var(--radius)',
  '--radius-xl': 'calc(var(--radius) + 4px)',
  '--radius-2xl': 'calc(var(--radius) + 8px)',
  '--radius-3xl': 'calc(var(--radius) + 12px)',
  '--radius-4xl': 'calc(var(--radius) + 16px)',
} as const

/**
 * `--container-content` caps the content column, header bar included, so
 * tables do not stretch the full width of an ultrawide display.
 */
export const layout = {
  '--height-header': 'var(--header-height)',
  '--width-sidebar': 'var(--sidebar-width)',
  '--container-content': '96rem',
  '--spacing': 'var(--spacing)',
} as const
```

Then append `geometryRules`, copied verbatim from the React package's `src/tokens/geometry.ts`, including its comment, from `/**\n * Control geometry` to the end of the object.

- [ ] **Step 4: Write `src/lib/tokens/semantic.ts`**

```ts
import type { RampRole, ResolvedTheme } from './config.js'
import type { Step } from './tailwind-palette.js'

/**
 * The semantic contract: what a colour means. Consumers override these by
 * name (spec, Theming level 2), so the list is public and stable.
 *
 * Values point at the role ramps in `:root` (`var(--color-primary-600)`)
 * rather than being resolved to literals. That way an override of one ramp
 * step moves every token that reads it, and light and dark cannot drift apart
 * silently.
 *
 * Adapted from the React package 2.23.0 src/tokens/semantic.ts. The
 * React package's brand literals and `--error` did not come over. `--secondary` is a
 * neutral fill again, as in shadcn, rather than a brand orange.
 */
export const SEMANTIC_TOKENS = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--info',
  '--success',
  '--warning',
  '--border',
  '--input',
  '--ring',
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
  '--sidebar',
  '--sidebar-foreground',
  '--sidebar-primary',
  '--sidebar-primary-foreground',
  '--sidebar-accent',
  '--sidebar-accent-foreground',
  '--sidebar-border',
  '--sidebar-ring',
  '--color-table-header',
] as const

export type SemanticToken = (typeof SEMANTIC_TOKENS)[number]

type Scheme = Record<SemanticToken, string>

const WHITE = 'oklch(1 0 0)'
const step = (role: RampRole, at: Step) => `var(--color-${role}-${at})`

/**
 * `:root`. Muted ink is the base's 600 rather than shadcn's 500: 500 falls
 * below AA on a `--muted` surface, which is where most small grey text sits.
 * `--accent` is a brand tint and means "active nav row". It is never a hover
 * state.
 */
export function lightTokens(theme: ResolvedTheme): Scheme {
  const [c1, c2, c3, c4, c5] = theme.charts

  return {
    '--background': WHITE,
    '--foreground': step('base', 950),
    '--card': WHITE,
    '--card-foreground': step('base', 950),
    '--popover': WHITE,
    '--popover-foreground': step('base', 950),
    '--primary': step('primary', 600),
    '--primary-foreground': WHITE,
    '--secondary': step('base', 100),
    '--secondary-foreground': step('base', 900),
    '--muted': step('base', 100),
    '--muted-foreground': step('base', 600),
    '--accent': step('primary', 50),
    '--accent-foreground': step('primary', 700),
    '--destructive': step('critical', 600),
    '--info': step('info', 600),
    '--success': step('success', 600),
    '--warning': step('warning', 600),
    '--border': step('base', 200),
    '--input': step('base', 200),
    '--ring': step('primary', 400),
    '--chart-1': c1[500],
    '--chart-2': c2[500],
    '--chart-3': c3[500],
    '--chart-4': c4[500],
    '--chart-5': c5[500],
    '--sidebar': step('base', 50),
    '--sidebar-foreground': step('base', 950),
    '--sidebar-primary': step('primary', 600),
    '--sidebar-primary-foreground': WHITE,
    '--sidebar-accent': step('base', 100),
    '--sidebar-accent-foreground': step('base', 900),
    '--sidebar-border': step('base', 200),
    '--sidebar-ring': step('base', 400),
    '--color-table-header': step('base', 50),
  }
}

/**
 * `.dark`: near-black surfaces with translucent white borders, so stacked
 * panels stay legible without heavy outlines. Status ink brightens to the 400
 * step. The table header follows the sidebar, as in the React package.
 * Without that, the header is the brightest thing on a dark screen.
 */
export function darkTokens(theme: ResolvedTheme): Scheme {
  const [c1, c2, c3, c4, c5] = theme.charts

  return {
    '--background': step('base', 950),
    '--foreground': step('base', 50),
    '--card': step('base', 900),
    '--card-foreground': step('base', 50),
    '--popover': step('base', 900),
    '--popover-foreground': step('base', 50),
    '--primary': step('primary', 400),
    '--primary-foreground': step('primary', 950),
    '--secondary': step('base', 800),
    '--secondary-foreground': step('base', 50),
    '--muted': step('base', 800),
    '--muted-foreground': step('base', 400),
    '--accent': step('primary', 950),
    '--accent-foreground': step('primary', 200),
    '--destructive': step('critical', 400),
    '--info': step('info', 400),
    '--success': step('success', 400),
    '--warning': step('warning', 400),
    '--border': 'oklch(1 0 0 / 10%)',
    '--input': 'oklch(1 0 0 / 15%)',
    '--ring': step('primary', 500),
    '--chart-1': c1[400],
    '--chart-2': c2[400],
    '--chart-3': c3[400],
    '--chart-4': c4[400],
    '--chart-5': c5[400],
    '--sidebar': step('base', 900),
    '--sidebar-foreground': step('base', 50),
    '--sidebar-primary': step('primary', 400),
    '--sidebar-primary-foreground': step('primary', 950),
    '--sidebar-accent': step('base', 800),
    '--sidebar-accent-foreground': step('base', 50),
    '--sidebar-border': 'oklch(1 0 0 / 10%)',
    '--sidebar-ring': step('base', 600),
    '--color-table-header': 'var(--sidebar)',
  }
}
```

- [ ] **Step 5: Write `src/lib/tokens/emit-web.ts`**

```ts
import { RAMP_ROLES, type ResolvedTheme, resolveTheme, type ThemeConfig } from './config.js'
import { layout, radiusScale, sizing } from './geometry.js'
import { darkTokens, lightTokens, SEMANTIC_TOKENS } from './semantic.js'
import { STEPS } from './tailwind-palette.js'

/**
 * Generates `theme.css` from a theme config.
 *
 * Consumers import it after Tailwind:
 *
 *   @import 'tailwindcss';
 *   @import 'tw-animate-css';
 *   @import '@jovertical/mise-design-system/theme.css';
 *   @source '../node_modules/@jovertical/mise-design-system/dist';
 *
 * The `@source` line is not optional. Tailwind v4 skips `node_modules` when
 * it detects content, so without it every class the components use is pruned.
 *
 * Adapted from the React package 2.23.0 src/tokens/emit-web.ts. The
 * emitter now takes a config instead of reading module constants.
 */

/** Tokens declared in `:root` under a `--color-*` name rather than a semantic one. */
const COLOR_PREFIXED = new Set<string>(['--color-table-header'])

/** The faces live in `:root` so a consumer can override them in plain CSS. */
const FONT_TOKENS = ['--font-sans', '--font-heading', '--font-mono'] as const

/**
 * A 10% wash under ink of the same tone, for a soft badge, a chip or an alert.
 * Named once here, because a tint that drifts by a percent between components
 * reads as two different states. Red washes from `--destructive`, the red
 * every component inks with.
 */
const SOFT_TINTS = {
  '--color-primary-soft': 'var(--primary)',
  '--color-info-soft': 'var(--color-info)',
  '--color-success-soft': 'var(--color-success)',
  '--color-warning-soft': 'var(--color-warning)',
  '--color-destructive-soft': 'var(--destructive)',
} as const

const declare = (entries: Iterable<readonly string[]>) =>
  [...entries].map(([token, value]) => `  ${token}: ${value};`)

const bridgeName = (token: string) =>
  token.startsWith('--color-') ? token : `--color-${token.slice(2)}`

/**
 * The `@theme inline` bridge. `inline` makes Tailwind write each value
 * through as authored, so `bg-primary` emits `var(--primary)` and follows
 * whichever of `:root` / `.dark` is in scope. A bridge that pointed at a ramp
 * step directly would freeze the utility in one scheme.
 */
function themeInline(): string {
  const lines = [
    '  /* Faces, resolved from :root so a consumer can override them. */',
    ...declare(FONT_TOKENS.map((token) => [token, `var(${token})`])),
    '',
    '  /* Radius scale, derived from the single --radius in :root. */',
    ...declare(Object.entries(radiusScale)),
    '',
    '  /* Semantic surfaces and ink. Every one resolves through :root / .dark. */',
    ...declare(
      SEMANTIC_TOKENS.filter((token) => !COLOR_PREFIXED.has(token)).map((token) => [
        bridgeName(token),
        `var(${token})`,
      ]),
    ),
    '',
    '  /* Soft tints: each tone at 10%, behind ink of the same tone. */',
    ...declare(
      Object.entries(SOFT_TINTS).map(([token, ink]) => [
        token,
        `color-mix(in oklab, ${ink} 10%, transparent)`,
      ]),
    ),
    '',
    '  /* Theme-responsive, declared under a --color-* name in :root. */',
    ...declare([...COLOR_PREFIXED].map((token) => [token, `var(${token})`])),
    '',
    '  /* Role ramps. The self-reference hands each utility a var() that :root',
    '     resolves, rather than baking in a literal. */',
    ...RAMP_ROLES.flatMap((role) =>
      declare(STEPS.map((at) => [`--color-${role}-${at}`, `var(--color-${role}-${at})`])),
    ),
    '',
    '  /* Structural measurements. */',
    ...declare(Object.entries(layout)),
  ]

  return `@theme inline {\n${lines.join('\n')}\n}`
}

function rootBlock(theme: ResolvedTheme): string {
  const lines = [
    '  /* Structure, and the one --radius the scale derives from. */',
    ...declare(Object.entries(sizing)),
    `  --radius: ${theme.radius};`,
    '',
    '  /* Faces. */',
    `  --font-sans: ${theme.fonts.sans};`,
    `  --font-heading: ${theme.fonts.heading};`,
    `  --font-mono: ${theme.fonts.mono};`,
    '',
    '  /* Light scheme. --accent is a brand tint meaning "active nav row";',
    '     it is never a hover state. */',
    ...declare(Object.entries({ ...lightTokens(theme), ...theme.light })),
    '',
    '  /* Role ramps, as literals: Tailwind prunes theme variables nobody uses. */',
    ...RAMP_ROLES.flatMap((role) =>
      declare(STEPS.map((at) => [`--color-${role}-${at}`, theme.ramps[role][at]])),
    ),
  ]

  return `:root {\n${lines.join('\n')}\n}`
}

function darkBlock(theme: ResolvedTheme): string {
  const lines = [
    '  /* Near-black surfaces and translucent white borders. */',
    ...declare(Object.entries({ ...darkTokens(theme), ...theme.dark })),
  ]

  return `.dark {\n${lines.join('\n')}\n}`
}

const BASE_BLOCK = `@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans;
  }
}`

/**
 * Printing a listing should produce the table, not a screenshot of the app.
 * The rules target `data-slot` attributes the components emit, so they ship
 * with the theme instead of rotting in an app.
 */
const PRINT_BLOCK = `@media print {
  [data-slot='sidebar'],
  [data-slot='sidebar-gap'],
  header {
    display: none !important;
  }

  [data-slot='sidebar-inset'] {
    margin: 0 !important;
    box-shadow: none !important;
  }

  [data-slot='table-container'] {
    overflow: visible !important;
  }

  body {
    background: #fff !important;
  }
}`

/** `:root` and `.dark` only, for swapping a theme at runtime, as Storybook's preset switcher does. */
export function emitThemeVariables(config: ThemeConfig = {}): string {
  const theme = resolveTheme(config)

  return `${rootBlock(theme)}\n\n${darkBlock(theme)}\n`
}

/** The whole generated theme, without the hand-written component overrides. */
export function emitThemeCss(config: ThemeConfig = {}): string {
  const theme = resolveTheme(config)

  return [
    '/* Generated by @jovertical/mise-design-system. Do not edit.',
    ' * Regenerate with `pnpm build:theme`, or `npx mise-theme` for a custom theme.',
    ' */',
    '',
    '@custom-variant dark (&:is(.dark *));',
    '',
    themeInline(),
    '',
    rootBlock(theme),
    '',
    darkBlock(theme),
    '',
    BASE_BLOCK,
    '',
    PRINT_BLOCK,
    '',
  ].join('\n')
}

/**
 * The shipped stylesheet: the emitted theme, then the hand-written overrides.
 * They are concatenated rather than joined by an `@import`, because CSS
 * requires `@import` to come before every other rule.
 */
export function themeStylesheet(config: ThemeConfig, componentsCss: string): string {
  return `${emitThemeCss(config)}\n${componentsCss}`
}
```

- [ ] **Step 6: Write `src/lib/tokens.ts`**

```ts
/**
 * The `/tokens` entry: pure values and the emitters that shape them. It can
 * be imported from a Node script, a test, or Storybook without pulling in
 * Svelte.
 */

export {
  defineTheme,
  type HueOrRamp,
  RAMP_ROLES,
  type RampRole,
  type ResolvedTheme,
  resolveRamp,
  resolveTheme,
  STATUS_ROLES,
  type StatusRole,
  type ThemeConfig,
  type ThemeFonts,
  type TokenOverrides,
} from './tokens/config.js'
export { emitThemeCss, emitThemeVariables, themeStylesheet } from './tokens/emit-web.js'
export { geometryRules, layout, radiusScale, sizing } from './tokens/geometry.js'
export { BASES, type BaseName, defaultTheme, type PresetName, presets } from './tokens/presets.js'
export { darkTokens, lightTokens, SEMANTIC_TOKENS, type SemanticToken } from './tokens/semantic.js'
export { type HueName, type Ramp, STEPS, type Step, tailwindPalette } from './tokens/tailwind-palette.js'
```

- [ ] **Step 7: Run the test to see it pass**

Run: `pnpm vitest run tests/theme.test.ts`
Expected: PASS.

- [ ] **Step 8: Write `src/lib/styles/components.css`**

Adapted from the React package's `src/styles/components.css`. The scrollbar block is copied verbatim, from its `/* ====…\n   Scrollbars` banner to the end of the file. The Sonner block comes back with toasts in round 2. The top-loader and app-loader blocks were product chrome, and they come back only if those components are ported.

```css
/**
 * Component overrides: styles that extend components beyond what a class
 * string can say. Appended to the generated theme in dist/theme.css.
 *
 * Adapted from the React package 2.23.0 src/styles/components.css.
 */

/* =============================================================================
   Disabled link buttons – an <a> has no :disabled, so Button sets
   aria-disabled and drops its href instead. This draws it the way
   `disabled:pointer-events-none disabled:opacity-50` draws a <button>.
   ============================================================================= */

[data-slot='button'][aria-disabled='true'] {
  pointer-events: none;
  opacity: 0.5;
}

/* <the Scrollbars section, verbatim> */
```

Replace the last comment line with the copied scrollbar section.

- [ ] **Step 9: Write `scripts/build-theme.ts`**

```ts
/**
 * Writes dist/theme.css: the default theme followed by the component overrides.
 * One artifact means one line in a consumer's stylesheet.
 *
 * Adapted from the React package 2.23.0 scripts/build-theme.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { themeStylesheet } from '../src/lib/tokens/emit-web.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const overrides = readFileSync(join(root, 'src/lib/styles/components.css'), 'utf8')
const css = themeStylesheet({}, overrides)

mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist/theme.css'), css)

console.log(`dist/theme.css: ${css.split('\n').length} lines`)
```

- [ ] **Step 10: Build the theme and check Tailwind accepts it**

```bash
pnpm build:theme
mkdir -p /tmp/mise-css-probe && printf "@import 'tailwindcss';\n@import '%s/dist/theme.css';\n@source inline('bg-primary text-muted-foreground rounded-4xl bg-primary-soft font-heading');\n" "$PWD" > /tmp/mise-css-probe/in.css
pnpm exec tailwindcss -i /tmp/mise-css-probe/in.css -o /tmp/mise-css-probe/out.css
grep -E "\.bg-primary \{|\.bg-primary-soft|\.font-heading" -A2 /tmp/mise-css-probe/out.css
```

Expected: `.bg-primary { background-color: var(--primary); }`, a `.bg-primary-soft` rule using `var(--color-primary-soft)` or the `color-mix`, and `.font-heading { font-family: var(--font-heading); }`. The point is that each utility is written as a `var()` and not as a literal. If Tailwind writes a literal for any of them, stop and report it.

- [ ] **Step 11: Run the gate and commit**

Run: `pnpm test`. Expected: all green.

```bash
git add src/lib scripts tests
git commit -m "feat(tokens): semantic contract, the CSS emitter and theme.css" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Phase A gate

Stop. Report in the phase-gates format: Tasks 1–5 and their outcomes, the repository URL, the Biome-or-Prettier decision, the hue count Tailwind 4.3 shipped, and anything unexpected. Wait for approval, then push with `git push origin main`.

---

# Phase B — Round 0: CLI, Storybook, CI, AI tooling (Tasks 6–9)

### Task 6: The `mise-theme` CLI

**Files:**
- Create: `src/lib/tokens/cli.ts`, `bin/mise-theme.js`
- Test: `tests/theme-cli.test.ts`

**Interfaces:**
- Consumes: `themeStylesheet`, `ThemeConfig` (Task 5).
- Produces: `runThemeCli(argv: string[], cwd?: string): Promise<{ code: number; message: string }>`. It is deliberately not exported from `tokens.ts`, so browser bundles never pull in `node:fs`.

- [ ] **Step 1: Write the failing test**

`tests/theme-cli.test.ts`:

```ts
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { beforeEach, describe, expect, it } from 'vitest'

import { runThemeCli } from '../src/lib/tokens/cli.js'
import { tailwindPalette } from '../src/lib/tokens/tailwind-palette.js'

let dir: string

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'mise-theme-'))
  writeFileSync(join(dir, 'package.json'), '{ "type": "module" }')
})

describe('mise-theme', () => {
  it('writes a full theme.css replacement from a config file', async () => {
    writeFileSync(join(dir, 'mise.theme.js'), "export default { base: 'stone', primary: 'teal' }")

    const result = await runThemeCli(['mise.theme.js', '-o', 'src/mise-theme.css'], dir)

    expect(result.code).toBe(0)
    const css = readFileSync(join(dir, 'src', 'mise-theme.css'), 'utf8')
    expect(css).toContain(`--color-primary-600: ${tailwindPalette.teal[600]};`)
    expect(css).toContain('@theme inline {')
    expect(css).toContain("[data-slot='button'][aria-disabled='true']")
  })

  it('prints usage when the arguments are incomplete', async () => {
    const result = await runThemeCli(['mise.theme.js'], dir)
    expect(result.code).toBe(1)
    expect(result.message).toMatch(/^Usage: mise-theme <config> -o <output.css>/)
  })

  it('reports a config without a default export', async () => {
    writeFileSync(join(dir, 'empty.js'), 'export const theme = {}')
    const result = await runThemeCli(['empty.js', '-o', 'out.css'], dir)
    expect(result).toEqual({ code: 1, message: 'empty.js has no default export.' })
  })

  it('reports an invalid config instead of throwing', async () => {
    writeFileSync(join(dir, 'bad.js'), "export default { primary: 'chartreuse' }")
    const result = await runThemeCli(['bad.js', '-o', 'out.css'], dir)
    expect(result.code).toBe(1)
    expect(result.message).toContain('Unknown hue "chartreuse" for primary')
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/theme-cli.test.ts`
Expected: FAIL with `Failed to resolve import "../src/lib/tokens/cli.js"`.

- [ ] **Step 3: Write `src/lib/tokens/cli.ts`**

```ts
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import type { ThemeConfig } from './config.js'
import { themeStylesheet } from './emit-web.js'

const USAGE = 'Usage: mise-theme <config> -o <output.css>'

export interface CliResult {
  code: number
  message: string
}

/**
 * Turns a consumer's `mise.theme.js` into a full replacement for `theme.css`
 * (spec, Theming level 3). The component overrides ship next to this file in
 * `dist/styles/`, so the output matches the packaged stylesheet line for line,
 * apart from the theme.
 */
export async function runThemeCli(argv: string[], cwd = process.cwd()): Promise<CliResult> {
  const [configPath, flag, outputPath] = argv
  if (!configPath || flag !== '-o' || !outputPath) return { code: 1, message: USAGE }

  try {
    const module = await import(pathToFileURL(resolve(cwd, configPath)).href)
    const config: ThemeConfig | undefined = module.default
    if (!config || typeof config !== 'object') {
      return { code: 1, message: `${configPath} has no default export.` }
    }

    const overrides = await readFile(new URL('../styles/components.css', import.meta.url), 'utf8')
    const css = themeStylesheet(config, overrides)
    const target = resolve(cwd, outputPath)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, css)

    return { code: 0, message: `${outputPath}: ${css.split('\n').length} lines` }
  } catch (error) {
    return { code: 1, message: error instanceof Error ? error.message : String(error) }
  }
}
```

- [ ] **Step 4: Write `bin/mise-theme.js`**

```js
#!/usr/bin/env node
import { runThemeCli } from '../dist/tokens/cli.js'

const { code, message } = await runThemeCli(process.argv.slice(2))

if (code === 0) console.log(message)
else console.error(message)

process.exit(code)
```

```bash
chmod +x bin/mise-theme.js
```

- [ ] **Step 5: Run the test to see it pass**

Run: `pnpm vitest run tests/theme-cli.test.ts`
Expected: PASS.

- [ ] **Step 6: Check the built bin end to end**

```bash
pnpm build
printf "export default { base: 'slate', primary: 'rose' }\n" > /tmp/mise-cli-probe.js
node bin/mise-theme.js /tmp/mise-cli-probe.js -o /tmp/mise-cli-probe.css && grep -c "oklch" /tmp/mise-cli-probe.css
```

Expected: `pnpm build` ends with publint reporting no errors (warnings about the `private` field are fine). The bin prints `/tmp/mise-cli-probe.css: N lines`, and the grep count is above 60. If `dist/styles/components.css` is missing, `svelte-package` did not copy the CSS. Stop and report.

> **Amended 2026-11-04, during execution.** Two changes to the code above were
> needed. The committed files are authoritative.
> - **`cli.ts`** reads `components.css` from
>   `join(dirname(fileURLToPath(import.meta.url)), '..', 'styles', 'components.css')`,
>   not from `new URL(…)`. Under jsdom the global `URL` is not Node's, and `fs`
>   rejects it.
> - **The test** writes its configs under the git-ignored `.tmp/` and removes
>   them in `afterEach`. Vitest only loads a module from inside the project
>   root; the OS temp dir failed with "Cannot find module".
> - **`package.json`'s `repository.url`** takes the `git+https://` prefix
>   publint suggested.

- [ ] **Step 7: Run the gate and commit**

Run: `pnpm test`. Expected: all green.

```bash
git add src/lib/tokens/cli.ts bin tests/theme-cli.test.ts
git commit -m "feat(tokens): mise-theme CLI, config file to theme CSS" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Storybook and the foundation stories

**Files:**
- Create: `.storybook/main.ts`, `.storybook/preview.ts`, `.storybook/preview.css`, `stories/palette.stories.svelte`, `stories/geometry.stories.svelte`, `stories/theming.stories.svelte`

**Interfaces:**
- Consumes: `emitThemeVariables`, `presets`, `PresetName`, `RAMP_ROLES`, `STEPS`, `SEMANTIC_TOKENS`, `radiusScale`, `geometryRules` (Tasks 4–5).
- Produces: Storybook globals `scheme` (`'light' | 'dark'`) and `preset` (`PresetName`). Component stories in Tasks 10–15 rely on them.

- [ ] **Step 1: Write `.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/sveltekit'

/**
 * `dist/theme.css` must exist before Storybook starts, because `preview.css`
 * imports it. `pnpm storybook` builds it first. Tailwind comes from
 * vite.config.ts, which the sveltekit framework loads.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.svelte', '../stories/**/*.stories.svelte'],
  addons: ['@storybook/addon-svelte-csf', '@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/sveltekit', options: {} },
}

export default config
```

- [ ] **Step 2: Write `.storybook/preview.css`**

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '../dist/theme.css';

/*
 * Storybook renders this package's own source rather than a consumer's
 * install, so the scan target is `src`. A consuming app needs the
 * node_modules form; see the README.
 */
@source '../src';
@source '../stories';

/*
 * The canvas is `--muted`, the page colour of an operations screen. White is
 * reserved for what sits on it: cards, sidebars, dialogs. A white canvas hides
 * that relationship.
 */
body {
  background: var(--muted);
  color: var(--foreground);
}
```

- [ ] **Step 3: Write `.storybook/preview.ts`**

```ts
import type { Decorator, Preview } from '@storybook/sveltekit'

import { emitThemeVariables, type PresetName, presets } from '../src/lib/tokens.js'
import './preview.css'

const PRESET_STYLE_ID = 'mise-preset'

/**
 * Swaps the theme at runtime by appending `:root` / `.dark` after theme.css.
 * This is Theming level 2 (override the variables in CSS), driven by level 3's
 * emitter, so the toolbar exercises both.
 */
function applyPreset(name: PresetName) {
  let style = document.getElementById(PRESET_STYLE_ID)
  if (!style) {
    style = document.createElement('style')
    style.id = PRESET_STYLE_ID
    document.head.append(style)
  }
  style.textContent = emitThemeVariables(presets[name] ?? presets.zinc)
}

const withTheme: Decorator = (storyFn, context) => {
  document.documentElement.classList.toggle('dark', context.globals.scheme === 'dark')
  applyPreset((context.globals.preset ?? 'zinc') as PresetName)
  return storyFn()
}

const preview: Preview = {
  /*
   * Every story gets a docs page with a props table. For a design system that
   * is most of the value. The `shadcn` / `mise` tags mirror each component's
   * `Origin:` header, and provenance.test.ts fails if they disagree.
   */
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { disabled: true },
    a11y: { test: 'error' },
  },
  globalTypes: {
    scheme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Scheme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    preset: {
      description: 'Theme preset',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: Object.keys(presets).map((name) => ({ value: name, title: name })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { scheme: 'light', preset: 'zinc' },
  decorators: [withTheme],
}

export default preview
```

- [ ] **Step 4: Write the foundation stories**

`stories/palette.stories.svelte`:

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { RAMP_ROLES, SEMANTIC_TOKENS, STEPS } from '../src/lib/tokens.js'

  /**
   * The six role ramps `:root` carries, and the semantic tokens that read them.
   * Switch the Theme toolbar to watch a preset move both.
   */
  const { Story } = defineMeta({ title: 'Foundations/Palette', tags: ['!autodocs'] })
</script>

<Story name="Ramps">
  <div class="grid gap-2">
    {#each RAMP_ROLES as role}
      <div class="grid grid-cols-[6rem_repeat(11,minmax(0,1fr))] items-center gap-1">
        <span class="text-muted-foreground text-xs">{role}</span>
        {#each STEPS as step}
          <div
            class="h-10 rounded-md"
            style="background: var(--color-{role}-{step})"
            title="--color-{role}-{step}"
          ></div>
        {/each}
      </div>
    {/each}
  </div>
</Story>

<Story name="Semantic">
  <div class="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3">
    {#each SEMANTIC_TOKENS as token}
      <div class="bg-card flex items-center gap-3 rounded-xl p-2 ring-1 ring-foreground/5">
        <div class="size-8 shrink-0 rounded-md ring-1 ring-foreground/10" style="background: var({token})"></div>
        <code class="text-xs">{token}</code>
      </div>
    {/each}
  </div>
</Story>
```

`stories/geometry.stories.svelte`:

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { geometryRules, radiusScale } from '../src/lib/tokens.js'

  const { Story } = defineMeta({ title: 'Foundations/Geometry', tags: ['!autodocs'] })
</script>

<Story name="Radii">
  <div class="flex flex-wrap gap-4">
    {#each Object.keys(radiusScale) as token}
      <div class="grid justify-items-center gap-2">
        <div class="bg-card size-20 ring-1 ring-foreground/10" style="border-radius: var({token})"></div>
        <code class="text-xs">{token}</code>
      </div>
    {/each}
  </div>
</Story>

<Story name="Control rules">
  <table class="bg-card w-fit rounded-xl text-sm ring-1 ring-foreground/5">
    <tbody>
      {#each Object.entries(geometryRules) as [element, rule]}
        <tr class="border-b last:border-b-0">
          <td class="px-3 py-2">{element}</td>
          <td class="px-3 py-2"><code class="text-xs">{rule}</code></td>
        </tr>
      {/each}
    </tbody>
  </table>
</Story>
```

`stories/theming.stories.svelte`:

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  /**
   * Theming level 2 in the browser: semantic tokens overridden on a wrapper,
   * with no tooling. The -soft tints are color-mix() of their ink, so they
   * follow without being touched.
   */
  const { Story } = defineMeta({ title: 'Foundations/Theming', tags: ['!autodocs'] })
</script>

{#snippet sample()}
  <div class="bg-card grid w-64 gap-3 rounded-[min(var(--radius-4xl),24px)] p-5 shadow-sm ring-1 ring-foreground/5">
    <p class="font-heading text-base font-medium">Morning shift</p>
    <p class="text-muted-foreground text-sm">12 orders waiting at the Riverside location.</p>
    <span class="bg-primary-soft text-primary w-fit rounded-lg px-2 py-0.5 text-xs font-medium">On track</span>
    <span class="bg-primary text-primary-foreground w-fit rounded-2xl px-4 py-2 text-sm font-medium">Open orders</span>
  </div>
{/snippet}

<Story name="CSS override">
  <div class="flex flex-wrap gap-6">
    {@render sample()}
    <div style="--primary: oklch(0.6 0.15 160); --radius: 0.25rem;">
      {@render sample()}
    </div>
  </div>
</Story>
```

- [ ] **Step 5: Build Storybook**

Run: `pnpm build:storybook`
Expected: it exits 0 and writes `storybook-static/`. If `@storybook/sveltekit` needs a config key this plan does not show, follow its error message and record the change in the commit body.

- [ ] **Step 6: Check it in the browser**

Run: `pnpm storybook`, open `http://localhost:6006`, and confirm:
- `Foundations/Palette/Ramps` shows six rows of eleven swatches.
- The Theme toolbar's `stone` changes the base row.
- `teal-on-stone` changes the primary row.
- The Scheme toolbar's `Dark` turns the canvas near-black.
- `Foundations/Theming/CSS override` shows a green, square-cornered second card.

Stop the server.

- [ ] **Step 7: Run the gate and commit**

Run: `pnpm test`. Expected: all green.

```bash
git add .storybook stories
git commit -m "feat(storybook): Storybook with scheme and preset toolbars, foundation stories" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: CI and README

**Files:**
- Create: `.github/workflows/ci.yml`, `README.md`

**Interfaces:**
- Consumes: the `pnpm test`, `pnpm build` and `pnpm build:storybook` scripts (Task 2).

- [ ] **Step 1: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Types, lint and tests
        run: pnpm test
      - name: Package and publint
        run: pnpm build
      - name: Storybook builds
        run: pnpm build:storybook
```

`pnpm/action-setup` reads the version from `packageManager` in `package.json`.

- [ ] **Step 2: Write `README.md`**

````markdown
# mise-design-system

Svelte 5 components and a configurable Tailwind v4 theme for operations
dashboards: locations, shifts, orders, stock.

> **Status:** pre-1.0 and not yet published. It is reviewed in Storybook
> while the component set is ported in rounds. How it ships is decided before v1.

mise ports the API of a React design system to Svelte 5 and
[bits-ui](https://bits-ui.com). Its Svelte mechanics follow
[shadcn-svelte](https://shadcn-svelte.com). It ships a neutral default theme
(zinc with an indigo brand), which a consuming app configures on top.

## Install

```sh
pnpm add @jovertical/mise-design-system
pnpm add -D tailwindcss tw-animate-css
```

`svelte`, `tailwindcss` and `tw-animate-css` are peer dependencies. Your own
stylesheet imports all three, so they resolve from your install.

## Set up

In your app's main stylesheet:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '@jovertical/mise-design-system/theme.css';
@source '../node_modules/@jovertical/mise-design-system/dist';
```

The `@source` line is required. Tailwind v4 skips `node_modules` when it
looks for classes, so without it every component renders unstyled. Adjust the
relative path to where your stylesheet lives.

Dark mode is the `.dark` class on an ancestor, usually `<html>`.

```svelte
<script lang="ts">
  import { Button } from '@jovertical/mise-design-system'
</script>

<Button>Open orders</Button>
<Button variant="outline" href="/shifts">Shifts</Button>
```

## Theming

Three levels, each optional.

**1. Use the default.** The imports above are all it takes.

**2. Override tokens in CSS.** The semantic tokens are a documented contract:
`--background`, `--foreground`, `--primary`, `--muted`, `--muted-foreground`,
`--border`, `--success`, `--warning`, `--destructive`, `--radius`,
`--font-sans`, `--font-heading`, `--font-mono`, and the rest listed in
`SEMANTIC_TOKENS`. Override any of them after the import:

```css
:root { --primary: oklch(0.6 0.15 160); --radius: 0.5rem; }
.dark { --primary: oklch(0.75 0.13 160); }
```

The `-soft` tints are `color-mix()` of their ink, so they follow automatically.

**3. Generate a theme from a config.** For a different base, brand ramp or
status mapping:

```js
// mise.theme.js
import { defineTheme } from '@jovertical/mise-design-system/tokens'

export default defineTheme({
  base: 'stone',              // zinc | slate | gray | neutral | stone
  primary: 'teal',            // a Tailwind hue name, or a custom 50–950 ramp
  status: { warning: 'orange' },
  radius: '0.5rem',
  fonts: { sans: "'Inter', system-ui, sans-serif" },
  light: { '--sidebar': 'oklch(0.98 0 0)' },
  dark: { '--sidebar': 'oklch(0.2 0 0)' },
})
```

```sh
npx mise-theme mise.theme.js -o src/mise-theme.css
```

Import `src/mise-theme.css` in place of `theme.css`. `emitThemeCss(config)`
is exported from `/tokens` too, if you would rather call it in your own build
script.

## Develop

```sh
pnpm install
pnpm storybook        # http://localhost:6006
pnpm test             # svelte-check, lint, unit tests
pnpm build            # dist/ + dist/theme.css, then publint
```

## Licence

MIT. Tailwind CSS's palette, shadcn/ui and shadcn-svelte are MIT too; their
notices are in `LICENSES/`.
````

- [ ] **Step 3: Check the README against the code**

Every name the README uses must exist: `defineTheme`, `emitThemeCss`, `SEMANTIC_TOKENS` in `src/lib/tokens.ts`; the CLI flags in `cli.ts`; the bases in `presets.ts`.

```bash
for name in defineTheme emitThemeCss SEMANTIC_TOKENS; do grep -q "$name" src/lib/tokens.ts && echo "ok $name" || echo "MISSING $name"; done
```

Expected: three `ok` lines.

- [ ] **Step 4: Commit**

```bash
git add .github README.md
git commit -m "docs: README and the CI workflow" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: AI tooling

**Files:**
- Create: `CLAUDE.md`, `AGENTS.md`, `docs/naming.md`, `.ai/guidelines/architecture/guide.md`, `.ai/guidelines/theming/guide.md`, `.claude/skills/{authors-components,changes-tokens,git-workflow,vitest-testing,documents-updates,writes-clean-code}/SKILL.md`
- Modify: `.ai/guidelines/style/guide.md` (from Task 2)

**Interfaces:**
- Produces: the rules later component tasks follow. Tasks 10–15 activate `authors-components` and `vitest-testing`.

- [ ] **Step 1: Write `CLAUDE.md`**

```markdown
# mise-design-system

> **Read first:** `docs/specs/2026-11-04-svelte-port-design.md` (what this is
> and why), then `.ai/guidelines/architecture/guide.md`,
> `.ai/guidelines/style/guide.md` and `.ai/guidelines/theming/guide.md`.
> `docs/naming.md` is the naming authority.

## What this is

A public, MIT-licensed Svelte 5 component library and Tailwind v4 theme for
operations dashboards. It ports the API of the React package
2.23.0 ("the React package", a local checkout at
`<react-package>`) but not its brand.
The React package is read-only; never change it. shadcn-svelte is the
reference for Svelte and bits-ui mechanics only.

It is ported in rounds. Each round ends with the user reviewing it in
Storybook, and the next round starts only on an explicit go.

## Stack

Svelte 5 · SvelteKit 3 as build tooling only · `@sveltejs/package` ·
TypeScript ~6.0 · Tailwind CSS 4 · bits-ui 2 · class-variance-authority ·
`@lucide/svelte` · Vitest + Testing Library (jsdom) · Storybook 10
(`@storybook/sveltekit`, `addon-svelte-csf`) · Biome · pnpm.

## Rules

- Prop names, values and defaults match the React component. Only the
  mechanics change (spec, "Component API translation"). Classes are copied
  character for character.
- Components never import `$app/*`. They are plain Svelte 5.
- Relative imports in `.ts` files under `src/lib` end in `.js`.
- Every component module opens with an `Origin:` / `Svelte:` / `Diverged:`
  header. `tests/provenance.test.ts` enforces it, and the story's `tags`
  must match.
- Every component folder is re-exported from `src/lib/index.ts`, and its runtime
  names are listed in `tests/barrel.test.ts`.
- Colours come from the semantic tokens and the `Tone` maps in
  `src/lib/utils/tone.ts`. A component never writes a colour of its own.
- Story copy is generic operations: locations, shifts, orders, stock.
  Nothing product-specific.
- Publishing is deferred until v1. `package.json` stays `"private": true`.
- Dependencies are installed by the user, not by the agent.

## Commands

- `pnpm storybook`: build the theme and start Storybook on :6006
- `pnpm test`: svelte-check, lint, unit tests
- `pnpm build`: `svelte-package`, `dist/theme.css`, publint

## Skills

Activate the matching skill before working in its area:

- `authors-components`: adding or changing anything in `src/lib/components/`
- `changes-tokens`: anything in `src/lib/tokens/` or `src/lib/styles/`
- `vitest-testing`: writing or fixing a test
- `git-workflow`: committing or pushing
- `documents-updates`: after a component, default, token or flow change
- `writes-clean-code`: every code change
```

```bash
cp CLAUDE.md AGENTS.md
```

- [ ] **Step 2: Copy and adapt `docs/naming.md`**

```bash
cp <react-package>/docs/naming.md docs/naming.md
```

Edit it as follows:
- **Section 0:** replace the paragraph about the Cargorix template and the portals with: "The React package's names decide. mise does not rename a component the React package ships, so a name can be looked up in either library."
- **Section 1:** keep the rule. Change "`Origin: shadcn/ui new-york <name>`" to "an `Origin:` line that ends in `shadcn/ui new-york <name>`". Change "`rg -l 'Origin: the React package' src/components`" to "`rg -L 'shadcn/ui' src/lib/components`".
- **Elsewhere:** remove every count taken from the portals ("36 of 152 badges…"), leaving the rule each count supported. Replace "the portals" with "consumers".

- [ ] **Step 3: Write `.ai/guidelines/architecture/guide.md`**

```markdown
# Architecture

## Entries

| Entry | File | What it is |
|---|---|---|
| `.` | `src/lib/index.ts` | Components and utilities. Svelte, so it carries the `svelte` export condition |
| `./tokens` | `src/lib/tokens.ts` | Pure TypeScript: theme config, presets, emitters. No Svelte |
| `./theme.css` | `dist/theme.css` | Written by `scripts/build-theme.ts`, never by hand |
| `mise-theme` | `bin/mise-theme.js` → `src/lib/tokens/cli.ts` | Node only, so it is not exported from `./tokens` |

## Where a file goes

- A component lives in `src/lib/components/<name>/`, with one `.svelte` file per
  part (`card.svelte`, `card-header.svelte`, …), an `index.ts` re-exporting the
  parts under their flat names (`Card`, `CardHeader`), a `<name>.stories.svelte`,
  and a `<name>-variants.ts` when the React package has a cva map worth importing
  on its own.
- A Props type is exported from the part's `<script module>` block as
  `<Part>Props`.
- Shared helpers go in `src/lib/utils/`. Token code goes in `src/lib/tokens/`.
- Tests are in `tests/`, named after the component. Fixtures that compose
  several parts are in `tests/fixtures/`.
- Foundation stories (palette, geometry, theming) are in `stories/`.

## Porting a component

1. Read the React file, its stories, and the shadcn-svelte component of the
   same name.
2. Keep the React API and classes. Take bits-ui wiring, snippets and `bind:`
   from shadcn-svelte.
3. Record anything else that changed on the `Diverged:` line.
```

- [ ] **Step 4: Complete `.ai/guidelines/style/guide.md`**

Keep Task 2's "Lint and format" section, and append:

```markdown
## TypeScript and Svelte

- Svelte 5 runes only: `$props`, `$state`, `$derived`, `$bindable`. No stores
  and no `export let`.
- Destructure `class: className` and pass it last to `cn(...)`, so a caller
  can override any class.
- Pass `...rest` to the root element or primitive last, so callers can set any
  attribute, including `data-*` and `aria-*`.
- A snippet prop renders inside a `div`, as a `ReactNode` prop did in the
  React package.
- `bind:ref` on every part.

## Comments

Every component opens with this header, as an HTML comment in `.svelte` files
and a JSDoc block in `.ts` files:

    Origin: the React package 2.23.0 `<file>.tsx`[ (`<Part>`)], itself shadcn/ui new-york `<name>`
    Svelte: shadcn-svelte `<name>`          (only when shadcn-svelte was used)
    Diverged: <what changed beyond the port, or "none">

Carry over the React package's prose comments on a prop or a part when they
explain a choice. Drop the counts taken from the portals.

## Story copy

Generic operations: locations, shifts, orders, stock, registers. Never
a product name, a portal, or a real business name.
```

- [ ] **Step 5: Write `.ai/guidelines/theming/guide.md`**

```markdown
# Theming

`src/lib/tokens/` turns a `ThemeConfig` into CSS. Nothing else writes theme CSS.

- `tailwind-palette.ts` is generated by `scripts/copy-tailwind-palette.ts`.
  Never edit it by hand.
- `presets.ts`: the bases, `defaultTheme` (zinc, indigo; D11) and Storybook's
  presets.
- `config.ts`: `ThemeConfig` → `ResolvedTheme`, failing loudly on an unknown
  hue or an incomplete ramp.
- `semantic.ts`: the public token contract (`SEMANTIC_TOKENS`) and its light
  and dark values. Values point at role ramps (`var(--color-primary-600)`),
  never at literals, except white and the dark-mode translucent borders.
- `emit-web.ts`: the `@theme inline` bridge, `:root`, `.dark`, base and print.

## Rules

- A bridge line never points a utility at a ramp step:
  `--color-primary: var(--color-primary-600)` would freeze `bg-primary` in one
  scheme. `tests/theme.test.ts` enforces it.
- A new semantic token goes into `SEMANTIC_TOKENS` and both scheme functions,
  in the same position. The test checks both blocks.
- Ramp values are literals in `:root`, because Tailwind prunes theme variables
  nobody uses.
- `components.css` is for what a class string cannot say. It is appended after
  the generated theme.
```

- [ ] **Step 6: Adapt the six skills**

For each of `authors-components`, `changes-tokens`, `git-workflow`, `vitest-testing`, `documents-updates`, `writes-clean-code`:

```bash
mkdir -p .claude/skills/<skill>
cp <react-package>/.claude/skills/<skill>/SKILL.md .claude/skills/<skill>/SKILL.md
```

Then apply these edits to every copied skill:
- Replace `src/components/<x>.tsx` with `src/lib/components/<x>/<x>.svelte`, `src/lib/` with `src/lib/utils/`, `src/tokens/` with `src/lib/tokens/`, and `src/styles/` with `src/lib/styles/`.
- Replace React mechanics with the spec's translation table: `className` → `class`, `asChild` → `href` or bits-ui `child`, `React.ComponentProps<'x'>` → `HTMLXAttributes` from `svelte/elements`, `@testing-library/react` → `@testing-library/svelte`, `.stories.tsx` → `.stories.svelte` with `defineMeta`.
- Remove every section about the portals, consumer verification, GitHub Packages, release-please, `docs/theme-fixes.md`, the palette parity suite, `/native`, and the `.cursor` / `.github` mirrors and their lint.
- Replace `pnpm test:types` with `pnpm check`, `pnpm test:lint` with `pnpm lint`, and `pnpm test:unit` with `pnpm test:unit`.

Specific to each skill:
- **`authors-components`:** the header format is the one in the style guide. The barrel step is "add `export * from './components/<name>/index.js'` and append the runtime names to `EXPECTED_EXPORTS`".
- **`changes-tokens`:** point it at `.ai/guidelines/theming/guide.md`, and make its gate `tests/theme.test.ts` and `tests/theme-config.test.ts`.
- **`git-workflow`:** base `main`, commit directly to `main` until there is a reason for PRs, component-scoped conventional commits, push only at a phase or round gate, and no "Consumer impact" section.
- **`vitest-testing`:** keep the structural-suite section (provenance, barrel, theme) and the Testing Library section. Add: "Render a snippet child with `createRawSnippet` from `svelte`, or compose parts in a fixture under `tests/fixtures/`."

Then check that nothing product-specific survived:

```bash
grep -rniE "portal|release-please|theme-fixes|github packages|native|\.cursor|cargorix" .claude/skills CLAUDE.md docs/naming.md .ai || echo "clean"
```

Expected: `clean`, or only lines where the word is used generically. Read each remaining hit and fix it.

> **Amended 2026-11-04, during execution.** The React skills turned out to be
> mostly about the portals, consumer scans and release-please, so search-and-replace
> would have left little. Each skill was rewritten around mise instead, keeping
> the React version's structure and rules where they apply. `docs/naming.md`
> was adapted the same way.

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md AGENTS.md docs/naming.md .ai .claude
git commit -m "docs: CLAUDE.md, guides and skills adapted from the React package" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Phase B gate

Stop. Report Tasks 6–9 in the phase-gates format, including any Storybook config change that Task 7 needed. Wait for approval, then run `git push origin main` and check that CI passes:

```bash
gh run watch --repo jovertical/mise-design-system --exit-status
```

If CI fails, report the failing step's decisive line, and do not start Phase C.

---

# Phase C — Round 1: core components (Tasks 10–14)

Every component task follows the same loop:
1. Read the React file and its stories.
2. Read the shadcn-svelte component of the same name.
3. Write the failing test.
4. Write the parts.
5. Write `index.ts`, the barrel line and the `EXPECTED_EXPORTS` entries.
6. Write the stories.
7. Run `pnpm test`, check in Storybook, commit.

Activate the `authors-components` and `vitest-testing` skills first.

**Porting stories:** each component task lists the React story exports to port, by name. Port each one to a `<Story name="…">` with the same name in words ("PrimaryAndSecondary" → `name="Primary and secondary"`), keep the React JSDoc above it as an HTML comment, and translate its markup with the spec's table and the copy rules in Global Constraints. Anything a React story renders with `render: () => (…)` becomes a `{#snippet template()}` or plain children of `<Story>`. Task 11 ports `Button`'s stories in full as the worked example.

### Task 10: Card, the provenance suite and the `OnACard` story wrapper

**Files:**
- Create: `src/lib/components/card/{card,card-header,card-title,card-description,card-action,card-content,card-footer}.svelte`, `src/lib/components/card/index.ts`, `src/lib/components/card/card.stories.svelte`, `stories/on-a-card.svelte`
- Modify: `src/lib/index.ts`, `tests/barrel.test.ts`
- Test: `tests/provenance.test.ts`, `tests/card.test.ts`, `tests/fixtures/card-composition.svelte`

**Interfaces:**
- Consumes: `cn`, `WithElementRef` (Task 3).
- Produces: `Card` (`variant?: 'default' | 'ghost'`), `CardHeader` (`divided?: boolean`), `CardTitle`, `CardDescription`, `CardAction`, `CardContent` (`stack?: 'sm' | 'md' | 'lg'`), `CardFooter` (`bleed?: boolean`, `divided?: boolean`, `variant?: 'default' | 'muted'`). Every part takes `class`, `ref` (bindable), `children` and rest attributes. Also `stories/on-a-card.svelte`, which renders its children inside `Card` + `CardContent` with `class="w-fit"`.

- [ ] **Step 1: Write the provenance suite**

`tests/provenance.test.ts`:

```ts
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

/**
 * A provenance header is only useful if it is true, and nobody checks a header
 * by hand. The `Origin:` line names the React file each module was ported
 * from. The story's `tags` project the same fact into the Storybook sidebar
 * (`shadcn` when that React file descends from shadcn/ui, `mise` when the
 * React package authored it), and are checked against the header.
 *
 * Ported from the React package 2.23.0 tests/provenance.test.ts.
 */

const components = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'lib', 'components')

const folders = existsSync(components)
  ? readdirSync(components, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : []

const isStory = (name: string) => name.endsWith('.stories.svelte')
const isModule = (name: string) =>
  (name.endsWith('.svelte') || name.endsWith('.ts')) && !isStory(name) && name !== 'index.ts'

const modules = folders
  .flatMap((folder) =>
    readdirSync(join(components, folder))
      .filter(isModule)
      .map((name) => `${folder}/${name}`),
  )
  .sort()

const read = (path: string) => readFileSync(join(components, path), 'utf8')

/** The opening comment: `<!-- … -->` in a .svelte file, `/** … *\/` in a .ts file. */
function header(path: string): string | null {
  const pattern = path.endsWith('.svelte') ? /^<!--([\s\S]*?)-->/ : /^\/\*\*([\s\S]*?)\*\//
  return read(path).match(pattern)?.[1] ?? null
}

function field(path: string, key: string): string | null {
  const match = (header(path) ?? '').match(new RegExp(`^[\\s*]*${key}:\\s*(.+)$`, 'm'))
  return match ? match[1].trim() : null
}

const ORIGIN = /^the React package 2\.23\.0 `[a-z-]+\.tsx?`/
const SVELTE = /^shadcn-svelte `[a-z-]+`/

const provenanceOf = (path: string) =>
  field(path, 'Origin')?.includes('shadcn/ui') ? 'shadcn' : 'mise'

describe('Origin headers', () => {
  it('opens every component module with a header comment', () => {
    expect(modules.filter((path) => header(path) === null)).toEqual([])
  })

  it('names the React file each module was ported from', () => {
    expect(modules.filter((path) => !ORIGIN.test(field(path, 'Origin') ?? ''))).toEqual([])
  })

  it('records a Diverged line in every module, "none" included', () => {
    expect(modules.filter((path) => field(path, 'Diverged') === null)).toEqual([])
  })

  it('names a shadcn-svelte component wherever a Svelte line is present', () => {
    const wrong = modules.filter((path) => {
      const value = field(path, 'Svelte')
      return value !== null && !SVELTE.test(value)
    })
    expect(wrong).toEqual([])
  })
})

describe('Storybook tags', () => {
  it('gives every component folder a story tagged with its provenance', () => {
    const wrong = folders.flatMap((folder) => {
      const story = `${folder}/${folder}.stories.svelte`
      if (!existsSync(join(components, story))) return [`${story} is missing`]

      const tags = read(story).match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? ''
      const expected = provenanceOf(`${folder}/${folder}.svelte`)
      return tags.includes(`'${expected}'`) ? [] : [`${story} should be tagged '${expected}'`]
    })
    expect(wrong).toEqual([])
  })
})
```

Run: `pnpm vitest run tests/provenance.test.ts`
Expected: PASS. There are no folders yet, so every list is empty.

- [ ] **Step 2: Write the failing Card test**

`tests/fixtures/card-composition.svelte`:

```svelte
<script lang="ts">
  import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '../../src/lib/index.js'

  let {
    variant = 'default',
    divided = false,
    stack,
    bleed = false,
    footerVariant = 'default',
  }: {
    variant?: 'default' | 'ghost'
    divided?: boolean
    stack?: 'sm' | 'md' | 'lg'
    bleed?: boolean
    footerVariant?: 'default' | 'muted'
  } = $props()
</script>

<Card {variant} class="extra-card">
  <CardHeader {divided}>
    <CardTitle>Morning shift</CardTitle>
    <CardDescription>Riverside location</CardDescription>
    <CardAction>Edit</CardAction>
  </CardHeader>
  <CardContent {stack}>12 orders</CardContent>
  <CardFooter {bleed} variant={footerVariant}>View all orders</CardFooter>
</Card>
```

`tests/card.test.ts`:

```ts
import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import CardComposition from './fixtures/card-composition.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe('Card', () => {
  it('renders every part with its data-slot, nested as composed', () => {
    const { container } = render(CardComposition)
    const card = slot(container, 'card')
    for (const part of ['card-header', 'card-title', 'card-description', 'card-action', 'card-content', 'card-footer']) {
      expect(card.contains(slot(container, part)), part).toBe(true)
    }
    expect(slot(container, 'card-title')).toHaveTextContent('Morning shift')
  })

  it('defaults to the raised surface and merges a caller class', () => {
    const card = slot(render(CardComposition).container, 'card')
    expect(card).toHaveAttribute('data-variant', 'default')
    expect(card).toHaveClass('bg-card', 'shadow-sm', 'extra-card')
  })

  it('drops the surface for the ghost variant', () => {
    const card = slot(render(CardComposition, { variant: 'ghost' }).container, 'card')
    expect(card).toHaveClass('bg-transparent', 'shadow-none')
    expect(card).not.toHaveClass('bg-card')
  })

  it('draws the header rule only when divided', () => {
    expect(slot(render(CardComposition).container, 'card-header')).not.toHaveClass('border-b')
    expect(slot(render(CardComposition, { divided: true }).container, 'card-header')).toHaveClass('border-b')
  })

  it('stacks content at the named gap', () => {
    const content = slot(render(CardComposition, { stack: 'md' }).container, 'card-content')
    expect(content).toHaveAttribute('data-stack', 'md')
    expect(content).toHaveClass('flex', 'flex-col', 'gap-4')
  })

  it('marks a bleed footer and a muted footer', () => {
    expect(slot(render(CardComposition, { bleed: true }).container, 'card-footer')).toHaveAttribute('data-bleed', 'true')
    const muted = slot(render(CardComposition, { footerVariant: 'muted' }).container, 'card-footer')
    expect(muted).toHaveAttribute('data-variant', 'muted')
    expect(muted).toHaveClass('bg-muted/40')
  })
})
```

Run: `pnpm vitest run tests/card.test.ts`
Expected: FAIL. `Card` is not exported from `src/lib/index.js`.

- [ ] **Step 3: Write `card.svelte`**

```svelte
<!--
  Origin: the React package 2.23.0 `card.tsx` (`Card`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port. The React header lists the divergences from shadcn.
-->
<script lang="ts" module>
  import { cva, type VariantProps } from 'class-variance-authority'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../utils/types.js'

  export const cardVariants = cva(
    'ring-foreground/5 dark:ring-foreground/10 flex flex-col gap-4 rounded-[min(var(--radius-4xl),24px)] py-(--card-spacing) shadow-sm ring-1 [--card-spacing:--spacing(5)]',
    {
      variants: {
        variant: {
          default: 'bg-card text-card-foreground',
          ghost: 'bg-transparent shadow-none ring-0 py-0 gap-2',
        },
      },
      defaultVariants: { variant: 'default' },
    },
  )

  export type CardVariant = NonNullable<VariantProps<typeof cardVariants>['variant']>

  /**
   * Padding is a `--card-spacing` variable on both axes, so a full-bleed child
   * can cancel it. `ghost` drops the surface for a titled section that sits
   * straight on the page.
   */
  export type CardProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & { variant?: CardVariant }
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'

  let {
    variant = 'default',
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CardProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card"
  data-variant={variant}
  class={cn(cardVariants({ variant }), className)}
  {...rest}
>
  {@render children?.()}
</div>
```

- [ ] **Step 4: Write the other six parts**

Each part follows `card.svelte`'s shape: a header comment, a `<script module>` that exports `<Part>Props`, and an instance script that destructures `ref = $bindable(null)`, `class: className`, `children` and `...rest`, then renders one `<div bind:this={ref} data-slot="…" class={cn(…, className)} {...rest}>{@render children?.()}</div>`. Copy each part's prose comment from `card.tsx` onto its Props type as JSDoc, dropping the portal counts. Here is each part's full source.

`card-header.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardHeader`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../utils/types.js'

  /**
   * The two explicit row tracks appear only when a `CardAction` is present, so
   * a title-only header carries no empty second row and gutter. `divided`
   * draws the rule under the header as a prop, rather than a `border-b` a
   * caller has to know works.
   */
  export type CardHeaderProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    divided?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'

  let {
    divided = false,
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CardHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-header"
  class={cn(
    '@container/card-header grid auto-rows-min items-start gap-1 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
    divided && 'border-b',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
```

`card-title.svelte`: the same shape, with `export type CardTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>>` and JSDoc "A flex row, so a hint or a status badge sits on the title's baseline. `min-w-0` lets a long title truncate against its neighbour." It renders `data-slot="card-title"` with class `cn('font-heading flex min-w-0 items-center gap-2 text-base font-medium', className)`.

`card-description.svelte`: the same shape, with `CardDescriptionProps = WithElementRef<HTMLAttributes<HTMLDivElement>>`, `data-slot="card-description"`, and class `cn('text-muted-foreground text-sm', className)`.

`card-action.svelte`: the same shape, with `CardActionProps = WithElementRef<HTMLAttributes<HTMLDivElement>>` and JSDoc "The header's top-right slot, for something the reader can do: a menu, an Edit link, a view toggle. Not a place to park a figure." It renders `data-slot="card-action"` with class `cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)`.

`card-content.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardContent`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../utils/types.js'

  export const CONTENT_STACK_CLASS = {
    sm: 'flex flex-col gap-3',
    md: 'flex flex-col gap-4',
    lg: 'flex flex-col gap-6',
  } as const

  /**
   * `stack` turns on a vertical flex with a gap, for content that is several
   * blocks rather than one. Off by default: one child needs no layout.
   */
  export type CardContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    stack?: keyof typeof CONTENT_STACK_CLASS
  }
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'

  let { stack, ref = $bindable(null), class: className, children, ...rest }: CardContentProps =
    $props()
</script>

<div
  bind:this={ref}
  data-slot="card-content"
  data-stack={stack}
  class={cn('px-(--card-spacing)', stack && CONTENT_STACK_CLASS[stack], className)}
  {...rest}
>
  {@render children?.()}
</div>
```

`card-footer.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardFooter`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../utils/types.js'

  /**
   * `bleed` runs the footer to the card's edges, for a footer that is one wide
   * target ("View all orders →"). It cancels the card's bottom padding, drops
   * the horizontal padding, gives a Button inside the card's gutter back, and
   * rounds and clips the bottom corners. `divided` draws the rule above it.
   * `variant="muted"` is the recessed band, with a bottom radius that matches
   * the card's own.
   */
  export type CardFooterProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    bleed?: boolean
    divided?: boolean
    variant?: 'default' | 'muted'
  }
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'

  let {
    bleed = false,
    divided = false,
    variant = 'default',
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CardFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-footer"
  data-bleed={bleed || undefined}
  data-variant={variant}
  class={cn(
    'flex items-center px-(--card-spacing) [.border-t]:pt-(--card-spacing)',
    divided && 'border-t',
    variant === 'muted' &&
      'bg-muted/40 text-muted-foreground rounded-b-[min(var(--radius-4xl),24px)] py-3 text-sm',
    bleed &&
      '-mb-(--card-spacing) overflow-hidden rounded-b-[min(var(--radius-4xl),24px)] px-0 [.border-t]:pt-0 [&_[data-slot=button]]:px-(--card-spacing)',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
```

Write `card-title.svelte`, `card-description.svelte` and `card-action.svelte` in full from the descriptions above. Each has its own header comment, with `(\`CardTitle\`)` and so on in the Origin line.

- [ ] **Step 5: Write `index.ts`, the barrel line and the expected exports**

`src/lib/components/card/index.ts`:

```ts
export { default as Card, type CardProps, type CardVariant } from './card.svelte'
export { default as CardAction, type CardActionProps } from './card-action.svelte'
export { default as CardContent, type CardContentProps } from './card-content.svelte'
export { default as CardDescription, type CardDescriptionProps } from './card-description.svelte'
export { default as CardFooter, type CardFooterProps } from './card-footer.svelte'
export { default as CardHeader, type CardHeaderProps } from './card-header.svelte'
export { default as CardTitle, type CardTitleProps } from './card-title.svelte'
```

Append to `src/lib/index.ts`:

```ts

export * from './components/card/index.js'
```

Append to `EXPECTED_EXPORTS` in `tests/barrel.test.ts`: `'Card', 'CardAction', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardTitle'`.

- [ ] **Step 6: Run the tests to see them pass**

Run: `pnpm vitest run tests/card.test.ts tests/barrel.test.ts tests/provenance.test.ts`
Expected: the Card and barrel tests PASS. Provenance FAILS with `card/card.stories.svelte is missing`. The next step fixes that.

- [ ] **Step 7: Write the story wrapper and the Card stories**

`stories/on-a-card.svelte`:

```svelte
<!--
  Draws a story on a card, for components that live on one. The canvas is
  --muted, and so is every neutral wash (a soft badge, a soft button). On the
  bare canvas those vanish and look like a bug that is not there.
-->
<script lang="ts">
  import type { Snippet } from 'svelte'

  import { Card, CardContent } from '../src/lib/index.js'

  let { children }: { children: Snippet } = $props()
</script>

<Card class="w-fit">
  <CardContent>{@render children()}</CardContent>
</Card>
```

`src/lib/components/card/card.stories.svelte` opens with:

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Card from './card.svelte'
  import CardContent from './card-content.svelte'
  import CardDescription from './card-description.svelte'
  import CardFooter from './card-footer.svelte'
  import CardHeader from './card-header.svelte'
  import CardTitle from './card-title.svelte'

  const { Story } = defineMeta({
    title: 'Primitives/Card',
    component: Card,
    tags: ['shadcn'],
    argTypes: { variant: { control: 'inline-radio', options: ['default', 'ghost'] } },
  })
</script>
```

Port these React stories from `card.stories.tsx`: **Default**, **ContentOnly**, **MutedFooter**, **Ghost**.

Deferred, with the component that blocks each:
- **WithAction**, **WithFooter**, **BleedFooterLink**: `Button`. Task 11 adds these.
- **TitleWithHint**: `Tooltip`, round 2.
- **AsAList**: `CardList`, round 5 triage.
- **ProgressPanel**: `MetricBar`, `RadialStat` and `Separator`, rounds 4–5.

Record the round-2+ deferrals in a comment at the top of the module script:

```svelte
  // Deferred until their components are ported: TitleWithHint (Tooltip),
  // AsAList (CardList), ProgressPanel (MetricBar, RadialStat, Separator).
```

- [ ] **Step 8: Run the gate and check Storybook**

Run: `pnpm test`. Expected: all green, provenance included.

Run `pnpm storybook` and check `Primitives/Card` in light, dark and `teal-on-stone`. The radius should follow the preset's `0.5rem`, clamped at 24px. Stop the server.

- [ ] **Step 9: Commit**

```bash
git add src/lib stories tests
git commit -m "feat(card): port Card and its parts, with the provenance suite" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Button

**Files:**
- Create: `src/lib/components/button/button-variants.ts`, `src/lib/components/button/button.svelte`, `src/lib/components/button/index.ts`, `src/lib/components/button/button.stories.svelte`
- Modify: `src/lib/index.ts`, `tests/barrel.test.ts`, `src/lib/components/card/card.stories.svelte`
- Test: `tests/button.test.ts`, `tests/snippet.ts`

**Interfaces:**
- Consumes: `cn`, `Tone`, `TONES`, `WithElementRef` (Task 3); `OnACard`, `CardHeader`, `CardFooter`, `CardAction` (Task 10).
- Produces:
  - `Button`, with props `variant?: ButtonVariant` (default `'solid'`), `tone?: Tone` (default from `defaultButtonTone`), `size?: ButtonSize` (default `'md'`), `iconOnly?: boolean` (default `false`), `href?: string`, `disabled?: boolean`, `ref` (bindable), `children?: Snippet`, plus button and anchor attributes.
  - `buttonVariants(opts?)`, `defaultButtonTone(variant)`, `type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link'`, `type ButtonSize = Size`, `type ButtonProps`.
  - `text(value: string): Snippet` in `tests/snippet.ts`.

- [ ] **Step 1: Write the snippet helper and the failing test**

`tests/snippet.ts`:

```ts
import { createRawSnippet, type Snippet } from 'svelte'

/** A children snippet holding plain text, for rendering a component directly in a test. */
export const text = (value: string): Snippet =>
  createRawSnippet(() => ({ render: () => `<span>${value}</span>` }))
```

`tests/button.test.ts`:

```ts
import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Button } from '../src/lib/index.js'
import { text } from './snippet.js'

describe('Button', () => {
  it('renders a button with its data attributes and defaults', () => {
    render(Button, { children: text('Save changes') })
    const button = screen.getByRole('button', { name: 'Save changes' })
    expect(button).toHaveAttribute('data-slot', 'button')
    expect(button).toHaveAttribute('data-variant', 'solid')
    expect(button).toHaveAttribute('data-tone', 'primary')
    expect(button).toHaveAttribute('data-size', 'md')
    expect(button).not.toHaveAttribute('data-icon-only')
    expect(button).toHaveClass('bg-primary', 'h-9')
  })

  it('defaults the tone by variant: neutral for outline, primary for link', () => {
    const { unmount } = render(Button, { variant: 'outline', children: text('Cancel') })
    expect(screen.getByRole('button')).toHaveAttribute('data-tone', 'neutral')
    unmount()
    render(Button, { variant: 'link', children: text('Details') })
    expect(screen.getByRole('button')).toHaveAttribute('data-tone', 'primary')
  })

  it('takes an explicit tone over the default', () => {
    render(Button, { tone: 'critical', children: text('Delete') })
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })

  it('draws an icon-only button as a circle of the size', () => {
    render(Button, { iconOnly: true, size: 'sm', 'aria-label': 'More', children: text('⋯') })
    const button = screen.getByRole('button', { name: 'More' })
    expect(button).toHaveAttribute('data-icon-only', 'true')
    expect(button).toHaveClass('rounded-full', 'size-8')
  })

  it('lets a caller class beat the variant class', () => {
    render(Button, { class: 'px-8', children: text('Wide') })
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-8')
    expect(button).not.toHaveClass('px-4')
  })

  it('disables a button with the native attribute', () => {
    render(Button, { disabled: true, children: text('Save') })
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders a link when given an href', () => {
    render(Button, { href: '/orders', children: text('Orders') })
    const link = screen.getByRole('link', { name: 'Orders' })
    expect(link).toHaveAttribute('href', '/orders')
    expect(link).toHaveAttribute('data-slot', 'button')
  })

  it('takes a disabled link out of navigation and the tab order', () => {
    const { container } = render(Button, { href: '/orders', disabled: true, children: text('Orders') })
    const link = container.querySelector('a') as HTMLAnchorElement
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('role', 'link')
    expect(link).toHaveAttribute('tabindex', '-1')
  })

  it('passes native handlers through', async () => {
    let clicks = 0
    render(Button, { onclick: () => clicks++, children: text('Count') })
    screen.getByRole('button').click()
    expect(clicks).toBe(1)
  })
})
```

Run: `pnpm vitest run tests/button.test.ts`
Expected: FAIL. `Button` is not exported.

- [ ] **Step 2: Copy `button-variants.ts`**

```bash
cp <react-package>/src/components/button-variants.ts src/lib/components/button/button-variants.ts
```

Then make exactly two edits:
1. Replace the opening `/** … */` header with:
   ```ts
   /**
    * Origin: the React package 2.23.0 `button-variants.ts`, itself shadcn/ui new-york `button`
    * Diverged: none. Copied verbatim; only the import path moved.
    *
    * `variant` (solid, soft, outline, ghost, link) × `tone` (the shared `Tone`),
    * sizes `sm | md | lg`, and `iconOnly` for the square. Hover is `--muted`,
    * never `--accent`.
    */
   ```
2. Change `from '../lib/tone'` to `from '../../utils/tone.js'`.

Run `diff <(sed '1,/^import/d' <react-package>/src/components/button-variants.ts) <(sed '1,/^import/d' src/lib/components/button/button-variants.ts)`.
Expected: only the import path line differs.

- [ ] **Step 3: Write `button.svelte`**

```svelte
<!--
  Origin: the React package 2.23.0 `button.tsx`, itself shadcn/ui new-york `button`
  Svelte: shadcn-svelte `button`
  Diverged: `asChild` dropped for `href`, which renders an <a>. A disabled link
    drops its href, sets aria-disabled and leaves the tab order, as
    shadcn-svelte's button does; components.css draws it like :disabled. No
    `type` default is added; the React button has none.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'

  import type { Tone } from '../../utils/tone.js'
  import type { WithElementRef } from '../../utils/types.js'
  import type { ButtonSize, ButtonVariant } from './button-variants.js'

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant
      /** Defaults to `primary` for `solid` and `link`, `neutral` for the rest. */
      tone?: Tone
      size?: ButtonSize
      /** One glyph and no label: square, round, and it needs an `aria-label`. */
      iconOnly?: boolean
      children?: Snippet
    }
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'
  import { buttonVariants, defaultButtonTone } from './button-variants.js'

  let {
    variant = 'solid',
    tone,
    size = 'md',
    iconOnly = false,
    href,
    disabled,
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: ButtonProps = $props()

  const resolvedTone = $derived(tone ?? defaultButtonTone(variant))
  const classes = $derived(
    cn(buttonVariants({ variant, tone: resolvedTone, size, iconOnly }), className),
  )
</script>

{#if href}
  <a
    bind:this={ref}
    href={disabled ? undefined : href}
    aria-disabled={disabled || undefined}
    role={disabled ? 'link' : undefined}
    tabindex={disabled ? -1 : undefined}
    class={classes}
    data-slot="button"
    data-variant={variant}
    data-tone={resolvedTone}
    data-size={size}
    data-icon-only={iconOnly || undefined}
    {...rest}
  >
    {@render children?.()}
  </a>
{:else}
  <!-- biome-ignore lint/a11y/useButtonType: `type` comes from the caller through rest, as in React -->
  <button
    bind:this={ref}
    {disabled}
    class={classes}
    data-slot="button"
    data-variant={variant}
    data-tone={resolvedTone}
    data-size={size}
    data-icon-only={iconOnly || undefined}
    {...rest}
  >
    {@render children?.()}
  </button>
{/if}
```

- [ ] **Step 4: Write `index.ts`, the barrel line and the expected exports**

`src/lib/components/button/index.ts`:

```ts
export { default as Button, type ButtonProps } from './button.svelte'
export {
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
  defaultButtonTone,
} from './button-variants.js'
```

Add `export * from './components/button/index.js'` to `src/lib/index.ts`, keeping the component lines in alphabetical order. Append `'Button', 'buttonVariants', 'defaultButtonTone'` to `EXPECTED_EXPORTS`.

- [ ] **Step 5: Run the tests to see them pass**

Run: `pnpm vitest run tests/button.test.ts tests/barrel.test.ts`
Expected: PASS.

- [ ] **Step 6: Write the Button stories (the worked example)**

`src/lib/components/button/button.stories.svelte`:

```svelte
<script module lang="ts">
  import PlusIcon from '@lucide/svelte/icons/plus'
  import TrashIcon from '@lucide/svelte/icons/trash-2'
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../stories/on-a-card.svelte'
  import { TONES } from '../../utils/tone.js'
  import Button from './button.svelte'
  import type { ButtonVariant } from './button-variants.js'

  const VARIANTS: ButtonVariant[] = ['solid', 'soft', 'outline', 'ghost', 'link']

  const { Story } = defineMeta({
    title: 'Primitives/Button',
    component: Button,
    tags: ['shadcn'],
    argTypes: {
      variant: { control: 'inline-radio', options: VARIANTS },
      tone: { control: 'select', options: [undefined, ...TONES] },
      size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    },
  })
</script>

<!-- Every prop, for poking at in the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><Button {...args}>Save changes</Button></OnACard>
  {/snippet}
</Story>

<!--
  Five treatments × six tones. Every colour comes from the semantic tokens.
  Most of this grid should never ship; the stories below are the
  combinations a screen actually wants.
-->
<Story name="Matrix">
  <OnACard>
    <div class="grid grid-cols-[auto_repeat(6,auto)] items-center justify-start gap-3">
      <span></span>
      {#each TONES as tone}
        <span class="text-muted-foreground text-xs">{tone}</span>
      {/each}
      {#each VARIANTS as variant}
        <span class="text-muted-foreground text-xs">{variant}</span>
        {#each TONES as tone}
          <Button {variant} {tone}>Open orders</Button>
        {/each}
      {/each}
    </div>
  </OnACard>
</Story>

<!--
  The pair almost every form ends on. `tone` is left off both: a solid button
  defaults to the brand and everything else to neutral, so an outline Cancel
  beside a solid Save is not also brand-coloured.
-->
<Story name="Primary and secondary">
  <OnACard>
    <div class="flex items-center gap-3">
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  </OnACard>
</Story>
```

Then port the remaining React stories, **Destructive**, **Sizes** and **IconOnly**, from `button.stories.tsx`. Keep each React JSDoc as the HTML comment above its `<Story>`. Use `PlusIcon`, `TrashIcon` and `EllipsisIcon` where the React stories use `IconPlus`, `IconTrash` and `IconDots`, and wrap each in `<OnACard>`.

- [ ] **Step 7: Add the Card stories that needed Button**

In `card.stories.svelte`, import `Button` and `CardAction`, then port **WithAction**, **WithFooter** and **BleedFooterLink** from `card.stories.tsx`. React's `<Button asChild><a href="#">…</a></Button>` becomes `<Button href="#">…</Button>`. Tabler icons map to their lucide equivalents (`IconArrowUpRight` → `@lucide/svelte/icons/arrow-up-right`).

- [ ] **Step 8: Run the gate and check Storybook**

Run: `pnpm test`. Expected: all green.

In `pnpm storybook`, check:
- `Primitives/Button/Matrix` in light, dark and `teal-on-stone`.
- `Primitives/Card/Bleed footer link`: the footer runs edge to edge, and the button's label lines up with the title.
- The a11y panel shows no violations on `Playground`.

- [ ] **Step 9: Commit**

```bash
git add src/lib tests
git commit -m "feat(button): port Button, with href links and disabled-link handling" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Badge

**Files:**
- Create: `src/lib/components/badge/badge-variants.ts`, `src/lib/components/badge/badge.svelte`, `src/lib/components/badge/index.ts`, `src/lib/components/badge/badge.stories.svelte`
- Modify: `src/lib/index.ts`, `tests/barrel.test.ts`
- Test: `tests/badge.test.ts`

**Interfaces:**
- Consumes: `cn`, `Tone`, `TONES`, the `TONE_*_CLASS` maps, `WithElementRef` (Task 3); `text` (Task 11); `OnACard` (Task 10).
- Produces:
  - `Badge`, with props `variant?: BadgeVariant` (default `'soft'`), `tone?: Tone` (default `'neutral'`), `count?: boolean` (default `false`), `href?: string`, `ref`, `children`, plus span and anchor attributes.
  - `badgeVariants`, `type BadgeVariant = 'solid' | 'soft' | 'outline'`, `type BadgeProps`.

- [ ] **Step 1: Write the failing test**

`tests/badge.test.ts`:

```ts
import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Badge } from '../src/lib/index.js'
import { text } from './snippet.js'

const badge = (container: HTMLElement) => container.querySelector('[data-slot="badge"]') as HTMLElement

describe('Badge', () => {
  it('defaults to a soft neutral span in the regular weight', () => {
    const el = badge(render(Badge, { children: text('Draft') }).container)
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveAttribute('data-variant', 'soft')
    expect(el).toHaveAttribute('data-tone', 'neutral')
    expect(el).toHaveClass('bg-muted', 'text-muted-foreground', 'font-normal')
  })

  it('sets a toned badge in the medium weight', () => {
    const el = badge(render(Badge, { tone: 'success', children: text('Open') }).container)
    expect(el).toHaveClass('bg-success-soft', 'text-success', 'font-medium')
  })

  it('draws solid and outline treatments from the tone maps', () => {
    expect(badge(render(Badge, { variant: 'solid', tone: 'critical', children: text('Late') }).container)).toHaveClass('bg-destructive', 'text-white')
    expect(badge(render(Badge, { variant: 'outline', tone: 'info', children: text('Tag') }).container)).toHaveClass('border-info/50', 'bg-transparent')
  })

  it('shapes a count as a circle of fixed height', () => {
    const el = badge(render(Badge, { count: true, children: text('3') }).container)
    expect(el).toHaveAttribute('data-count', 'true')
    expect(el).toHaveClass('h-5', 'min-w-5', 'rounded-full', 'tabular-nums')
  })

  it('renders a link when given an href', () => {
    render(Badge, { href: '/orders?status=late', children: text('Late') })
    expect(screen.getByRole('link', { name: 'Late' })).toHaveAttribute('href', '/orders?status=late')
  })
})
```

Run: `pnpm vitest run tests/badge.test.ts`. Expected: FAIL. `Badge` is not exported.

- [ ] **Step 2: Write `badge-variants.ts`**

In the React package the cva lives inside `badge.tsx`. Here it gets its own file, as `Button`'s does.

```ts
/**
 * Origin: the React package 2.23.0 `badge.tsx` (`badgeVariants`), itself shadcn/ui new-york `badge`
 * Diverged: split out of the component file, as button-variants.ts is.
 *   Classes, variants and defaults unchanged.
 */
import { cva } from 'class-variance-authority'

import {
  TONE_OUTLINE_CLASS,
  TONE_SOFT_CLASS,
  TONE_SOLID_CLASS,
  TONES,
  type Tone,
} from '../../utils/tone.js'

export type BadgeVariant = 'solid' | 'soft' | 'outline'

const TREATMENT: Record<BadgeVariant, Record<Tone, string>> = {
  solid: TONE_SOLID_CLASS,
  soft: TONE_SOFT_CLASS,
  outline: TONE_OUTLINE_CLASS,
}
```

Then copy the `const badgeVariants = cva(…)` block from `badge.tsx` verbatim, comments included, and change only `const badgeVariants` to `export const badgeVariants`.

- [ ] **Step 3: Write `badge.svelte`**

```svelte
<!--
  Origin: the React package 2.23.0 `badge.tsx`, itself shadcn/ui new-york `badge`
  Svelte: shadcn-svelte `badge`
  Diverged: `asChild` dropped for `href`, which renders an <a>; the
    `[a&]:hover:opacity-90` class already styles that case.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  import type { Tone } from '../../utils/tone.js'
  import type { WithElementRef } from '../../utils/types.js'
  import type { BadgeVariant } from './badge-variants.js'

  export type BadgeProps = WithElementRef<HTMLAnchorAttributes> & {
    /**
     * `soft` is a state something is in. `solid` is a thing that was done, and
     * shouts. `outline` is a tag: metadata the reader may want, not a state to
     * act on.
     */
    variant?: BadgeVariant
    tone?: Tone
    /**
     * A number on its own: one digit draws a circle and more stretch it into a
     * pill of the same height, so a column of counts keeps one silhouette.
     */
    count?: boolean
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'
  import { badgeVariants } from './badge-variants.js'

  let {
    variant = 'soft',
    tone = 'neutral',
    count = false,
    href,
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: BadgeProps = $props()
</script>

<svelte:element
  this={href ? 'a' : 'span'}
  bind:this={ref}
  {href}
  data-slot="badge"
  data-variant={variant}
  data-tone={tone}
  data-count={count || undefined}
  class={cn(badgeVariants({ variant, tone, count }), className)}
  {...rest}
>
  {@render children?.()}
</svelte:element>
```

- [ ] **Step 4: Write `index.ts`, the barrel line and the expected exports**

```ts
export { default as Badge, type BadgeProps } from './badge.svelte'
export { type BadgeVariant, badgeVariants } from './badge-variants.js'
```

Add `export * from './components/badge/index.js'` to `src/lib/index.ts`, keeping alphabetical order. Append `'Badge', 'badgeVariants'` to `EXPECTED_EXPORTS`.

- [ ] **Step 5: Run the tests to see them pass**

Run: `pnpm vitest run tests/badge.test.ts tests/barrel.test.ts`. Expected: PASS.

- [ ] **Step 6: Write the Badge stories**

Use meta `title: 'Primitives/Badge'`, `tags: ['shadcn']`, `component: Badge`, with `argTypes` for `variant` (`solid`, `soft`, `outline`) and `tone` (`TONES`). Port **Playground**, **Matrix**, **Count**, **States**, **Tags**, **Solid** and **FromADomainStatus** from `badge.stories.tsx`, each inside `<OnACard>`. In **FromADomainStatus**, map order statuses (`open`, `preparing`, `ready`, `late`, `cancelled`) to tones instead of any product domain.

- [ ] **Step 7: Run the gate, check Storybook, commit**

Run: `pnpm test`. Expected: all green. Check `Primitives/Badge/Matrix` in both schemes.

```bash
git add src/lib tests
git commit -m "feat(badge): port Badge, with href links" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Input and Label

**Files:**
- Create: `src/lib/components/input/{input.svelte,index.ts,input.stories.svelte}`, `src/lib/components/label/{label.svelte,index.ts,label.stories.svelte}`
- Modify: `src/lib/index.ts`, `tests/barrel.test.ts`
- Test: `tests/input.test.ts`, `tests/fixtures/labelled-input.svelte`

**Interfaces:**
- Consumes: `cn`, `WithElementRef` (Task 3).
- Produces:
  - `Input`, with props `value` (bindable), `files` (bindable, file inputs only), `type`, `ref`, `class`, plus input attributes.
  - `Label`, with bits-ui `Label.RootProps`, `ref` and `class`.
  - The types `InputProps` and `LabelProps`.

- [ ] **Step 1: Write the failing test**

`tests/fixtures/labelled-input.svelte`:

```svelte
<script lang="ts">
  import { Input, Label } from '../../src/lib/index.js'

  let { value = $bindable('') }: { value?: string } = $props()
</script>

<Label for="location-name">Location name</Label>
<Input id="location-name" placeholder="Riverside" bind:value />
<output data-testid="echo">{value}</output>
```

`tests/input.test.ts`:

```ts
import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Input } from '../src/lib/index.js'
import LabelledInput from './fixtures/labelled-input.svelte'

describe('Input and Label', () => {
  it('associates the label with the input', () => {
    render(LabelledInput)
    const input = screen.getByLabelText('Location name')
    expect(input).toHaveAttribute('data-slot', 'input')
    expect(screen.getByText('Location name')).toHaveAttribute('data-slot', 'label')
  })

  it('binds the value both ways', async () => {
    render(LabelledInput, { value: 'North' })
    const input = screen.getByLabelText('Location name')
    expect(input).toHaveValue('North')
    await userEvent.clear(input)
    await userEvent.type(input, 'Harbour')
    expect(screen.getByTestId('echo')).toHaveTextContent('Harbour')
  })

  it('draws the React classes and merges a caller class', () => {
    render(Input, { class: 'max-w-xs', placeholder: 'Search orders' })
    const input = screen.getByPlaceholderText('Search orders')
    expect(input).toHaveClass('rounded-2xl', 'bg-input/50', 'h-9', 'max-w-xs')
  })

  it('passes aria-invalid through for the invalid treatment', () => {
    render(Input, { 'aria-invalid': true, placeholder: 'Quantity' })
    expect(screen.getByPlaceholderText('Quantity')).toHaveAttribute('aria-invalid', 'true')
  })
})
```

Run: `pnpm vitest run tests/input.test.ts`. Expected: FAIL. `Input` is not exported.

- [ ] **Step 2: Write `input.svelte`**

```svelte
<!--
  Origin: the React package 2.23.0 `input.tsx`, itself shadcn/ui new-york `input`
  Svelte: shadcn-svelte `input`
  Diverged: `bind:value` and, for type="file", `bind:files`, as shadcn-svelte
    has them. Classes unchanged.
-->
<script lang="ts" module>
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements'

  import type { WithElementRef } from '../../utils/types.js'

  type InputType = Exclude<HTMLInputTypeAttribute, 'file'>

  export type InputProps = WithElementRef<
    Omit<HTMLInputAttributes, 'type'> &
      ({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
  >

  const INPUT_CLASS = [
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-input/50 h-9 w-full min-w-0 rounded-2xl border border-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  ]
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(),
    files = $bindable(),
    type,
    class: className,
    ...rest
  }: InputProps = $props()
</script>

{#if type === 'file'}
  <input
    bind:this={ref}
    bind:files
    bind:value
    type="file"
    data-slot="input"
    class={cn(INPUT_CLASS, className)}
    {...rest}
  />
{:else}
  <input
    bind:this={ref}
    bind:value
    {type}
    data-slot="input"
    class={cn(INPUT_CLASS, className)}
    {...rest}
  />
{/if}
```

- [ ] **Step 3: Write `label.svelte`**

```svelte
<!--
  Origin: the React package 2.23.0 `label.tsx`, itself shadcn/ui new-york `label`
  Svelte: shadcn-svelte `label`
  Diverged: unaudited, as in the React package. bits-ui Label for Radix Label.
-->
<script lang="ts" module>
  import { Label as LabelPrimitive } from 'bits-ui'

  export type LabelProps = LabelPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: LabelProps = $props()
</script>

<LabelPrimitive.Root
  bind:ref
  data-slot="label"
  class={cn(
    'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    className,
  )}
  {...rest}
/>
```

The bits-ui import sits in the module script only. Module-script imports are visible to the instance script, and importing the same name in both scripts is a duplicate-identifier error. The same rule applies to `checkbox.svelte` and `dialog-content.svelte`.

- [ ] **Step 4: Write the `index.ts` files, the barrel lines and the expected exports**

```ts
// src/lib/components/input/index.ts
export { default as Input, type InputProps } from './input.svelte'
```

```ts
// src/lib/components/label/index.ts
export { default as Label, type LabelProps } from './label.svelte'
```

Add both `export *` lines to `src/lib/index.ts`, keeping alphabetical order. Append `'Input', 'Label'` to `EXPECTED_EXPORTS`.

- [ ] **Step 5: Run the tests to see them pass**

Run: `pnpm vitest run tests/input.test.ts tests/barrel.test.ts`. Expected: PASS.

- [ ] **Step 6: Write the stories**

- **Input:** use meta `title: 'Primitives/Input'` and `tags: ['shadcn']`. Port **Default**, **Invalid** and **Disabled** from `input.stories.tsx`. The placeholder "Branch name" becomes "Location name".
- **Label:** use meta `title: 'Primitives/Label'` and `tags: ['shadcn']`. Port **WithInput** from `label.stories.tsx`, with "Location name" and the placeholder "Riverside". Port **WithCheckbox** in Task 14, once `Checkbox` exists, and record that in a comment.

- [ ] **Step 7: Run the gate, check Storybook, commit**

Run: `pnpm test`. Expected: all green. In Storybook, check the focus ring on `Primitives/Input/Default` (tab into it) in both schemes.

```bash
git add src/lib tests
git commit -m "feat(input): port Input and Label" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Checkbox

**Files:**
- Create: `src/lib/components/checkbox/{checkbox.svelte,index.ts,checkbox.stories.svelte}`
- Modify: `src/lib/index.ts`, `tests/barrel.test.ts`, `src/lib/components/label/label.stories.svelte`
- Test: `tests/checkbox.test.ts`, `tests/fixtures/bound-checkbox.svelte`

**Interfaces:**
- Consumes: `cn`, `WithoutChildrenOrChild` (Task 3); `Label` (Task 13).
- Produces: `Checkbox`, with props `checked` (bindable, default `false`), `indeterminate` (bindable, default `false`), `onCheckedChange`, `disabled`, `ref` and `class`, plus bits-ui `Checkbox.RootProps` without `child` and `children`. Also `type CheckboxProps`.

- [ ] **Step 1: Write the failing test**

`tests/fixtures/bound-checkbox.svelte`:

```svelte
<script lang="ts">
  import { Checkbox, Label } from '../../src/lib/index.js'

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    disabled = false,
  }: { checked?: boolean; indeterminate?: boolean; disabled?: boolean } = $props()
</script>

<Checkbox id="count-done" bind:checked bind:indeterminate {disabled} />
<Label for="count-done">Stock count done</Label>
<output data-testid="state">{checked ? 'checked' : 'unchecked'}</output>
```

`tests/checkbox.test.ts`:

```ts
import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import BoundCheckbox from './fixtures/bound-checkbox.svelte'

describe('Checkbox', () => {
  it('renders an unchecked checkbox labelled by its Label', () => {
    render(BoundCheckbox)
    const box = screen.getByRole('checkbox', { name: 'Stock count done' })
    expect(box).toHaveAttribute('data-slot', 'checkbox')
    expect(box).toHaveAttribute('data-state', 'unchecked')
    expect(box).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles on click and binds the value back', async () => {
    render(BoundCheckbox)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
    expect(screen.getByTestId('state')).toHaveTextContent('checked')
  })

  it('toggles from its label', async () => {
    render(BoundCheckbox)
    await userEvent.click(screen.getByText('Stock count done'))
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('shows the indicator only when checked or indeterminate', () => {
    const { container, unmount } = render(BoundCheckbox)
    expect(container.querySelector('[data-slot="checkbox-indicator"] svg')).toBeNull()
    unmount()
    const checked = render(BoundCheckbox, { checked: true })
    expect(checked.container.querySelector('[data-slot="checkbox-indicator"] svg')).not.toBeNull()
  })

  it('reports the indeterminate state', () => {
    render(BoundCheckbox, { indeterminate: true })
    const box = screen.getByRole('checkbox')
    expect(box).toHaveAttribute('data-state', 'indeterminate')
    expect(box).toHaveAttribute('aria-checked', 'mixed')
  })

  it('ignores clicks when disabled', async () => {
    render(BoundCheckbox, { disabled: true })
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked')
  })
})
```

Run: `pnpm vitest run tests/checkbox.test.ts`. Expected: FAIL. `Checkbox` is not exported.

- [ ] **Step 2: Write `checkbox.svelte`**

```svelte
<!--
  Origin: the React package 2.23.0 `checkbox.tsx`, itself shadcn/ui new-york `checkbox`
  Svelte: shadcn-svelte `checkbox`
  Diverged: unaudited, as in the React package. bits-ui Checkbox for Radix
    Checkbox. The indeterminate state draws a minus, as shadcn-svelte's does;
    Radix's Indicator drew the same check for both states.
-->
<script lang="ts" module>
  import { Checkbox as CheckboxPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../utils/types.js'

  export type CheckboxProps = WithoutChildrenOrChild<CheckboxPrimitive.RootProps>
</script>

<script lang="ts">
  import CheckIcon from '@lucide/svelte/icons/check'
  import MinusIcon from '@lucide/svelte/icons/minus'

  import { cn } from '../../utils/cn.js'

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    ...rest
  }: CheckboxProps = $props()
</script>

<CheckboxPrimitive.Root
  bind:ref
  bind:checked
  bind:indeterminate
  data-slot="checkbox"
  class={cn(
    'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}
>
  {#snippet children({ checked, indeterminate })}
    <div data-slot="checkbox-indicator" class="grid place-content-center text-current transition-none">
      {#if indeterminate}
        <MinusIcon class="size-3.5" />
      {:else if checked}
        <CheckIcon class="size-3.5" />
      {/if}
    </div>
  {/snippet}
</CheckboxPrimitive.Root>
```

An indeterminate box is not `data-state=checked`, so it would draw no fill and the minus would sit on the bare border. Add `data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary` to the class string, and extend the `Diverged:` line with "Indeterminate takes the checked fill."

- [ ] **Step 3: Write `index.ts`, the barrel line and the expected exports**

```ts
export { default as Checkbox, type CheckboxProps } from './checkbox.svelte'
```

Add `export * from './components/checkbox/index.js'` to `src/lib/index.ts`, keeping alphabetical order. Append `'Checkbox'` to `EXPECTED_EXPORTS`.

- [ ] **Step 4: Run the tests to see them pass**

Run: `pnpm vitest run tests/checkbox.test.ts tests/barrel.test.ts`. Expected: PASS.

If "toggles from its label" fails because jsdom does not forward a label click to a `<button>`, keep the test, and check that the label's `for` reaches the bits-ui root's `id` (`screen.getByRole('checkbox')` has `id="count-done"`). If the `id` is correct and only jsdom's activation behaviour is missing, mark the test `it.skip` with the comment `// jsdom does not activate a <button> from its <label>; checked in Storybook` and verify it by hand in Step 6.

- [ ] **Step 5: Write the stories**

Use meta `title: 'Primitives/Checkbox'` and `tags: ['shadcn']`. Port **Default** and **States** from `checkbox.stories.tsx`, and add an indeterminate row to **States**. In `label.stories.svelte`, port **WithCheckbox** with the label "Stock count done".

- [ ] **Step 6: Run the gate, check Storybook, commit**

Run: `pnpm test`. Expected: all green. In Storybook, click the label in `Primitives/Label/With checkbox` and confirm it toggles the box. Check `States` in both schemes.

```bash
git add src/lib tests
git commit -m "feat(checkbox): port Checkbox on bits-ui, with an indeterminate mark" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Phase C gate

Stop. Report Tasks 10–14 in the phase-gates format, including any test skipped for jsdom and why. Wait for approval, push, and confirm CI passes as at the Phase B gate.

---

# Phase D — Round 1: Dialog and the round gate (Tasks 15–16)

### Task 15: Dialog

**Files:**
- Create: `src/lib/components/dialog/{dialog,dialog-trigger,dialog-portal,dialog-close,dialog-overlay,dialog-content,dialog-header,dialog-footer,dialog-title,dialog-description}.svelte`, `src/lib/components/dialog/index.ts`, `src/lib/components/dialog/dialog.stories.svelte`
- Modify: `src/lib/index.ts`, `tests/barrel.test.ts`
- Test: `tests/dialog.test.ts`, `tests/fixtures/dialog-harness.svelte`

**Interfaces:**
- Consumes: `cn`, `WithElementRef`, `WithoutChildrenOrChild` (Task 3); `Button` (Task 11); `Input`, `Label` (Task 13).
- Produces:
  - `Dialog` (bits-ui Root, `open` bindable).
  - `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`.
  - `DialogContent`, with props `size?: 'sm' | 'md' | 'lg' | 'xl'` (default `'lg'`), `showCloseButton?: boolean` (default `true`), `portalProps`, `children`.
  - `DialogHeader`, `DialogFooter` (divs), `DialogTitle`, `DialogDescription`.
  - The types `DialogContentProps` and `DialogSize`.

- [ ] **Step 1: Write the failing test**

`tests/fixtures/dialog-harness.svelte`:

```svelte
<script lang="ts">
  import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '../../src/lib/index.js'

  let {
    open = $bindable(false),
    size,
    showCloseButton,
  }: { open?: boolean; size?: 'sm' | 'md' | 'lg' | 'xl'; showCloseButton?: boolean } = $props()
</script>

<Dialog bind:open>
  <DialogTrigger>
    {#snippet child({ props })}
      <Button {...props}>Close the shift</Button>
    {/snippet}
  </DialogTrigger>
  <DialogContent {size} {showCloseButton}>
    <DialogHeader>
      <DialogTitle>Close the morning shift?</DialogTitle>
      <DialogDescription>Open orders move to the next shift.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Cancel</Button>
        {/snippet}
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
```

`tests/dialog.test.ts`:

```ts
import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import DialogHarness from './fixtures/dialog-harness.svelte'

describe('Dialog', () => {
  it('opens from its trigger, rendered through the child snippet as a Button', async () => {
    render(DialogHarness)
    const trigger = screen.getByRole('button', { name: 'Close the shift' })
    // The trigger's props land on the Button through `child`, as Radix's Slot
    // merged them under `asChild`: the slot is the trigger's, the look is Button's.
    // (Amended 2026-11-04: the plan first expected data-slot="button".)
    expect(trigger).toHaveAttribute('data-slot', 'dialog-trigger')
    expect(trigger).toHaveClass('bg-primary')
    await userEvent.click(trigger)
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('data-slot', 'dialog-content')
    expect(dialog).toHaveAccessibleName('Close the morning shift?')
    expect(dialog).toHaveAccessibleDescription('Open orders move to the next shift.')
    expect(screen.getByTestId('open')).toHaveTextContent('open')
  })

  it('defaults to the lg width and takes a size', async () => {
    render(DialogHarness, { open: true, size: 'md' })
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('data-size', 'md')
    expect(dialog).toHaveClass('sm:max-w-md')
  })

  it('closes from the corner close button', async () => {
    render(DialogHarness, { open: true })
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })

  it('closes from a DialogClose in the footer', async () => {
    render(DialogHarness, { open: true })
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })

  it('closes on Escape', async () => {
    render(DialogHarness, { open: true })
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })

  it('leaves the corner button out when asked', async () => {
    render(DialogHarness, { open: true, showCloseButton: false })
    await screen.findByRole('dialog')
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
  })
})
```

Run: `pnpm vitest run tests/dialog.test.ts`. Expected: FAIL. `Dialog` is not exported.

- [ ] **Step 2: Write the bits-ui pass-through parts**

`dialog.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`Dialog`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: bits-ui Dialog for Radix Dialog. `open` is bindable.
-->
<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui'

  let { open = $bindable(false), ...rest }: DialogPrimitive.RootProps = $props()
</script>

<DialogPrimitive.Root bind:open {...rest} />
```

`dialog-trigger.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogTrigger`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: `asChild` is bits-ui's `child` snippet. No `type` default; Radix's trigger had none.
-->
<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui'

  let { ref = $bindable(null), ...rest }: DialogPrimitive.TriggerProps = $props()
</script>

<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...rest} />
```

`dialog-close.svelte`: the same as `dialog-trigger.svelte`, with `DialogClose` in the Origin line, `DialogPrimitive.CloseProps`, `<DialogPrimitive.Close bind:ref data-slot="dialog-close" {...rest} />`, and `Diverged: \`asChild\` is bits-ui's \`child\` snippet.`

`dialog-portal.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogPortal`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: bits-ui Portal for Radix Portal.
-->
<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui'

  let { ...rest }: DialogPrimitive.PortalProps = $props()
</script>

<DialogPrimitive.Portal {...rest} />
```

`dialog-overlay.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogOverlay`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: none beyond the port.
-->
<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui'

  import { cn } from '../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DialogPrimitive.OverlayProps = $props()
</script>

<DialogPrimitive.Overlay
  bind:ref
  data-slot="dialog-overlay"
  class={cn(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/20 backdrop-blur-sm',
    className,
  )}
  {...rest}
/>
```

- [ ] **Step 3: Write `dialog-content.svelte`**

```svelte
<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogContent`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: `portalProps` added for the bits-ui Portal, as shadcn-svelte has it.
    The close button keeps the React classes rather than shadcn-svelte's ghost Button.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import type { WithoutChildrenOrChild } from '../../utils/types.js'

  export const DIALOG_SIZE_CLASS = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  } as const

  export type DialogSize = keyof typeof DIALOG_SIZE_CLASS

  /**
   * `size` names four widths rather than each dialog carrying its own
   * `sm:max-w-*`. `lg` is the default: it is what an unstyled dialog rendered at.
   */
  export type DialogContentProps = WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<DialogPrimitive.PortalProps>
    children: Snippet
    showCloseButton?: boolean
    size?: DialogSize
  }
</script>

<script lang="ts">
  import XIcon from '@lucide/svelte/icons/x'

  import { cn } from '../../utils/cn.js'
  import DialogOverlay from './dialog-overlay.svelte'
  import DialogPortal from './dialog-portal.svelte'

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    showCloseButton = true,
    size = 'lg',
    ...rest
  }: DialogContentProps = $props()
</script>

<DialogPortal {...portalProps}>
  <DialogOverlay />
  <DialogPrimitive.Content
    bind:ref
    data-slot="dialog-content"
    data-size={size}
    class={cn(
      'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[min(var(--radius-4xl),24px)] ring-1 ring-foreground/5 dark:ring-foreground/10 p-6 shadow-xl duration-200 outline-none',
      DIALOG_SIZE_CLASS[size],
      className,
    )}
    {...rest}
  >
    {@render children?.()}
    {#if showCloseButton}
      <DialogPrimitive.Close
        data-slot="dialog-close"
        class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <XIcon />
        <span class="sr-only">Close</span>
      </DialogPrimitive.Close>
    {/if}
  </DialogPrimitive.Content>
</DialogPortal>
```

- [ ] **Step 4: Write the remaining parts**

`dialog-header.svelte` and `dialog-footer.svelte` are plain `div` parts with the same shape as `card-description.svelte`: `WithElementRef<HTMLAttributes<HTMLDivElement>>`, an exported `DialogHeaderProps` / `DialogFooterProps`, `bind:this={ref}` and `{@render children?.()}`.
- Header: `data-slot="dialog-header"`, class `cn('flex flex-col gap-2 text-center sm:text-left', className)`.
- Footer: `data-slot="dialog-footer"`, class `cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)`.
- Origin lines name `` (`DialogHeader`) `` and `` (`DialogFooter`) ``, with `Diverged: none beyond the port.`

`dialog-title.svelte`:

```svelte
<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogTitle`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: none beyond the port.
-->
<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui'

  import { cn } from '../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DialogPrimitive.TitleProps = $props()
</script>

<DialogPrimitive.Title
  bind:ref
  data-slot="dialog-title"
  class={cn('font-heading text-lg leading-none font-semibold', className)}
  {...rest}
/>
```

`dialog-description.svelte`: the same as `dialog-title.svelte`, with `DialogDescription` in the Origin line, `DialogPrimitive.DescriptionProps`, `<DialogPrimitive.Description … data-slot="dialog-description">`, and class `cn('text-muted-foreground text-sm', className)`.

- [ ] **Step 5: Write `index.ts`, the barrel line and the expected exports**

```ts
export { default as Dialog } from './dialog.svelte'
export { default as DialogClose } from './dialog-close.svelte'
export {
  default as DialogContent,
  type DialogContentProps,
  type DialogSize,
} from './dialog-content.svelte'
export { default as DialogDescription } from './dialog-description.svelte'
export { default as DialogFooter, type DialogFooterProps } from './dialog-footer.svelte'
export { default as DialogHeader, type DialogHeaderProps } from './dialog-header.svelte'
export { default as DialogOverlay } from './dialog-overlay.svelte'
export { default as DialogPortal } from './dialog-portal.svelte'
export { default as DialogTitle } from './dialog-title.svelte'
export { default as DialogTrigger } from './dialog-trigger.svelte'
```

Add `export * from './components/dialog/index.js'` to `src/lib/index.ts`, keeping alphabetical order. Append `'Dialog', 'DialogClose', 'DialogContent', 'DialogDescription', 'DialogFooter', 'DialogHeader', 'DialogOverlay', 'DialogPortal', 'DialogTitle', 'DialogTrigger'` to `EXPECTED_EXPORTS`.

- [ ] **Step 6: Run the tests to see them pass**

Run: `pnpm vitest run tests/dialog.test.ts tests/barrel.test.ts tests/provenance.test.ts`
Expected: Dialog and barrel PASS. Provenance fails only on the missing story, which the next step adds.

If a close test times out because bits-ui waits for an exit animation jsdom never fires, stub `Element.prototype.getAnimations ??= () => []` in `tests/setup.ts` with a comment saying why, and rerun.

- [ ] **Step 7: Write the Dialog stories**

Use meta `title: 'Primitives/Dialog'`, `tags: ['shadcn']` and `component: DialogContent`.

Port from `dialog.stories.tsx`:
- **Default:** "Delete Makati branch?" becomes "Close the Riverside location?". Keep its body copy's meaning ("This cannot be undone. Orders and stock history stay, but the location can no longer take orders.").
- **WithForm:** a plain form with `Label` + `Input`, with no form library. Its fields are "Location name" and "Opening time". Submit closes the dialog by setting the bound `open` to false.
- **WithoutCloseButton**

React's controlled `useState(open)` becomes a `let open = $state(false)` in the story's own snippet scope. If a `<Story>` cannot hold state, move the story body into `src/lib/components/dialog/stories/<name>.svelte` and render that.

Defer **GenerateAndDownload** until `Progress` and `Spinner` are ported, and record it in a comment.

- [ ] **Step 8: Run the gate, check Storybook, commit**

Run: `pnpm test`. Expected: all green.

In Storybook, open each Dialog story in light, dark and `teal-on-stone`, and check each of these:
- The overlay blurs the page.
- The dialog animates in and out.
- Focus moves into the dialog and returns to the trigger on close.
- Escape closes the dialog.
- The a11y panel is clean.

```bash
git add src/lib tests
git commit -m "feat(dialog): port Dialog and its parts on bits-ui" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Round 0 + 1 gate

**Files:** none new.

- [ ] **Step 1: Run every gate from a clean tree**

```bash
rm -rf dist storybook-static .svelte-kit
pnpm test && pnpm build && pnpm build:storybook
```

Expected: all three exit 0. publint reports no errors.

- [ ] **Step 2: Check the packaged surface**

```bash
ls dist/components/button dist/tokens dist/styles dist/theme.css
ls dist/components/*/*.stories.svelte 2>/dev/null && echo "STORIES IN DIST" || echo "no stories in dist"
pnpm pack --dry-run 2>/dev/null | grep -E "stories|LICENSES|bin/mise-theme" | head
```

Expected:
- `dist/components/button/button.svelte` and `button.svelte.d.ts`, `dist/tokens/cli.js` and `dist/theme.css` exist.
- The pack list includes `LICENSES/` and `bin/mise-theme.js`, and no `.stories.svelte`.

If stories are present in `dist/`, they are only excluded from the pack, which is acceptable.

- [ ] **Step 3: Self-review against the spec**

Walk the spec's sections and confirm each has landed:
- Decisions D1–D11
- Package structure
- `package.json` shape
- Component API translation: every row used by the seven components
- Provenance
- Theming: all three levels
- Tooling
- Release (deferred)
- Rounds 0 and 1

List any gap in the gate report rather than fixing it silently.

- [ ] **Step 4: Push and confirm CI**

After the Phase C push has been approved, push Phase D:

```bash
git push origin main
gh run watch --repo jovertical/mise-design-system --exit-status
```

- [ ] **Step 5: Hand over for the Storybook review**

Start `pnpm storybook` and report to the user in the phase-gates format. Include:
- **Completed:** Tasks 15–16, plus a one-line summary of rounds 0 and 1.
- **Review checklist:** package structure, setup, the APIs of the seven components, and theming at all three levels (toolbar presets, `Foundations/Theming/CSS override`, `npx mise-theme`).
- **Deferred stories,** each with the component blocking it.
- **Open items:**
  - the Biome-or-Prettier decision;
  - any jsdom-skipped test;
  - the licensing question for code copied from the UNLICENSED React package, if the user has not yet answered it.
- **Next round:** round 2, forms and overlays.

Stop. Round 2 starts only on the user's explicit go.
