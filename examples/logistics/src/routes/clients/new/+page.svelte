<!-- New client: an empty client form; they start active, with the ops manager. -->
<script lang="ts">
  import { toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import ClientForm from '#lib/components/client-form.svelte'
  import { createClient } from '#lib/data/clients/index.js'
  import type { ClientInput } from '#lib/data/clients/schema.js'
  import { store } from '#lib/data/store.svelte.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  markThisPage('New client')

  const initial: ClientInput = {
    name: '',
    industry: '',
    city: '',
    contact: '',
    email: '',
    manager: 'Ops manager',
    status: 'active',
  }

  function save(values: ClientInput) {
    const client = createClient(store, values)

    toast.success(`${client.name} added`)

    goto(resolve('/clients/[id]', { id: client.id }))
  }
</script>

<ClientForm
  {initial}
  {save}
  page={{
    title: 'New client',
    description: 'Who they are, who to talk to, and who looks after the account.',
    back: { href: resolve('/clients'), label: 'Back to Clients' },
    submitLabel: 'Add client',
  }}
/>
