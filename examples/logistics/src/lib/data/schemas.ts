/**
 * What a form may submit and a write function may accept: one schema for
 * both, so the browser and the store reject the same input.
 */
import { z } from 'zod'

const cents = z.number().int('Whole cents only').min(0, 'Cannot be negative')

export const TIMEZONES = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Singapore',
  'Australia/Sydney',
] as const

export const orderSchema = z.object({
  clientId: z.string().min(1, 'Choose a client'),
  service: z.enum(['regular', 'express', 'same-day']),
  originId: z.string().min(1, 'Choose where it ships from'),
  destination: z.string().trim().min(3, 'Enter the delivery address'),
  packages: z
    .array(
      z.object({
        contents: z.string().trim().min(1, 'Say what is in it'),
        weightKg: z.number().positive('Enter a weight'),
      }),
    )
    .min(1, 'Add a package'),
  total: cents.min(1, 'Enter the order total'),
})

/** What the order form edits: everything about an order its customer decides. */
export type OrderInput = z.infer<typeof orderSchema>

const sku = z
  .string()
  .trim()
  .min(3, 'Enter a SKU')
  .regex(/^[A-Z0-9-]+$/, 'Capitals, digits and dashes only')

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Name the product'),
  sku,
  category: z.enum(['packaging', 'pallets', 'labels', 'cold-chain', 'safety']),
  unit: z.string().trim().min(1, 'Enter a unit'),
  price: cents.min(1, 'Enter a price'),
  reorderPoint: z.number().int('Whole units only').min(0, 'Cannot be negative'),
  /** On hand per site when the product is created; an edit leaves stock to adjustments. */
  openingStock: z.array(
    z.object({
      locationId: z.string(),
      onHand: z.number().int('Whole units only').min(0, 'Cannot be negative'),
    }),
  ),
})

/** What the product form edits. */
export type ProductInput = z.infer<typeof productSchema>

export const clientSchema = z.object({
  name: z.string().trim().min(2, 'Name the client'),
  industry: z.string().trim().min(1, 'Enter an industry'),
  city: z.string().trim().min(1, 'Enter a city'),
  contact: z.string().trim().min(1, 'Name a contact'),
  email: z.email('Enter an email address'),
  manager: z.string().trim().min(1, 'Name the account manager'),
  status: z.enum(['active', 'paused']),
})

/** What the client form edits: everything but the id and the lifetime value. */
export type ClientInput = z.infer<typeof clientSchema>

const prefix = z
  .string()
  .trim()
  .min(1, 'Enter a prefix')
  .max(8, 'Eight characters at most')
  .regex(/^[A-Z0-9-]+$/, 'Capitals, digits and dashes only')

export const settingsSchema = z.object({
  companyName: z.string().trim().min(2, 'Enter the company name'),
  legalName: z.string().trim().min(2, 'Enter the registered name'),
  taxId: z.string().trim().min(1, 'Enter the tax ID'),
  supportEmail: z.email('Enter an email address'),
  phone: z.string().trim(),
  website: z.union([z.literal(''), z.url('Enter a full address, with https://')]),
  address: z.object({
    line1: z.string().trim().min(1, 'Enter the street address'),
    line2: z.string().trim(),
    city: z.string().trim().min(1, 'Enter the city'),
    region: z.string().trim(),
    postalCode: z.string().trim(),
  }),
  logo: z.string().nullable(),
  timezone: z.enum(TIMEZONES),
  language: z.enum(['en-US', 'en-GB', 'es', 'fr']),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
  timeFormat: z.enum(['12h', '24h']),
  units: z.enum(['metric', 'imperial']),
  dimensionUnit: z.enum(['cm', 'in']),
  orderPrefix: prefix,
  shipmentPrefix: prefix,
  invoicePrefix: prefix,
  deliveryConfirmations: z.boolean(),
  proofOfDelivery: z.boolean(),
})

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

export const siteSchema = z.object({
  name: z.string().trim().min(2, 'Name the site'),
  city: z.string().trim().min(1, 'Enter a city'),
  manager: z.string().trim().min(1, 'Name the manager'),
  capacityUnits: z.number().int('Whole units only').positive('Enter the capacity'),
  docks: z.number().int('Whole docks only').min(1, 'At least one dock'),
  zones: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Name the zone'),
        capacity: z.number().int('Whole units only').positive('Enter a capacity'),
      }),
    )
    .min(1, 'Add a zone'),
})

/** What the site form edits; what each zone holds moves with stock, not here. */
export type SiteInput = z.infer<typeof siteSchema>
