import { defineTheme } from '@jovertical/mise-design-system/tokens'

/** The demo's brand: teal on stone, with a softer radius than mise's default. */
export default defineTheme({
  base: 'stone',
  primary: 'teal',
  status: { warning: 'amber' },
  charts: ['teal', 'sky', 'amber', 'rose', 'violet'],
  radius: '0.5rem',
})
