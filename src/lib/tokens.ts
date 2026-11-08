/**
 * The `/tokens` entry: pure values and the emitters that shape them. It can
 * be imported from a Node script, a test, or Storybook without pulling in
 * Svelte.
 */

export {
  defineTheme,
  type HueOrRamp,
  RAMP_ROLES,
  type RampRole,
  type ResolvedTheme,
  resolveRamp,
  resolveTheme,
  STATUS_ROLES,
  type StatusRole,
  type ThemeConfig,
  type ThemeFonts,
  type TokenOverrides,
} from './tokens/config.js'
export { emitThemeCss, emitThemeVariables, themeStylesheet } from './tokens/emit-web.js'
export { geometryRules, layout, radiusScale, sizing } from './tokens/geometry.js'
export { BASES, type BaseName, defaultTheme, type PresetName, presets } from './tokens/presets.js'
export { darkTokens, lightTokens, SEMANTIC_TOKENS, type SemanticToken } from './tokens/semantic.js'
export {
  type HueName,
  type Ramp,
  STEPS,
  type Step,
  tailwindPalette,
} from './tokens/tailwind-palette.js'
