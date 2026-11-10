/** What a new or edited warehouses record still needs before it can be saved. */
import type { ReadinessItem } from '@jovertical/mise-design-system'

import { readinessRow } from '#modules/core/data/shared.js'
import type { SiteInput } from './schema.js'

export const siteReadiness = (values: SiteInput): ReadinessItem[] => [
  readinessRow('name', 'Named', values.name.trim().length >= 2),
  readinessRow('manager', 'Manager', values.manager.trim() !== ''),
  readinessRow('capacity', 'Capacity and docks', values.capacityUnits > 0 && values.docks > 0),
  readinessRow(
    'zones',
    'At least one zone',
    values.zones.some((zone) => zone.name.trim() !== '' && zone.capacity > 0),
  ),
]
