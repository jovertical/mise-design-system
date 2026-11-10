/** What a new or edited shipments record still needs before it can be saved. */
import type { ReadinessItem } from '@jovertical/mise-design-system'

import { readinessRow } from '../shared.js'
import type { ShipmentInput } from './schema.js'

export const shipmentReadiness = (values: ShipmentInput): ReadinessItem[] => [
  readinessRow('origin', 'Origin', values.originId !== ''),
  readinessRow('vehicle', 'Vehicle', values.vehicleId !== ''),
  readinessRow('driver', 'Driver', values.driverId !== ''),
  readinessRow('orders', 'At least one order', values.orderIds.length > 0),
]
