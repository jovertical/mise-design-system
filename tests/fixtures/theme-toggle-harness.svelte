<script lang="ts">
  import { type Theme, ThemeProvider, ThemeToggle } from '../../src/lib/index.js'

  let { defaultTheme }: { defaultTheme?: Theme } = $props()
</script>

<ThemeProvider storageKey="mise-test-theme" {defaultTheme}>
  <ThemeToggle />
</ThemeProvider>
