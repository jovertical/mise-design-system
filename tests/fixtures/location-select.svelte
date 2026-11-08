<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from '../../src/lib/index.js'

  let { value = $bindable('riverside') }: { value?: string } = $props()

  const locations = [
    { value: 'riverside', label: 'Riverside' },
    { value: 'harbour', label: 'Harbour' },
    { value: 'north', label: 'North yard', disabled: true },
  ]
</script>

<Select bind:value items={locations}>
  <SelectTrigger aria-label="Location">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Locations</SelectLabel>
      <SelectItem value="riverside" label="Riverside" />
      <SelectItem value="harbour" label="Harbour" />
      <SelectItem value="north" label="North yard" disabled />
    </SelectGroup>
  </SelectContent>
</Select>
<output data-testid="value">{value}</output>
