<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
  } from '@jovertical/mise-design-system'

  const REGIONS = [
    {
      label: 'North',
      locations: [
        { value: 'north-yard', label: 'North yard' },
        { value: 'riverside', label: 'Riverside' },
      ],
    },
    {
      label: 'Coast',
      locations: [
        { value: 'harbour', label: 'Harbour' },
        { value: 'sta-cruz', label: 'Sta Cruz' },
      ],
    },
  ]

  const ITEMS = REGIONS.flatMap((region) => region.locations)

  let value = $state('riverside')
</script>

<Select bind:value items={ITEMS}>
  <SelectTrigger class="max-w-xs" aria-label="Location">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {#each REGIONS as region, index (region.label)}
      {#if index > 0}
        <SelectSeparator />
      {/if}
      <SelectGroup>
        <SelectLabel>{region.label}</SelectLabel>
        {#each region.locations as location (location.value)}
          <SelectItem value={location.value} label={location.label} />
        {/each}
      </SelectGroup>
    {/each}
  </SelectContent>
</Select>
