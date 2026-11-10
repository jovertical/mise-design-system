<!-- Edit site: the site form on an existing site, each zone showing what it holds. -->
<script lang="ts">
  import { Button, ErrorState, PageLayout, toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import SiteForm from '#lib/components/site-form.svelte'
  import type { SiteInput } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import { getLocation, siteToInput, updateSite } from '#lib/data/warehouses.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const location = $derived(getLocation(store, page.params.id ?? ''))

  markThisPage('Edit', () => location?.name)

  function save(values: SiteInput) {
    if (!location) return

    const saved = updateSite(store, location.id, values)

    toast.success(`${saved.name} saved`)

    goto(resolve('/warehouses/[id]', { id: saved.id }))
  }
</script>

{#snippet backToWarehouses()}
  <Button href={resolve('/warehouses')}>Back to warehouses</Button>
{/snippet}

{#if !location}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such site"
      description="That warehouse does not exist."
      homeLink={backToWarehouses}
    />
  </PageLayout>
{:else}
  {#key location.id}
    <SiteForm
      initial={siteToInput(location)}
      used={location.zones.map((zone) => zone.used)}
      {save}
      page={{
        title: 'Edit site',
        description: 'Change who runs it, its capacity, or its zones.',
        back: {
          href: resolve('/warehouses/[id]', { id: location.id }),
          label: `Back to ${location.name}`,
        },
        submitLabel: 'Save changes',
      }}
    />
  {/key}
{/if}
