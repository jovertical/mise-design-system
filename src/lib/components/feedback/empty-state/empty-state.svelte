<!--
  Origin: the React package 2.23.0 `empty-state.tsx`
  Diverged: `icon` and `actions` are snippets, as R3-4 has a ReactNode prop.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  /**
   * The default "nothing here yet" panel, for a list that came back empty when
   * the screen has nothing more specific to say. `Empty` and its parts stay
   * exported for the cases that do. The fallback wording is honest anywhere,
   * which is also the signal that a screen has not been given its own.
   */
  export interface EmptyStateProps {
    /** Rendered in `EmptyMedia`'s icon chip. */
    icon: Snippet
    title?: string
    description?: string
    /** Buttons offering a way out of the empty state, laid out in a row. */
    actions?: Snippet
    class?: string
  }
</script>

<script lang="ts">
  import Empty from '../empty/empty.svelte'
  import EmptyContent from '../empty/empty-content.svelte'
  import EmptyDescription from '../empty/empty-description.svelte'
  import EmptyHeader from '../empty/empty-header.svelte'
  import EmptyMedia from '../empty/empty-media.svelte'
  import EmptyTitle from '../empty/empty-title.svelte'

  let { icon, title, description, actions, class: className }: EmptyStateProps = $props()
</script>

<Empty class={className}>
  <EmptyHeader>
    <EmptyMedia variant="icon">{@render icon()}</EmptyMedia>
    <EmptyTitle>{title || 'No Data'}</EmptyTitle>
    <EmptyDescription>{description || 'There is no data available.'}</EmptyDescription>
  </EmptyHeader>
  {#if actions}
    <EmptyContent class="flex-row justify-center gap-2">{@render actions()}</EmptyContent>
  {/if}
</Empty>
