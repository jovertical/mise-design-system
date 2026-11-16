<!--
  Open on the page, for the anatomy, through the bindable `open` and
  `contentProps`: opened once mounted, since a tooltip that starts open is
  never positioned, and placed absolutely inside the stage.
-->
<script lang="ts">
  import { Hint } from '@jovertical/mise-design-system'

  let open = $state(false)

  $effect(() => {
    open = true
  })

  const contentProps = {
    side: 'top' as const,
    strategy: 'absolute' as const,
    avoidCollisions: false,
    portalProps: { disabled: true },
  }
</script>

<span class="text-foreground flex items-center gap-1.5 text-sm font-medium">
  Capacity used
  <Hint label="What counts toward capacity" bind:open {contentProps}>
    Provisioned databases against the plan's ceiling.
  </Hint>
</span>
