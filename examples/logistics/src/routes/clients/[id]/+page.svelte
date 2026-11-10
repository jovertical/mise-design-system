<!-- One client: who to call, what they are worth, and what they have ordered. -->
<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    ErrorState,
    FactList,
    FactListItem,
    PageHeader,
    PageLayout,
    StatTile,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@jovertical/mise-design-system'
  import IconBriefcase from '@tabler/icons-svelte-runes/icons/briefcase'
  import IconMail from '@tabler/icons-svelte-runes/icons/mail'
  import IconMapPin from '@tabler/icons-svelte-runes/icons/map-pin'
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
  import IconUser from '@tabler/icons-svelte-runes/icons/user'
  import IconUserCog from '@tabler/icons-svelte-runes/icons/user-cog'
  import { clientOrders, getClient, openOrderValue } from '#modules/clients/data/index.js'
  import { CLIENT_STATUS } from '#modules/clients/utils/status.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateTime, money } from '#modules/core/utils/format.js'
  import { ORDER_STATUS } from '#modules/orders/utils/status.js'
  import { nameThisPage } from '#modules/shell/utils/breadcrumb.svelte.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const client = $derived(getClient(store, page.params.id ?? ''))
  const orders = $derived(client ? clientOrders(store, client.id) : [])

  nameThisPage(() => client?.name)
</script>

{#snippet back()}
  <Button href={resolve('/clients')}>Back to clients</Button>
{/snippet}
{#snippet userIcon()}
  <IconUser />
{/snippet}
{#snippet mailIcon()}
  <IconMail />
{/snippet}
{#snippet pinIcon()}
  <IconMapPin />
{/snippet}
{#snippet industryIcon()}
  <IconBriefcase />
{/snippet}
{#snippet managerIcon()}
  <IconUserCog />
{/snippet}

{#if !client}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such client"
      description="That client does not exist, or the demo data was reset."
      homeLink={back}
    />
  </PageLayout>
{:else}
  {#snippet status()}
    <Badge tone={CLIENT_STATUS[client.status].tone}>{CLIENT_STATUS[client.status].label}</Badge>
  {/snippet}
  {#snippet actions()}
    <Button variant="outline" href={resolve('/clients/[id]/edit', { id: client.id })}>
      <IconPencil />Edit
    </Button>
  {/snippet}
  <PageLayout>
    <PageHeader
      title={client.name}
      titleAccessory={status}
      description="{client.industry} · {client.city}"
      {actions}
    />

    <div class="grid gap-4 sm:grid-cols-3">
      <StatTile label="Orders" value={orders.length} />
      <StatTile label="Open order value" value={money(openOrderValue(store, client.id))} />
      <StatTile label="Lifetime value" value={money(client.lifetimeValue)} />
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
        <CardContent>
          {#if orders.length}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead>Deliver to</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead numeric>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {#each orders as order (order.id)}
                  <TableRow>
                    <TableCell>
                      <a
                        class="font-medium underline-offset-4 hover:underline"
                        href={resolve('/orders/[id]', { id: order.number })}
                        >{order.number}</a
                      >
                    </TableCell>
                    <TableCell>{dateTime(order.placedAt)}</TableCell>
                    <TableCell>{order.destination}</TableCell>
                    <TableCell
                      ><Badge tone={ORDER_STATUS[order.status].tone}
                        >{ORDER_STATUS[order.status].label}</Badge
                      ></TableCell
                    >
                    <TableCell numeric>{money(order.total)}</TableCell>
                  </TableRow>
                {/each}
              </TableBody>
            </Table>
          {:else}
            <p class="text-muted-foreground text-sm">No orders yet.</p>
          {/if}
        </CardContent>
      </Card>

      <Card class="self-start">
        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
        <CardContent>
          <FactList>
            <FactListItem
              orientation="vertical"
              icon={userIcon}
              label="Contact"
              value={client.contact}
            />
            <FactListItem
              orientation="vertical"
              icon={mailIcon}
              label="Email"
              value={client.email}
            />
            <FactListItem orientation="vertical" icon={pinIcon} label="City" value={client.city} />
            <FactListItem
              orientation="vertical"
              icon={industryIcon}
              label="Industry"
              value={client.industry}
            />
            <FactListItem
              orientation="vertical"
              icon={managerIcon}
              label="Account manager"
              value={client.manager}
            />
          </FactList>
        </CardContent>
      </Card>
    </div>
  </PageLayout>
{/if}
