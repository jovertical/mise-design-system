<!-- Open on the page, for the anatomy, without its hold on the page. -->
<script lang="ts">
  import {
    Button,
    Input,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@jovertical/mise-design-system'
</script>

<div class="h-72">
  <Popover open>
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Quantity</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent
      class="flex flex-col gap-4"
      portalProps={{ disabled: true }}
      onOpenAutoFocus={(event) => event.preventDefault()}
      trapFocus={false}
      interactOutsideBehavior="ignore"
      escapeKeydownBehavior="ignore"
    >
      <div class="grid gap-2">
        <Label for="anatomy-min">Minimum</Label>
        <Input id="anatomy-min" placeholder="0" />
      </div>
      <Button size="sm">Apply</Button>
    </PopoverContent>
  </Popover>
</div>
