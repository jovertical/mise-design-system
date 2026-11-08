<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarMenuButton`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: React's `asChild` becomes a `child` snippet that receives the
    button's props. `tooltip` takes a string or a snippet; React's
    TooltipContent props object becomes `tooltipContentProps`.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { TooltipContentProps } from '../../overlays/tooltip/tooltip-content.svelte'
  import type { SidebarMenuButtonSize } from './sidebar-variants.js'

  export type SidebarMenuButtonProps = WithElementRef<HTMLButtonAttributes, HTMLButtonElement> & {
    child?: Snippet<[{ props: Record<string, unknown> }]>
    isActive?: boolean
    size?: SidebarMenuButtonSize
    /** Keeps the button flat: no hover or active background, as for a logo. */
    noHover?: boolean
    /** Shown beside the button while the sidebar is collapsed to icons, on desktop. */
    tooltip?: string | Snippet
    tooltipContentProps?: Omit<TooltipContentProps, 'children'>
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Tooltip from '../../overlays/tooltip/tooltip.svelte'
  import TooltipContent from '../../overlays/tooltip/tooltip-content.svelte'
  import TooltipTrigger from '../../overlays/tooltip/tooltip-trigger.svelte'
  import { useSidebar } from './context.svelte.js'
  import { sidebarMenuButtonVariants } from './sidebar-variants.js'

  let {
    ref = $bindable(null),
    child,
    isActive = false,
    size = 'default',
    noHover = false,
    tooltip,
    tooltipContentProps,
    class: className,
    children,
    ...rest
  }: SidebarMenuButtonProps = $props()

  const sidebar = useSidebar()

  const buttonProps = $derived({
    'data-slot': 'sidebar-menu-button',
    'data-sidebar': 'menu-button',
    'data-size': size,
    'data-active': isActive,
    class: cn(
      sidebarMenuButtonVariants({ size }),
      noHover &&
        'hover:bg-transparent! active:bg-transparent! data-[active=true]:bg-transparent! data-[state=open]:bg-transparent!',
      className,
    ),
    ...rest,
  })
</script>

{#snippet button(extra: Record<string, unknown>)}
  {@const merged = { ...buttonProps, ...extra }}
  {#if child}
    {@render child({ props: merged })}
  {:else}
    <button bind:this={ref} type="button" {...merged}>{@render children?.()}</button>
  {/if}
{/snippet}

{#if !tooltip}
  {@render button({})}
{:else}
  <Tooltip>
    <TooltipTrigger>
      {#snippet child({ props })}
        {@render button(props)}
      {/snippet}
    </TooltipTrigger>
    <TooltipContent
      side="right"
      align="center"
      hidden={sidebar.state !== 'collapsed' || sidebar.isMobile}
      {...tooltipContentProps}
    >
      {#if typeof tooltip === 'string'}
        {tooltip}
      {:else}
        {@render tooltip()}
      {/if}
    </TooltipContent>
  </Tooltip>
{/if}
