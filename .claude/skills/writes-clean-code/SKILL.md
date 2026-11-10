---
name: writes-clean-code
description: >-
  Enforces clean code conventions — early returns over nested if-else, descriptive variable names,
  lookup maps over branching on a variant, small focused functions, and defensive handling of
  optional props. Activates on every code change; or when the user mentions clean code, refactor,
  nesting, early return, guard clause, ternary, or defensive programming.
metadata:
  internal: true
---

# Writes Clean Code

## When to Apply

On **every code change** in this repository: components, token emitters,
scripts, tests, stories, and the examples.

## The rules

They live in **`.ai/guidelines/clean-code/guide.md`**. Read it before writing
code: names, module boundaries, size, repetition, spacing between statements,
control flow and defensive handling, each with a bad and a good example.

## What the build checks

`tests/conventions.test.ts` fails, with `path:line: rule: detail`, on:

- a banned or single-letter name (`names`);
- a `.svelte` file over 250 lines or a `.ts` file over 300 (`file-length`);
- a function over 40 lines (`function-length`);
- a `!` non-null assertion outside tests (`non-null`);
- statements packed without the blank lines the guide asks for (`spacing`).

## Before the gate

Run `pnpm fix:spacing` (it only adds or removes blank lines), then
`pnpm format`, then `pnpm test`.

## Common pitfalls

- `(e) =>`, `(a, b) =>`, `pkg`, `cfg`: the naming rule has no callback
  exception.
- Two calls on adjacent lines; a guard with no blank line after it.
- Reaching for an exception instead of fixing the code. Every exception in
  `scripts/conventions/exceptions.ts` carries a reason; a new one needs one too.
- An exception without a reason a reviewer would accept.
