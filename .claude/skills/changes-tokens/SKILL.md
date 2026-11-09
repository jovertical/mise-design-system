---
name: changes-tokens
description: >-
  Guides changing mise's theme — the generated Tailwind palette, the presets and default theme,
  the theme config and its resolution, the semantic light and dark tokens, geometry, the -soft
  tints, components.css and the emitted theme.css — through tests/theme.test.ts and
  tests/theme-config.test.ts. Activates when editing anything in src/lib/tokens/ or
  src/lib/styles/, when a theme test fails, or when a colour, radius, font or spacing value
  needs to move; or when the user mentions token, palette, preset, theme, theme.css, colour,
  radius, dark mode, mise-theme, or defineTheme.
metadata:
  internal: true
---

# Changes Tokens

Adapted from the React package's `changes-tokens` skill. The architecture is in
`.ai/guidelines/theming/guide.md`. Read it first.

## When to Apply

- Changing a semantic token in `src/lib/tokens/semantic.ts`
- Changing the default theme or a preset in `src/lib/tokens/presets.ts`
- Changing `ThemeConfig` or `resolveTheme` in `src/lib/tokens/config.ts`
- Changing radius, layout or `geometryRules` in `src/lib/tokens/geometry.ts`
- Editing `src/lib/styles/components.css`
- A theme test fails

## How the theme is built

```
tailwind-palette.ts ─► presets.ts ─► resolveTheme(config) ─┐
                                                           ├─► emitThemeCss() ─┐
semantic.ts + geometry.ts ─────────────────────────────────┘                   ├─► dist/theme.css
                                       src/lib/styles/components.css ──────────┘   (build-theme.ts)
```

`npx mise-theme` runs the same pipeline on a consumer's config.
**`dist/theme.css` is output**; never edit it.

## Procedure

1. **Change the token, not a component.** A component that needs a new colour
   gets it from a token or a `tone.ts` map.
2. **Keep the contract whole.**
   - A new semantic token goes into `SEMANTIC_TOKENS` and into both
     `lightTokens` and `darkTokens`, in the same position.
   - A value points at a role ramp (`var(--color-primary-600)`), not at a literal.
3. **Never bridge a utility to a ramp step.** `--color-primary:
   var(--color-primary-600)` in `@theme inline` freezes `bg-primary` in one
   scheme.
4. **Rebuild**, because Storybook reads `dist/theme.css`: `pnpm build:theme`.
5. **Run the theme suites**: `pnpm vitest run tests/theme.test.ts tests/theme-config.test.ts`.
   If one fails, fix the emitter or the token. A test changes only when the
   contract changes on purpose, and then the test says so by name.
6. **Look at it** in Storybook (`Foundations/Palette`, `Foundations/Theming`)
   in light, dark, and at least one other preset.

## The palette

`tailwind-palette.ts` is generated. To pick up a new Tailwind release, run:

```bash
pnpm tsx scripts/copy-tailwind-palette.ts && pnpm biome format --write src/lib/tokens
```

Never hand-edit a step. A ramp is a relationship between eleven values, and the
values are Tailwind's.

## Status tints

```
bg-success-soft text-success
bg-warning-soft text-warning
bg-info-soft text-info
bg-destructive-soft text-destructive
bg-primary-soft text-primary
```

Never a hand-written alpha over a raw hue. The red washes from `--destructive`.
`--accent` means "active nav row": never a hover, never a brand tint.

## `src/lib/tokens/` stays pure

No Svelte, no DOM. `/tokens` is imported by Node scripts, the CLI and
Storybook. `cli.ts` is the one Node-only module, and it is not exported from
`tokens.ts`.

## Common Pitfalls

- Editing `dist/theme.css` or `tailwind-palette.ts` by hand.
- Judging a change on a stale `dist/theme.css`.
- A token added to the light scheme and not the dark.
- A literal colour in `semantic.ts` where a ramp step would do.
- Reaching for `--accent` for a brand tint or a hover.
