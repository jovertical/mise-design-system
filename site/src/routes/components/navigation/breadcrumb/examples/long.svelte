<!--
  The middle crumb truncates; the root, the separators and the leaf do not
  (`shrink-0`). A trail that pushes its own leaf off the edge has stopped
  saying where you are.
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

<div class="max-w-sm">
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem class="shrink-0"
        ><BreadcrumbLink href="#/items">Items</BreadcrumbLink></BreadcrumbItem
      >
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="#/items/cold-brew">
          Single origin cold brew concentrate, 1 litre, unsweetened
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem class="shrink-0"><BreadcrumbPage>Edit</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</div>
