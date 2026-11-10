<!--
  Origin: mise
  Diverged: none. The React package has no search trigger; the apps built on
    it hand-roll one in their header. mise authored it (2026-11-10).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The "Type to search… ⌘K" field in a header, which opens a command
   * palette. A button shaped like an input, not an input: the palette owns
   * the text field, so typing here would mean two search fields to keep in
   * step. Bind `open` to the same value as the `CommandDialog`.
   */
  export type CommandTriggerProps = WithElementRef<HTMLButtonAttributes> & {
    /** Whether the palette is open. Opened on click, toggled on the hotkey. */
    open?: boolean
    /** The key that, with ⌘ or Ctrl, toggles `open`. `false` registers none and hides the hint. */
    hotkey?: string | false
    /** The label. Defaults to "Type to search…". */
    children?: Snippet
  }
</script>

<script lang="ts">
  import IconSearch from '@tabler/icons-svelte-runes/icons/search'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    open = $bindable(false),
    hotkey = 'k',
    class: className,
    children,
    onclick,
    ...rest
  }: CommandTriggerProps = $props()

  // ⌘ until the browser says otherwise, so a server render and the first
  // client render agree.
  let modifier = $state('⌘')

  $effect(() => {
    const apple = /Mac|iPhone|iPad/.test(navigator.platform)

    modifier = apple ? '⌘' : 'Ctrl '
  })

  const shortcuts = $derived(
    hotkey === false ? undefined : `Meta+${hotkey.toUpperCase()} Control+${hotkey.toUpperCase()}`,
  )

  function onwindowkeydown(event: KeyboardEvent) {
    if (hotkey === false) {
      return
    }

    const pressed = event.key.toLowerCase() === hotkey.toLowerCase()

    if (!pressed || !(event.metaKey || event.ctrlKey)) {
      return
    }

    event.preventDefault()

    open = !open
  }

  function onbuttonclick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    onclick?.(event)

    if (event.defaultPrevented) {
      return
    }

    open = true
  }
</script>

<svelte:window onkeydown={onwindowkeydown} />

<button
  bind:this={ref}
  type="button"
  data-slot="command-trigger"
  aria-keyshortcuts={shortcuts}
  class={cn(
    'bg-input/50 text-muted-foreground hover:bg-input/70 hover:text-foreground flex h-9 w-full min-w-0 items-center gap-2 rounded-2xl border border-transparent px-3 text-sm shadow-xs transition-[color,background-color,box-shadow] outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    className,
  )}
  onclick={onbuttonclick}
  {...rest}
>
  <IconSearch class="size-4 shrink-0" />
  <span class="truncate">
    {#if children}
      {@render children()}
    {:else}
      Type to search…
    {/if}
  </span>
  {#if hotkey !== false}
    <kbd
      class="bg-background text-muted-foreground ml-auto hidden shrink-0 rounded-md border px-1.5 py-0.5 text-xs font-medium sm:inline-block"
    >
      {modifier}{hotkey.toUpperCase()}
    </kbd>
  {/if}
</button>
