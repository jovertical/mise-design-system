import { describe, expect, it } from 'vitest'

import { defineTheme, RAMP_ROLES, resolveTheme } from '../src/lib/tokens/config.js'
import { BASES, presets } from '../src/lib/tokens/presets.js'
import { STEPS, tailwindPalette } from '../src/lib/tokens/tailwind-palette.js'

const SPEC_HUES = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
]

describe('tailwind palette', () => {
  it('carries every Tailwind v4 hue the spec relies on', () => {
    const missing = SPEC_HUES.filter((hue) => !(hue in tailwindPalette))

    expect(missing).toEqual([])
  })

  it('gives every hue all eleven steps as oklch literals', () => {
    for (const [hue, ramp] of Object.entries(tailwindPalette)) {
      for (const step of STEPS) expect(ramp[step], `${hue}-${step}`).toMatch(/^oklch\(/)
    }
  })
})

describe('resolveTheme', () => {
  it('defaults to a zinc base, an indigo brand and the spec statuses (D11)', () => {
    const theme = resolveTheme()

    expect(theme.ramps.base).toBe(tailwindPalette.zinc)
    expect(theme.ramps.primary).toBe(tailwindPalette.indigo)
    expect(theme.ramps.info).toBe(tailwindPalette.sky)
    expect(theme.ramps.success).toBe(tailwindPalette.emerald)
    expect(theme.ramps.warning).toBe(tailwindPalette.amber)
    expect(theme.ramps.critical).toBe(tailwindPalette.red)
    expect(theme.radius).toBe('0.625rem')
    expect(theme.buttonRadius).toBe('9999px')
    expect(theme.charts).toHaveLength(5)
  })

  it('resolves a ramp for every role', () => {
    expect(Object.keys(resolveTheme().ramps).sort()).toEqual([...RAMP_ROLES].sort())
  })

  it('takes a base, a brand hue and one status from the config', () => {
    const theme = resolveTheme({ base: 'stone', primary: 'teal', status: { warning: 'orange' } })

    expect(theme.ramps.base).toBe(tailwindPalette.stone)
    expect(theme.ramps.primary).toBe(tailwindPalette.teal)
    expect(theme.ramps.warning).toBe(tailwindPalette.orange)
    expect(theme.ramps.success).toBe(tailwindPalette.emerald)
  })

  it('accepts a custom 50–950 ramp for the brand', () => {
    const ramp = Object.fromEntries(STEPS.map((step) => [step, `oklch(0.5 0.1 ${step})`]))

    expect(resolveTheme({ primary: ramp as never }).ramps.primary).toEqual(ramp)
  })

  it('names the missing steps of an incomplete custom ramp', () => {
    const ramp = { 50: 'oklch(0.9 0.1 200)', 500: 'oklch(0.5 0.1 200)' }

    expect(() => resolveTheme({ primary: ramp as never })).toThrow(
      'The primary ramp is missing steps: 100, 200, 300, 400, 600, 700, 800, 900, 950',
    )
  })

  it('rejects an unknown hue name', () => {
    expect(() => resolveTheme({ primary: 'chartreuse' as never })).toThrow(
      'Unknown hue "chartreuse" for primary',
    )
  })

  it('rejects a base that is not one of the neutrals', () => {
    expect(() => resolveTheme({ base: 'red' as never })).toThrow('Unknown base "red"')
  })

  it('merges fonts one face at a time', () => {
    const fonts = resolveTheme({ fonts: { sans: "'Inter', sans-serif" } }).fonts

    expect(fonts.sans).toBe("'Inter', sans-serif")
    expect(fonts.mono).toMatch(/ui-monospace/)
  })

  it('carries the light and dark escape hatches through untouched', () => {
    const theme = resolveTheme({ light: { '--sidebar': 'white' }, dark: { '--sidebar': 'black' } })

    expect(theme.light).toEqual({ '--sidebar': 'white' })
    expect(theme.dark).toEqual({ '--sidebar': 'black' })
  })
})

describe('defineTheme', () => {
  it('returns the config unchanged; it exists for the types', () => {
    const config = { base: 'slate' as const }

    expect(defineTheme(config)).toBe(config)
  })
})

describe('presets', () => {
  it('offers one preset per neutral base, plus a worked custom one', () => {
    expect(Object.keys(presets)).toEqual([...BASES, 'teal-on-stone'])
  })

  it.each(Object.entries(presets))('resolves the %s preset', (_name, preset) => {
    expect(() => resolveTheme(preset)).not.toThrow()
  })
})
