<script lang="ts">
  import { Field, FieldLabel, Textarea } from '@jovertical/mise-design-system'

  let notes = $state('')
</script>

<Field class="w-full max-w-md">
  <FieldLabel for="kitchen-notes">Notes for the kitchen</FieldLabel>
  <Textarea
    id="kitchen-notes"
    bind:value={notes}
    placeholder="Ships frozen. Thaw before service."
  />
</Field>
