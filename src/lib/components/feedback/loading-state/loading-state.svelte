<!--
  Origin: the React package 2.23.0 `loading-state.tsx`
  Diverged: `actions` is a snippet, as R3-4 has a ReactNode prop.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  /**
   * The panel that says work is under way, when the shape of what is coming is
   * not known yet. The mirror of `EmptyState`, on the same `Empty` parts, so a
   * list that flips from loading to empty does not move; the border is solid
   * because something is coming. Reach for it last: where the layout is known,
   * a `Skeleton` holds it.
   */
  export interface LoadingStateProps {
    title?: string
    description?: string
    /** Something to do instead of waiting, usually "Continue in background". */
    actions?: Snippet
    class?: string
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Empty from '../empty/empty.svelte'
  import EmptyContent from '../empty/empty-content.svelte'
  import EmptyDescription from '../empty/empty-description.svelte'
  import EmptyHeader from '../empty/empty-header.svelte'
  import EmptyMedia from '../empty/empty-media.svelte'
  import EmptyTitle from '../empty/empty-title.svelte'
  import Spinner from '../spinner/spinner.svelte'

  let { title, description, actions, class: className }: LoadingStateProps = $props()
</script>

<Empty class={cn('border-solid', className)}>
  <EmptyHeader>
    <EmptyMedia variant="icon"><Spinner class="size-6" /></EmptyMedia>
    <EmptyTitle>{title || 'Loading'}</EmptyTitle>
    {#if description}
      <EmptyDescription>{description}</EmptyDescription>
    {/if}
  </EmptyHeader>
  {#if actions}
    <EmptyContent class="flex-row justify-center gap-2">{@render actions()}</EmptyContent>
  {/if}
</Empty>
