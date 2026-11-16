<!--
  `iconTone` when the thing itself is in a state worth a colour; the name
  stays in ink. A classifying badge goes beside the label, not in the name,
  which truncates and would take the badge with it.
-->
<script lang="ts">
  import { Avatar, AvatarFallback, Badge, EntityLabel } from '@jovertical/mise-design-system'
  import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle'
</script>

{#snippet warning()}
  <IconAlertTriangle />
{/snippet}

{#snippet staff()}
  <Avatar><AvatarFallback class="text-xs">DR</AvatarFallback></Avatar>
{/snippet}

<div class="flex w-80 flex-col gap-4">
  <EntityLabel
    icon={warning}
    iconTone="warning"
    title="Oat milk, 1 L"
    description="3 left · reorder at 12"
  />
  <div class="flex items-center justify-between gap-3">
    <EntityLabel media={staff} title="Dana Reyes" description="dana@riverside.example" />
    <Badge>Shift lead</Badge>
  </div>
</div>
