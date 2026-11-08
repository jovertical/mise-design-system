<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Label from '../label/label.svelte'
  import RadioGroup from './radio-group.svelte'
  import RadioGroupItem from './radio-group-item.svelte'

  const { Story } = defineMeta({
    title: 'Forms/RadioGroup',
    component: RadioGroup,
    tags: ['shadcn'],
  })
</script>

<Story name="Playground">
  {#snippet template(args)}
    <RadioGroup value="percentage" aria-label="Discount" {...args}>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="percentage" id="percentage" />
        <Label for="percentage">Percentage off</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="fixed" id="fixed" />
        <Label for="fixed">Fixed amount off</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="bogo" id="bogo" disabled />
        <Label for="bogo">Buy one, get one (coming soon)</Label>
      </div>
    </RadioGroup>
  {/snippet}
</Story>
