<!--
  `media` carries who or what the row is about; the control moves to the
  trailing edge. A choice already taken is shown disabled with a badge saying
  why, rather than filtered out: a missing name reads as a sync problem.
-->
<script lang="ts">
  import {
    Avatar,
    AvatarFallback,
    ChoiceRow,
    RadioGroup,
    RadioGroupItem,
  } from '@jovertical/mise-design-system'

  const STAFF = [
    { id: 'dana', name: 'Dana', role: 'Shift lead', assigned: false },
    { id: 'eli', name: 'Eli', role: 'Picker', assigned: false },
    { id: 'kim', name: 'Kim', role: 'Driver', assigned: true },
  ]

  let picked = $state('dana')
</script>

<RadioGroup bind:value={picked} class="w-full max-w-md gap-3">
  {#each STAFF as person (person.id)}
    {#snippet radio()}
      <RadioGroupItem id="staff-{person.id}" value={person.id} disabled={person.assigned} />
    {/snippet}
    {#snippet avatar()}
      <Avatar class="size-8 rounded-lg">
        <AvatarFallback class="rounded-lg text-xs">
          {person.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    {/snippet}
    <ChoiceRow
      for="staff-{person.id}"
      control={radio}
      media={avatar}
      label={person.name}
      description={person.role}
      badge={person.assigned ? 'Already assigned' : undefined}
      disabled={person.assigned}
    />
  {/each}
</RadioGroup>
