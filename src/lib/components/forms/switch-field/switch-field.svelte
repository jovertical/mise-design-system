<!--
  Origin: the React package 2.23.0 `switch-field.tsx`
  Diverged: `checked` is bindable, with `onCheckedChange` kept. Spreads the rest
    onto the root, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type SwitchFieldVariant = 'default' | 'flush'

  /**
   * A bordered on/off row: what it does on the left, the switch on the right.
   *
   * Shares the surface the bordered radio rows use (`ChoiceRow`): same radius,
   * same border, same accent once it is on, so the two read as one family.
   *
   * Deliberately *not* wrapped in a `<label for>` the way those rows are. A
   * label forwards its click to the control it names, and where the control is
   * inside the label the switch receives both that click and its own: it
   * toggles twice and lands back where it started. A radio is idempotent, so
   * the same shape is harmless there; a switch is not.
   *
   * `variant="flush"` is the same row without the surface, for stacking in a
   * card. It keeps the scoped `FieldLabel for`, which is the whole reason this
   * component exists rather than each caller pairing a `Switch` with a title
   * and wiring `aria-labelledby` by hand. Flush drops the checked accent with
   * the surface: there is nothing left to tint, and a tinted row in a stack
   * would read as a selection rather than an on/off.
   */
  export type SwitchFieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /** The switch's id, which the label points at. */
    id: string
    label: string
    description?: string
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
    /**
     * `default` draws its own bordered surface, for a switch that stands alone
     * in a form.
     *
     * `flush` draws none, for several stacked inside a card. Three bordered
     * rows in a bordered card is three containers deep, and the reader counts
     * boxes instead of reading rows; the card is already the container, so the
     * rows only need separating. Put `divide-y` on the wrapper.
     */
    variant?: SwitchFieldVariant
    /**
     * Revealed below the row while the switch is on.
     *
     * Kept inside the same bordered surface rather than rendered as a sibling,
     * so what the switch turns on is visibly part of what the switch controls.
     */
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Field from '../field/field.svelte'
  import FieldDescription from '../field/field-description.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Switch from '../switch/switch.svelte'

  let {
    id,
    label,
    description,
    checked = $bindable(false),
    onCheckedChange,
    disabled = false,
    variant = 'default',
    class: className,
    children,
    ...rest
  }: SwitchFieldProps = $props()

  const isFlush = $derived(variant === 'flush')
</script>

<div
  data-slot="switch-field"
  data-state={checked ? 'checked' : 'unchecked'}
  data-variant={variant}
  class={cn(
    !isFlush && [
      'rounded-2xl border transition-colors',
      'border-border bg-muted/40',
      'data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
    ],
    disabled && 'opacity-60',
    className,
  )}
  {...rest}
>
  <!-- No horizontal padding when flush: the card supplies it, and a second
       inset makes the rows look indented from their own heading. Vertical
       stays, or stacked rows collide. -->
  <Field orientation="horizontal" class={isFlush ? 'py-3' : 'p-4'}>
    <div class="min-w-0 flex-1">
      <FieldLabel for={id} class="font-medium">{label}</FieldLabel>
      {#if description}
        <FieldDescription class="mt-0.5">{description}</FieldDescription>
      {/if}
    </div>

    <Switch {id} bind:checked {onCheckedChange} {disabled} class="shrink-0" />
  </Field>

  {#if children && checked}
    <!-- Unmounted rather than hidden while off, so anything inside stops
         fetching and holds no state the switch has already dismissed. Flush
         indents instead of ruling off: a border here would be a third
         horizontal line among the separators between rows. -->
    <div
      class={isFlush
        ? 'border-border/60 mb-3 border-l pl-4'
        : 'border-border/60 border-t px-4 py-4'}
    >
      {@render children()}
    </div>
  {/if}
</div>
