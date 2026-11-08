<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import InputOTP from './input-otp.svelte'
  import InputOTPGroup from './input-otp-group.svelte'
  import InputOTPSeparator from './input-otp-separator.svelte'
  import InputOTPSlot from './input-otp-slot.svelte'

  const { Story } = defineMeta({
    title: 'Forms/InputOTP',
    component: InputOTP,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
    args: { maxlength: 6 },
  })
</script>

<!--
  A one-time code: six cells in two groups. The field is drawn as `Input` is,
  so a code sits in a form of inputs as one of them.
-->
<Story name="Playground">
  {#snippet template(args)}
    <InputOTP {...args} aria-label="Verification code">
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
  {/snippet}
</Story>

<!--
  A register PIN of 4 to 6 digits: six slots, digits only, a dot for each digit
  typed.
-->
<Story name="Masked PIN" asChild>
  <InputOTP maxlength={6} pattern={'^\\d*$'} inputmode="numeric" aria-label="PIN" value="4821">
    {#snippet children({ cells })}
      <InputOTPGroup class="w-80">
        {#each cells as cell (cell)}
          <InputOTPSlot {cell} masked class="w-auto flex-1" />
        {/each}
      </InputOTPGroup>
    {/snippet}
  </InputOTP>
</Story>
