<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Input from './input.svelte'

  const { Story } = defineMeta({ title: 'Forms/Input', component: Input, tags: ['shadcn'] })
  const SIZES = ['sm', 'md', 'lg'] as const
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Input placeholder="Location name" aria-label="Location name" class="max-w-xs" {...args} />
  {/snippet}
</Story>

<!-- `sm` for a dense row or a table cell, `md` everywhere else, `lg` beside large buttons. -->
<Story name="Sizes" asChild>
  <StoryAxis values={SIZES} orientation="vertical">
    {#snippet item(size)}
      <Input {size} placeholder="Order number" class="max-w-xs" />
    {/snippet}
  </StoryAxis>
</Story>

<!--
  `aria-invalid` draws the destructive ring, rather than a hand-set
  `border-destructive` class. It reaches every input the same way. The message
  under it belongs to `Field`, which pairs the two.
-->
<Story name="States" asChild>
  <StoryAxis values={['default', 'invalid', 'disabled'] as const} orientation="vertical">
    {#snippet item(state)}
      <Input
        value={state === 'invalid' ? 'not-an-email' : ''}
        placeholder="Email"
        aria-invalid={state === 'invalid' ? 'true' : undefined}
        disabled={state === 'disabled'}
        aria-label="Email, {state}"
        class="max-w-xs"
      />
    {/snippet}
  </StoryAxis>
</Story>
