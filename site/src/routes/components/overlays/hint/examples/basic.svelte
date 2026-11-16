<!--
  The `?` that explains the thing beside it. Hover or focus it to read the
  explanation; its `label` is what a screen reader announces, so it names what
  is explained rather than saying "Help".
-->
<script lang="ts">
  import { Hint } from '@jovertical/mise-design-system'
</script>

<span class="text-foreground flex items-center gap-1.5 text-sm font-medium">
  Devices pairing
  <Hint label="What counts as pairing">
    Devices that have claimed a code but not yet completed provisioning. They drop off this figure
    once the sync engine reports in.
  </Hint>
</span>
