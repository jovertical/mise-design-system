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
