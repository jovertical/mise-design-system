<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Label from '../label/label.svelte'
  import Switch from './switch.svelte'

  const SWITCH_STATES = ['off', 'on', 'disabled, off', 'disabled, on'] as const

  const { Story } = defineMeta({ title: 'Forms/Switch', component: Switch, tags: ['shadcn'] })
</script>

<!-- Bare: pair it with a Label when the switch needs words beside it. -->
<Story name="Playground">
  {#snippet template(args)}
    <div class="flex items-center gap-2">
      <Switch id="compare" {...args} />
      <Label for="compare">Compare to previous shift</Label>
    </div>
  {/snippet}
</Story>

<!-- Off, on, and both again disabled: a setting the viewer cannot change. -->
<Story name="States" asChild>
  <StoryAxis values={SWITCH_STATES}>
    {#snippet item(state)}
      <Switch
        checked={state.endsWith('on')}
        disabled={state.startsWith('disabled')}
        aria-label={state}
      />
    {/snippet}
  </StoryAxis>
</Story>
