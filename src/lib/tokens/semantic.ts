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
  '--destructive-foreground',
  '--info-foreground',
  '--success-foreground',
  '--warning-foreground',
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
    '--destructive-foreground': WHITE,
    '--info-foreground': WHITE,
    '--success-foreground': WHITE,
    '--warning-foreground': WHITE,
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
    // White on a bright 400 all but disappears; the darkest step reads, as
    // `--primary-foreground` does on the brand.
    '--destructive-foreground': step('critical', 950),
    '--info-foreground': step('info', 950),
    '--success-foreground': step('success', 950),
    '--warning-foreground': step('warning', 950),
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
