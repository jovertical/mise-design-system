<!-- Open on the page, for the anatomy, and kept below its trigger wherever the page is scrolled. -->
<script lang="ts">
  import {
    Avatar,
    AvatarFallback,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from '@jovertical/mise-design-system'
</script>

<div class="h-56">
  <HoverCard open>
    <HoverCardTrigger href="#/staff/dana" class="text-sm font-medium underline underline-offset-4">
      Dana Reyes
    </HoverCardTrigger>
    <HoverCardContent
      class="flex items-start gap-3"
      portalProps={{ disabled: true }}
      side="bottom"
      avoidCollisions={false}
    >
      <Avatar><AvatarFallback>DR</AvatarFallback></Avatar>
      <div class="flex min-w-0 flex-col">
        <span class="text-sm font-medium">Dana Reyes</span>
        <span class="text-muted-foreground text-xs">Shift lead, North depot</span>
      </div>
    </HoverCardContent>
  </HoverCard>
</div>
