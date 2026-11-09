/**
 * Sixty orders over the last two weeks. The rows are hand-written; the status
 * plan and the event history are derived from them so every order's history
 * walks forward to its status. Index ranges, oldest first:
 *   0–19 completed (carried by the delivered shipments), 20 cancelled,
 *   21–38 in fulfilment (carried by the active shipments), 39–52 ready,
 *   53 cancelled, 54–59 received.
 * OR-2041 (index 40) is the wireframe's detail page: ready, Bloom & Stem.
 */
import type { DemoTime, Order, OrderEvent, OrderStatus } from '../types.js'
import { CLIENTS } from './clients.js'

const ORIGINS = ['loc-riverside', 'loc-harbour', 'loc-north', 'loc-market'] as const

const DESTINATIONS = [
  '501 7th Ave',
  '199 Water St',
  '240 Kent Ave',
  '850 3rd Ave',
  '47 Elm St',
  '104 Roosevelt Ave',
  '1930 Grand Concourse',
  '95 Columbus Dr',
  '221 Washington St',
  '60 Park Pl',
  '9 Quay Rd',
  '18 Mill Ln',
  '312 Orchard St',
  '77 Canal St',
  '5401 5th Ave',
  '1200 Harbor Blvd',
  '33 Birch Ct',
  '410 Lakeview Rd',
  '72 Station Sq',
  '146 Pine Ave',
]

const CONTENTS = [
  'Dry goods',
  'Cut flowers',
  'Hand tools',
  'Baked goods',
  'Home textiles',
  'Paper stock',
  'Pharmacy items',
  'Apparel',
  'Seed bags',
  'Bike parts',
  'Books',
  'Chilled seafood',
  'Pet food',
  'Fixings',
]

const SERVICES: Order['service'][] = ['regular', 'express', 'regular', 'same-day', 'express']
const SOURCES: Order['source'][] = ['api', 'portal', 'csv', 'manual', 'api', 'portal']

function statusOf(index: number): OrderStatus {
  if (index <= 19) return 'completed'
  if (index === 20 || index === 53) return 'cancelled'
  if (index <= 38) return 'in-fulfilment'
  if (index <= 52) return 'ready'
  return 'received'
}

/** Day -14 for the oldest order; the six received orders all came in today. */
const placedDay = (index: number) => (index >= 54 ? 0 : -14 + Math.floor((index * 13) / 53))
const clock = (index: number) =>
  `${String(8 + (index % 9)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`

const FLOW: OrderStatus[] = ['received', 'ready', 'in-fulfilment', 'completed']

/**
 * Days after placing that each step happens: ready next day, out the day
 * after, delivered four to eight days in, so completions spread over the last
 * two weeks and both weeks of the delivery trend have something in them.
 */
const STEP_DAYS: Record<OrderStatus, (index: number) => number> = {
  received: () => 0,
  ready: () => 1,
  'in-fulfilment': () => 2,
  completed: (index) => 4 + (index % 5),
  cancelled: () => 1,
}

function eventsFor(status: OrderStatus, placedAt: DemoTime, index: number): OrderEvent[] {
  const steps: OrderStatus[] =
    status === 'cancelled' ? ['received', 'cancelled'] : FLOW.slice(0, FLOW.indexOf(status) + 1)
  return steps.map((step, offset) => ({
    status: step,
    at: {
      day: Math.min(placedAt.day + STEP_DAYS[step](index), 0),
      time: offset === 0 ? placedAt.time : '15:00',
    },
  }))
}

/** Index ranges to shipment ids, matching shipments.ts. */
function shipmentOf(index: number): string | null {
  if (index <= 19) return `shp-${3001 + Math.floor(index / 4)}`
  const active: Record<number, number> = {
    21: 3006,
    22: 3006,
    23: 3007,
    24: 3007,
    25: 3008,
    26: 3008,
    27: 3009,
    28: 3009,
    29: 3010,
    30: 3010,
    31: 3011,
    32: 3012,
    33: 3013,
    34: 3014,
    35: 3015,
    36: 3016,
    37: 3017,
    38: 3018,
  }
  return active[index] ? `shp-${active[index]}` : null
}

function build(index: number): Order {
  const number = `OR-${2001 + index}`
  const status = statusOf(index)
  const placedAt: DemoTime = { day: placedDay(index), time: clock(index) }
  const client = CLIENTS[index % CLIENTS.length]
  const packageCount = 1 + (index % 4)
  const packages = Array.from({ length: packageCount }, (_, n) => ({
    label: `PKG-${n + 1}`,
    contents: CONTENTS[(index + n) % CONTENTS.length],
    weightKg: 12 + ((index * 7 + n * 13) % 90),
  }))
  return {
    id: number.toLowerCase(),
    number,
    clientId: client.id,
    source: SOURCES[index % SOURCES.length],
    service: SERVICES[index % SERVICES.length],
    originId: ORIGINS[index % ORIGINS.length],
    destination: DESTINATIONS[index % DESTINATIONS.length],
    packages,
    total: 2800 + ((index * 1733) % 11200),
    status,
    placedAt,
    events: eventsFor(status, placedAt, index),
    shipmentId: shipmentOf(index),
  }
}

const orders = Array.from({ length: 60 }, (_, index) => build(index))

const bloom = CLIENTS.find((client) => client.name === 'Bloom & Stem')
orders[40] = {
  ...orders[40],
  clientId: bloom?.id ?? orders[40].clientId,
  service: 'express',
  originId: 'loc-harbour',
  destination: '199 Water St',
  packages: [
    { label: 'PKG-1', contents: 'Cut flowers ×20', weightKg: 15 },
    { label: 'PKG-2', contents: 'Planters ×4', weightKg: 32 },
  ],
  total: 8100,
}

export const ORDERS: Order[] = orders
