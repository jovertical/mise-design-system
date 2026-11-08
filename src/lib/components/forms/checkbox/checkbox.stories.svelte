<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Label from '../label/label.svelte'
  import Checkbox from './checkbox.svelte'

  const { Story } = defineMeta({
    title: 'Forms/Checkbox',
    component: Checkbox,
    tags: ['shadcn'],
  })
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="flex items-center gap-2">
      <Checkbox id="count-done" {...args} />
      <Label for="count-done">Stock count done</Label>
    </div>
  {/snippet}
</Story>

<!--
  Every state, indeterminate included. Indeterminate is the "some of these" mark
  on a parent row, such as a location whose shifts are partly closed. It draws a
  minus on the checked fill.
-->
<Story name="States" asChild>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <Checkbox id="unchecked" />
      <Label for="unchecked">Unchecked</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="checked" checked />
      <Label for="checked">Checked</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="indeterminate" indeterminate />
      <Label for="indeterminate">Indeterminate</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="disabled" disabled />
      <Label for="disabled">Disabled</Label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="disabled-checked" disabled checked />
      <Label for="disabled-checked">Disabled, checked</Label>
    </div>
  </div>
</Story>
