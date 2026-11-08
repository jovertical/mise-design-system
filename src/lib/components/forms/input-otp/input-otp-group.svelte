<!--
  Origin: the React package 2.23.0 `input-otp.tsx` (`InputOTPGroup`), itself shadcn/ui new-york `input-otp`
  Svelte: shadcn-svelte `input-otp`
  Diverged: focus is read with `group-focus-within/input-otp` from the
    container that holds the hidden input, where React reads input-otp's
    context into `data-focused`.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The field: one rounded box around its slots, drawn as `Input` is
   * (rounded-2xl, `bg-input/50`, the same focus ring around the whole of it),
   * so a code sits in a form of inputs as one of them. Pass `aria-invalid`
   * here, not on the slots: the field is what turns red.
   */
  export type InputOTPGroupProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: InputOTPGroupProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="input-otp-group"
  class={cn(
    'bg-input/50 flex h-9 items-stretch overflow-hidden rounded-2xl border border-transparent shadow-xs transition-[color,box-shadow]',
    'group-focus-within/input-otp:border-ring group-focus-within/input-otp:ring-ring/50 group-focus-within/input-otp:ring-[3px]',
    'aria-invalid:border-destructive group-focus-within/input-otp:aria-invalid:ring-destructive/20 dark:group-focus-within/input-otp:aria-invalid:ring-destructive/40',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
