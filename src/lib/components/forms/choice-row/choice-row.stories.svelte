<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Avatar from '../../data-display/avatar/avatar.svelte'
  import AvatarFallback from '../../data-display/avatar/avatar-fallback.svelte'
  import Checkbox from '../checkbox/checkbox.svelte'
  import RadioGroup from '../radio-group/radio-group.svelte'
  import RadioGroupItem from '../radio-group/radio-group-item.svelte'
  import ChoiceRow from './choice-row.svelte'
  import ChoiceRowReadonly from './choice-row-readonly.svelte'

  const { Story } = defineMeta({
    title: 'Forms/ChoiceRow',
    component: ChoiceRow,
    tags: ['mise'],
    args: {
      label: 'Publish now',
      description: 'Goes on sale as soon as you press the button.',
    },
  })

  const publish = $state({ value: 'now' })
  const subtypes = $state({ bakery: true, cafe: false, grocery: false, pharmacy: false })
  const staff = $state({ value: '' })
  const reveal = $state({ value: 'later' })

  const SUBTYPES = [
    { id: 'bakery', label: 'Bakery', description: 'Bread, pastry, counter service.' },
    { id: 'cafe', label: 'Café', description: 'Drinks and a seated area.' },
    { id: 'grocery', label: 'Grocery', description: 'Packaged goods, weighed items.' },
    { id: 'pharmacy', label: 'Pharmacy', description: 'Regulated stock and dispensing.' },
  ] as const

  const STAFF = [
    { id: 'dana', name: 'Dana', role: 'Manager', assigned: false },
    { id: 'eli', name: 'Eli', role: 'Staff', assigned: false },
    { id: 'kim', name: 'Kim', role: 'Owner', assigned: true },
  ]
</script>

{#snippet nowRadio()}
  <RadioGroupItem id="publish-now" value="now" />
{/snippet}

{#snippet laterRadio()}
  <RadioGroupItem id="publish-later" value="later" />
{/snippet}

{#snippet comingSoonBox()}
  <Checkbox id="channel-online" disabled />
{/snippet}

{#snippet revealNow()}
  <RadioGroupItem id="reveal-now" value="now" />
{/snippet}

{#snippet revealLater()}
  <RadioGroupItem id="reveal-later" value="later" />
{/snippet}

{#snippet datePicker()}
  <p class="text-muted-foreground text-sm">A date picker would sit here.</p>
{/snippet}

<!-- One of several. The row follows the radio without being told what it means. -->
<Story name="Playground">
  {#snippet template(args)}
    <RadioGroup bind:value={publish.value} class="max-w-md gap-3">
      <ChoiceRow {...args} for="publish-now" control={nowRadio} />
      <ChoiceRow
        for="publish-later"
        control={laterRadio}
        label="Schedule for later"
        description="Pick a date and let it publish itself."
      />
    </RadioGroup>
  {/snippet}
</Story>

<!--
  A qualifier beside the label, and a row that cannot be chosen yet.
  `disabled` on the row dims the surface; the control needs it too, or bits-ui
  will still select it.
-->
<Story name="States" asChild>
  <div class="max-w-md">
    <ChoiceRow
      for="channel-online"
      control={comingSoonBox}
      label="Online store"
      description="A storefront customers browse."
      badge="Coming soon"
      disabled
    />
  </div>
</Story>

<!--
  Several at once, and the case the `pointer-events-none` on the control is
  for. A `<label>` forwards clicks to the control it names, and a control
  inside that label is hit directly too, so one click arrives twice. Radio
  survives it; a checkbox toggles straight back and looks broken. Click the
  row, click the box, click the label: each is one toggle.
-->
<Story name="With checkbox" asChild>
  <div class="grid max-w-2xl gap-3 sm:grid-cols-2">
    {#each SUBTYPES as option (option.id)}
      {#snippet box()}
        <Checkbox id="subtype-{option.id}" bind:checked={subtypes[option.id]} />
      {/snippet}
      <ChoiceRow
        for="subtype-{option.id}"
        control={box}
        label={option.label}
        description={option.description}
      />
    {/each}
  </div>
</Story>

<!--
  `media` carries identity (who or what the row is about) where the control
  carries whether it is chosen.

  The last row is the case worth studying: a choice already taken. It is shown
  rather than filtered out, because a name missing from a list reads as a sync
  problem. Disabled with a badge saying why is something the reader can act
  on. The avatar is squared, so it matches the list rows the same records
  appear in elsewhere; both the root and the fallback need the radius.

  Note where the radio sits: media takes the leading edge, so the control
  moves to the trailing one. Nothing here asks for that; the component derives
  it.
-->
<Story name="With media" asChild>
  <RadioGroup bind:value={staff.value} class="max-w-md gap-3">
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
</Story>

<!--
  Children are revealed under a selected row, inside the same border, so what
  the choice turns on is visibly part of what the choice controls. They sit
  outside the `<label>`: a click on a field in here would otherwise toggle the
  row it belongs to.
-->
<Story name="With revealed content" asChild>
  <RadioGroup bind:value={reveal.value} class="max-w-md gap-3">
    <ChoiceRow for="reveal-now" control={revealNow} label="Publish now" />
    <ChoiceRow
      for="reveal-later"
      control={revealLater}
      label="Schedule for later"
      children={reveal.value === 'later' ? datePicker : undefined}
    />
  </RadioGroup>
</Story>

<!--
  `ChoiceRowReadonly` shows a value whose editor is elsewhere. Same surface, a
  filled dot rather than a control, because a real radio would offer an edit
  the row cannot honour.
-->
<Story name="Static" asChild>
  <div class="flex max-w-md flex-col gap-3">
    <ChoiceRowReadonly label="Visible" description="A storefront lists it." selected />
    <ChoiceRowReadonly
      label="Hidden"
      description="Sells at the register, listed nowhere."
      selected={false}
    />
  </div>
</Story>
