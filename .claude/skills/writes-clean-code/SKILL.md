---
name: writes-clean-code
description: >-
  Enforces clean code conventions — early returns over nested if-else, descriptive variable names,
  lookup maps over branching on a variant, small focused functions, and defensive handling of
  optional props. Activates on every code change; or when the user mentions clean code, refactor,
  nesting, early return, guard clause, ternary, or defensive programming.
---

# Writes Clean Code

## When to Apply

On **every code change** — components, hooks, token emitters, scripts, tests.

Adapted from the React package's `writes-clean-code` skill. The rules are
framework-neutral. The examples are TypeScript, as in a Svelte component's
`<script>` or a token emitter, in Biome's single-quote, no-semicolon style.

## Early returns over nested if-else

Handle the empty, loading and error cases first and return. The happy path
reads at the top level, last.

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

No `else` after a `return`.

## Maps over branching on a variant

A variant, a tone or a size picks from a map or a `cva` config — not from a chain
of ternaries. The map is also what lets Tailwind see every class.

### Bad

```ts
const ring = tone === 'critical' ? 'ring-destructive' : tone === 'warning' ? 'ring-warning' : tone === 'success' ? 'ring-success' : 'ring-border'
```

### Good

```ts
const TONE_RING_CLASS: Record<Tone, string> = {
  neutral: 'ring-border',
  primary: 'ring-primary',
  info: 'ring-info',
  success: 'ring-success',
  warning: 'ring-warning',
  critical: 'ring-destructive',
}

const ring = TONE_RING_CLASS[tone]
```

Before writing a new map, check `src/lib/utils/tone.ts` — the treatment probably
already exists.

## Descriptive names

Never a single letter or an abbreviation — in callbacks, loops, or anywhere.

### Bad

```ts
ORDERS.filter((o) => o.status === 'late').map((o) => o.id)
const cfg = STATUS_TONE[s]
```

### Good

```ts
ORDERS.filter((order) => order.status === 'late').map((order) => order.id)
const tone = STATUS_TONE[status]
```

| Context | Name |
| --- | --- |
| `.find()` | `candidate` |
| `.map()` / `.filter()` / `.some()` | the singular of the collection — `order`, `row`, `step` |
| a comparator | `first`, `second` — not `a`, `b` |
| an event | `event` — not `e` |
| a ref | what it points at — `triggerRef`, not `ref2` |

## Small, focused functions

When a component's markup grows past what one screen shows, or a branch of it
does a self-contained job, extract it. A part becomes its own `.svelte` file in
the component's folder; markup repeated inside one file becomes a
`{#snippet}`.

In a `.ts` module, put public exports first and private helpers below.

Do not over-extract. A three-line helper used once, which makes the reader
jump, is worse than the three lines.

## Defensive with optional props

- Default in the `$props()` destructure, not deep in the body:
  `let { size = 'md', tone = 'neutral', ...rest } = $props()`.
- Treat `null` and `undefined` as "no data" explicitly — `value === null`, not
  `!value`, which also swallows `0`.
- Clamp what a caller can get wrong. A percentage is clamped to 0–100, because
  over 100 is a bug upstream, not a bar to draw.
- Validate at the boundary once; do not re-check the same prop three levels
  down.

## Duplicate code

The same block in two places becomes one helper. The same arrangement in two
components becomes one component — see `authors-components`.

## Common Pitfalls

- Nested ternaries in markup or class names.
- `else` after `return`.
- `(d) =>`, `(e) =>`, `cfg`, `btn` — the naming rule has no callback exception.
- `!value` where `0` is a real value.
- A new tone map when `utils/tone.ts` already has the treatment.
- Extracting a helper that is used once and harder to read than what it replaced.
- Leaving a branch an earlier guard already made unreachable.
