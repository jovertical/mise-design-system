import { describe, expect, it } from 'vitest'

import {
  emitThemeCss,
  emitThemeVariables,
  presets,
  RAMP_ROLES,
  SEMANTIC_TOKENS,
  STEPS,
  tailwindPalette,
} from '../src/lib/tokens.js'
import { TONE_SOLID_CLASS } from '../src/lib/utils/tone.js'

/** The body of the first `<selector> {` block, without its braces. */
function block(css: string, selector: string): string {
  const start = css.indexOf(`\n${selector} {\n`)
  if (start === -1) throw new Error(`no "${selector}" block`)
  const end = css.indexOf('\n}', start + 1)
  return css.slice(start + selector.length + 4, end)
}

/** Declarations in order, duplicates kept, so a test can catch a token declared twice. */
function declarations(body: string): Array<[string, string]> {
  return [...body.matchAll(/^\s*(--[\w-]+):\s*(.+);$/gm)].map((match) => [match[1], match[2]])
}

const tokenValue = (body: string, token: string) =>
  declarations(body).find(([name]) => name === token)?.[1]

const COLOR_PREFIXED = new Set<string>(['--color-table-header'])

describe.each(Object.keys(presets))('preset %s', (name) => {
  const css = emitThemeCss(presets[name as keyof typeof presets])

  it('declares every semantic token in :root and in .dark', () => {
    for (const selector of [':root', '.dark']) {
      const declared = new Set(declarations(block(css, selector)).map(([token]) => token))
      const missing = SEMANTIC_TOKENS.filter((token) => !declared.has(token))
      expect(missing, selector).toEqual([])
    }
  })

  it('writes every ramp step of every role into :root as a literal', () => {
    const root = block(css, ':root')
    for (const role of RAMP_ROLES) {
      for (const step of STEPS) {
        expect(tokenValue(root, `--color-${role}-${step}`), `${role}-${step}`).toMatch(/^oklch\(/)
      }
    }
  })
})

describe('@theme inline bridge', () => {
  const bridge = block(emitThemeCss(), '@theme inline')

  it('routes every semantic utility through its own variable', () => {
    for (const token of SEMANTIC_TOKENS) {
      if (COLOR_PREFIXED.has(token)) continue
      expect(tokenValue(bridge, `--color-${token.slice(2)}`), token).toBe(`var(${token})`)
    }
  })

  it('never points a utility at a ramp step directly, except a ramp at itself', () => {
    const frozen = declarations(bridge).filter(([name, value]) => {
      const target = value.match(/^var\((--color-[a-z]+-\d+)\)$/)?.[1]
      return target !== undefined && target !== name
    })
    expect(frozen).toEqual([])
  })

  it('derives the radius scale from the single --radius', () => {
    expect(tokenValue(bridge, '--radius-lg')).toBe('var(--radius)')
    expect(tokenValue(bridge, '--radius-4xl')).toBe('calc(var(--radius) + 16px)')
  })

  it('washes each tone from its own ink', () => {
    expect(tokenValue(bridge, '--color-primary-soft')).toBe(
      'color-mix(in oklab, var(--primary) 10%, transparent)',
    )
    expect(tokenValue(bridge, '--color-destructive-soft')).toBe(
      'color-mix(in oklab, var(--destructive) 10%, transparent)',
    )
  })

  it('leaves the faces to :root, so a consumer can override them in CSS', () => {
    expect(tokenValue(bridge, '--font-sans')).toBe('var(--font-sans)')
  })
})

describe('config reaches the output', () => {
  it('emits the default theme when no config is given', () => {
    const root = block(emitThemeCss(), ':root')
    expect(tokenValue(root, '--color-primary-600')).toBe(tailwindPalette.indigo[600])
    expect(tokenValue(root, '--color-base-950')).toBe(tailwindPalette.zinc[950])
    expect(tokenValue(root, '--primary')).toBe('var(--color-primary-600)')
  })

  it('takes the base, brand, statuses, radius and fonts from a config', () => {
    const css = emitThemeCss({
      base: 'stone',
      primary: 'teal',
      status: { warning: 'orange' },
      radius: '0.5rem',
      fonts: { sans: "'Inter', sans-serif" },
    })
    const root = block(css, ':root')
    expect(tokenValue(root, '--color-base-100')).toBe(tailwindPalette.stone[100])
    expect(tokenValue(root, '--color-primary-600')).toBe(tailwindPalette.teal[600])
    expect(tokenValue(root, '--color-warning-600')).toBe(tailwindPalette.orange[600])
    expect(tokenValue(root, '--radius')).toBe('0.5rem')
    expect(tokenValue(root, '--font-sans')).toBe("'Inter', sans-serif")
  })

  it('replaces an overridden token in place rather than declaring it twice', () => {
    const css = emitThemeCss({ light: { '--sidebar': 'white' }, dark: { '--sidebar': 'black' } })
    const light = declarations(block(css, ':root')).filter(([name]) => name === '--sidebar')
    const dark = declarations(block(css, '.dark')).filter(([name]) => name === '--sidebar')
    expect(light).toEqual([['--sidebar', 'white']])
    expect(dark).toEqual([['--sidebar', 'black']])
  })

  it('appends an override for a token the contract does not have', () => {
    const root = block(emitThemeCss({ light: { '--brand-glow': 'pink' } }), ':root')
    expect(tokenValue(root, '--brand-glow')).toBe('pink')
  })
})

describe('emitThemeVariables', () => {
  it('emits only :root and .dark, for swapping a theme at runtime', () => {
    const css = emitThemeVariables(presets.stone)
    expect(css).not.toContain('@theme')
    expect(css).not.toContain('@layer')
    expect(tokenValue(block(`\n${css}`, ':root'), '--color-base-50')).toBe(
      tailwindPalette.stone[50],
    )
  })
})

/*
 * A solid status fill is a 600 step in light and a 400 step in dark. White
 * reads on the 600s, but on the bright dark-mode 400s (green, amber, cyan) it
 * all but disappears, so each fill carries its own ink, as `--primary` does.
 */
describe('status inks on a solid fill', () => {
  const css = emitThemeCss()
  const statuses = [
    ['--destructive-foreground', 'critical'],
    ['--info-foreground', 'info'],
    ['--success-foreground', 'success'],
    ['--warning-foreground', 'warning'],
  ] as const

  it.each(statuses)('%s is white in light and the darkest step in dark', (token, role) => {
    expect(tokenValue(block(css, ':root'), token)).toBe('oklch(1 0 0)')
    expect(tokenValue(block(css, '.dark'), token)).toBe(`var(--color-${role}-950)`)
  })

  it('writes every solid tone in its fill and its own ink', () => {
    expect(TONE_SOLID_CLASS.success).toBe('bg-success text-success-foreground')
    expect(TONE_SOLID_CLASS.warning).toBe('bg-warning text-warning-foreground')
    expect(TONE_SOLID_CLASS.info).toBe('bg-info text-info-foreground')
    expect(TONE_SOLID_CLASS.critical).toBe('bg-destructive text-destructive-foreground')
  })
})
