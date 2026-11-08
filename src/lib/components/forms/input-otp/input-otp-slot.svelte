<!--
  Origin: the React package 2.23.0 `input-otp.tsx` (`InputOTPSlot`), itself shadcn/ui new-york `input-otp`
  Svelte: shadcn-svelte `input-otp`
  Diverged: takes bits-ui's `cell` where React takes an `index`, and React's
    `isMasked` is `masked`. `animate-caret-blink` is defined by neither
    package, so the caret is steady, as React's is.
-->
<script lang="ts" module>
  import { PinInput as InputOTPPrimitive } from 'bits-ui'

  export type InputOTPSlotProps = InputOTPPrimitive.CellProps & {
    /** A dot for each character typed, never the character: a PIN being set. */
    masked?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    cell,
    masked = false,
    class: className,
    ...rest
  }: InputOTPSlotProps = $props()
</script>

<InputOTPPrimitive.Cell
  bind:ref
  {cell}
  data-slot="input-otp-slot"
  class={cn(
    // A cell of the field: split from the one before it by a thin border, the
    // one being typed in a step lighter.
    'border-border relative flex w-9 items-center justify-center border-l text-sm transition-colors outline-none first:border-l-0',
    'data-[active=true]:bg-foreground/5',
    className,
  )}
  {...rest}
>
  {#snippet child({ props })}
    <div {...props} data-active={cell.isActive}>
      {#if masked && cell.char}
        <span data-slot="input-otp-dot" class="bg-foreground size-2 rounded-full"></span>
      {:else}
        {cell.char}
      {/if}
      {#if cell.hasFakeCaret}
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
        </div>
      {/if}
    </div>
  {/snippet}
</InputOTPPrimitive.Cell>
