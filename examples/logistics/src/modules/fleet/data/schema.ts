/** What a form may submit and a write function may accept, for fleet: one schema for both. */
import { z } from 'zod'

export const vehicleSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^(VAN|TRK)-\d{3}$/, 'Like VAN-030 or TRK-216'),
  registration: z.string().trim().min(4, 'Enter the registration'),
  type: z.enum(['van', 'truck']),
  homeLocationId: z.string().min(1, 'Choose a home site'),
  driverId: z.string().nullable(),
  mileageKm: z.number().int('Whole kilometres only').min(0, 'Cannot be negative'),
  /** Days from DEMO_TODAY, as the data keeps every date. */
  nextServiceDay: z.number().int(),
  condition: z.enum(['excellent', 'good', 'service-due', 'overdue']),
})

/** What the vehicle form edits; status is operational and moves on its own. */
export type VehicleInput = z.infer<typeof vehicleSchema>
