<script lang="ts">
  import { Label, RadioGroup, RadioGroupItem } from '@jovertical/mise-design-system'

  let discount = $state('percentage')
</script>

<RadioGroup bind:value={discount} aria-label="Discount">
  <div class="flex items-center gap-2">
    <RadioGroupItem value="percentage" id="percentage" />
    <Label for="percentage">Percentage off</Label>
  </div>
  <div class="flex items-center gap-2">
    <RadioGroupItem value="fixed" id="fixed" />
    <Label for="fixed">Fixed amount off</Label>
  </div>
  <div class="flex items-center gap-2">
    <RadioGroupItem value="bogo" id="bogo" disabled />
    <Label for="bogo">Buy one, get one (coming soon)</Label>
  </div>
</RadioGroup>
