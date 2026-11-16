<!--
  The form shape: a positioned panel holding a few fields. A popover carries
  no semantics of its own; what goes in it brings its meaning.
-->
<script lang="ts">
  import {
    Button,
    Input,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@jovertical/mise-design-system'
  import IconFilter from '@tabler/icons-svelte-runes/icons/filter'
</script>

<Popover>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}><IconFilter />Quantity</Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent class="flex flex-col gap-4">
    <div class="grid gap-2">
      <Label for="quantity-min">Minimum</Label>
      <Input id="quantity-min" placeholder="0" />
    </div>
    <div class="grid gap-2">
      <Label for="quantity-max">Maximum</Label>
      <Input id="quantity-max" placeholder="100" />
    </div>
    <Button size="sm">Apply</Button>
  </PopoverContent>
</Popover>
