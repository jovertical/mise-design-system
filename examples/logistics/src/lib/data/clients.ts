import { newClientSchema } from './schemas.js'
import { matches, type Source } from './shared.js'
import type { Cents, Client, Id } from './types.js'

export type ClientFilters = { search?: string; status?: Client['status']; manager?: string }
export type NewClient = Pick<Client, 'name' | 'industry' | 'contact' | 'email' | 'city'>

export const listClients = (s: Source, filters: ClientFilters = {}): Client[] =>
  s.data.clients
    .filter((client) => !filters.status || client.status === filters.status)
    .filter((client) => !filters.manager || client.manager === filters.manager)
    .filter((client) => matches(filters.search, client.name, client.contact))

export const getClient = (s: Source, id: Id) => s.data.clients.find((client) => client.id === id)

export const clientOrders = (s: Source, id: Id) =>
  s.data.orders
    .filter((order) => order.clientId === id)
    .toSorted((a, b) => b.number.localeCompare(a.number))

/** The value of the client's orders that are neither completed nor cancelled. */
export const openOrderValue = (s: Source, id: Id): Cents =>
  clientOrders(s, id)
    .filter((order) => order.status !== 'completed' && order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)

export function createClient(s: Source, raw: NewClient): Client {
  const input = newClientSchema.parse(raw)
  const client: Client = {
    ...input,
    id: `cli-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${s.data.clients.length + 1}`,
    manager: 'Ops manager',
    status: 'active',
    lifetimeValue: 0,
  }
  s.data.clients.push(client)
  return client
}
