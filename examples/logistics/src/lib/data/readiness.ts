/**
 * What each create or edit page still needs before it can be saved, as rows
 * for mise's ReadinessChecklist. Pure functions of the form's values, so the
 * aside updates as you type and the rows are tested without rendering.
 */
import type { ReadinessItem } from '@jovertical/mise-design-system'

import {
  type ClientInput,
  clientSchema,
  type OrderInput,
  type ProductInput,
  productSchema,
} from './schemas.js'

const row = (id: string, label: string, met: boolean): ReadinessItem => ({
  id,
  label,
  status: met ? 'met' : 'unmet',
})

export const orderReadiness = (values: OrderInput): ReadinessItem[] => [
  row('client', 'Client chosen', values.clientId !== ''),
  row(
    'route',
    'Origin and delivery address',
    values.originId !== '' && values.destination.trim().length >= 3,
  ),
  row(
    'packages',
    'At least one package with a weight',
    values.packages.some((pkg) => pkg.weightKg > 0),
  ),
  row('total', 'Total set', values.total > 0),
]

export const clientReadiness = (values: ClientInput): ReadinessItem[] => [
  row('name', 'Named', values.name.trim().length >= 2),
  row(
    'contact',
    'Contact and email',
    values.contact.trim() !== '' && clientSchema.shape.email.safeParse(values.email).success,
  ),
  row('city', 'City', values.city.trim() !== ''),
  row('manager', 'Account manager', values.manager.trim() !== ''),
]

export const productReadiness = (values: ProductInput): ReadinessItem[] => [
  row('name', 'Named', values.name.trim().length >= 2),
  row('sku', 'SKU', productSchema.shape.sku.safeParse(values.sku).success),
  row('unit', 'Unit', values.unit.trim() !== ''),
  row('price', 'Price set', values.price > 0),
]
