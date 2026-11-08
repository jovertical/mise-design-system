<!--
  Origin: the React package 2.23.0 `button-group.tsx` (`ButtonGroupSeparator`), itself shadcn/ui new-york `button-group`
  Svelte: shadcn-svelte `button-group`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { SeparatorProps } from '../../layout/separator/separator.svelte'

  /** A rule between two parts of a group. Vertical by default, for a row. */
  export type ButtonGroupSeparatorProps = SeparatorProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Separator from '../../layout/separator/separator.svelte'

  let {
    ref = $bindable(null),
    orientation = 'vertical',
    class: className,
    ...rest
  }: ButtonGroupSeparatorProps = $props()
</script>

<Separator
  bind:ref
  data-slot="button-group-separator"
  {orientation}
  class={cn('bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto', className)}
  {...rest}
/>
