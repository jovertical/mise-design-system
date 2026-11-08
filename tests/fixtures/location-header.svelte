<script lang="ts">
  import {
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    Button,
    PageHeader,
  } from '../../src/lib/index.js'

  let {
    title,
    eyebrow,
    truncateTitle = false,
    withTrail = false,
    withBackLink = false,
    withAccessory = false,
  }: {
    title?: string
    eyebrow?: string
    truncateTitle?: boolean
    withTrail?: boolean
    withBackLink?: boolean
    withAccessory?: boolean
  } = $props()
</script>

{#snippet trail()}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="/locations">Locations</BreadcrumbLink></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/snippet}
{#snippet back()}
  <a href="/locations">Back to locations</a>
{/snippet}
{#snippet accessory()}
  <Badge tone="success">Open</Badge>
{/snippet}
{#snippet actions()}
  <Button>Edit</Button>
{/snippet}

<PageHeader
  {title}
  {eyebrow}
  {truncateTitle}
  description="Opened 4 June 2026"
  breadcrumb={withTrail ? trail : undefined}
  backLink={withBackLink ? back : undefined}
  titleAccessory={withAccessory ? accessory : undefined}
  {actions}
/>
