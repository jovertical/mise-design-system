<!--
  ⌘K / Ctrl K, or the header's search field: one palette over orders,
  clients, products and the screens. Command filters the items as you type;
  choosing one navigates.
-->
<script lang="ts">
  import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandTrigger,
  } from '@jovertical/mise-design-system'
  import { clientOf } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { NAVIGATION } from '#modules/shell/utils/navigation.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  let open = $state(false)

  function go(href: string) {
    open = false

    goto(href)
  }
</script>

<CommandTrigger bind:open class="ml-auto w-48 shrink md:w-72" />

<CommandDialog
  bind:open
  title="Search"
  description="Find an order, a client, a product or a screen."
>
  <CommandInput placeholder="Search orders, clients, products…" />
  <CommandList>
    <CommandEmpty>Nothing matches.</CommandEmpty>
    <CommandGroup heading="Go to">
      {#each NAVIGATION.flatMap((group) => group.items) as item (item.href)}
        <CommandItem value="Go to {item.label}" onSelect={() => go(resolve(item.href))}>
          <item.icon />
          {item.label}
        </CommandItem>
      {/each}
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Orders">
      {#each store.data.orders.toSorted((first, second) =>
        second.number.localeCompare(first.number),
      ) as order (order.id)}
        <CommandItem
          value="{order.number} {clientOf(store, order.clientId)?.name}"
          onSelect={() => go(resolve('/orders/[id]', { id: order.number }))}
        >
          {order.number}
          <span class="text-muted-foreground">{clientOf(store, order.clientId)?.name}</span>
        </CommandItem>
      {/each}
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Clients">
      {#each store.data.clients as client (client.id)}
        <CommandItem
          value="{client.name} {client.contact}"
          onSelect={() => go(resolve('/clients/[id]', { id: client.id }))}
        >
          {client.name}
        </CommandItem>
      {/each}
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Products">
      {#each store.data.products as product (product.id)}
        <CommandItem
          value="{product.sku} {product.name}"
          onSelect={() => go(resolve('/products/[id]', { id: product.sku }))}
        >
          {product.name}
          <span class="text-muted-foreground">{product.sku}</span>
        </CommandItem>
      {/each}
    </CommandGroup>
  </CommandList>
</CommandDialog>
