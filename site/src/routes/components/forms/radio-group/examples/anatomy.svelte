<script lang="ts">
  import { Label, RadioGroup, RadioGroupItem } from '@jovertical/mise-design-system'
</script>

<RadioGroup value="percentage" aria-label="Discount" class="w-64">
  <div class="flex items-center gap-2">
    <RadioGroupItem value="percentage" id="anatomy-percentage" />
    <Label for="anatomy-percentage">Percentage off</Label>
  </div>
  <div class="flex items-center gap-2">
    <RadioGroupItem value="fixed" id="anatomy-fixed" />
    <Label for="anatomy-fixed">Fixed amount off</Label>
  </div>
</RadioGroup>
