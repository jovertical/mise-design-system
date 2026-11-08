<!--
  Origin: the React package 2.23.0 `readiness.tsx` (`ReadinessChecklist`)
  Diverged: the folder's root part, exported as ReadinessChecklist. Lucide's
    circle-check (filled by class), loader, circle-dashed and circle-small
    (filled) for Tabler's. Spreads the rest onto the list, as every component
    does.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { ReadinessItem } from './readiness-summarise.js'

  /**
   * One row per requirement, answering "what does this page still need from
   * me". Deliberately not wrapped in a card: it goes in an AsideCard on one
   * page and a page body on another, and a component that brought its own
   * surface would make the second impossible.
   */
  export type ReadinessChecklistProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
    items: ReadinessItem[]
    /** Shown when nothing is applicable: a server returning no rows. */
    emptyMessage?: string
    /**
     * Drops the "Required" / "Optional" tag from unmet rows, for a progress
     * list (what a server is doing), where a queued step tagged Required in
     * warning colour reads as a problem when it simply has not started.
     */
    showRequirement?: boolean
  }
</script>

<script lang="ts">
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check'
  import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed'
  import CircleSmallIcon from '@lucide/svelte/icons/circle-small'
  import LoaderIcon from '@lucide/svelte/icons/loader'

  import { cn } from '../../../utils/cn.js'
  import Text from '../../typography/text/text.svelte'
  import { summariseReadiness } from './readiness-summarise.js'

  let {
    items,
    emptyMessage = 'Nothing to check yet.',
    showRequirement = true,
    class: className,
    ...rest
  }: ReadinessChecklistProps = $props()

  const applicable = $derived(summariseReadiness(items).applicable)
  const icon = 'mt-0.5 size-4 shrink-0'
</script>

{#if applicable.length === 0}
  <Text as="p" size="sm" muted>{emptyMessage}</Text>
{:else}
  <ul data-slot="readiness-checklist" class={cn('flex flex-col gap-3', className)} {...rest}>
    {#each applicable as item (item.id)}
      {@const met = item.status === 'met'}
      {@const pending = item.status === 'pending'}
      <li data-status={item.status} class="flex items-start gap-2 text-sm">
        {#if met}
          <CircleCheckIcon class={cn('text-success fill-current [&_path]:text-background', icon)} />
        {:else if pending}
          <LoaderIcon class={cn('text-muted-foreground animate-spin', icon)} />
        {:else if item.optional}
          <!-- A skipped optional and a missing required are both unticked and
               are not the same news: only the second shuts the gate. -->
          <CircleDashedIcon class={cn('text-muted-foreground', icon)} />
        {:else}
          <CircleSmallIcon class={cn('text-warning fill-current', icon)} />
        {/if}

        <div class="min-w-0 flex-1">
          <div class="flex items-baseline justify-between gap-2">
            <span class={cn('min-w-0 truncate', !met && 'text-muted-foreground')}
              >{item.label}</span
            >
            <!-- Only says what is needed: a tag on every row turns the column
                 into a second list. -->
            {#if showRequirement && !met && !pending}
              <span
                class={cn(
                  'shrink-0 text-xs',
                  item.optional ? 'text-muted-foreground' : 'text-warning',
                )}
              >
                {item.optional ? 'Optional' : 'Required'}
              </span>
            {/if}
          </div>
          {#if !met && item.detail}
            <p class="text-muted-foreground mt-0.5 text-xs">{item.detail}</p>
          {/if}
          {#if !met && item.action}
            <div class="mt-0.5 text-xs">{@render item.action()}</div>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
{/if}
