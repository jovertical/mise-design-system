<!--
  Asks which run a ready order goes on, when it is dropped in In fulfilment:
  the scheduled runs leaving from its origin. With none, it says so and offers
  to plan one. Closing it leaves the order where it was.
-->
<script lang="ts">
  import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    toast,
  } from '@jovertical/mise-design-system'

  import { locationName, vehicleOf } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateTime } from '#modules/core/utils/format.js'
  import type { Order } from '#modules/orders/data/types.js'
  import { addOrderToShipment, runsFor } from '#modules/shipments/data/index.js'
  import { resolve } from '$app/paths'

  let { order = $bindable(null) }: { order?: Order | null } = $props()

  let chosen = $state('')

  const runs = $derived(order ? runsFor(store, order) : [])

  const options = $derived(
    runs.map((run) => ({
      value: run.id,
      label: [
        run.number,
        vehicleOf(store, run.vehicleId)?.registration,
        run.stops[0] && `leaves ${dateTime(run.stops[0].eta)}`,
      ]
        .filter(Boolean)
        .join(' · '),
    })),
  )

  $effect(() => {
    chosen = options[0]?.value ?? ''
  })

  function close() {
    order = null
  }

  function confirm() {
    if (!order || !chosen) return

    try {
      const run = addOrderToShipment(store, chosen, order.id)

      toast.success(`${order.number} is on ${run.number}`)

      close()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error))
    }
  }
</script>

<Dialog
  open={order !== null}
  onOpenChange={(open) => {
    if (!open) close()
  }}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Put {order?.number} on a run</DialogTitle>
      <DialogDescription>
        {#if runs.length}
          The runs still scheduled from {locationName(store, order?.originId ?? null)}.
        {:else}
          No scheduled run leaves from {locationName(store, order?.originId ?? null)}.
        {/if}
      </DialogDescription>
    </DialogHeader>
    {#if runs.length}
      <Select type="single" bind:value={chosen} items={options}>
        <SelectTrigger class="w-full" aria-label="Run"><SelectValue /></SelectTrigger>
        <SelectContent>
          {#each options as option (option.value)}
            <SelectItem value={option.value} label={option.label} />
          {/each}
        </SelectContent>
      </Select>
    {/if}
    <DialogFooter>
      <Button variant="outline" onclick={close}>Not now</Button>
      {#if runs.length}
        <Button onclick={confirm} disabled={!chosen}>Put on run</Button>
      {:else}
        <Button href={resolve('/shipments/new')}>Plan a run</Button>
      {/if}
    </DialogFooter>
  </DialogContent>
</Dialog>
