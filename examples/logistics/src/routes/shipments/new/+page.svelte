<!-- Plan a run: an empty run planner; the run is scheduled and its orders move into fulfilment. -->
<script lang="ts">
  import { toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import ShipmentForm from '#lib/components/shipment-form.svelte'
  import { createShipment } from '#lib/data/shipments/index.js'
  import type { ShipmentInput } from '#lib/data/shipments/schema.js'
  import { store } from '#lib/data/store.svelte.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  markThisPage('Plan a run')

  const initial: ShipmentInput = { originId: '', vehicleId: '', driverId: '', orderIds: [] }

  function save(values: ShipmentInput) {
    const shipment = createShipment(store, values)

    toast.success(`${shipment.number} scheduled`)

    goto(resolve('/shipments/[id]', { id: shipment.number }))
  }
</script>

<ShipmentForm
  {initial}
  {save}
  page={{
    title: 'Plan a run',
    description: 'Pick a vehicle and a driver, then the ready orders it carries.',
    back: { href: resolve('/shipments'), label: 'Back to Shipments' },
    submitLabel: 'Schedule shipment',
  }}
/>
