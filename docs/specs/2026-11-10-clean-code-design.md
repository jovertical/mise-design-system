# Clean code: stricter guidelines, a check, and the refactor to meet them

**Date:** 2026-11-10
**Status:** approved in conversation (scope, enforcement, the spacing rule and its grouping, the
design in two parts)
**Scope:** the whole repository: mise (`src/`, `tests/`, `scripts/`, `stories/`) and the
logistics example (`examples/logistics/src`, `tests`, `scripts`). Behaviour does not change.

## Goal

One written standard for how code in this repository reads, checked by a test so it holds
without anyone remembering it, and the code brought up to it. The standard covers four things
the code drifts on today: abbreviated names, modules that mix concerns, files and functions
that grow too long, and statements packed together without room to read.

## What exists today

- The rules on names, early returns, lookup maps and small functions live in the
  `writes-clean-code` skill (`.claude/skills/writes-clean-code/SKILL.md`). The skill is read
  when it is loaded; nothing checks the code against it. `.ai/guidelines/style/guide.md` does
  not mention them.
- Biome lints and formats. It has no rule on name length, and its formatter keeps blank lines
  between statements but never adds one.
- A measure on 2026-11-10: 59 `s: Source` parameters in the example's data layer; single-letter
  or abbreviated names (`(a, b)`, `pkg`, `n`, `i`, `c`, `p`) in mise's `src/lib` and the
  example; six entity forms repeating the same section heading and readiness card;
  `schemas.ts` and `readiness.ts` holding every entity; `entity-form.svelte.ts` holding both
  the form setup and the discard dialog's state; pages of 300 to 383 lines.

## Decisions

| # | Decision | Ruling |
| --- | --- | --- |
| C1 | Scope | mise and the example, one standard for both |
| C2 | Where the rules live | `.ai/guidelines/clean-code/guide.md`, linked from `CLAUDE.md` (copied to `AGENTS.md`). The `writes-clean-code` skill becomes a short pointer to it |
| C3 | Enforcement | `tests/conventions.test.ts` at mise's root, in the existing `pnpm test`, parsing code rather than matching text |
| C4 | Landing | A list of files that already break the rules lets the test land green; each phase empties its part of the list; the last phase leaves it empty. A file not on the list cannot regress |
| C5 | Spacing | Enforced by the test and applied by a fixer, `pnpm fix:spacing`, since Biome cannot |
| C6 | Shared form pieces | Example compositions (`form-section.svelte`, `readiness-card.svelte`), not mise components. A mise form section is a later, separate decision |
| C7 | Behaviour | Unchanged. Every phase keeps mise's tests, the example's tests and the smoke run passing; the browser flow checks are re-run at the end |
| C8 | Commit types | mise renames are `refactor(<component>)` and the check and fixer `test:`/`chore:`, none of which cut a release; the example stays `chore(example)` |

## The rules

### Names

- No abbreviation and no single letter anywhere a name is declared: parameters, locals,
  destructured names, `for` and `{#each}` variables, snippet parameters, `catch` bindings,
  type parameters excepted.
- `index`, not `i`; `event`, not `e`; `first` and `second` in a comparator, not `a` and `b`;
  the singular of the collection in `.map`, `.filter`, `.some`, `.find` (`order`, `row`), or
  `candidate` in `.find`.
- `source: Source`, not `s: Source`.
- Allowed, because they are a library's own vocabulary: `args` (Storybook), `props` (the
  argument formsnap hands a control's snippet), `x` and `y` as chart coordinates, `id`, `ref`,
  and a name starting with `_` for a value deliberately unused.
- Banned list, checked by the test: every one-letter name outside the allowances, and `acc`,
  `arr`, `btn`, `cb`, `cfg`, `ctx`, `curr`, `el`, `err`, `ev`, `evt`, `fn`, `idx`, `msg`,
  `num`, `obj`, `opts`, `pkg`, `prev`, `res`, `str`, `tmp`, `val`.

### Modules

- One concern per module. A module that holds two things a reader would look for in two places
  is split.
- In the example, an entity's code lives together: `src/lib/data/<entity>/` holds its reads and
  writes, its schema and its readiness rows. The cross-entity `schemas.ts` and `readiness.ts`
  go.
- A form's setup and the discard dialog's state are separate modules.
- In a `.ts` module, public exports first, private helpers below.

### Size

- A `.svelte` file is at most 250 lines; a `.ts` file at most 300; a function at most 40 lines.
- Exempt, each with its reason in the test's exceptions table: stories (the story skeleton
  makes them long by design), generated files (`src/lib/tokens/tailwind-palette.ts`,
  `skills/mise/components/`), and any file the test lists with a sentence on why.
- A page over the limit is split into section components beside it.

### Repetition

- The same markup in two components becomes one component.
- The same markup twice in one file becomes a `{#snippet}`.

### Spacing between statements

In a function body, a block, or at the top level of a module:

1. Each statement stands apart from its neighbours with a blank line: a guard, a declaration,
   a call, a `return`.
2. Consecutive single-line declarations (`const`, `let`) may stay together, and so may
   consecutive single-line assignments. A call never groups.
3. A statement that spans more than one line has a blank line before and after it, even
   between declarations.
4. A guard clause (`if (…) return` or `if (…) throw` on one line) is followed by a blank line.
5. A block's first statement has no blank line above it and its last none below.

```ts
function save(values: VehicleInput) {
  if (!vehicle) return

  const saved = updateVehicle(store, vehicle.id, values)

  toast.success(`${saved.code} saved`)

  goto(resolve('/fleet/[id]', { id: saved.code }))
}
```

```ts
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const compact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numbers = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
```

Imports are one group at the top, as Biome orders them; the rule starts after them.

### Carried over from the skill

Early returns over nested `if`/`else`, no `else` after `return`, lookup maps over chains of
ternaries on a variant, `=== null` where `0` is a real value, defaults in the `$props()`
destructure, and no `!` non-null assertion outside tests.

## The check: `tests/conventions.test.ts`

- **Files:** mise's `src/`, `tests/`, `scripts/`, `stories/`, and the example's `src/`,
  `tests/`, `scripts/`. Not `node_modules`, `dist`, `build`, `.svelte-kit`, `storybook-static`.
- **Parsing:** `.ts` with the TypeScript compiler (`ts.createSourceFile`); `.svelte` with
  `svelte/compiler`'s `parse` for the template's declarations (`{#each}` items and indices,
  snippet parameters, arrow functions in attributes) and its `<script>` blocks handed to the
  TypeScript compiler at their offsets, so reported lines match the file.
- **Checks:** banned names (with the line and the name), file length, function length,
  `!` assertions outside `tests/`, and the spacing rules.
- **Failures** read `path:line: <rule>: <detail>`, all of them at once rather than the first.
- **The exceptions table** is a `Record<path, reason>` per rule at the top of the test.
- **The list of existing breakers** (C4) is a separate `Record<path, rule[]>`, with a comment
  saying it must only shrink. A listed file that no longer breaks its rule fails the test too,
  so the list cannot go stale.

## The fixer: `pnpm fix:spacing`

- `scripts/fix-spacing.ts`, run from the root with a path (`pnpm fix:spacing` covers mise and
  the example).
- It uses the same parsing as the check, and only inserts blank lines where rules 1 to 4 ask
  for one and removes those rule 5 forbids. It never changes a character inside a statement.
- It runs before Biome; Biome's formatting then settles the rest.

## Testing the check itself

`tests/conventions-rules.test.ts` feeds the checker small snippets: a banned name in each
place a name can be declared, an allowed name, a grouped pair of declarations, a multi-line
statement without room, a guard without a blank line, a `.svelte` file with a bad `{#each}`
name. The fixer is tested the same way: input, expected output, and that a second run changes
nothing.

## Phases

1. **Rules and check:** the guideline and its links; the checker, its rule tests and the list
   of existing breakers; the fixer.
2. **Spacing everywhere:** the fixer across mise and the example, read in review; the breakers
   list loses its spacing entries.
3. **Names in mise:** `src/lib`, `tests`, `scripts`, `stories`.
4. **The example's data layer:** a folder per entity, `source`, and the form setup split from
   the discard state.
5. **The example's components:** `form-section` and `readiness-card`, pages over the limit
   split, the remaining names.
6. **Finish:** the breakers list empty, docs, and every check re-run, the browser flow checks
   included.

## Out of scope

Behaviour, public API names (component and prop names stay as `docs/naming.md` has them), the
bakery app, and the three mise gaps already on the handoff's open list.
