<script module lang="ts">
  import { Time } from '@internationalized/date'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import TimePicker from './time-picker.svelte'

  const { Story } = defineMeta({
    title: 'Forms/TimePicker',
    component: TimePicker,
    tags: ['mise'],
    parameters: { layout: 'centered' },
  })

  const boundary = $state<{ value: Time | undefined }>({ value: new Time(17, 30) })
  const empty = $state<{ value: Time | undefined }>({ value: undefined })
</script>

<!-- Pre-filled to a shift boundary. -->
<Story name="Playground">
  {#snippet template()}
    <TimePicker bind:value={boundary.value} />
  {/snippet}
</Story>

<!--
  Empty until the operator picks, and a partial pick fills the rest from 12:00
  AM; disabled, for a boundary the operator cannot edit.
-->
<Story name="States" asChild>
  <StoryAxis values={['empty', 'disabled'] as const} orientation="vertical">
    {#snippet item(state)}
      {#if state === 'empty'}
        <TimePicker bind:value={empty.value} />
      {:else}
        <TimePicker disabled />
      {/if}
    {/snippet}
  </StoryAxis>
</Story>
