<!--
  The run planner's orders: the ready orders at the run's origin, each with a
  box to put it on the run. The ticks keep their order, which the stops follow.
-->
<script lang="ts">
  import {
    Checkbox,
    EmptyState,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@jovertical/mise-design-system'
  import { FormFieldErrors, FormFieldset, FormLegend } from '@jovertical/mise-design-system/form'
  import ListChecks from '@lucide/svelte/icons/list-checks'
  import Package from '@lucide/svelte/icons/package'
  import type { SuperForm } from 'sveltekit-superforms'

  import FormSection from '#modules/core/components/form-section.svelte'
  import { clientOf, locationName } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import type { Id } from '#modules/core/data/types.js'
  import { weight } from '#modules/core/utils/format.js'
  import type { Order } from '#modules/orders/data/types.js'
  import type { ShipmentInput } from '#modules/shipments/data/schema.js'

  let { form, orders }: { form: SuperForm<ShipmentInput>; orders: Order[] } = $props()

  // The form is built once per page and never replaced, so reading it here is enough.
  // svelte-ignore state_referenced_locally
  const { form: values } = form

  function tick(orderId: Id, on: boolean) {
    const rest = $values.orderIds.filter((id) => id !== orderId)

    $values.orderIds = on ? [...rest, orderId] : rest
  }

  const kilograms = (order: Order) => order.packages.reduce((sum, item) => sum + item.weightKg, 0)
</script>

{#snippet emptyIcon()}
  <Package />
{/snippet}

<FormSection
  icon={ListChecks}
  title="Orders"
  hint={$values.originId
    ? `Ready orders at ${locationName(store, $values.originId)} that are on no other run.`
    : 'Choose an origin to see its ready orders.'}
>
  <FormFieldset {form} name="orderIds" class="flex flex-col gap-3">
    <FormLegend class="sr-only">Orders on this run</FormLegend>
    {#if orders.length === 0}
      <EmptyState
        icon={emptyIcon}
        title={$values.originId ? 'No ready orders here' : 'No origin yet'}
        description={$values.originId
          ? `Every ready order at ${locationName(store, $values.originId)} is already on a run.`
          : 'The orders a run can carry depend on where it leaves from.'}
      />
    {:else}
      <Table compact>
        <TableHeader>
          <TableRow>
            <TableHead class="w-10"><span class="sr-only">On this run</span></TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Deliver to</TableHead>
            <TableHead class="text-right">Weight</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each orders as order (order.id)}
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={$values.orderIds.includes(order.id)}
                  onCheckedChange={(on) => tick(order.id, on === true)}
                  aria-label="Put {order.number} on this run"
                />
              </TableCell>
              <TableCell class="font-medium">{order.number}</TableCell>
              <TableCell>{clientOf(store, order.clientId)?.name}</TableCell>
              <TableCell>{order.destination}</TableCell>
              <TableCell class="text-right tabular-nums">{weight(kilograms(order))}</TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    {/if}
    <FormFieldErrors class="empty:hidden" />
  </FormFieldset>
</FormSection>
