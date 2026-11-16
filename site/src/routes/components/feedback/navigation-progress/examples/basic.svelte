<!--
  A route that takes a moment: press Navigate and the bar parks two thirds
  across the top until it resolves; one that resolves at once still flashes
  to full, so the click is acknowledged. The app feeds `pending` from its
  router. In an app the bar runs across the window; the box's transform holds
  it to the box here.
-->
<script lang="ts">
  import { Button, NavigationProgress } from '@jovertical/mise-design-system'

  let pending = $state(false)

  function navigate(duration: number) {
    pending = true

    setTimeout(() => (pending = false), duration)
  }
</script>

<div
  class="bg-muted flex h-32 w-full items-center justify-center gap-3 overflow-hidden rounded-xl border [transform:translateZ(0)]"
>
  <NavigationProgress {pending} />
  <Button onclick={() => navigate(1200)}>Navigate, slow</Button>
  <Button variant="outline" onclick={() => navigate(0)}>Navigate, instant</Button>
</div>
