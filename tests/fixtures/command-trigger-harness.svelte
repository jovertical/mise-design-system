<script lang="ts">
  import { CommandTrigger } from '../../src/lib/index.js'

  let {
    open = $bindable(false),
    hotkey = 'k',
    label,
    onclick,
  }: {
    open?: boolean
    hotkey?: string | false
    label?: string
    onclick?: (event: MouseEvent) => void
  } = $props()
</script>

{#if label}
  <CommandTrigger bind:open {hotkey} {onclick}>{label}</CommandTrigger>
{:else}
  <CommandTrigger bind:open {hotkey} {onclick} />
{/if}
<output data-testid="open">{open ? 'open' : 'closed'}</output>
