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
  // Fully round, so a button matches the inputs beside it.
  buttonRadius: '9999px',
  fonts: { sans: SYSTEM_SANS, heading: SYSTEM_SANS, mono: SYSTEM_MONO },
} as const satisfies {
  base: BaseName
  primary: HueName
  status: Record<StatusRole, HueName>
  charts: readonly [HueName, HueName, HueName, HueName, HueName]
  radius: string
  buttonRadius: string
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
