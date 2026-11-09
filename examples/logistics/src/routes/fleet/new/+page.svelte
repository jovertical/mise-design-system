<!-- New vehicle: an empty vehicle form; it joins the fleet idle. -->
<script lang="ts">
  import { toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import VehicleForm from '#lib/components/vehicle-form.svelte'
  import { createVehicle } from '#lib/data/fleet.js'
  import type { VehicleInput } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  markThisPage('New vehicle')

  const initial: VehicleInput = {
    code: '',
    registration: '',
    type: 'van',
    homeLocationId: '',
    driverId: null,
    mileageKm: 0,
    nextServiceDay: 180,
    condition: 'excellent',
  }

  function save(values: VehicleInput) {
    const vehicle = createVehicle(store, values)
    toast.success(`${vehicle.code} added`)
    goto(resolve('/fleet/[id]', { id: vehicle.code }))
  }
</script>

<VehicleForm
  {initial}
  {save}
  page={{
    title: 'New vehicle',
    description: 'What it is, where it is based, and when it is next due a service. It joins idle.',
    back: { href: resolve('/fleet'), label: 'Back to Fleet' },
    submitLabel: 'Add vehicle',
  }}
/>
