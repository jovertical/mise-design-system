<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Textarea from './textarea.svelte'

  const { Story } = defineMeta({
    title: 'Forms/Textarea',
    component: Textarea,
    tags: ['shadcn'],
  })
</script>

<!-- No ceiling, no counter. A bare number counts up towards nothing. -->
<Story name="Playground">
  {#snippet template(args)}
    <Textarea placeholder="Notes for the kitchen" aria-label="Notes" {...args} />
  {/snippet}
</Story>

<!--
  `maxlength` stops typing at the ceiling, so the count can never exceed it.
  Falling under `minlength` is the only reachable invalid state, and only once
  something has been typed, because an untouched optional field is not wrong.
  Type in the second to watch the counter turn destructive and back.
-->
<Story name="States" asChild>
  <StoryAxis values={['in range', 'below minimum'] as const} orientation="vertical">
    {#snippet item(state)}
      <Textarea
        maxlength={120}
        minlength={20}
        value={state === 'in range' ? 'Ships frozen. Thaw before service.' : 'Too short'}
        aria-label="Notes, {state}"
      />
    {/snippet}
  </StoryAxis>
</Story>

<!-- `maxlength` adds a counter under the box, counting up towards the ceiling. -->
<Story name="With limit" asChild>
  <Textarea maxlength={120} value="Ships frozen. Thaw before service." aria-label="Notes" />
</Story>
