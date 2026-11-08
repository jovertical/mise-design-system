<!--
  Origin: the React package 2.23.0 `input-group.tsx` (`InputGroupTextarea`), itself shadcn/ui new-york `input-group`
  Svelte: shadcn-svelte `input-group`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A bare `textarea`, not this package's `Textarea`. That one wraps itself in
   * a `div` with a counter once `maxlength` is set, which breaks the group's
   * `>textarea` selectors. A group that wants a count shows it in an addon.
   */
  export type InputGroupTextareaProps = WithElementRef<HTMLTextareaAttributes, HTMLTextAreaElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...rest
  }: InputGroupTextareaProps = $props()
</script>

<textarea
  bind:this={ref}
  bind:value
  data-slot="input-group-control"
  class={cn(
    'placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full flex-1 resize-none bg-transparent px-3 py-3 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    className,
  )}
  {...rest}
></textarea>
