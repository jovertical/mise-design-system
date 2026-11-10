<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconSearch from '@tabler/icons-svelte-runes/icons/search'
  import IconX from '@tabler/icons-svelte-runes/icons/x'

  import InputGroup from './input-group.svelte'
  import InputGroupAddon from './input-group-addon.svelte'
  import InputGroupButton from './input-group-button.svelte'
  import InputGroupInput from './input-group-input.svelte'
  import InputGroupText from './input-group-text.svelte'

  const { Story } = defineMeta({
    title: 'Forms/InputGroup',
    component: InputGroup,
    tags: ['shadcn'],
  })
</script>

<!-- An addon at each end: a glyph and a clear button, both focusing the input on click. -->
<Story name="Playground">
  {#snippet template(args)}
    <InputGroup class="max-w-xs" {...args}>
      <InputGroupAddon><IconSearch class="size-4" /></InputGroupAddon>
      <InputGroupInput placeholder="Search stock…" aria-label="Search stock" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Clear"
          ><IconX class="size-3.5" /></InputGroupButton
        >
      </InputGroupAddon>
    </InputGroup>
  {/snippet}
</Story>

<!-- `InputGroupText` for a fixed unit or symbol rather than an interactive addon. -->
<Story name="With text" asChild>
  <InputGroup class="max-w-xs">
    <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
    <InputGroupInput placeholder="0.00" aria-label="Unit price" />
    <InputGroupAddon align="inline-end"><InputGroupText>USD</InputGroupText></InputGroupAddon>
  </InputGroup>
</Story>
