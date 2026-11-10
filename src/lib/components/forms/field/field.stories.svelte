<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconBarcode from '@tabler/icons-svelte-runes/icons/barcode'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import Separator from '../../layout/separator/separator.svelte'
  import Checkbox from '../checkbox/checkbox.svelte'
  import Input from '../input/input.svelte'
  import InputGroup from '../input-group/input-group.svelte'
  import InputGroupAddon from '../input-group/input-group-addon.svelte'
  import InputGroupInput from '../input-group/input-group-input.svelte'
  import Select from '../select/select.svelte'
  import SelectContent from '../select/select-content.svelte'
  import SelectItem from '../select/select-item.svelte'
  import SelectTrigger from '../select/select-trigger.svelte'
  import SelectValue from '../select/select-value.svelte'
  import Textarea from '../textarea/textarea.svelte'
  import Field from './field.svelte'
  import FieldContent from './field-content.svelte'
  import FieldDescription from './field-description.svelte'
  import FieldError from './field-error.svelte'
  import FieldGroup from './field-group.svelte'
  import FieldLabel from './field-label.svelte'
  import FieldLegend from './field-legend.svelte'
  import FieldSeparator from './field-separator.svelte'
  import FieldSet from './field-set.svelte'

  const { Story } = defineMeta({ title: 'Forms/Field', component: Field, tags: ['shadcn'] })

  const categories = ['Dry goods', 'Dairy', 'Produce', 'Packaging'].map((label) => ({
    value: label.toLowerCase(),
    label,
  }))

  const suppliers = [
    { value: 'north-mill', label: 'North Mill' },
    { value: 'harbour-dairy', label: 'Harbour Dairy' },
  ]
</script>

<!--
  One field, in the order every field is written: label, control, description,
  error. The description sits under the control: it explains what to type, and a
  reader who already knows skips from the label to the box. `for` matches the
  control's `id`, always; without it the label is decoration.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Field class="max-w-sm" {...args}>
      <FieldLabel for="brand">Brand</FieldLabel>
      <Input id="brand" placeholder="North Mill" />
      <FieldDescription>Shown on the item page and searchable at the register.</FieldDescription>
    </Field>
  {/snippet}
</Story>
<!--
  `vertical`, the default, is the Playground. `horizontal` is for a checkbox or a
  radio: control first, then the label and its description beside it. The
  description goes inside `FieldContent`, or it wraps back under the checkbox.

  `responsive` puts the label and the control on one line at `md` and stacks
  them below it, for the same question asked once per row. It reads the
  container query on `FieldGroup`, so it responds to its column, not the
  viewport.
-->
<Story name="Orientations" asChild>
  <StoryAxis values={['horizontal', 'responsive'] as const} orientation="vertical">
    {#snippet item(orientation)}
      {#if orientation === 'horizontal'}
        <FieldGroup class="max-w-md">
          <Field orientation="horizontal">
            <Checkbox id="publish" checked />
            <FieldContent>
              <FieldLabel for="publish">Publish on import</FieldLabel>
              <FieldDescription>
                Imported items go live on the registers. Leave this off to review them as drafts
                first.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="stock" />
            <FieldContent>
              <FieldLabel for="stock">Import stock levels</FieldLabel>
              <FieldDescription>
                Stock is set to the quantity in the file for each mapped location.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      {:else}
        <FieldGroup class="max-w-2xl">
          {#each ['Riverside', 'Harbour'] as location}
            <Field orientation="responsive">
              <FieldLabel for={location}>{location}</FieldLabel>
              <Select items={suppliers}>
                <SelectTrigger id={location} class="sm:w-64">
                  <SelectValue placeholder="Choose a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {#each suppliers as supplier}
                    <SelectItem value={supplier.value} label={supplier.label} />
                  {/each}
                </SelectContent>
              </Select>
            </Field>
          {/each}
        </FieldGroup>
      {/if}
    {/snippet}
  </StoryAxis>
</Story>
<!--
  `required` rather than a hand-typed asterisk. The glyph is `aria-hidden` with a
  real "(required)" beside it in `sr-only`, because a screen reader announcing
  "asterisk" tells you nothing.

  Invalid: the error replaces nothing; it is added under the description. The
  description says what the field wants and the error says why what is there
  does not qualify, and a reader correcting a mistake usually needs both.
-->
<Story name="States" asChild>
  <StoryAxis values={['required', 'invalid'] as const} orientation="vertical">
    {#snippet item(state)}
      {#if state === 'required'}
        <Field class="max-w-sm">
          <FieldLabel for="name" required>Item name</FieldLabel>
          <Input id="name" placeholder="All-purpose flour, 25 kg" />
        </Field>
      {:else}
        <Field class="max-w-sm" data-invalid="true">
          <FieldLabel for="sku-error" required>SKU</FieldLabel>
          <Input id="sku-error" value="500000" aria-invalid="true" />
          <FieldDescription>Leave empty and one is generated on save.</FieldDescription>
          <FieldError>That SKU already belongs to another item.</FieldError>
        </Field>
      {/if}
    {/snippet}
  </StoryAxis>
</Story>

<!--
  A control with an adornment takes `InputGroup`, not an icon positioned over an
  `Input`. The addon is a sibling of the input, so the text never runs under the
  glyph, and the focus ring is drawn around the pair.
-->
<Story name="With addon" asChild>
  <Field class="max-w-sm">
    <FieldLabel for="sku">SKU</FieldLabel>
    <InputGroup>
      <InputGroupInput id="sku" placeholder="Generated on save" />
      <InputGroupAddon align="inline-end"><IconBarcode /></InputGroupAddon>
    </InputGroup>
    <FieldDescription>Leave empty and one is generated on save.</FieldDescription>
  </Field>
</Story>

<!--
  The whole shape, the pattern to copy. A card with no header when the page's
  heading already names it. Pairs go in a plain two-column grid; long fields take
  the full width. `Separator` between groups of questions; `FieldSeparator` only
  when there is a word to put on the line.
-->
<Story name="In a form card" asChild>
  <Card class="h-fit max-w-3xl">
    <CardContent>
      <FieldGroup>
        <div class="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel for="form-name" required>Item name</FieldLabel>
            <Input id="form-name" placeholder="All-purpose flour, 25 kg" />
          </Field>
          <Field>
            <FieldLabel for="form-sku">SKU</FieldLabel>
            <InputGroup>
              <InputGroupInput id="form-sku" placeholder="Generated on save" />
              <InputGroupAddon align="inline-end"><IconBarcode /></InputGroupAddon>
            </InputGroup>
            <FieldDescription>Leave empty and one is generated on save.</FieldDescription>
          </Field>
        </div>
        <div class="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel for="form-category" required>Category</FieldLabel>
            <Select items={categories}>
              <SelectTrigger id="form-category">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {#each categories as category}
                  <SelectItem value={category.value} label={category.label} />
                {/each}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel for="form-brand">Brand</FieldLabel>
            <Input id="form-brand" placeholder="North Mill" />
            <FieldDescription>Shown on the item page and at the register.</FieldDescription>
          </Field>
        </div>
        <Field>
          <FieldLabel for="form-description">Description</FieldLabel>
          <Textarea id="form-description" rows={3} placeholder="What this item is." />
        </Field>
        <Separator />
        <Field orientation="horizontal">
          <Checkbox id="form-track" checked />
          <FieldContent>
            <FieldLabel for="form-track">Track stock</FieldLabel>
            <FieldDescription>
              Counts are kept per location and the register refuses a sale that would go negative.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </CardContent>
  </Card>
</Story>

<!--
  `FieldSet` groups fields that answer one question and gives them a legend: a
  `<legend>` inside a `<fieldset>` is what tells a screen reader they belong
  together. `FieldSeparator` takes a word; use it where the groups are
  alternatives rather than sequential.
-->
<Story name="Grouped with legend" asChild>
  <Card class="max-w-2xl">
    <CardContent>
      <FieldSet>
        <FieldLegend variant="label">How rows are matched</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel for="legend-sku">Match on SKU</FieldLabel>
            <Input id="legend-sku" placeholder="500000" />
            <FieldDescription>Exact match against the existing catalogue.</FieldDescription>
          </Field>
          <FieldSeparator>or</FieldSeparator>
          <Field>
            <FieldLabel for="legend-barcode">Match on barcode</FieldLabel>
            <Input id="legend-barcode" placeholder="4806500000001" />
            <FieldDescription>Used when the file carries no SKU column.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </CardContent>
  </Card>
</Story>
