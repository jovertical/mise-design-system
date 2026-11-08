<!--
  Draws a story on a card, for components that live on one. The canvas is
  --muted, the page colour of an operations screen; a story shows a component
  where it is used.
-->
<script lang="ts">
  import type { Snippet } from 'svelte'

  import { Card, CardContent } from '../src/lib/index.js'

  let { children }: { children: Snippet } = $props()
</script>

<Card class="w-fit">
  <CardContent>{@render children()}</CardContent>
</Card>
