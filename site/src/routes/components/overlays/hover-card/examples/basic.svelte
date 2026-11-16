<!--
  A preview on hover or focus, for a fact worth a glance without leaving the
  page: a person's details behind their name.
-->
<script lang="ts">
  import {
    Avatar,
    AvatarFallback,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from '@jovertical/mise-design-system'
</script>

<p class="text-sm">
  Counted by
  <HoverCard>
    <HoverCardTrigger href="#/staff/dana" class="font-medium underline underline-offset-4">
      Dana Reyes
    </HoverCardTrigger>
    <HoverCardContent class="flex items-start gap-3">
      <Avatar><AvatarFallback>DR</AvatarFallback></Avatar>
      <div class="flex min-w-0 flex-col">
        <span class="text-sm font-medium">Dana Reyes</span>
        <span class="text-muted-foreground text-xs">Shift lead, North depot</span>
        <span class="text-muted-foreground mt-1 text-xs">Joined 12 Mar 2025</span>
      </div>
    </HoverCardContent>
  </HoverCard>
  at 14:20.
</p>
