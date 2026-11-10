<!-- New vehicle: an empty vehicle form; it joins the fleet idle. -->
<script lang="ts">
  import { toast } from '@jovertical/mise-design-system'
  import { store } from '#modules/core/data/store.svelte.js'
  import VehicleForm from '#modules/fleet/components/vehicle-form.svelte'
  import { createVehicle } from '#modules/fleet/data/index.js'
  import type { VehicleInput } from '#modules/fleet/data/schema.js'
  import { markThisPage } from '#modules/shell/utils/breadcrumb.svelte.js'
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
