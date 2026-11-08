<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarSeparator`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { SeparatorProps } from '../../layout/separator/separator.svelte'

  export type SidebarSeparatorProps = SeparatorProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Separator from '../../layout/separator/separator.svelte'

  let { ref = $bindable(null), class: className, ...rest }: SidebarSeparatorProps = $props()
</script>

<Separator
  bind:ref
  data-slot="sidebar-separator"
  data-sidebar="separator"
  class={cn(
    'mx-2 w-auto',
    'group-data-[sidetheme=primary]:bg-white/30 group-data-[sidetheme=light]:bg-border group-data-[sidetheme=panel]:bg-sidebar-border',
    className,
  )}
  {...rest}
/>
