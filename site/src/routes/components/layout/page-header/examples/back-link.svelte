<!--
  The create-and-edit shape: a back link, not a trail. A trail says where you
  are; a back link says the way out.
-->
<script lang="ts">
  import { Button, PageHeader, PageHeaderBackLink } from '@jovertical/mise-design-system'
</script>

{#snippet back()}
  <PageHeaderBackLink href="#/locations">Back to locations</PageHeaderBackLink>
{/snippet}

{#snippet saveOrCancel()}
  <Button variant="outline" size="sm">Cancel</Button>
  <Button size="sm">Save changes</Button>
{/snippet}

<div class="w-full">
  <PageHeader
    backLink={back}
    title="Edit location"
    description="Update location details and opening hours."
    actions={saveOrCancel}
  />
</div>
