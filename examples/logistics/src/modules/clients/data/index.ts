import { matches, type Source } from '#modules/core/data/shared.js'
import type { Cents, Id } from '#modules/core/data/types.js'
import { type ClientInput, clientSchema } from './schema.js'
import type { Client } from './types.js'

export type ClientFilters = { search?: string; status?: Client['status']; manager?: string }

export const listClients = (source: Source, filters: ClientFilters = {}): Client[] =>
  source.data.clients
    .filter((client) => !filters.status || client.status === filters.status)
    .filter((client) => !filters.manager || client.manager === filters.manager)
    .filter((client) => matches(filters.search, client.name, client.contact))

export const getClient = (source: Source, id: Id) =>
  source.data.clients.find((client) => client.id === id)

export const clientOrders = (source: Source, id: Id) =>
  source.data.orders
    .filter((order) => order.clientId === id)
    .toSorted((first, second) => second.number.localeCompare(first.number))

/** The value of the client's orders that are neither completed nor cancelled. */
export const openOrderValue = (source: Source, id: Id): Cents =>
  clientOrders(source, id)
    .filter((order) => order.status !== 'completed' && order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)

export const clientToInput = (client: Client): ClientInput => ({
  name: client.name,
  industry: client.industry,
  city: client.city,
  contact: client.contact,
  email: client.email,
  manager: client.manager,
  status: client.status,
})

export function createClient(source: Source, raw: ClientInput): Client {
  const input = clientSchema.parse(raw)

  const client: Client = {
    ...input,
    id: `cli-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${source.data.clients.length + 1}`,
    lifetimeValue: 0,
  }

  source.data.clients.push(client)

  return client
}

export function updateClient(source: Source, id: Id, raw: ClientInput): Client {
  const client = getClient(source, id)

  if (!client) throw new Error(`No client ${id}`)

  Object.assign(client, clientSchema.parse(raw))

  return client
}
