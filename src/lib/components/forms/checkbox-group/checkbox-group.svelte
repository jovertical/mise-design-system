<!--
  Origin: mise
  Diverged: none. CheckboxGroup has no React original; mise authored it for
    bertos-bakery-ops' staff and login forms (2026-11-10), where every app had
    been re-implementing the array a set of checkboxes binds to.
-->
<script lang="ts" module>
  import type { HTMLFieldsetAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type CheckboxGroupOption = {
    value: string
    label: string
    /** A line under the label. */
    description?: string
    disabled?: boolean
  }

  /**
   * Several choices from a short list, as ticks: a legend, one checkbox per
   * option, and the field's error. `value` is the ticked options' values, kept
   * in the order of `options` however they were ticked, so a form posts the
   * same array for the same choice.
   *
   * Values are strings, as a form posts them; map ids to strings and back at
   * the edge. With `name`, each ticked box submits as `name[]`.
   */
  export type CheckboxGroupProps = WithElementRef<
    Omit<HTMLFieldsetAttributes, 'children'>,
    HTMLFieldSetElement
  > & {
    value?: string[]
    onValueChange?: (value: string[]) => void
    options: CheckboxGroupOption[]
    legend: string
    description?: string
    /** As `FieldError` takes them; any message marks the set invalid. */
    errors?: Array<{ message?: string } | undefined>
    /** Shown in place of the boxes when `options` is empty. */
    empty?: string
    /** `horizontal` wraps the options along a row, for short labels. */
    orientation?: 'vertical' | 'horizontal'
    disabled?: boolean
    /** Each ticked box submits as `name[]`. */
    name?: string
  }
</script>

<script lang="ts">
  import { Checkbox as CheckboxPrimitive } from 'bits-ui'

  import { cn } from '../../../utils/cn.js'
  import Checkbox from '../checkbox/checkbox.svelte'
  import Field from '../field/field.svelte'
  import FieldContent from '../field/field-content.svelte'
  import FieldDescription from '../field/field-description.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import FieldLegend from '../field/field-legend.svelte'
  import FieldSet from '../field/field-set.svelte'

  let {
    ref = $bindable(null),
    value = $bindable([]),
    onValueChange,
    options,
    legend,
    description,
    errors,
    empty = 'Nothing to choose from.',
    orientation = 'vertical',
    disabled = false,
    name,
    class: className,
    ...rest
  }: CheckboxGroupProps = $props()

  const uid = $props.id()

  const invalid = $derived((errors ?? []).some((error) => !!error?.message))

  function inOptionOrder(next: string[]) {
    return options.map((option) => option.value).filter((optionValue) => next.includes(optionValue))
  }

  function select(next: string[]) {
    value = inOptionOrder(next)

    onValueChange?.(value)
  }
</script>

<FieldSet bind:ref class={className} {...rest}>
  <FieldLegend variant="label">{legend}</FieldLegend>

  {#if description}
    <FieldDescription>{description}</FieldDescription>
  {/if}

  {#if options.length === 0}
    <p class="text-muted-foreground text-sm">{empty}</p>
  {:else}
    <CheckboxPrimitive.Group
      bind:value={() => value, select}
      {disabled}
      name={name ? `${name}[]` : undefined}
      data-slot="checkbox-group"
      data-invalid={invalid ? 'true' : undefined}
      class={cn(
        'flex gap-3',
        orientation === 'horizontal' ? 'flex-row flex-wrap gap-x-6' : 'flex-col',
      )}
    >
      {#each options as option (option.value)}
        {@const id = `${uid}-${option.value}`}
        <Field orientation="horizontal" data-invalid={invalid ? 'true' : undefined} class="w-auto">
          <Checkbox
            {id}
            value={option.value}
            disabled={option.disabled}
            aria-invalid={invalid ? 'true' : undefined}
          />
          <FieldContent>
            <FieldLabel for={id} class="font-normal">{option.label}</FieldLabel>
            {#if option.description}
              <FieldDescription>{option.description}</FieldDescription>
            {/if}
          </FieldContent>
        </Field>
      {/each}
    </CheckboxPrimitive.Group>
  {/if}

  <FieldError {errors} />
</FieldSet>
