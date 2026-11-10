<script module lang="ts">
  import { Time } from '@internationalized/date'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Field from '../field/field.svelte'
  import FieldDescription from '../field/field-description.svelte'
  import FieldError from '../field/field-error.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import TimePicker from './time-picker.svelte'

  const { Story } = defineMeta({
    title: 'Forms/TimePicker',
    component: TimePicker,
    tags: ['mise'],
    parameters: { layout: 'centered' },
  })

  const boundary = $state<{ value: Time | undefined }>({ value: new Time(17, 30) })
  const empty = $state<{ value: Time | undefined }>({ value: undefined })
  const field = $state<{ value: Time | undefined }>({ value: new Time(3, 0) })
  const FORMATS = ['12-hour', '24-hour', '24-hour, every 15 minutes'] as const
</script>

<!-- Pre-filled to a shift boundary. -->
<Story name="Playground">
  {#snippet template()}
    <TimePicker bind:value={boundary.value} />
  {/snippet}
</Story>

<!--
  The clock a team reads: 12-hour with AM/PM, or 24-hour with no period.
  `minuteStep` lists only the minutes a schedule uses.
-->
<Story name="Formats" asChild>
  <StoryAxis values={FORMATS} orientation="vertical">
    {#snippet item(format)}
      {#if format === '12-hour'}
        <TimePicker value={new Time(17, 30)} />
      {:else if format === '24-hour'}
        <TimePicker hourCycle={24} value={new Time(17, 30)} />
      {:else}
        <TimePicker hourCycle={24} minuteStep={15} value={new Time(17, 30)} />
      {/if}
    {/snippet}
  </StoryAxis>
</Story>

<!--
  Empty until the operator picks, and a partial pick fills the rest from 12:00
  AM; disabled, for a boundary the operator cannot edit; invalid, its border on
the hour select.
-->
<Story name="States" asChild>
  <StoryAxis values={['empty', 'disabled', 'invalid'] as const} orientation="vertical">
    {#snippet item(state)}
      {#if state === 'empty'}
        <TimePicker bind:value={empty.value} />
      {:else if state === 'disabled'}
        <TimePicker disabled />
      {:else}
        <TimePicker aria-invalid="true" value={new Time(1, 0)} />
      {/if}
    {/snippet}
  </StoryAxis>
</Story>

<!--
  In a `Field`: the label's `for` names the picker's `id`, which sits on the hour
  select, so clicking the label focuses it.
-->
<Story name="In a field" asChild>
  <Field class="max-w-xs" data-invalid="true">
    <FieldLabel for="day-rollover">Day rolls over at</FieldLabel>
    <TimePicker id="day-rollover" hourCycle={24} aria-invalid="true" bind:value={field.value} />
    <FieldDescription>Sales after this time count toward the next day.</FieldDescription>
    <FieldError errors={[{ message: 'Pick a time before 06:00.' }]} />
  </Field>
</Story>
