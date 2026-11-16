<script lang="ts">
  import { Field, FieldLabel, Input } from '@jovertical/mise-design-system'

  let name = $state('')
</script>

<Field class="w-full max-w-xs">
  <FieldLabel for="location-name">Location name</FieldLabel>
  <Input id="location-name" bind:value={name} placeholder="Riverside" />
</Field>
