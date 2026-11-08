<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Checkbox from '../checkbox/checkbox.svelte'
  import Input from '../input/input.svelte'
  import Label from './label.svelte'

  const { Story } = defineMeta({ title: 'Forms/Label', component: Label, tags: ['shadcn'] })
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="flex max-w-xs flex-col gap-1.5">
      <Label for="location-name" {...args}>Location name</Label>
      <Input id="location-name" placeholder="Riverside" />
    </div>
  {/snippet}
</Story>

<!-- A flex row, so a checkbox and its label sit on one baseline without extra markup. -->
<Story name="With checkbox" asChild>
  <Label for="count-done" class="flex items-center gap-2">
    <Checkbox id="count-done" />
    Stock count done
  </Label>
</Story>
