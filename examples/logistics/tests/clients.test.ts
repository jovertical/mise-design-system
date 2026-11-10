/**
 * The clients repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'

import {
  clientOrders,
  clientToInput,
  createClient,
  getClient,
  listClients,
  openOrderValue,
  updateClient,
} from '../src/modules/clients/data/index.js'
import { clientSchema } from '../src/modules/clients/data/schema.js'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('clients', () => {
  it('finds a client, its orders and open value', () => {
    const coastal = listClients(source, { search: 'coastal' })[0]

    expect(getClient(source, coastal.id)?.name).toBe('Coastal Grocers')
    expect(clientOrders(source, coastal.id).length).toBeGreaterThan(0)
    expect(openOrderValue(source, coastal.id)).toBeGreaterThan(0)
  })

  it('adds a client', () => {
    const client = createClient(source, {
      name: 'Pine Street Deli',
      industry: 'Food',
      contact: 'H. Boyd',
      email: 'boyd@pinestreetdeli.example',
      city: 'Riverside',
      manager: 'Ops manager',
      status: 'paused',
    })

    expect(client).toMatchObject({ status: 'paused', manager: 'Ops manager', lifetimeValue: 0 })
    expect(listClients(source)).toHaveLength(15)
  })

  it('updates a client, keeping its id and lifetime value', () => {
    const coastal = listClients(source, { search: 'coastal' })[0]
    const { id, lifetimeValue } = coastal

    const client = updateClient(source, id, {
      ...clientToInput(coastal),
      contact: 'R. Mendes',
      status: 'paused',
    })

    expect(client).toMatchObject({ id, lifetimeValue, contact: 'R. Mendes', status: 'paused' })
    expect(() => updateClient(source, 'cli-nobody', clientToInput(coastal))).toThrow('No client')
  })

  it('turns a client into form input that the schema accepts', () => {
    const coastal = listClients(source, { search: 'coastal' })[0]

    expect(clientSchema.parse(clientToInput(coastal))).toEqual(clientToInput(coastal))
  })
})
