<!--
  Origin: the React package 2.23.0 `input-otp.tsx` (`InputOTPSeparator`), itself shadcn/ui new-york `input-otp`
  Svelte: shadcn-svelte `input-otp`
  Diverged: Tabler's minus for Lucide's. Takes `class`, and children in place of
    the icon, as shadcn-svelte's does.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type InputOTPSeparatorProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import IconMinus from '@tabler/icons-svelte-runes/icons/minus'

  let { ref = $bindable(null), children, ...rest }: InputOTPSeparatorProps = $props()
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: upstream shadcn markup. An <hr> cannot hold the icon drawn between the groups of cells -->
<div bind:this={ref} data-slot="input-otp-separator" role="separator" {...rest}>
  {#if children}
    {@render children()}
  {:else}
    <IconMinus />
  {/if}
</div>
