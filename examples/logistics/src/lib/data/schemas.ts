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

export const newOrderSchema = z.object({
  clientId: z.string().min(1, 'Choose a client'),
  service: z.enum(['regular', 'express', 'same-day']),
  originId: z.string().min(1, 'Choose where it ships from'),
  destination: z.string().trim().min(3, 'Enter the delivery address'),
  weightKg: z.number().positive('Enter a weight'),
  total: cents,
})

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

export const settingsSchema = z.object({
  companyName: z.string().trim().min(2, 'Enter the company name'),
  timezone: z.enum(TIMEZONES),
  units: z.enum(['metric', 'imperial']),
  deliveryConfirmations: z.boolean(),
  proofOfDelivery: z.boolean(),
})
