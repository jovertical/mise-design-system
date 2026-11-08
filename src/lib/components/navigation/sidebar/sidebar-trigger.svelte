<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarTrigger`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { ButtonProps } from '../../actions/button/button.svelte'

  export type SidebarTriggerProps = ButtonProps
</script>

<script lang="ts">
  import PanelLeftIcon from '@lucide/svelte/icons/panel-left'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import { useSidebar } from './context.svelte.js'

  let { ref = $bindable(null), class: className, onclick, ...rest }: SidebarTriggerProps = $props()

  const sidebar = useSidebar()
</script>

<Button
  bind:ref
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  variant="ghost"
  iconOnly
  type="button"
  class={cn('size-7', className)}
  onclick={(event: MouseEvent) => {
    onclick?.(event as never)
    sidebar.toggle()
  }}
  {...rest}
>
  <PanelLeftIcon class="size-5" />
  <span class="sr-only">Toggle Sidebar</span>
</Button>
