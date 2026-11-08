<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Select from './select.svelte'
  import SelectContent from './select-content.svelte'
  import SelectItem from './select-item.svelte'
  import SelectTrigger from './select-trigger.svelte'
  import SelectValue from './select-value.svelte'

  const { Story } = defineMeta({ title: 'Forms/Select', component: Select, tags: ['shadcn'] })

  const locations = [
    { value: 'riverside', label: 'Riverside' },
    { value: 'harbour', label: 'Harbour' },
    { value: 'north', label: 'North yard' },
  ]

  const channels = [
    { value: 'all', label: 'All channels' },
    { value: 'counter', label: 'Counter' },
    { value: 'online', label: 'Online' },
  ]
</script>

<!--
  `SelectTrigger` is `w-full` by default, since a select sits in a form field
  beside inputs that are already full width. `items` lets the closed trigger
  show the chosen label.
-->
<!--
  The props are a union keyed on `type`, which Storybook's untyped `args` cannot
  be spread across; `as object` lets the controls through without the check.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Select value="riverside" items={locations} {...args as object}>
      <SelectTrigger class="max-w-xs" aria-label="Location">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {#each locations as location}
          <SelectItem value={location.value} label={location.label} />
        {/each}
      </SelectContent>
    </Select>
  {/snippet}
</Story>

<!-- `size="sm"` for a select inside a dense row: a table cell, a toolbar. -->
<Story name="Sizes" asChild>
  <StoryAxis values={['sm', 'md'] as const}>
    {#snippet item(size)}
      <Select value="all" items={channels}>
        <SelectTrigger {size} class="w-40" aria-label="Channel, {size}">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {#each channels as channel}
            <SelectItem value={channel.value} label={channel.label} />
          {/each}
        </SelectContent>
      </Select>
    {/snippet}
  </StoryAxis>
</Story>
