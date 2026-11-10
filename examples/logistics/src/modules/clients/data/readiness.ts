/** What a new or edited clients record still needs before it can be saved. */
import type { ReadinessItem } from '@jovertical/mise-design-system'

import { readinessRow } from '#modules/core/data/shared.js'
import { type ClientInput, clientSchema } from './schema.js'

export const clientReadiness = (values: ClientInput): ReadinessItem[] => [
  readinessRow('name', 'Named', values.name.trim().length >= 2),
  readinessRow(
    'contact',
    'Contact and email',
    values.contact.trim() !== '' && clientSchema.shape.email.safeParse(values.email).success,
  ),
  readinessRow('city', 'City', values.city.trim() !== ''),
  readinessRow('manager', 'Account manager', values.manager.trim() !== ''),
]
