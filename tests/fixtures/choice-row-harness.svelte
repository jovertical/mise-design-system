<script lang="ts">
  import { Avatar, AvatarFallback, Checkbox, ChoiceRow } from '../../src/lib/index.js'

  let {
    checked = $bindable(false),
    disabled = false,
    withMedia = false,
    withChildren = false,
  }: {
    checked?: boolean
    disabled?: boolean
    withMedia?: boolean
    withChildren?: boolean
  } = $props()
</script>

{#snippet control()}
  <Checkbox id="bakery" bind:checked {disabled} />
{/snippet}

{#snippet avatar()}
  <Avatar><AvatarFallback>BK</AvatarFallback></Avatar>
{/snippet}

{#snippet revealed()}
  <input aria-label="Opening hours">
{/snippet}

<ChoiceRow
  for="bakery"
  {control}
  media={withMedia ? avatar : undefined}
  label="Bakery"
  description="Bread, pastry, counter service."
  badge={disabled ? 'Coming soon' : undefined}
  {disabled}
  children={withChildren ? revealed : undefined}
/>
<output data-testid="checked">{checked ? 'on' : 'off'}</output>
