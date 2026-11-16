<script lang="ts">
  import { Textarea } from '@jovertical/mise-design-system'
</script>

<!-- A block around it: Textarea renders the box and its counter as siblings. -->
<div class="w-80">
  <Textarea
    maxlength={120}
    value="Ships frozen. Thaw before service."
    aria-label="Delivery notes"
  />
</div>
