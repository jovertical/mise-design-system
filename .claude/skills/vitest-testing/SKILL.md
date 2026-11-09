---
name: vitest-testing
description: >-
  Tests mise with Vitest — the structural suites (provenance, barrel, theme, theme-config) that
  guard the package's shape, and behaviour tests that render a Svelte 5 component with
  @testing-library/svelte in jsdom. Covers the jsdom stubs in tests/setup.ts, snippet children
  with createRawSnippet, fixtures that compose parts, and running one test by name. Activates
  when writing or fixing a test, when a suite fails, or when a bug fix needs a regression test;
  or when the user mentions test, vitest, spec, assertion, jsdom, Testing Library, provenance,
  or barrel.
metadata:
  internal: true
---

# Vitest Testing

Adapted from the React package's `vitest-testing` skill.

## Setup

`vite.config.ts` holds the test config: `environment: 'jsdom'`, `globals: true`,
`setupFiles: ['tests/setup.ts']`, `include: ['tests/**/*.test.ts']`. The
`svelteTesting()` plugin adds the browser resolve condition and auto-cleanup.

Import `describe` / `it` / `expect` from `vitest` explicitly anyway. Tests live
**flat in `tests/`**, named for what they guard. Fixtures that compose several
parts live in `tests/fixtures/`.

```bash
pnpm test:unit                                   # everything
pnpm vitest run tests/theme.test.ts              # one file
pnpm vitest run -t "takes a disabled link out"   # one test by name
```

## The structural suites

| Suite | Fails when | Fix |
| --- | --- | --- |
| `provenance.test.ts` | a module has no header, no `Origin:` naming a React file, or no `Diverged:`; a `Svelte:` line names no shadcn-svelte component; a story's tag disagrees with its component's header, or the story is missing | fix the header or the tag |
| `barrel.test.ts` | a component folder is missing from `src/lib/index.ts`, the barrel names one that does not exist, or a name in `EXPECTED_EXPORTS` does not resolve | add the `export *` line or the missing export |
| `theme.test.ts` | a semantic token is missing from `:root` or `.dark`, a bridge freezes a utility on a ramp step, or a config option does not reach the CSS | fix the emitter or the token |
| `theme-config.test.ts` | a default, a preset or a validation message moved | fix `config.ts` / `presets.ts` |

Fix these in source. Loosen a test only when the contract changes on purpose,
and name the change in the test.

## Behaviour tests

Render the real component and assert what a user would read: roles,
accessible names, `data-slot` and `data-*` state. Assert a class only when the
class *is* the behaviour (`bg-destructive` for a critical tone).

```ts
import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Button } from '../src/lib/index.js'
import { text } from './snippet.js'

describe('Button', () => {
  it('takes a disabled link out of navigation and the tab order', () => {
    const { container } = render(Button, { href: '/orders', disabled: true, children: text('Orders') })
    const link = container.querySelector('a') as HTMLAnchorElement
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('tabindex', '-1')
  })
})
```

- **Snippet children:** `text(value)` in `tests/snippet.ts` wraps
  `createRawSnippet`. For anything with parts or `bind:`, write a fixture
  component in `tests/fixtures/`, and give it an `<output data-testid>` that
  echoes bound state.
- **user-event:** `import { userEvent } from '@testing-library/user-event'`.
  The default import fails type-checking under NodeNext.
- **jsdom stubs:** `tests/setup.ts` stubs `ResizeObserver`, `DOMRect`,
  `scrollIntoView` and pointer capture for bits-ui. Add a new stub there, not
  in one test file.
- **Files a test writes** go under the git-ignored `.tmp/`. Vitest only loads
  modules from inside the project root.

## What Vitest cannot see

- **Pixels:** a dark mode that washes out, a radius that ignores the preset.
  Look in Storybook.
- **Real activation behaviour** jsdom lacks, such as a `<label>` clicking a
  `<button>`. If you skip a test for this, say why in the skip comment and
  check it in Storybook.

## Common Pitfalls

- Loosening an assertion to get green.
- A class assertion where a role or `data-*` attribute would do.
- A jsdom stub inside one test file.
- Tests in subdirectories, apart from `tests/fixtures/`.
