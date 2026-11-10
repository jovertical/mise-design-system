<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconDots from '@tabler/icons-svelte-runes/icons/dots'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'
  import Button from '../../actions/button/button.svelte'
  import Badge from '../../data-display/badge/badge.svelte'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.svelte'
  import BreadcrumbItem from '../../navigation/breadcrumb/breadcrumb-item.svelte'
  import BreadcrumbLink from '../../navigation/breadcrumb/breadcrumb-link.svelte'
  import BreadcrumbList from '../../navigation/breadcrumb/breadcrumb-list.svelte'
  import BreadcrumbPage from '../../navigation/breadcrumb/breadcrumb-page.svelte'
  import BreadcrumbSeparator from '../../navigation/breadcrumb/breadcrumb-separator.svelte'
  import PageHeader from './page-header.svelte'
  import PageHeaderBackLink from './page-header-back-link.svelte'

  const { Story } = defineMeta({
    title: 'Layout/PageHeader',
    component: PageHeader,
    tags: ['mise'],
  })
</script>

{#snippet newLocation()}
  <Button><IconPlus class="size-4" />New location</Button>
{/snippet}
{#snippet locationsTrail()}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem class="shrink-0"
        ><BreadcrumbLink href="#">Locations</BreadcrumbLink></BreadcrumbItem
      >
    </BreadcrumbList>
  </Breadcrumb>
{/snippet}
{#snippet setupTrail()}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem class="shrink-0"
        ><BreadcrumbLink href="#">Locations</BreadcrumbLink></BreadcrumbItem
      >
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>New location setup</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/snippet}
{#snippet itemTrail()}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem class="shrink-0"
        ><BreadcrumbLink href="#">Items</BreadcrumbLink></BreadcrumbItem
      >
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>Cold brew concentrate</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/snippet}
{#snippet routeTrail()}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#">Route planner</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>RT-2026-0176</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/snippet}
{#snippet orderTrail()}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#">Orders</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>OR-2041</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/snippet}
{#snippet cancelSetup()}
  <Button variant="outline">Cancel setup</Button>
{/snippet}
{#snippet draft()}
  <Badge variant="outline">Draft</Badge>
{/snippet}
{#snippet open()}
  <Badge variant="outline" tone="success">Open</Badge>
{/snippet}
{#snippet ticketOpen()}
  <Badge variant="outline">Open</Badge>
{/snippet}
{#snippet edit()}
  <Button>Edit</Button>
{/snippet}
{#snippet closeOrMore()}
  <Button variant="outline">Close temporarily</Button>
  <Button variant="ghost" iconOnly aria-label="More actions"><IconDots class="size-4" /></Button>
{/snippet}
{#snippet inProgress()}
  <Badge variant="outline" tone="warning">In progress</Badge>
{/snippet}
{#snippet routeActions()}
  <Button variant="outline" size="sm">Live map</Button>
  <Button size="sm">Edit route</Button>
{/snippet}
{#snippet backToLocations()}
  <PageHeaderBackLink href="#locations">Back to locations</PageHeaderBackLink>
{/snippet}
{#snippet saveOrCancel()}
  <Button variant="outline" size="sm">Cancel</Button>
  <Button size="sm">Save changes</Button>
{/snippet}
{#snippet orderBadges()}
  <Badge variant="outline" tone="warning">On hold</Badge>
  <Badge variant="outline">Online</Badge>
{/snippet}
{#snippet orderActions()}
  <Button size="sm">Resume order</Button>
  <Button variant="outline" size="sm">Export</Button>
  <Button variant="outline" size="sm">Actions</Button>
{/snippet}

<!-- A listing. Title, what the page is for, and the one primary action. -->
<Story name="Playground">
  {#snippet template(args)}
    <PageHeader
      title="Locations"
      description="Every location trading on this account."
      actions={newLocation}
      {...args}
    />
  {/snippet}
</Story>
<!-- `titleAccessory` sits inline with the title; `actions` go to the right. -->
<Story name="With accessory and actions" asChild>
  <PageHeader
    title="Riverside"
    description="Opened 4 June 2026 · 3 registers"
    titleAccessory={open}
    actions={closeOrMore}
  />
</Story>

<!--
  An eyebrow names the kind of thing when the title cannot: `RT-2026-0176` says
  nothing on its own. Skip it when the title already reads as English.
-->
<Story name="With eyebrow" asChild>
  <PageHeader
    breadcrumb={routeTrail}
    eyebrow="Route detail"
    title="RT-2026-0176"
    titleAccessory={inProgress}
    description="25 Jul 2026 · Departs 08:00 · Riverside → Harbour"
    actions={routeActions}
  />
</Story>

<!--
  The create-and-edit shape. A back link, not a trail: a trail says here is where
  you are, a back link says here is the way out.
-->
<Story name="With back link" asChild>
  <PageHeader
    backLink={backToLocations}
    title="Edit location"
    description="Update location details and opening hours."
    actions={saveOrCancel}
  />
</Story>

<!-- A long title wraps rather than pushing the actions off the edge. -->
<Story name="Long content" asChild>
  <PageHeader
    title="Single origin cold brew concentrate, 1 litre, unsweetened, for the counter fridge"
    titleAccessory={draft}
    actions={edit}
  />
</Story>

<!-- A flow. No trail, because a wizard is something you are part-way through, not a place. -->
<Story name="Flow" asChild>
  <PageHeader title="Item builder" description="Finish this draft to publish it." />
</Story>

<!-- Shape one: the title names the page, so the trail stops at its parent. -->
<Story name="Title with ancestor trail" asChild>
  <PageHeader
    title="New location setup"
    description="Set up a location end to end. Each step provisions something, so finished steps cannot be revisited."
    breadcrumb={locationsTrail}
  />
</Story>

<!--
  Shape two: the trail runs to the page and there is no title. With no `title`
  there is no `h1`, so the body has to supply one.
-->
<Story name="Trail as title" asChild>
  <PageHeader breadcrumb={setupTrail} actions={cancelSetup} />
</Story>

<!-- Shape two with a status beside the trail rather than beside a title. -->
<Story name="Trail as title with accessory" asChild>
  <PageHeader breadcrumb={itemTrail} titleAccessory={draft} actions={edit} />
</Story>

<!--
  `truncateTitle` for a title someone else wrote, like a ticket's subject: one
  line, capped, the badge kept beside it, the whole subject as a tooltip.
-->
<Story name="Truncated title" asChild>
  <PageHeader
    title="The register at the North location stops sending orders after a few hours and we cannot see them"
    titleAccessory={ticketOpen}
    truncateTitle
  />
</Story>

<!--
  Two status badges and three actions, the busiest header. The title row wraps,
  and the actions drop below the title on a narrow screen.
-->
<Story name="Busiest" asChild>
  <PageHeader
    breadcrumb={orderTrail}
    title="Order OR-2041"
    titleAccessory={orderBadges}
    description="Created on 12 Jul 2026 · 09:30 · By Ana Cruz"
    actions={orderActions}
  />
</Story>

<!--
  The detail shape: a trail stopping at the parent, and the entity as the title.
  The trail is the address, the title is the name; neither repeats the other.
-->
<Story name="Detail" asChild>
  <PageHeader
    breadcrumb={locationsTrail}
    title="Riverside"
    titleAccessory={open}
    description="Bakery · Open daily"
    actions={closeOrMore}
  />
</Story>
