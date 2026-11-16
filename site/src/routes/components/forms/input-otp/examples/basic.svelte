<!-- A one-time code: six cells in two groups, drawn as Input is. -->
<script lang="ts">
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from '@jovertical/mise-design-system'

  let code = $state('')
</script>

<InputOTP maxlength={6} bind:value={code} aria-label="Verification code">
  {#snippet children({ cells })}
    <InputOTPGroup>
      {#each cells.slice(0, 3) as cell (cell)}
        <InputOTPSlot {cell} />
      {/each}
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      {#each cells.slice(3, 6) as cell (cell)}
        <InputOTPSlot {cell} />
      {/each}
    </InputOTPGroup>
  {/snippet}
</InputOTP>
