<!--
  Origin: the React package 2.23.0 `error-page.tsx`
  Diverged: React's ErrorPage, renamed to sit beside EmptyState and
    LoadingState (round 8 plan, R8-3). `icon`, `homeLink` and `actions` are
    snippets; `homeLink` is the caller's own link, drawn as given (a `Button`
    with `href`, or the router's link in one), where React wrapped a node in
    `Button asChild`. Spreads the rest onto the root, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * The full-page stop: not found, forbidden, or something that threw.
   *
   * Three lines and a button, sitting high on the page rather than centred in
   * it, near where a reader's eye already is. The description is given room to
   * stay on one line: clamped to the width the empty states use, a sentence
   * explaining what happened breaks into three ragged lines.
   *
   * The action names its destination ("Back to transfers"), and a refusal
   * explains the rule, not the mechanism.
   */
  export type ErrorStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> & {
    /** HTTP status, above the title. Omit it and nothing is shown. */
    status?: number
    title: string
    description: string
    /**
     * A glyph above the title. Most error pages read better without one: the
     * sentence already says what happened.
     */
    icon?: Snippet
    /** The way home: a `Button` with `href`, or the router's link styled as one. */
    homeLink?: Snippet
    /**
     * A `history.back()` button ahead of `homeLink`. Off by default: one obvious
     * way forward is easier to act on, and Back is right only when the reader
     * arrived by navigating rather than by URL.
     */
    showBackButton?: boolean
    /** Extra buttons, ahead of Back and Home: Try again, for a thrown error. */
    actions?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import Empty from '../empty/empty.svelte'
  import EmptyContent from '../empty/empty-content.svelte'
  import EmptyDescription from '../empty/empty-description.svelte'
  import EmptyHeader from '../empty/empty-header.svelte'
  import EmptyMedia from '../empty/empty-media.svelte'
  import EmptyTitle from '../empty/empty-title.svelte'

  let {
    status,
    title,
    description,
    icon,
    homeLink,
    showBackButton = false,
    actions,
    class: className,
    ...rest
  }: ErrorStateProps = $props()

  const hasActions = $derived(Boolean(actions || showBackButton || homeLink))
</script>

<div
  data-slot="error-state"
  class={cn(
    'flex min-h-[calc(30vh-var(--header-height,0px))] w-full items-center justify-center p-6',
    className,
  )}
  {...rest}
>
  <Empty class="gap-3 border-none">
    <EmptyHeader class="max-w-2xl gap-2">
      {#if icon}
        <EmptyMedia variant="icon">{@render icon()}</EmptyMedia>
      {/if}
      {#if status !== undefined}
        <span class="text-muted-foreground text-xs font-medium tracking-widest">{status}</span>
      {/if}
      <EmptyTitle class="font-semibold">{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>

    {#if hasActions}
      <EmptyContent class="max-w-2xl flex-row justify-center gap-2">
        {@render actions?.()}
        {#if showBackButton}
          <Button variant="outline" onclick={() => window.history.back()}>Go Back</Button>
        {/if}
        {@render homeLink?.()}
      </EmptyContent>
    {/if}
  </Empty>
</div>
