<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@jovertical/mise-design-system'

  const VEHICLES = [
    { value: 'van-12', label: 'Van 12' },
    { value: 'truck-212', label: 'Truck 212 (in service)' },
  ]
</script>

<Select value="van-12" items={VEHICLES} disabled>
  <SelectTrigger class="w-56" aria-label="Vehicle, locked">
    <SelectValue />
  </SelectTrigger>
  <SelectContent />
</Select>

<Select value="van-12" items={VEHICLES}>
  <SelectTrigger class="w-56" aria-label="Vehicle">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="van-12" label="Van 12" />
    <SelectItem value="truck-212" label="Truck 212 (in service)" disabled />
  </SelectContent>
</Select>
