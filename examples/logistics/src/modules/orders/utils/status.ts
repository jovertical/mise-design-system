/** How the orders module's statuses and labels show: one map each, so every screen agrees. */
import type { Look } from '#modules/core/utils/look.js'
import type { OrderStatus } from '#modules/orders/data/types.js'

export const ORDER_STATUS: Record<OrderStatus, Look> = {
  received: { label: 'Received', tone: 'info' },
  ready: { label: 'Ready', tone: 'success' },
  'in-fulfilment': { label: 'In fulfilment', tone: 'warning' },
  completed: { label: 'Completed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'critical' },
}

export const SOURCE_LABEL = { api: 'API', portal: 'Portal', csv: 'CSV', manual: 'Manual' } as const

export const SERVICE_LABEL = {
  regular: 'Regular',
  express: 'Express',
  'same-day': 'Same day',
} as const
