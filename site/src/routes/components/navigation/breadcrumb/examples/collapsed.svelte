<!-- For a trail too deep to render whole: the middle collapses to an ellipsis. -->
<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbEllipsis,
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
      ><BreadcrumbLink href="#/locations">Locations</BreadcrumbLink></BreadcrumbItem
    >
    <BreadcrumbSeparator />
    <BreadcrumbItem class="shrink-0"><BreadcrumbEllipsis /></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem class="shrink-0"
      ><BreadcrumbPage>Register timeline</BreadcrumbPage></BreadcrumbItem
    >
  </BreadcrumbList>
</Breadcrumb>
