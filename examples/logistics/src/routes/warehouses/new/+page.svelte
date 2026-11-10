<!-- New site: an empty site form with one zone to start from. -->
<script lang="ts">
  import { toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import SiteForm from '#lib/components/site-form.svelte'
  import { store } from '#lib/data/store.svelte.js'
  import { createSite } from '#lib/data/warehouses/index.js'
  import type { SiteInput } from '#lib/data/warehouses/schema.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  markThisPage('New site')

  const initial: SiteInput = {
    name: '',
    city: '',
    manager: '',
    capacityUnits: 0,
    docks: 1,
    zones: [{ name: 'Zone A', capacity: 0 }],
  }

  function save(values: SiteInput) {
    const site = createSite(store, values)

    toast.success(`${site.name} added`)

    goto(resolve('/warehouses/[id]', { id: site.id }))
  }
</script>

<SiteForm
  {initial}
  {save}
  page={{
    title: 'New site',
    description: 'Where it is, who runs it, and how its space is split into zones.',
    back: { href: resolve('/warehouses'), label: 'Back to Warehouses' },
    submitLabel: 'Add site',
  }}
/>
