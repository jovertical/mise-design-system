<!--
  Origin: the React package 2.23.0 `label.tsx`, itself shadcn/ui new-york `label`
  Svelte: shadcn-svelte `label`
  Diverged: unaudited, as in the React package. bits-ui Label for Radix Label.
-->
<script lang="ts" module>
  import { Label as LabelPrimitive } from 'bits-ui'

  /** The text naming a control: `for` points at the control's `id`. Inside a `Field`, use `FieldLabel`. */
  export type LabelProps = LabelPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: LabelProps = $props()
</script>

<LabelPrimitive.Root
  bind:ref
  data-slot="label"
  class={cn(
    'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    className,
  )}
  {...rest}
/>
