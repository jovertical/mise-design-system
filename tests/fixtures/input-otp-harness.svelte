<script lang="ts">
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../../src/lib/index.js'

  let { value = $bindable(''), masked = false }: { value?: string; masked?: boolean } = $props()
</script>

<InputOTP maxlength={6} bind:value aria-label="Verification code">
  {#snippet children({ cells })}
    <InputOTPGroup>
      {#each cells.slice(0, 3) as cell (cell)}
        <InputOTPSlot {cell} {masked} />
      {/each}
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      {#each cells.slice(3, 6) as cell (cell)}
        <InputOTPSlot {cell} {masked} />
      {/each}
    </InputOTPGroup>
  {/snippet}
</InputOTP>
<output data-testid="value">{value}</output>
