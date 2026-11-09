<!--
  Clients: who ships with us. A row opens the client's own page; Add client
  goes to the new-client page.
-->
<script lang="ts">
  import {
    Avatar,
    AvatarFallback,
    Badge,
    Button,
    DataTable,
    DataTableColumnHeader,
    DataTableToolbar,
    dataTableColumns,
    EntityLabel,
    PageHeader,
    PageLayout,
  } from '@jovertical/mise-design-system'
  import Plus from '@lucide/svelte/icons/plus'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import NoMatches from '#lib/components/no-matches.svelte'
  import { clientOrders, listClients, openOrderValue } from '#lib/data/clients.js'
  import { latency } from '#lib/data/latency.js'
  import { initials } from '#lib/data/lookups.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Client } from '#lib/data/types.js'
  import { money } from '#lib/format.js'
  import { CLIENT_STATUS } from '#lib/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  let loading = $state(true)
  $effect(() => {
    latency().then(() => (loading = false))
  })

  const clients = $derived(listClients(store))

  const STATUS_OPTIONS = Object.entries(CLIENT_STATUS).map(([value, look]) => ({
    value,
    label: look.label,
  }))
  const MANAGER_OPTIONS = $derived(
    [...new Set(store.data.clients.map((client) => client.manager))].map((manager) => ({
      value: manager,
      label: manager,
    })),
  )
  const inList = (row: { getValue: (id: string) => unknown }, id: string, values: string[]) =>
    values.includes(String(row.getValue(id)))

  const column = dataTableColumns<Client>()
  const columns = column.columns([
    column.accessor('name', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Client' }),
      cell: ({ row }) => renderSnippet(clientCell, row.original),
    }),
    column.accessor('contact', { header: 'Contact' }),
    column.accessor('city', { header: 'City' }),
    column.display({
      id: 'orders',
      header: 'Orders',
      cell: ({ row }) => String(clientOrders(store, row.original.id).length),
    }),
    column.display({
      id: 'open',
      header: 'Open value',
      cell: ({ row }) => money(openOrderValue(store, row.original.id)),
    }),
    column.accessor('lifetimeValue', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Lifetime' }),
      cell: ({ row }) => money(row.original.lifetimeValue),
    }),
    column.accessor('manager', { header: 'Manager', filterFn: inList }),
    column.accessor('status', {
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original),
      filterFn: inList,
    }),
  ])
</script>

{#snippet clientCell(client: Client)}
  {#snippet avatar()}
    <Avatar class="size-8"><AvatarFallback>{initials(client.name)}</AvatarFallback></Avatar>
  {/snippet}
  <EntityLabel title={client.name} description={client.industry} media={avatar} />
{/snippet}
{#snippet statusCell(client: Client)}
  <Badge tone={CLIENT_STATUS[client.status].tone}>{CLIENT_STATUS[client.status].label}</Badge>
{/snippet}
{#snippet headerActions()}
  <Button href={resolve('/clients/new')}><Plus />Add client</Button>
{/snippet}

{#snippet noMatches()}
  <NoMatches things="clients" />
{/snippet}

<PageLayout>
  <PageHeader title="Clients" description="Who ships with us." actions={headerActions} />

  <DataTable
    {columns}
    data={clients}
    getRowId={(client) => client.id}
    onRowClick={(client) => goto(resolve('/clients/[id]', { id: client.id }))}
    isLoading={loading}
    emptyState={noMatches}
    withPadding={false}
  >
    {#snippet toolbar(table)}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search clients…' }}
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            allLabel: 'All statuses',
            options: STATUS_OPTIONS,
          },
          {
            columnId: 'manager',
            title: 'Manager',
            allLabel: 'All managers',
            options: MANAGER_OPTIONS,
          },
        ]}
      />
    {/snippet}
  </DataTable>
</PageLayout>
