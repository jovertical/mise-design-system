<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldSet`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLFieldsetAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type FieldSetProps = WithElementRef<HTMLFieldsetAttributes, HTMLFieldSetElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: FieldSetProps = $props()
</script>

<fieldset
  bind:this={ref}
  data-slot="field-set"
  class={cn(
    'flex flex-col gap-6',
    'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</fieldset>
