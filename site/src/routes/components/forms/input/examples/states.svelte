<!--
  `aria-invalid` draws the destructive ring, rather than a hand-set class; the
  message under it belongs to Field, which pairs the two.
-->
<script lang="ts">
  import { Input } from '@jovertical/mise-design-system'
</script>

<div class="flex w-full max-w-xs flex-col gap-3">
  <Input value="not-an-email" aria-invalid="true" aria-label="Email, invalid" />
  <Input placeholder="Email" disabled aria-label="Email, disabled" />
  <Input value="ops@riverside.example" readonly aria-label="Email, read only" />
</div>
