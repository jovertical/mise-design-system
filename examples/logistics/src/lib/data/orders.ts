import { matches, type Source } from './shared.js'
import type { Cents, Id, Order, OrderStatus } from './types.js'

export type OrderFilters = { search?: string; status?: OrderStatus }

export type NewOrder = {
  clientId: Id
  service: Order['service']
  originId: Id
  destination: string
  weightKg: number
  total: Cents
}

export const OPEN_STATUSES = ['received', 'ready', 'in-fulfilment', 'completed'] as const

const clientName = (s: Source, id: Id) =>
  s.data.clients.find((client) => client.id === id)?.name ?? ''

/** Newest first: order numbers rise with time. */
export function listOrders(s: Source, filters: OrderFilters = {}): Order[] {
  return s.data.orders
    .filter((order) => !filters.status || order.status === filters.status)
    .filter((order) => matches(filters.search, order.number, clientName(s, order.clientId)))
    .toSorted((a, b) => b.number.localeCompare(a.number))
}

export const getOrder = (s: Source, idOrNumber: string) =>
  s.data.orders.find(
    (order) => order.id === idOrNumber.toLowerCase() || order.number === idOrNumber.toUpperCase(),
  )

/** Each open status's count, and how many orders of it were placed on each of the last 7 days. */
export function orderStats(s: Source) {
  return Object.fromEntries(
    OPEN_STATUSES.map((status) => {
      const orders = s.data.orders.filter((order) => order.status === status)
      const trend = Array.from(
        { length: 7 },
        (_, index) => orders.filter((order) => order.placedAt.day === index - 6).length,
      )
      return [status, { count: orders.length, trend }]
    }),
  ) as Record<(typeof OPEN_STATUSES)[number], { count: number; trend: number[] }>
}

export function ordersByStatus(s: Source): Record<OrderStatus, Order[]> {
  const groups: Record<OrderStatus, Order[]> = {
    received: [],
    ready: [],
    'in-fulfilment': [],
    completed: [],
    cancelled: [],
  }
  for (const order of listOrders(s)) groups[order.status].push(order)
  return groups
}

export function createOrder(s: Source, input: NewOrder): Order {
  const highest = Math.max(...s.data.orders.map((order) => Number(order.number.slice(3))))
  const number = `OR-${highest + 1}`
  const placedAt = { day: 0, time: '12:00' }
  const order: Order = {
    id: number.toLowerCase(),
    number,
    clientId: input.clientId,
    source: 'manual',
    service: input.service,
    originId: input.originId,
    destination: input.destination,
    packages: [{ label: 'PKG-1', contents: 'General freight', weightKg: input.weightKg }],
    total: input.total,
    status: 'received',
    placedAt,
    events: [{ status: 'received', at: placedAt }],
    shipmentId: null,
  }
  s.data.orders.push(order)
  return order
}

export function cancelOrder(s: Source, idOrNumber: string): Order {
  const order = getOrder(s, idOrNumber)
  if (!order) throw new Error(`No order ${idOrNumber}`)
  if (order.status === 'completed' || order.status === 'cancelled') {
    throw new Error(`${order.number} is ${order.status} and cannot be cancelled`)
  }
  order.status = 'cancelled'
  order.events.push({ status: 'cancelled', at: { day: 0, time: '12:00' } })
  return order
}
