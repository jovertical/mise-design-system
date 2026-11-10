<!--
  Origin: the React package 2.23.0 `button.tsx`, itself shadcn/ui new-york `button`
  Svelte: shadcn-svelte `button`
  Diverged: `asChild` dropped for `href`, which renders an <a>. A disabled link
    drops its href, sets aria-disabled and leaves the tab order, as
    shadcn-svelte's button does; components.css draws it like :disabled. No
    `type` default is added; the React button has none.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'
  import type { ButtonSize, ButtonVariant } from './button-variants.js'

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant
      /** Defaults to `primary` for `solid` and `link`, `neutral` for the rest. */
      tone?: Tone
      size?: ButtonSize
      /** One glyph and no label: square, round, and it needs an `aria-label`. */
      iconOnly?: boolean
      children?: Snippet
    }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { buttonVariants, defaultButtonTone } from './button-variants.js'

  let {
    variant = 'solid',
    tone,
    size = 'md',
    iconOnly = false,
    href,
    disabled,
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: ButtonProps = $props()

  const resolvedTone = $derived(tone ?? defaultButtonTone(variant))

  const classes = $derived(
    cn(buttonVariants({ variant, tone: resolvedTone, size, iconOnly }), className),
  )
</script>

{#if href}
  <a
    bind:this={ref}
    href={disabled ? undefined : href}
    aria-disabled={disabled || undefined}
    role={disabled ? 'link' : undefined}
    tabindex={disabled ? -1 : undefined}
    class={classes}
    data-slot="button"
    data-variant={variant}
    data-tone={resolvedTone}
    data-size={size}
    data-icon-only={iconOnly || undefined}
    {...rest}
  >
    {@render children?.()}
  </a>
{:else}
  <!-- biome-ignore lint/a11y/useButtonType: `type` comes from the caller through rest, as in React -->
  <button
    bind:this={ref}
    {disabled}
    class={classes}
    data-slot="button"
    data-variant={variant}
    data-tone={resolvedTone}
    data-size={size}
    data-icon-only={iconOnly || undefined}
    {...rest}
  >
    {@render children?.()}
  </button>
{/if}
