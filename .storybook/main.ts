import type { StorybookConfig } from '@storybook/sveltekit'

/**
 * `dist/theme.css` must exist before Storybook starts, because `preview.css`
 * imports it. `pnpm storybook` builds it first. Tailwind comes from
 * vite.config.ts, which the sveltekit framework loads.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.svelte', '../stories/**/*.stories.svelte'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    'storybook-addon-tag-badges',
  ],
  framework: { name: '@storybook/sveltekit', options: {} },
}

export default config
