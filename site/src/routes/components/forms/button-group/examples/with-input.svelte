<!-- Two buttons and the input they act on, read as one control. -->
<script lang="ts">
  import { Button, ButtonGroup, Input } from '@jovertical/mise-design-system'
  import IconMinus from '@tabler/icons-svelte-runes/icons/minus'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'

  let crates = $state(4)
</script>

<ButtonGroup>
  <Button
    variant="outline"
    iconOnly
    aria-label="Fewer crates"
    onclick={() => (crates = Math.max(0, crates - 1))}
  >
    <IconMinus class="size-4" />
  </Button>
  <Input
    class="w-16 rounded-none text-center"
    value={String(crates)}
    readonly
    aria-label="Crates"
  />
  <Button variant="outline" iconOnly aria-label="More crates" onclick={() => (crates += 1)}>
    <IconPlus class="size-4" />
  </Button>
</ButtonGroup>
