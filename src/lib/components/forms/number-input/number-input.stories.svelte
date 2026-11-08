<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Field from '../field/field.svelte'
  import FieldDescription from '../field/field-description.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import NumberInput from './number-input.svelte'

  const { Story } = defineMeta({
    title: 'Forms/NumberInput',
    component: NumberInput,
    tags: ['mise'],
    args: { 'aria-label': 'Weight', format: 'decimal', value: 2.5, precision: 2 },
    argTypes: {
      format: { control: 'inline-radio', options: ['integer', 'decimal', 'currency'] },
    },
  })

  const FORMAT_VALUES = { integer: 12, decimal: 2.5, currency: 1999 } as const
</script>

<!--
  A number typed into a text field. `null` is an empty field, not zero: blank
  means "not recorded", where zero would claim the item weighs nothing.
-->
<Story name="Playground">
  {#snippet template(args)}
    <NumberInput class="max-w-48" {...args} />
  {/snippet}
</Story>

<!--
  `integer` takes whole numbers; `decimal` takes up to `precision` places;
  `currency` speaks cents: 1999 in, "19.99" shown, and only two places can be
  typed.
-->
<Story name="Formats" asChild>
  <StoryAxis values={['integer', 'decimal', 'currency'] as const}>
    {#snippet item(format)}
      <NumberInput
        class="w-36"
        aria-label={format}
        {format}
        value={FORMAT_VALUES[format]}
        prefix={format === 'currency' ? '$' : undefined}
      />
    {/snippet}
  </StoryAxis>
</Story>

<!-- Empty (the placeholder shows), and disabled. -->
<Story name="States" asChild>
  <StoryAxis values={['empty', 'disabled'] as const}>
    {#snippet item(state)}
      <NumberInput
        class="w-36"
        aria-label={state}
        placeholder="0"
        value={state === 'disabled' ? 4 : null}
        disabled={state === 'disabled'}
        controls={state === 'disabled'}
        format="integer"
      />
    {/snippet}
  </StoryAxis>
</Story>

<!--
  − and + either side: seats, copies, units. The buttons sit inside the field's
  own fill, so it reads as one control beside the plain inputs around it, and
  each disables at its end of the range. React's CountInput.
-->
<Story name="With controls" asChild>
  <NumberInput aria-label="Copies" format="integer" controls value={1} min={1} max={10} />
</Story>

<!-- A currency symbol, or a unit, ahead of the number. -->
<Story name="With prefix" asChild>
  <div class="flex flex-col gap-3">
    <NumberInput class="w-40" aria-label="Price" format="currency" prefix="$" value={1250} />
    <NumberInput
      class="w-40"
      aria-label="Price in euros"
      format="currency"
      prefix="€"
      value={899}
    />
  </div>
</Story>

<!-- In a field, labelled and described as any other input. -->
<Story name="In a field" asChild>
  <Field class="max-w-xs">
    <FieldLabel for="reorder-point">Reorder point</FieldLabel>
    <NumberInput id="reorder-point" format="integer" controls value={12} />
    <FieldDescription>Warn when stock falls to this many units.</FieldDescription>
  </Field>
</Story>

<!-- Clamped to 1–20: type 35 and it reads 20. -->
<Story name="Bounded" asChild>
  <NumberInput class="w-36" aria-label="Bounded" min={1} max={20} value={12} />
</Story>

<!-- `step={5}`: the arrow keys and buttons move five at a time, Shift fifty. -->
<Story name="Step" asChild>
  <NumberInput aria-label="Step" format="integer" controls step={5} value={15} />
</Story>

<!-- A negative floor lets a minus sign be typed: a stock adjustment. -->
<Story name="Signed" asChild>
  <NumberInput class="w-36" aria-label="Adjustment" min={-100} value={-3} />
</Story>

<!-- `precision={3}`: a fourth place cannot be typed. -->
<Story name="Precision" asChild>
  <NumberInput class="w-36" aria-label="Weight in kg" precision={3} value={0.125} />
</Story>

<!--
  `clearable={false}` for a count where zero is a real answer and blank is not
  one: an emptied field commits `min` on blur. The default, `clearable`, keeps
  the blank as `null`, for a cook time or a lead time that may go unanswered.
-->
<Story name="Clearable" asChild>
  <div class="flex flex-col gap-3">
    <NumberInput aria-label="Seats" format="integer" controls clearable={false} value={2} />
    <NumberInput aria-label="Lead time in days" format="integer" controls value={null} />
  </div>
</Story>
