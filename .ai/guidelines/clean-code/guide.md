# Clean code

How code in this repository reads, in mise and in the examples alike. A test
checks most of it (see the end), so a rule here is a rule the build keeps.

The examples are TypeScript in Biome's style: single quotes, no semicolons.

## Names

No abbreviation and no single letter anywhere a name is declared: parameters,
locals, destructured names, `for` and `{#each}` variables, snippet parameters
and `catch` bindings. A reader should never have to look up what a name holds.

| Instead of | Write |
| --- | --- |
| `i`, `idx` | `index` |
| `e`, `ev`, `evt` | `event` |
| `(a, b)` in a comparator | `(first, second)` |
| `o`, `x`, `item` over a list of orders | the singular: `order` |
| `.find((x) => …)` | `candidate` |
| `s: Source` | `source: Source` |
| `pkg`, `cfg`, `opts`, `ctx` | what it is: `item`, `config`, `options`, `context` |

### Bad

```ts
const late = orders.filter((o) => o.status === 'late').map((o) => o.id)
const cfg = STATUS_TONE[s]
```

### Good

```ts
const late = orders.filter((order) => order.status === 'late').map((order) => order.id)
const tone = STATUS_TONE[status]
```

**Allowed**, because they are a library's own vocabulary or a convention every
reader knows: `args` (Storybook), `props` (the argument formsnap hands a
control's snippet), `x` and `y` as chart coordinates, `id`, `ref`, a type
parameter (`T`), and a name starting with `_` for a value deliberately unused.

**Import names are not checked.** An import takes the exporting library's name
(`import X from '@lucide/svelte/icons/x'`); renaming it hides where it comes
from.

**Banned**, besides every single letter outside the allowances: `acc`, `arr`,
`btn`, `cb`, `cfg`, `ctx`, `curr`, `el`, `err`, `ev`, `evt`, `fn`, `idx`,
`msg`, `num`, `obj`, `opts`, `pkg`, `prev`, `res`, `str`, `tmp`, `val`.

## Modules

One concern per module. A module holding two things a reader would look for in
two places is split.

- Code about one thing lives together. In the logistics example an entity's
  reads and writes, its schema and its readiness rows sit in one folder,
  `src/lib/data/<entity>/`, not spread across files shared by every entity.
- State with its own life (a dialog's open state, a store) is its own module,
  not a passenger in the module that happens to use it first.
- In a `.ts` module, public exports first, private helpers below.

## Size

| What | At most |
| --- | --- |
| A `.svelte` file | 250 lines |
| A `.ts` file | 300 lines |
| A function | 40 lines |

A page over the limit is split into section components beside it. A function
over it is split into named helpers below it.

Exempt, each with its reason in the check's exceptions table: stories (the
story skeleton makes them long by design) and generated files.

Do not over-extract. A three-line helper used once, which makes the reader
jump, is worse than the three lines.

## Repetition

- The same markup in two components becomes one component.
- The same markup twice in one file becomes a `{#snippet}`.
- The same block of code in two places becomes one helper.

## Spacing between statements

Statements breathe. In a function body, a block, or at the top level of a
module:

1. Each statement stands apart from its neighbours with a blank line: a guard,
   a declaration, a call, a `return`.
2. Consecutive single-line declarations (`const`, `let`, `type`) may stay
   together, and so may consecutive single-line assignments. A call never
   groups.
3. A statement that spans more than one line has a blank line before and after
   it, even between declarations.
4. A one-line guard (`if (…) return`, `throw`, `continue` or `break`) is
   followed by a blank line.
5. A block's first statement has no blank line above it and its last none
   below.

Imports are one group at the top, as Biome orders them; the rule starts after
them. A comment above a statement belongs to it.

### Bad

```ts
function save(values: VehicleInput) {
  if (!vehicle) return
  const saved = updateVehicle(store, vehicle.id, values)
  toast.success(`${saved.code} saved`)
  goto(resolve('/fleet/[id]', { id: saved.code }))
}
```

### Good

```ts
function save(values: VehicleInput) {
  if (!vehicle) return

  const saved = updateVehicle(store, vehicle.id, values)

  toast.success(`${saved.code} saved`)

  goto(resolve('/fleet/[id]', { id: saved.code }))
}
```

### Good, at the top level

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

`pnpm fix:spacing` applies these rules for you; run it before `pnpm format`.

## Control flow

Handle the empty, missing and error cases first and return. The happy path
reads at the top level, last. No `else` after a `return`.

### Bad

```ts
function resolveRamp(role: string, value: HueOrRamp): Ramp {
  if (typeof value !== 'string') {
    const missing = STEPS.filter((step) => !value[step])
    if (missing.length === 0) {
      return value
    } else {
      throw new Error(`The ${role} ramp is missing steps: ${missing.join(', ')}`)
    }
  } else {
    const ramp = lookup(value)
    if (ramp) {
      return ramp
    } else {
      throw new Error(`Unknown hue "${value}" for ${role}.`)
    }
  }
}
```

### Good

```ts
function resolveRamp(role: string, value: HueOrRamp): Ramp {
  if (typeof value === 'string') {
    const ramp = lookup(value)

    if (!ramp) throw new Error(`Unknown hue "${value}" for ${role}.`)

    return ramp
  }

  const missing = STEPS.filter((step) => !value[step])

  if (missing.length > 0) throw new Error(`The ${role} ramp is missing steps: ${missing.join(', ')}`)

  return value
}
```

A variant, a tone or a size picks from a map or a `cva` config, not from a
chain of ternaries. Before writing a new tone map, check `src/lib/utils/tone.ts`.

## Defensive with optional values

- Default in the `$props()` destructure, not deep in the body.
- `value === null` where `0` is a real value; `!value` swallows it.
- Clamp what a caller can get wrong: a percentage to 0–100.
- Validate at the boundary once; do not re-check the same prop three levels
  down.
- No `!` non-null assertion outside tests. Narrow with a guard instead.

## How it is checked

`tests/conventions.test.ts` parses every `.ts` and `.svelte` file under mise's
`src`, `tests`, `scripts` and `stories` and the examples' `src`, `tests` and
`scripts`, and fails on a banned name, a file or function over its length, a
`!` outside tests, or a spacing rule broken. Each failure reads
`path:line: rule: detail`.

- Exceptions live in `scripts/conventions/exceptions.ts`, each with its
  reason. Add one only with a reason a reviewer would accept.
- `BREAKERS` in the test lists files that broke a rule when the check landed.
  It may only shrink: a listed file that no longer breaks its rule fails the
  test until it is taken off the list.
