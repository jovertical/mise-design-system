<!-- For the anatomy: every part a page header takes. -->
<script lang="ts">
  import {
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    Button,
    PageHeader,
  } from '@jovertical/mise-design-system'
</script>

{#snippet trail()}
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#/orders">Orders</BreadcrumbLink></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
{/snippet}

{#snippet status()}
  <Badge variant="outline" tone="warning">On hold</Badge>
{/snippet}

{#snippet actions()}
  <Button size="sm">Resume order</Button>
  <Button variant="outline" size="sm">Export</Button>
{/snippet}

<div class="w-[40rem]">
  <PageHeader
    breadcrumb={trail}
    eyebrow="Order"
    title="OR-2041"
    titleAccessory={status}
    description="Created 12 Jul 2026 · 09:30 · By Ana Cruz"
    {actions}
  />
</div>
