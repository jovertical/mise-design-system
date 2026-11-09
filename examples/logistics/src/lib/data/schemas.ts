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
  total: cents,
})

/** What the order form edits: everything about an order its customer decides. */
export type OrderInput = z.infer<typeof orderSchema>

export const productPatchSchema = z.object({
  price: cents,
  reorderPoint: z.number().int().min(0, 'Cannot be negative'),
})

export const newClientSchema = z.object({
  name: z.string().trim().min(2, 'Name the client'),
  industry: z.string().trim().min(1, 'Enter an industry'),
  contact: z.string().trim().min(1, 'Name a contact'),
  email: z.email('Enter an email address'),
  city: z.string().trim().min(1, 'Enter a city'),
})

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
