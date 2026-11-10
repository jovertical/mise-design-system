/** What a form may submit and a write function may accept, for shipments: one schema for both. */
import { z } from 'zod'

export const shipmentSchema = z.object({
  originId: z.string().min(1, 'Choose an origin'),
  vehicleId: z.string().min(1, 'Choose a vehicle'),
  driverId: z.string().min(1, 'Choose a driver'),
  orderIds: z.array(z.string()).min(1, 'Choose at least one order'),
})

/** What the run planner edits; the stops follow from the orders. */
export type ShipmentInput = z.infer<typeof shipmentSchema>
