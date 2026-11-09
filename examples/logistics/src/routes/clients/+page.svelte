<!--
  Clients: who ships with us. A row opens the client's own page; Add client
  opens a form in a dialog.
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    dataTableColumns,
    EntityLabel,
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
    PageHeader,
    PageLayout,
    toast,
  } from '@jovertical/mise-design-system'
  import Plus from '@lucide/svelte/icons/plus'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import NoMatches from '#lib/components/no-matches.svelte'
  import { clientOrders, createClient, listClients, openOrderValue } from '#lib/data/clients.js'
  import { latency } from '#lib/data/latency.js'
  import { initials } from '#lib/data/lookups.js'
  import { type ClientInput, clientSchema } from '#lib/data/schemas.js'
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

  // The add-client dialog.
  let adding = $state(false)
  let draft = $state<Omit<ClientInput, 'manager' | 'status'>>({
    name: '',
    industry: '',
    contact: '',
    email: '',
    city: '',
  })
  let errors = $state<Partial<Record<keyof Omit<ClientInput, 'manager' | 'status'>, string>>>({})

  function startAdding() {
    draft = { name: '', industry: '', contact: '', email: '', city: '' }
    errors = {}
    adding = true
  }

  function add(event: SubmitEvent) {
    event.preventDefault()
    const result = clientSchema.safeParse({ ...draft, manager: 'Ops manager', status: 'active' })
    if (!result.success) {
      errors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      )
      return
    }
    const client = createClient(store, result.data)
    adding = false
    toast.success(`${client.name} added`)
  }

  const FIELDS: {
    key: keyof Omit<ClientInput, 'manager' | 'status'>
    label: string
    placeholder: string
    type?: string
  }[] = [
    { key: 'name', label: 'Name', placeholder: 'Pine Street Deli' },
    { key: 'industry', label: 'Industry', placeholder: 'Food' },
    { key: 'contact', label: 'Contact', placeholder: 'H. Boyd' },
    { key: 'email', label: 'Email', placeholder: 'orders@pinestreet.example', type: 'email' },
    { key: 'city', label: 'City', placeholder: 'Riverside' },
  ]

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
  <Button onclick={startAdding}><Plus />Add client</Button>
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

<Dialog bind:open={adding}>
  <DialogContent class="sm:max-w-md">
    <form onsubmit={add} class="flex flex-col gap-6" novalidate>
      <DialogHeader>
        <DialogTitle>Add a client</DialogTitle>
        <DialogDescription>They start as Active, managed by you.</DialogDescription>
      </DialogHeader>
      <FieldGroup>
        {#each FIELDS as field (field.key)}
          <Field data-invalid={errors[field.key] ? 'true' : undefined}>
            <FieldLabel for="client-{field.key}" required>{field.label}</FieldLabel>
            <Input
              id="client-{field.key}"
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              bind:value={draft[field.key]}
              aria-invalid={errors[field.key] ? 'true' : undefined}
            />
            <FieldError errors={errors[field.key] ? [{ message: errors[field.key] }] : []} />
          </Field>
        {/each}
      </FieldGroup>
      <DialogFooter>
        <Button type="button" variant="outline" onclick={() => (adding = false)}>Cancel</Button>
        <Button type="submit">Add client</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
