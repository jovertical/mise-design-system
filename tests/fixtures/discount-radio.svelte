<script lang="ts">
  import { Label, RadioGroup, RadioGroupItem } from '../../src/lib/index.js'

  let { value = $bindable('percentage') }: { value?: string } = $props()
</script>

<RadioGroup bind:value aria-label="Discount">
  <div>
    <RadioGroupItem value="percentage" id="percentage" />
    <Label for="percentage">Percentage off</Label>
  </div>
  <div>
    <RadioGroupItem value="fixed" id="fixed" />
    <Label for="fixed">Fixed amount off</Label>
  </div>
  <div>
    <RadioGroupItem value="bogo" id="bogo" disabled />
    <Label for="bogo">Buy one, get one</Label>
  </div>
</RadioGroup>
<output data-testid="value">{value}</output>
