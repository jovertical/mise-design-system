<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import NavigationProgress from './navigation-progress.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/NavigationProgress',
    component: NavigationProgress,
    tags: ['mise'],
    parameters: { layout: 'fullscreen' },
  })

  const slow = $state({ pending: false })
  const instant = $state({ pending: false })

  function navigate(state: { pending: boolean }, holdMs: number) {
    state.pending = true
    setTimeout(() => {
      state.pending = false
    }, holdMs)
  }
</script>

<!--
  A route that takes a moment: press Navigate and the bar parks at two thirds
  across the top of the viewport until it resolves. The app feeds `pending`
  from its router.
-->
<Story name="Playground" asChild>
  <div class="p-6">
    <NavigationProgress pending={slow.pending} />
    <Button onclick={() => navigate(slow, 1200)}>Navigate</Button>
  </div>
</Story>

<!--
  A route that resolves at once still flashes to full and hides, rather than
  never appearing: the click is acknowledged either way.
-->
<Story name="Instant navigation" asChild>
  <div class="p-6">
    <NavigationProgress pending={instant.pending} />
    <Button onclick={() => navigate(instant, 0)}>Navigate</Button>
  </div>
</Story>
