<!--
  Edit run: the run planner on a scheduled shipment. A run that has left is
  kept as it was, so it gets a stop instead of the planner.
-->
<script lang="ts">
  import { Button, ErrorState, PageLayout, toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import ShipmentForm from '#lib/components/shipment-form.svelte'
  import {
    getShipment,
    isShipmentEditable,
    shipmentToInput,
    updateShipment,
  } from '#lib/data/shipments/index.js'
  import type { ShipmentInput } from '#lib/data/shipments/schema.js'
  import { store } from '#lib/data/store.svelte.js'
  import { SHIPMENT_STATUS } from '#lib/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const shipment = $derived(getShipment(store, page.params.id ?? ''))

  markThisPage('Edit', () => shipment?.number)

  function save(values: ShipmentInput) {
    if (!shipment) return

    const saved = updateShipment(store, shipment.id, values)

    toast.success(`${saved.number} saved`)

    goto(resolve('/shipments/[id]', { id: saved.number }))
  }
</script>

{#snippet backToShipments()}
  <Button href={resolve('/shipments')}>Back to shipments</Button>
{/snippet}

{#if !shipment}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such shipment"
      description="That shipment number does not exist."
      homeLink={backToShipments}
    />
  </PageLayout>
{:else if !isShipmentEditable(shipment)}
  {#snippet backToShipment()}
    <Button href={resolve('/shipments/[id]', { id: shipment.number })}>
      Back to {shipment.number}
    </Button>
  {/snippet}
  <PageLayout>
    <ErrorState
      title="{shipment.number} can't be replanned"
      description="It is {SHIPMENT_STATUS[
        shipment.status
      ].label.toLowerCase()}. Only a scheduled run can change."
      homeLink={backToShipment}
    />
  </PageLayout>
{:else}
  {#key shipment.id}
    <ShipmentForm
      initial={shipmentToInput(shipment)}
      shipmentId={shipment.id}
      {save}
      page={{
        title: 'Edit run',
        description:
          'Change the vehicle, the driver or the orders. Unticked orders go back to ready.',
        back: {
          href: resolve('/shipments/[id]', { id: shipment.number }),
          label: `Back to ${shipment.number}`,
        },
        submitLabel: 'Save changes',
      }}
    />
  {/key}
{/if}
