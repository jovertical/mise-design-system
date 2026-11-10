<!--
  The signed-in user, top right: an avatar that opens who you are, where you
  work, and the demo's own actions.
-->
<script lang="ts">
  import {
    Avatar,
    AvatarFallback,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@jovertical/mise-design-system'
  import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle'
  import IconRotate from '@tabler/icons-svelte-runes/icons/rotate'

  let { onReset }: { onReset?: () => void } = $props()
</script>

<DropdownMenu>
  <DropdownMenuTrigger
    aria-label="Account"
    class="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
  >
    <Avatar class="size-8"><AvatarFallback class="text-xs">OM</AvatarFallback></Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" class="w-60">
    <DropdownMenuLabel class="flex flex-col gap-0.5">
      <span class="text-foreground text-sm font-medium">Ops manager</span>
      <span class="text-muted-foreground text-xs font-normal">Riverside DC</span>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={() => onReset?.()}><IconRotate />Reset demo data</DropdownMenuItem>
    <DropdownMenuItem>
      {#snippet child({ props })}
        <a href="https://github.com/jovertical/mise-design-system" {...props}
          ><IconInfoCircle />About this demo</a
        >
      {/snippet}
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
