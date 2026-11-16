<!-- A flex row, so a checkbox and its label sit on one baseline without extra markup. -->
<script lang="ts">
  import { Checkbox, Label } from '@jovertical/mise-design-system'
</script>

<Label for="count-done" class="flex items-center gap-2">
  <Checkbox id="count-done" />
  Stock count done
</Label>
