<!--
  Origin: the React package 2.23.0 `navigation-progress.tsx`
  Diverged: the shimmer's class and keyframes are `mise-` prefixed in
    components.css. Effects on `pending` for React's two effects and refs.
    `top-0`, which React's lacked: without it the fixed bar sat at its place in
    the flow, not across the top of the viewport its own comment promises.
-->
<script lang="ts" module>
  /** Where the bar waits while a navigation is in flight. */
  const PEAK_POSITION = 0.65
  const PEAK_ANIMATION_MS = 220
  const DONE_ANIMATION_MS = 180
  const BAR_HEIGHT = 5

  /**
   * The navigation progress bar across the top of the viewport.
   *
   * It does not report real progress, and cannot: a route transition has no
   * measurable completion. It jumps to about two thirds and waits there, the
   * honest version of the same lie every browser tells. A navigation that
   * resolves instantly still flashes the bar to full and hides it, rather than
   * leaving it parked: nothing is worse than a progress bar that stops.
   */
  export type NavigationProgressProps = {
    /**
     * Whether a navigation is in flight. Rising shows the bar and runs it to
     * the peak; falling runs it to full width and hides it. The router stays in
     * the app: Inertia's start and finish events, or SvelteKit's `navigating`.
     */
    pending: boolean
  }
</script>

<script lang="ts">
  let { pending }: NavigationProgressProps = $props()

  let progress = $state(0)
  let visible = $state(false)
  let wasPending = false
  let peakTimeout: ReturnType<typeof setTimeout> | undefined
  let doneTimeout: ReturnType<typeof setTimeout> | undefined

  $effect(() => {
    if (pending && !wasPending) {
      // Start: show the bar and move to the peak on the next tick, so the
      // transition has a 0 to move away from.
      wasPending = true
      clearTimeout(doneTimeout)
      visible = true
      progress = 0
      peakTimeout = setTimeout(() => {
        progress = PEAK_POSITION
      }, 0)
    } else if (!pending && wasPending) {
      // Done: run to full width, then hide.
      wasPending = false
      clearTimeout(peakTimeout)
      progress = 1
      doneTimeout = setTimeout(() => {
        visible = false
        progress = 0
      }, DONE_ANIMATION_MS)
    }
  })

  $effect(() => () => {
    clearTimeout(peakTimeout)
    clearTimeout(doneTimeout)
  })

  const duration = $derived(progress === 1 ? DONE_ANIMATION_MS : PEAK_ANIMATION_MS)
</script>

{#if visible}
  <div
    data-slot="navigation-progress"
    class="fixed top-0 right-0 left-0 z-[1600]"
    style:height="{BAR_HEIGHT}px"
    role="progressbar"
    aria-label="Loading"
    aria-valuenow={Math.round(progress * 100)}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <div
      class="bg-primary relative h-full overflow-hidden transition-[width] ease-out"
      style:width="{progress * 100}%"
      style:transition-duration="{duration}ms"
    >
      <div class="mise-navigation-progress-shimmer absolute inset-0" aria-hidden="true"></div>
    </div>
  </div>
{/if}
