<!--
  Origin: the React package 2.23.0 `page-header.tsx`
  Diverged: the ReactNode slots are snippets; `description` and `eyebrow` also
    take a plain string (R3-4). Adds `data-slot="page-header"`, and
    PageHeaderBackLink, the back link every create and edit page drew for
    itself (bertos-bakery-ops' audit, 2026-11-10).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  /**
   * Which affordance a page carries follows what kind of page it is. A list
   * page carries nothing above the title, which is the section's name. A
   * create or edit page carries `backLink` (the way out, drawn with
   * `PageHeaderBackLink`), and its title is what you are doing. A detail page
   * carries `breadcrumb`, to the parent or carrying the leaf, and its title is
   * the entity, or its kind and the entity, never the crumb repeated. A
   * multi-step flow carries `breadcrumb` with the leaf, and no title.
   */
  export interface PageHeaderProps {
    /**
     * Omit it when the trail carries the leaf and repeating it would add
     * nothing. Without a title there is no `h1`, so the body owns the heading.
     */
    title?: string
    description?: string | Snippet
    /** The trail of ancestors, above the title. Pass this or `backLink`, not both. */
    breadcrumb?: Snippet
    /** A way back out, where the breadcrumb would be: the create-and-edit shape. */
    backLink?: Snippet
    /** A short uppercase label naming the kind of page when the title cannot. */
    eyebrow?: string | Snippet
    /** Inline with the title: a switcher, a status badge. */
    titleAccessory?: Snippet
    /** One line, capped at `max-w-3xl`, with the whole title as a tooltip. For titles someone else wrote. */
    truncateTitle?: boolean
    /** The right-hand action cluster. */
    actions?: Snippet
    class?: string
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    title,
    description,
    breadcrumb,
    backLink,
    eyebrow,
    titleAccessory,
    truncateTitle = false,
    actions,
    class: className,
  }: PageHeaderProps = $props()

  const above = $derived(backLink ?? breadcrumb)
</script>

{#snippet text(content: string | Snippet)}
  {#if typeof content === 'string'}
    {content}
  {:else}
    {@render content()}
  {/if}
{/snippet}

{#snippet pageTitle(value: string)}
  <h1
    title={truncateTitle ? value : undefined}
    class={cn(
      'font-heading text-2xl font-bold tracking-tight lg:text-3xl',
      truncateTitle && 'max-w-3xl min-w-0 truncate',
    )}
  >
    {value}
  </h1>
{/snippet}

<div data-slot="page-header" class={cn('flex min-w-0 flex-col gap-2', className)}>
  {@render above?.()}

  {#if eyebrow}
    <p class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
      {@render text(eyebrow)}
    </p>
  {/if}

  <!-- Stacked on a narrow screen and a row from `lg`: actions drop below the title rather than squeezing it. -->
  <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    <div class="min-w-0 flex-1">
      {#if title && titleAccessory}
        <!-- A truncated title gives way to its accessory; an untruncated one wraps. -->
        <div
          class={cn('flex items-center gap-3', truncateTitle ? 'min-w-0 flex-nowrap' : 'flex-wrap')}
        >
          {@render pageTitle(title)}
          {@render titleAccessory()}
        </div>
      {:else if title}
        {@render pageTitle(title)}
      {:else}
        <!-- An accessory with no title still has a place: a badge beside a trail. -->
        {@render titleAccessory?.()}
      {/if}

      {#if description}
        <!-- Clamped on a phone: three lines of context before the first control is not context. -->
        <div class="text-muted-foreground mt-1 line-clamp-2 text-sm sm:line-clamp-none">
          {@render text(description)}
        </div>
      {/if}
    </div>

    {#if actions}
      <div class="flex shrink-0 flex-wrap items-center gap-2">{@render actions()}</div>
    {/if}
  </div>
</div>
