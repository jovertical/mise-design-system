<!--
  Origin: the React package 2.23.0 `item.tsx` (`ItemSeparator`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { SeparatorProps } from '../../layout/separator/separator.svelte'

  export type ItemSeparatorProps = SeparatorProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Separator from '../../layout/separator/separator.svelte'

  let { ref = $bindable(null), class: className, ...rest }: ItemSeparatorProps = $props()
</script>

<Separator
  bind:ref
  data-slot="item-separator"
  orientation="horizontal"
  class={cn('my-0', className)}
  {...rest}
/>
