<!--
  Origin: the React package 2.23.0 `button.tsx`, itself shadcn/ui new-york `button`
  Svelte: shadcn-svelte `button`
  Diverged: `asChild` dropped for `href`, which renders an <a>. A disabled link
    drops its href, sets aria-disabled and leaves the tab order, as
    shadcn-svelte's button does; components.css draws it like :disabled. No
    `type` default is added; the React button has none. Adds `loading`, which
    React's lacked: a spinner before the label, `aria-busy`, and the button
    disabled until it settles (bertos-bakery-ops' audit, 2026-11-10).
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
      /**
       * Waiting on what the press started: a spinner before the label,
       * `aria-busy`, and disabled so a second press cannot repeat it. A loading
       * link drops its `href`, as a disabled one does.
       */
      loading?: boolean
      children?: Snippet
    }
</script>

<script lang="ts">
  import IconLoader2 from '@tabler/icons-svelte-runes/icons/loader-2'

  import { cn } from '../../../utils/cn.js'
  import { buttonVariants, defaultButtonTone } from './button-variants.js'

  let {
    variant = 'solid',
    tone,
    size = 'md',
    iconOnly = false,
    href,
    disabled,
    loading = false,
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: ButtonProps = $props()

  const resolvedTone = $derived(tone ?? defaultButtonTone(variant))
  const inactive = $derived(Boolean(disabled) || loading)

  const classes = $derived(
    cn(buttonVariants({ variant, tone: resolvedTone, size, iconOnly }), className),
  )
</script>

{#snippet spinner()}
  {#if loading}
    <IconLoader2 aria-hidden="true" data-slot="button-spinner" class="animate-spin" />
  {/if}
{/snippet}

{#if href}
  <a
    bind:this={ref}
    href={inactive ? undefined : href}
    aria-disabled={inactive || undefined}
    aria-busy={loading || undefined}
    role={inactive ? 'link' : undefined}
    tabindex={inactive ? -1 : undefined}
    class={classes}
    data-slot="button"
    data-variant={variant}
    data-tone={resolvedTone}
    data-size={size}
    data-icon-only={iconOnly || undefined}
    data-loading={loading ? '' : undefined}
    {...rest}
  >
    {@render spinner()}
    {@render children?.()}
  </a>
{:else}
  <!-- biome-ignore lint/a11y/useButtonType: `type` comes from the caller through rest, as in React -->
  <button
    bind:this={ref}
    disabled={inactive}
    aria-busy={loading || undefined}
    class={classes}
    data-slot="button"
    data-variant={variant}
    data-tone={resolvedTone}
    data-size={size}
    data-icon-only={iconOnly || undefined}
    data-loading={loading ? '' : undefined}
    {...rest}
  >
    {@render spinner()}
    {@render children?.()}
  </button>
{/if}
