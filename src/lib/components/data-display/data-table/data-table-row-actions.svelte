<!--
  Origin: the React package 2.23.0 `data-table-row-actions.tsx`
  Diverged: Lucide's ellipsis for Tabler's dots. Takes `class`, as every
    component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  /**
   * The ⋯ at the end of a table row, and the menu it opens: a round, soft,
   * neutral button whose hover dims its own chip, never `--accent`, which means
   * the active nav row. The menu opens leftward (`align="end"`) to stay inside
   * the table.
   *
   * The wrapper stops the click, so opening the menu does not also open a row
   * that navigates on click.
   */
  export type DataTableRowActionsProps = {
    /** The menu's items: `DropdownMenuItem`s, separators, a destructive item last. */
    children: Snippet
    /**
     * Announced in place of the glyph. Name the row when you can ("Actions for
     * Riverside") so a screen reader down the column hears which row it is.
     */
    label?: string
    /**
     * For a row with no actions it may take. The trigger stays, so the column
     * keeps its rhythm, and `label` says why it is off.
     */
    disabled?: boolean
    class?: string
  }
</script>

<script lang="ts">
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import DropdownMenu from '../../actions/dropdown-menu/dropdown-menu.svelte'
  import DropdownMenuContent from '../../actions/dropdown-menu/dropdown-menu-content.svelte'
  import DropdownMenuTrigger from '../../actions/dropdown-menu/dropdown-menu-trigger.svelte'

  let {
    children,
    label = 'Open menu',
    disabled = false,
    class: className,
  }: DataTableRowActionsProps = $props()
</script>

<!-- Not a control: it only keeps the row's own click from firing under the button. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<!-- biome-ignore lint/a11y/noStaticElementInteractions: not a control; it stops the row's click under the button -->
<!-- biome-ignore lint/a11y/useKeyWithClickEvents: the button inside is the control, with its own keyboard handling -->
<div
  data-slot="data-table-row-actions"
  class={cn('flex justify-end', className)}
  onclick={(event) => event.stopPropagation()}
>
  <DropdownMenu>
    <DropdownMenuTrigger {disabled}>
      {#snippet child({ props })}
        <Button
          variant="soft"
          tone="neutral"
          size="sm"
          iconOnly
          aria-label={label}
          class="rounded-full"
          {...props}
        >
          <EllipsisIcon />
        </Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">{@render children()}</DropdownMenuContent>
  </DropdownMenu>
</div>
