# Style

## Lint and format

Biome 2.6 lints and formats `.ts`, `.js` and `.svelte`, with
`html.experimentalFullSupportEnabled` and `html.formatter.indentScriptAndStyle`
on. Its Svelte support is experimental. It was checked on 2026-11-04 against
the spec's `Button` example:

- It reported no unused-variable or unused-import errors for names used only in markup.
- Formatting changed only whitespace: it wraps long tags one attribute per line and keeps the `<script>` indent.

Biome's `a11y/useButtonType` rule flags a `<button>` with no literal `type`.
`Button` takes `type` from the caller through `...rest`, as the React button
does, so that one element carries a `biome-ignore` comment saying so. Anywhere
else, give the button an explicit `type`.

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
- Relative imports in `.ts` end in `.js`. The tsconfig's `NodeNext` override
  makes a missing extension an error.
- Names, module boundaries, size and spacing between statements:
  `../clean-code/guide.md`.

## Comments

Every component module opens with this header, as an HTML comment in `.svelte`
files and a JSDoc block in `.ts` files:

    Origin: the React package 2.23.0 `<file>.tsx`[ (`<Part>`)], itself shadcn/ui new-york `<name>`
    Origin: mise                            (a component mise authored itself)
    Svelte: shadcn-svelte `<name>`          (only when shadcn-svelte was used)
    Diverged: <what changed beyond the port, or "none">

Carry over the React package's prose comments on a prop or a part when they
explain a choice. Drop the counts taken from the portals.

## Story copy

Generic operations: locations, shifts, orders, stock, registers. Never a
product name, a portal, or a real business name.

