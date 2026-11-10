/** How the shipments module's statuses and labels show: one map each, so every screen agrees. */
import type { Look } from '#modules/core/utils/look.js'
import type { ShipmentStatus } from '#modules/shipments/data/types.js'

export const SHIPMENT_STATUS: Record<ShipmentStatus, Look> = {
  scheduled: { label: 'Scheduled', tone: 'neutral' },
  'in-transit': { label: 'In transit', tone: 'info' },
  'out-for-delivery': { label: 'Out for delivery', tone: 'success' },
  delivered: { label: 'Delivered', tone: 'neutral' },
  delayed: { label: 'Delayed', tone: 'critical' },
}
