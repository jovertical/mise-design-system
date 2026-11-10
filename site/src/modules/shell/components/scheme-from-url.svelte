<!--
  `?scheme=dark` or `?scheme=light` sets the theme once on load, so the smoke
  run can open every page in both schemes without clicking the toggle. It goes
  through ThemeProvider like the toggle does. From the logistics example, read
  in an effect because a prerendered page has no query string.
-->
<script lang="ts">
  import { useTheme } from '@jovertical/mise-design-system'
  import { page } from '$app/state'

  const theme = useTheme()

  $effect(() => {
    const requested = page.url.searchParams.get('scheme')

    if (requested === 'dark' || requested === 'light') theme.setTheme(requested)
  })
</script>
