/** What a new or edited fleet record still needs before it can be saved. */
import type { ReadinessItem } from '@jovertical/mise-design-system'

import { readinessRow } from '#modules/core/data/shared.js'
import { type VehicleInput, vehicleSchema } from './schema.js'

export const vehicleReadiness = (values: VehicleInput): ReadinessItem[] => [
  readinessRow('code', 'Code', vehicleSchema.shape.code.safeParse(values.code).success),
  readinessRow('registration', 'Registration', values.registration.trim().length >= 4),
  readinessRow('home', 'Home site', values.homeLocationId !== ''),
]
