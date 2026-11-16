<!--
  CommandTrigger at rest: the default label with its shortcut, a label of its
  own, and `hotkey={false}`, which registers no key and drops the hint. It is
  filled like an input, so it reads as a field.
-->
<script lang="ts">
  import { CommandTrigger } from '@jovertical/mise-design-system'
</script>

<div class="flex w-full max-w-xs flex-col gap-3">
  <CommandTrigger hotkey="j" />
  <CommandTrigger hotkey={false}>Search orders…</CommandTrigger>
  <CommandTrigger hotkey={false} />
</div>
