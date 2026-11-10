<!-- Edit vehicle: the vehicle form on an existing vehicle. Status is not edited here. -->
<script lang="ts">
  import { Button, ErrorState, PageLayout, toast } from '@jovertical/mise-design-system'
  import { store } from '#modules/core/data/store.svelte.js'
  import VehicleForm from '#modules/fleet/components/vehicle-form.svelte'
  import { getVehicle, updateVehicle, vehicleToInput } from '#modules/fleet/data/index.js'
  import type { VehicleInput } from '#modules/fleet/data/schema.js'
  import { markThisPage } from '#modules/shell/utils/breadcrumb.svelte.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const vehicle = $derived(getVehicle(store, page.params.id ?? ''))

  markThisPage('Edit', () => vehicle?.code)

  function save(values: VehicleInput) {
    if (!vehicle) return

    const saved = updateVehicle(store, vehicle.id, values)

    toast.success(`${saved.code} saved`)

    goto(resolve('/fleet/[id]', { id: saved.code }))
  }
</script>

{#snippet backToFleet()}
  <Button href={resolve('/fleet')}>Back to fleet</Button>
{/snippet}

{#if !vehicle}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such vehicle"
      description="That vehicle code does not exist."
      homeLink={backToFleet}
    />
  </PageLayout>
{:else}
  {#key vehicle.id}
    <VehicleForm
      initial={vehicleToInput(vehicle)}
      vehicleId={vehicle.id}
      status={vehicle.status}
      {save}
      page={{
        title: 'Edit vehicle',
        description: 'Change its details, its home or driver, or its service record.',
        back: {
          href: resolve('/fleet/[id]', { id: vehicle.code }),
          label: `Back to ${vehicle.code}`,
        },
        submitLabel: 'Save changes',
      }}
    />
  {/key}
{/if}
