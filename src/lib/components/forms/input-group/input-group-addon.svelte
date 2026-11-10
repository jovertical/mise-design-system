<!--
  Origin: the React package 2.23.0 `input-group.tsx` (`InputGroupAddon`), itself shadcn/ui new-york `input-group`
  Svelte: shadcn-svelte `input-group`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { InputGroupAddonAlign } from './input-group-variants.js'

  /** A click on the addon focuses the group's input or textarea, unless it landed on a button. */
  export type InputGroupAddonProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    align?: InputGroupAddonAlign
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { inputGroupAddonVariants } from './input-group-variants.js'

  let {
    ref = $bindable(null),
    align = 'inline-start',
    class: className,
    children,
    onclick,
    ...rest
  }: InputGroupAddonProps = $props()

  function focusControl(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    onclick?.(event)

    if ((event.target as HTMLElement).closest('button')) return

    event.currentTarget.parentElement?.querySelector<HTMLElement>('input, textarea')?.focus()
  }
</script>

<!-- biome-ignore lint/a11y/useKeyWithClickEvents: forwards focus to the group's control, which is itself keyboard-operable -->
<!-- biome-ignore lint/a11y/useSemanticElements: a styling wrapper carrying a grouping role, as upstream -->
<div
  bind:this={ref}
  role="group"
  data-slot="input-group-addon"
  data-align={align}
  class={cn(inputGroupAddonVariants({ align }), className)}
  onclick={focusControl}
  {...rest}
>
  {@render children?.()}
</div>
