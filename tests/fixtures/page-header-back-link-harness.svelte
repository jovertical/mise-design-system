<script lang="ts">
  import { PageHeader, PageHeaderBackLink } from '../../src/lib/index.js'
</script>

<PageHeader title="New location">
  {#snippet backLink()}
    <PageHeaderBackLink href="/locations">Locations</PageHeaderBackLink>
  {/snippet}
</PageHeader>
