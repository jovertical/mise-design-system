<!--
  Origin: the React package 2.23.0 `readiness.tsx` (`ReadinessChecklist`)
  Diverged: the folder's root part, exported as ReadinessChecklist. Spreads the
    rest onto the list, as every component does. Draws `severity` (a blocking
    row critical, a `warn` row tagged "Check") and takes `showDetail`, for a
    record of a past check (bertos-bakery-ops' audit, 2026-11-10).
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { ReadinessItem, ReadinessRequirement } from './readiness-summarise.js'

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
    /**
     * `unmet` shows a row's `detail` and `action` only while it is unmet;
     * `all` shows the detail on met rows too, for a record of a check already
     * made, where what was found matters as much as what passed.
     */
    showDetail?: 'unmet' | 'all'
  }

  const TAG: Record<ReadinessRequirement, { label: string; class: string }> = {
    required: { label: 'Required', class: 'text-warning' },
    blocking: { label: 'Required', class: 'text-destructive' },
    check: { label: 'Check', class: 'text-warning' },
    optional: { label: 'Optional', class: 'text-muted-foreground' },
  }
</script>

<script lang="ts">
  import IconCircleCheckFilled from '@tabler/icons-svelte-runes/icons/circle-check-filled'
  import IconCircleDashed from '@tabler/icons-svelte-runes/icons/circle-dashed'
  import IconLoader from '@tabler/icons-svelte-runes/icons/loader'
  import IconPointFilled from '@tabler/icons-svelte-runes/icons/point-filled'

  import { cn } from '../../../utils/cn.js'
  import Text from '../../typography/text/text.svelte'
  import { requirementOf, summariseReadiness } from './readiness-summarise.js'

  let {
    items,
    emptyMessage = 'Nothing to check yet.',
    showRequirement = true,
    showDetail = 'unmet',
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
      {@const requirement = requirementOf(item)}
      <li
        data-status={item.status}
        data-severity={item.severity}
        class="flex items-start gap-2 text-sm"
      >
        {#if met}
          <IconCircleCheckFilled class={cn('text-success', icon)} />
        {:else if pending}
          <IconLoader class={cn('text-muted-foreground animate-spin', icon)} />
        {:else if requirement === 'optional'}
          <!-- A skipped optional and a missing required are both unticked and
               are not the same news: only the second shuts the gate. -->
          <IconCircleDashed class={cn('text-muted-foreground', icon)} />
        {:else}
          <IconPointFilled class={cn(TAG[requirement].class, icon)} />
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
                data-slot="readiness-tag"
                class={cn('shrink-0 text-xs', TAG[requirement].class)}
              >
                {TAG[requirement].label}
              </span>
            {/if}
          </div>
          {#if item.detail && (!met || showDetail === 'all')}
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
