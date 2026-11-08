<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import ThemeProvider from './theme-provider.svelte'
  import ThemeToggle from './theme-toggle.svelte'

  const { Story } = defineMeta({
    title: 'Actions/ThemeToggle',
    component: ThemeToggle,
    tags: ['mise'],
    parameters: { layout: 'centered' },
  })
</script>

<!--
  Icon-only, between light and dark, inside a ThemeProvider. Click it and the
  provider moves the class on `<html>`, so the whole frame follows. The story's
  provider stores under its own key, so it does not overwrite another app's;
  the toolbar's scheme switch takes over again on the next story.
-->
<Story name="Playground" asChild>
  <ThemeProvider storageKey="mise-story-theme">
    <ThemeToggle />
  </ThemeProvider>
</Story>
