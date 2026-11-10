<!-- Edit client: the client form on an existing client. Every client can be edited. -->
<script lang="ts">
  import { Button, ErrorState, PageLayout, toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import ClientForm from '#lib/components/client-form.svelte'
  import { clientToInput, getClient, openOrderValue, updateClient } from '#lib/data/clients.js'
  import type { ClientInput } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const client = $derived(getClient(store, page.params.id ?? ''))

  markThisPage('Edit', () => client?.name)

  function save(values: ClientInput) {
    if (!client) return

    const saved = updateClient(store, client.id, values)

    toast.success(`${saved.name} saved`)

    goto(resolve('/clients/[id]', { id: saved.id }))
  }
</script>

{#snippet backToClients()}
  <Button href={resolve('/clients')}>Back to clients</Button>
{/snippet}

{#if !client}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such client"
      description="That client does not exist, or the demo data was reset."
      homeLink={backToClients}
    />
  </PageLayout>
{:else}
  {#key client.id}
    <ClientForm
      initial={clientToInput(client)}
      {save}
      worth={{ lifetime: client.lifetimeValue, open: openOrderValue(store, client.id) }}
      page={{
        title: 'Edit client',
        description: 'Change their details, their contact or their account.',
        back: {
          href: resolve('/clients/[id]', { id: client.id }),
          label: `Back to ${client.name}`,
        },
        submitLabel: 'Save changes',
      }}
    />
  {/key}
{/if}
