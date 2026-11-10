/** What a new or edited orders record still needs before it can be saved. */
import type { ReadinessItem } from '@jovertical/mise-design-system'

import { readinessRow } from '../shared.js'
import type { OrderInput } from './schema.js'

export const orderReadiness = (values: OrderInput): ReadinessItem[] => [
  readinessRow('client', 'Client chosen', values.clientId !== ''),
  readinessRow(
    'route',
    'Origin and delivery address',
    values.originId !== '' && values.destination.trim().length >= 3,
  ),
  readinessRow(
    'packages',
    'At least one package with a weight',
    values.packages.some((pkg) => pkg.weightKg > 0),
  ),
  readinessRow('total', 'Total set', values.total > 0),
]
