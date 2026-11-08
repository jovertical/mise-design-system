import type { Decorator, Preview } from '@storybook/sveltekit'

import { emitThemeVariables, type PresetName, presets } from '../src/lib/tokens.js'
import './preview.css'

const PRESET_STYLE_ID = 'mise-preset'

/**
 * Swaps the theme at runtime by appending `:root` / `.dark` after theme.css.
 * This is Theming level 2 (override the variables in CSS), driven by level 3's
 * emitter, so the toolbar exercises both.
 */
function applyPreset(name: PresetName) {
  let style = document.getElementById(PRESET_STYLE_ID)
  if (!style) {
    style = document.createElement('style')
    style.id = PRESET_STYLE_ID
    document.head.append(style)
  }
  style.textContent = emitThemeVariables(presets[name] ?? presets.zinc)
}

const withTheme: Decorator = (storyFn, context) => {
  document.documentElement.classList.toggle('dark', context.globals.scheme === 'dark')
  applyPreset((context.globals.preset ?? 'zinc') as PresetName)
  return storyFn()
}

const preview: Preview = {
  /*
   * Every story gets a docs page with a props table. For a design system that
   * is most of the value. The `shadcn` / `mise` tags mirror each component's
   * `Origin:` header, and provenance.test.ts fails if they disagree.
   */
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { disabled: true },
    a11y: { test: 'error' },
    options: {
      /*
       * Groups in docs/naming.md §7 order, then components alphabetically
       * within a group. The object form's `method: 'alphabetical'` would also
       * reorder the stories inside a file, and the order a file declares its
       * stories in is deliberate, so equal titles keep their file order.
       * Storybook evaluates this function's source text on its own, so it must
       * be self-contained and carry no TypeScript annotations.
       */
      storySort: (a, b) => {
        const groups = [
          'Foundations',
          'Typography',
          'Actions',
          'Forms',
          'Navigation',
          'Layout',
          'Overlays',
          'Feedback',
          'Data display',
          'Patterns',
        ]
        const rankA = groups.indexOf(a.title.split('/')[0])
        const rankB = groups.indexOf(b.title.split('/')[0])
        const byGroup =
          (rankA === -1 ? groups.length : rankA) - (rankB === -1 ? groups.length : rankB)
        if (byGroup !== 0) return byGroup
        return a.title === b.title ? 0 : a.title.localeCompare(b.title)
      },
    },
  },
  globalTypes: {
    scheme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Scheme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    preset: {
      description: 'Theme preset',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: Object.keys(presets).map((name) => ({ value: name, title: name })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { scheme: 'light', preset: 'zinc' },
  decorators: [withTheme],
}

export default preview
