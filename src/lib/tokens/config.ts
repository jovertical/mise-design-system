import { BASES, type BaseName, defaultTheme } from './presets.js'
import { type HueName, type Ramp, STEPS, tailwindPalette } from './tailwind-palette.js'

export const STATUS_ROLES = ['info', 'success', 'warning', 'critical'] as const

export type StatusRole = (typeof STATUS_ROLES)[number]

/** Every ramp the theme emits into `:root`, as `--color-<role>-<step>`. */
export const RAMP_ROLES = ['base', 'primary', ...STATUS_ROLES] as const

export type RampRole = (typeof RAMP_ROLES)[number]

/** A Tailwind hue name, or a custom ramp with all eleven steps. */
export type HueOrRamp = HueName | Ramp

export interface ThemeFonts {
  sans: string
  heading: string
  mono: string
}

/** Single-token escape hatches, written last so they win. */
export type TokenOverrides = Record<`--${string}`, string>

export interface ThemeConfig {
  base?: BaseName
  primary?: HueOrRamp
  status?: Partial<Record<StatusRole, HueOrRamp>>
  charts?: readonly [HueName, HueName, HueName, HueName, HueName]
  radius?: string
  /**
   * The corner of a labelled button, as `--radius-button`. Fully round by
   * default, to match the inputs; separate from `radius` so a theme can square
   * its buttons without squaring its cards.
   */
  buttonRadius?: string
  fonts?: Partial<ThemeFonts>
  light?: TokenOverrides
  dark?: TokenOverrides
}

/** A config with every default filled in and every hue looked up. */
export interface ResolvedTheme {
  ramps: Record<RampRole, Ramp>
  charts: readonly [Ramp, Ramp, Ramp, Ramp, Ramp]
  radius: string
  buttonRadius: string
  fonts: ThemeFonts
  light: TokenOverrides
  dark: TokenOverrides
}

/** Identity, for type-checking a `mise.theme.js` the way `defineConfig` does for Vite. */
export function defineTheme(config: ThemeConfig): ThemeConfig {
  return config
}

export function resolveRamp(role: string, value: HueOrRamp): Ramp {
  if (typeof value === 'string') {
    const ramp = (tailwindPalette as Record<string, Ramp | undefined>)[value]

    if (!ramp) {
      throw new Error(
        `Unknown hue "${value}" for ${role}. Use a Tailwind hue name or a 50–950 ramp.`,
      )
    }

    return ramp
  }

  const missing = STEPS.filter((step) => !value[step])

  if (missing.length > 0) {
    throw new Error(`The ${role} ramp is missing steps: ${missing.join(', ')}`)
  }

  return value
}

export function resolveTheme(config: ThemeConfig = {}): ResolvedTheme {
  const base = config.base ?? defaultTheme.base

  if (!(BASES as readonly string[]).includes(base)) {
    throw new Error(`Unknown base "${base}". Use one of: ${BASES.join(', ')}.`)
  }

  const status = { ...defaultTheme.status, ...config.status }

  const [c1, c2, c3, c4, c5] = (config.charts ?? defaultTheme.charts).map((hue) =>
    resolveRamp('charts', hue),
  )

  return {
    ramps: {
      base: tailwindPalette[base],
      primary: resolveRamp('primary', config.primary ?? defaultTheme.primary),
      info: resolveRamp('status.info', status.info),
      success: resolveRamp('status.success', status.success),
      warning: resolveRamp('status.warning', status.warning),
      critical: resolveRamp('status.critical', status.critical),
    },
    charts: [c1, c2, c3, c4, c5],
    radius: config.radius ?? defaultTheme.radius,
    buttonRadius: config.buttonRadius ?? defaultTheme.buttonRadius,
    fonts: { ...defaultTheme.fonts, ...config.fonts },
    light: { ...config.light },
    dark: { ...config.dark },
  }
}
