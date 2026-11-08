<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '../../src/lib/index.js'

  let { routerLink = false }: { routerLink?: boolean } = $props()
</script>

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem class="shrink-0">
      {#if routerLink}
        <BreadcrumbLink href="/items">
          {#snippet child({ props })}
            <a href={props.href as string} {...props} data-router="true">Items</a>
          {/snippet}
        </BreadcrumbLink>
      {:else}
        <BreadcrumbLink href="/items">Items</BreadcrumbLink>
      {/if}
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem class="shrink-0"><BreadcrumbEllipsis /></BreadcrumbItem>
    <BreadcrumbSeparator>›</BreadcrumbSeparator>
    <BreadcrumbItem><BreadcrumbPage>Cold brew concentrate</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
