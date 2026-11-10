/**
 * Writes src/lib/tokens/tailwind-palette.ts from the installed Tailwind's
 * theme.css. The values are Tailwind's (MIT); this only reshapes them.
 *
 * Run: pnpm tsx scripts/copy-tailwind-palette.ts && pnpm biome format --write src/lib/tokens
 */
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tailwind = join(root, 'node_modules', 'tailwindcss')
const { version } = JSON.parse(readFileSync(join(tailwind, 'package.json'), 'utf8'))
const css = readFileSync(join(tailwind, 'theme.css'), 'utf8')

const palette: Record<string, Record<string, string>> = {}

for (const [, hue, step, value] of css.matchAll(/--color-([a-z]+)-(\d+):\s*(oklch\([^)]*\));/g)) {
  palette[hue] ??= {}
  palette[hue][step] = value
}

const ramps = Object.entries(palette)
  .map(([hue, ramp]) => {
    const steps = Object.entries(ramp).map(([step, value]) => `    ${step}: '${value}',`)

    return `  ${hue}: {\n${steps.join('\n')}\n  },`
  })
  .join('\n')

const source = `/**
 * Tailwind CSS v4's default colour palette, as literal oklch() values.
 *
 * Generated from tailwindcss@${version} theme.css by
 * scripts/copy-tailwind-palette.ts. Do not edit by hand; rerun the script.
 * Copyright (c) Tailwind Labs, Inc. MIT License; the full notice is in
 * LICENSES/tailwindcss.txt.
 *
 * Literals rather than var(--color-zinc-…) references, because Tailwind
 * prunes theme variables a consumer never uses.
 */
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type Step = (typeof STEPS)[number]

/** One hue, light to dark: eleven oklch() values. */
export type Ramp = Readonly<Record<Step, string>>

export const tailwindPalette = {
${ramps}
} as const satisfies Record<string, Ramp>

export type HueName = keyof typeof tailwindPalette
`

writeFileSync(join(root, 'src', 'lib', 'tokens', 'tailwind-palette.ts'), source)

copyFileSync(join(tailwind, 'LICENSE'), join(root, 'LICENSES', 'tailwindcss.txt'))

console.log(`tailwind-palette.ts: ${Object.keys(palette).length} hues from tailwindcss@${version}`)
