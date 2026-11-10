<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Button from '../../actions/button/button.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardFooter from '../../layout/card/card-footer.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import Field from '../field/field.svelte'
  import FieldGroup from '../field/field-group.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Input from '../input/input.svelte'
  import CheckboxGroup, { type CheckboxGroupOption } from './checkbox-group.svelte'

  const LOCATIONS: CheckboxGroupOption[] = [
    { value: 'north', label: 'North depot' },
    { value: 'south', label: 'South depot' },
    { value: 'harbour', label: 'Harbour store' },
  ]

  const DESCRIBED: CheckboxGroupOption[] = [
    { value: 'receiving', label: 'Receiving', description: 'Checks deliveries against the order.' },
    { value: 'picking', label: 'Picking', description: 'Pulls stock for outgoing orders.' },
    { value: 'counting', label: 'Counting', description: 'Runs the weekly stock count.' },
  ]

  const MANY: CheckboxGroupOption[] = Array.from({ length: 20 }, (_, index) => ({
    value: `site-${index + 1}`,
    label: `Site ${index + 1}, ${['North', 'East', 'South', 'West'][index % 4]} district`,
  }))

  const { Story } = defineMeta({
    title: 'Forms/CheckboxGroup',
    component: CheckboxGroup,
    tags: ['mise'],
    args: { legend: 'Locations', description: 'Where this shift runs.', options: LOCATIONS },
    argTypes: {
      orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
      disabled: { control: 'boolean' },
    },
  })

  const ORIENTATIONS = ['vertical', 'horizontal'] as const
  const playground = $state({ value: ['north'] })
  const form = $state({ value: ['receiving'] })
</script>

<!-- A set of ticks bound to an array of values, kept in the order of the options. -->
<Story name="Playground">
  {#snippet template(args)}
    <div class="max-w-md">
      <CheckboxGroup {...args} options={LOCATIONS} bind:value={playground.value} />
      <p class="text-muted-foreground mt-4 text-xs">value: [{playground.value.join(', ')}]</p>
    </div>
  {/snippet}
</Story>

<!-- Vertical for anything with a description; horizontal wraps short labels along a row. -->
<Story name="Orientations" asChild>
  <StoryAxis values={ORIENTATIONS} orientation="vertical">
    {#snippet item(orientation)}
      <CheckboxGroup legend="Locations" options={LOCATIONS} value={['south']} {orientation} />
    {/snippet}
  </StoryAxis>
</Story>

<!-- Disabled as a whole, one option disabled, invalid with its error, and nothing to choose. -->
<Story name="States" asChild>
  <div class="grid max-w-3xl gap-10 sm:grid-cols-2">
    <CheckboxGroup legend="Disabled" options={LOCATIONS} value={['north']} disabled />
    <CheckboxGroup
      legend="One option disabled"
      options={[
        ...LOCATIONS.slice(0, 2),
        { value: 'harbour', label: 'Harbour store', disabled: true },
      ]}
    />
    <CheckboxGroup
      legend="Invalid"
      options={LOCATIONS}
      errors={[{ message: 'Pick at least one location.' }]}
    />
    <CheckboxGroup legend="Empty" options={[]} empty="No locations yet." />
  </div>
</Story>

<!-- A line under each option, for choices whose names do not explain themselves. -->
<Story name="With description" asChild>
  <div class="max-w-md">
    <CheckboxGroup legend="Duties" options={DESCRIBED} value={['picking']} />
  </div>
</Story>

<!-- Twenty sites wrap along rows when horizontal; vertical simply grows. -->
<Story name="Long content" asChild>
  <div class="max-w-2xl">
    <CheckboxGroup
      legend="Sites"
      options={MANY}
      orientation="horizontal"
      value={['site-3', 'site-7']}
    />
  </div>
</Story>

<!-- Among the other fields of a form, on a card. -->
<Story name="In a form" asChild>
  <Card class="max-w-lg">
    <CardHeader><CardTitle>New staff member</CardTitle></CardHeader>
    <CardContent>
      <FieldGroup>
        <Field>
          <FieldLabel for="staff-name">Name</FieldLabel>
          <Input id="staff-name" placeholder="Full name" />
        </Field>
        <CheckboxGroup
          legend="Duties"
          description="What they may do on a shift."
          options={DESCRIBED}
          bind:value={form.value}
          name="duties"
        />
      </FieldGroup>
    </CardContent>
    <CardFooter class="justify-end"><Button>Save</Button></CardFooter>
  </Card>
</Story>
