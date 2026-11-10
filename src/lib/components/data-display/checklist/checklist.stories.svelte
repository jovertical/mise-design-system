<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import Checklist from './checklist.svelte'
  import type { ChecklistGroup, ChecklistTaskState } from './checklist-types.js'

  const { Story } = defineMeta({
    title: 'Data display/Checklist',
    component: Checklist,
    tags: ['mise'],
  })

  // Holds the open row the way a page holds its URL fragment: Checklist is
  // controlled, and closing the open row sets this back to nothing.
  const open = $state({
    playground: undefined as string | undefined,
    expanded: 'category' as string | undefined,
  })
</script>

<script lang="ts">
  const groups = (
    menu: [ChecklistTaskState, ChecklistTaskState, ChecklistTaskState],
    team: [ChecklistTaskState, ChecklistTaskState],
    percents: [number, number],
  ): ChecklistGroup[] => [
    {
      key: 'menu',
      label: 'Set up your menu',
      percent: percents[0],
      tasks: [
        {
          id: 'category',
          label: 'Add a category',
          state: menu[0],
          description: 'Categories group your products on the register and in reports.',
          actions: addCategory,
          learnMore: categoryGuide,
        },
        { id: 'product', label: 'Add your first product', state: menu[1], actions: addProduct },
        { id: 'modifier', label: 'Add a modifier', state: menu[2] },
      ],
    },
    {
      key: 'team',
      label: 'Bring in your team',
      percent: percents[1],
      tasks: [
        {
          id: 'invite',
          label: 'Invite a teammate',
          state: team[0],
          description: 'Each person signs in with their own PIN.',
        },
        { id: 'roles', label: 'Set what each role can do', state: team[1], hint: rolesHint },
      ],
    },
  ]

  const PARTIAL = $derived(
    groups(['completed', 'completed', 'pending'], ['pending', 'pending'], [67, 0]),
  )

  const PENDING = $derived(
    groups(['pending', 'pending', 'pending'], ['pending', 'pending'], [0, 0]),
  )

  const DONE = $derived(
    groups(['completed', 'completed', 'completed'], ['completed', 'skipped'], [100, 100]),
  )

  const MIXED = $derived(
    groups(['completed', 'skipped', 'pending'], ['pending', 'pending'], [33, 0]),
  )

  const WITH_MEDIA: ChecklistGroup[] = $derived([
    {
      key: 'menu',
      label: 'Set up your menu',
      percent: 0,
      tasks: [
        {
          id: 'category',
          label: 'Add a category',
          state: 'pending',
          description: 'Categories group your products on the register and in reports.',
          actions: addCategory,
          media: screenshot,
          learnMore: categoryGuide,
        },
        { id: 'product', label: 'Add your first product', state: 'pending', actions: addProduct },
      ],
    },
  ])

  const EDGES: ChecklistGroup[] = $derived([
    {
      key: 'fraction',
      label: 'A fractional share prints rounded, while the bar keeps the sliver that is left',
      percent: 99.6,
      tasks: [
        {
          id: 'long',
          label: 'Record your first sale on the register, print a receipt and close the shift',
          state: 'pending',
          description:
            'A long description wraps, because the open body has the room the row does not; the label above it truncates and carries a title.',
        },
        {
          id: 'media-only',
          label: 'Watch the two-minute tour',
          state: 'pending',
          media: screenshot,
        },
      ],
    },
    { key: 'over', label: 'Clamped from 140', percent: 140, tasks: [] },
    { key: 'under', label: 'Clamped from -20', percent: -20, tasks: [] },
  ])
</script>

{#snippet addCategory()}
  <Button size="sm" variant="outline">Add a category</Button>
{/snippet}
{#snippet addProduct()}
  <Button size="sm" variant="outline">Add a product</Button>
{/snippet}
{#snippet categoryGuide()}
  <a href="#guide" class="text-primary hover:underline">How categories work</a>
{/snippet}
{#snippet rolesHint()}
  Only needed when more than one person signs in.
{/snippet}
{#snippet screenshot()}
  <div
    class="bg-foreground/[0.07] text-muted-foreground flex aspect-video max-w-sm items-center justify-center rounded-lg text-xs"
  >
    Screenshot of the step
  </div>
{/snippet}

<!--
  The full "Get started" list, part way through: completed rows go muted and
  keep their place, so the list does not reshuffle between visits, and each
  group carries its own share. Open a row; open another and the first closes.
-->
<Story name="Playground" asChild>
  <div class="max-w-2xl">
    <Checklist
      groups={PARTIAL}
      expandedId={open.playground}
      onExpandedChange={(id) => (open.playground = id ?? undefined)}
    />
  </div>
</Story>

<!--
  Nothing started, and nothing wrong: every row a dashed ring, not a warning.
  And the finish line, one group at 100 and one finished by skipping. Nothing
  here dismisses the list; whether it stays is the page's call.
-->
<Story name="States" asChild>
  <div class="flex max-w-2xl flex-col gap-8">
    <Checklist groups={PENDING} />
    <Checklist groups={DONE} />
  </div>
</Story>

<!--
  All three states at once. `skipped` is not a quieter `completed`: the step is
  finished with, but nothing was done. The icons differ, and so does what a
  screen reader hears: "Completed:", "Skipped:", "Not started:".
-->
<Story name="With skipped row" asChild>
  <div class="max-w-2xl"><Checklist groups={MIXED} /></div>
</Story>

<!--
  The row a URL fragment opens, arriving as `expandedId`. Closing it hands
  `null` back; opening another hands that row's id. The open row carries media
  and a guide link as well as its action, so the whole body shows.
-->
<Story name="Expanded" asChild>
  <div class="max-w-2xl">
    <Checklist
      groups={WITH_MEDIA}
      expandedId={open.expanded}
      onExpandedChange={(id) => (open.expanded = id ?? undefined)}
    />
  </div>
</Story>

<!-- One group: the grouping is the caller's, so a flat list passes one. -->
<Story name="Single group" asChild>
  <div class="max-w-2xl"><Checklist groups={PARTIAL.slice(0, 1)} /></div>
</Story>

<!--
  The corners: a fractional share, shares outside 0–100 clamped, a long label
  that truncates and a long description that wraps, groups with no tasks (no
  list drawn), and a media-only row.
-->
<Story name="Edge cases" asChild>
  <div class="max-w-2xl"><Checklist groups={EDGES} expandedId="long" /></div>
</Story>
