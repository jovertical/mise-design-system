<!--
  `maxlength` adds a counter counting up towards the ceiling, and stops typing
  there. Under `minlength`, once something is typed, the counter turns
  destructive: an untouched optional field is not wrong.
-->
<script lang="ts">
  import { Textarea } from '@jovertical/mise-design-system'

  let notes = $state('Too short')
</script>

<!-- A block around it: Textarea renders the box and its counter as siblings. -->
<div class="w-full max-w-md">
  <Textarea bind:value={notes} maxlength={120} minlength={20} aria-label="Delivery notes" />
</div>
