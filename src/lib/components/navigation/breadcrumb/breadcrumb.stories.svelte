<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Breadcrumb from './breadcrumb.svelte'
  import BreadcrumbEllipsis from './breadcrumb-ellipsis.svelte'
  import BreadcrumbItem from './breadcrumb-item.svelte'
  import BreadcrumbLink from './breadcrumb-link.svelte'
  import BreadcrumbList from './breadcrumb-list.svelte'
  import BreadcrumbPage from './breadcrumb-page.svelte'
  import BreadcrumbSeparator from './breadcrumb-separator.svelte'

  const { Story } = defineMeta({
    title: 'Navigation/Breadcrumb',
    component: Breadcrumb,
    tags: ['mise'],
  })
</script>

<Story name="Playground">
  {#snippet template(args)}
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem class="shrink-0"
          ><BreadcrumbLink href="#">Items</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Cold brew concentrate</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  {/snippet}
</Story>

<!-- A trailing crumb makes the middle one a link rather than the leaf. -->
<Story name="With trailing page" asChild>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem class="shrink-0"
        ><BreadcrumbLink href="#">Items</BreadcrumbLink></BreadcrumbItem
      >
      <BreadcrumbSeparator />
      <BreadcrumbItem
        ><BreadcrumbLink href="#">Cold brew concentrate</BreadcrumbLink></BreadcrumbItem
      >
      <BreadcrumbSeparator />
      <BreadcrumbItem class="shrink-0"><BreadcrumbPage>Edit</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</Story>

<!--
  The middle crumb truncates; the root, the separators and the leaf do not. A
  trail that pushes its own leaf off the edge has stopped saying where you are.
-->
<Story name="Long content" asChild>
  <div class="max-w-sm">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem class="shrink-0"
          ><BreadcrumbLink href="#">Items</BreadcrumbLink></BreadcrumbItem
        >
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#"
            >Single origin cold brew concentrate, 1 litre, unsweetened</BreadcrumbLink
          >
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem class="shrink-0"><BreadcrumbPage>Edit</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
</Story>

<!-- For a trail too deep to render whole. -->
<Story name="Collapsed" asChild>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem class="shrink-0"
        ><BreadcrumbLink href="#">Locations</BreadcrumbLink></BreadcrumbItem
      >
      <BreadcrumbSeparator />
      <BreadcrumbItem class="shrink-0"><BreadcrumbEllipsis /></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem class="shrink-0"
        ><BreadcrumbPage>Register timeline</BreadcrumbPage></BreadcrumbItem
      >
    </BreadcrumbList>
  </Breadcrumb>
</Story>
