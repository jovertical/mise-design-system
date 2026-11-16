<!-- A register PIN of 4 to 6 digits: digits only, a dot for each digit typed. -->
<script lang="ts">
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '@jovertical/mise-design-system'

  let pin = $state('4821')
</script>

<InputOTP maxlength={6} pattern={'^\\d*$'} inputmode="numeric" aria-label="PIN" bind:value={pin}>
  {#snippet children({ cells })}
    <InputOTPGroup class="w-80">
      {#each cells as cell (cell)}
        <InputOTPSlot {cell} masked class="w-auto flex-1" />
      {/each}
    </InputOTPGroup>
  {/snippet}
</InputOTP>
