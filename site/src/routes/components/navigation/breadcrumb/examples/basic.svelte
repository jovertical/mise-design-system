<!--
  Where the page sits: links to the pages above it, and the page itself as
  plain text. A trailing crumb makes the middle one a link. Links are #/…
  placeholders here.
-->
<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@jovertical/mise-design-system'
</script>

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem class="shrink-0"
      ><BreadcrumbLink href="#/items">Items</BreadcrumbLink></BreadcrumbItem
    >
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#/items/cold-brew">Cold brew concentrate</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem class="shrink-0"><BreadcrumbPage>Edit</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
