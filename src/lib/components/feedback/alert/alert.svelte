<!--
  Origin: the React package 2.23.0 `alert.tsx` (`Alert`), itself shadcn/ui new-york `alert`
  Svelte: shadcn-svelte `alert`
  Diverged: the variants live in alert-variants.ts. Adds `tone`, the vocabulary
    every other mise component speaks, mapped onto the variants; `variant`
    still works where `tone` is absent (bertos-bakery-ops' audit, 2026-11-10).
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'
  import type { AlertVariant } from './alert-variants.js'

  /**
   * Status is the surface and the icon; the words stay in ink. Red body text
   * reads as the message being an error rather than being about one. The
   * layout has an icon column only when there is an icon, and a third column
   * for `AlertAction` from `sm`.
   */
  export type AlertProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /**
     * The status, as every component names it: `critical` for red, `neutral`
     * for the plain card. `primary` draws as `info`. Wins over `variant`.
     */
    tone?: Tone
    /** The older name for the same thing; `destructive` is `tone="critical"`. */
    variant?: AlertVariant
  }

  const TONE_VARIANT: Record<Tone, AlertVariant> = {
    neutral: 'default',
    primary: 'info',
    info: 'info',
    success: 'success',
    warning: 'warning',
    critical: 'destructive',
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { alertVariants } from './alert-variants.js'

  let {
    ref = $bindable(null),
    tone,
    variant,
    class: className,
    children,
    ...rest
  }: AlertProps = $props()

  const drawn = $derived(tone ? TONE_VARIANT[tone] : variant)
</script>

<div
  bind:this={ref}
  data-slot="alert"
  role="alert"
  data-tone={tone}
  class={cn(alertVariants({ variant: drawn }), className)}
  {...rest}
>
  {@render children?.()}
</div>
