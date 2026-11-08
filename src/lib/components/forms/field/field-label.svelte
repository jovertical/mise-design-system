<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldLabel`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port. The React divergence (`required`) carries over.
-->
<script lang="ts" module>
  import type { LabelProps } from '../label/label.svelte'

  export type FieldLabelProps = LabelProps & {
    /**
     * Marks the field as required: an `aria-hidden` asterisk beside a real
     * sr-only "(required)", because a screen reader announcing "asterisk" tells
     * you nothing.
     */
    required?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Label from '../label/label.svelte'

  let {
    ref = $bindable(null),
    required = false,
    class: className,
    children,
    ...rest
  }: FieldLabelProps = $props()
</script>

<Label
  bind:ref
  data-slot="field-label"
  class={cn(
    'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
    'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4',
    'has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10',
    className,
  )}
  {...rest}
>
  {@render children?.()}
  {#if required}
    <!-- -ml-2 cancels the label's gap, so the mark reads "Status*", not "Status *". -->
    <span aria-hidden="true" class="text-destructive -ml-2">*</span>
    <span class="sr-only">(required)</span>
  {/if}
</Label>
