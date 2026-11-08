<!--
  Origin: the React package 2.23.0 `input-otp.tsx` (`InputOTP`), itself shadcn/ui new-york `input-otp`
  Svelte: shadcn-svelte `input-otp`
  Diverged: bits-ui PinInput for the `input-otp` package, with `bind:value`.
    `maxLength` is `maxlength`, and the slots are drawn from the `cells` the
    children snippet receives rather than read from a context by index. React's
    `containerClassName` is `class`, which bits-ui puts on the container; the
    rest of the props go to the hidden input, as React's do. The container is a
    `group/input-otp`, so the field can read focus from the hidden input.
-->
<script lang="ts" module>
  import { PinInput as InputOTPPrimitive } from 'bits-ui'

  /**
   * A one-time code or a PIN, typed into one hidden input and drawn as cells.
   * Lay out `InputOTPGroup`s and `InputOTPSlot`s in the children snippet, one
   * slot per cell it receives.
   */
  export type InputOTPProps = InputOTPPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(''),
    class: className,
    ...rest
  }: InputOTPProps = $props()
</script>

<InputOTPPrimitive.Root
  bind:ref
  bind:value
  data-slot="input-otp"
  spellcheck={false}
  class={cn('group/input-otp flex items-center gap-2 has-disabled:opacity-50', className)}
  {...rest}
/>
