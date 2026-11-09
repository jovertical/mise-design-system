<!--
  Demo-only: `?scheme=dark` or `?scheme=light` sets the theme once on load, so
  the smoke run can screenshot both schemes without clicking the toggle. It
  goes through ThemeProvider like the toggle does, so the choice is stored.
-->
<script lang="ts">
  import { useTheme } from '@jovertical/mise-design-system'
  import { page } from '$app/state'

  const theme = useTheme()
  const requested = page.url.searchParams.get('scheme')
  if (requested === 'dark' || requested === 'light') theme.setTheme(requested)
</script>
