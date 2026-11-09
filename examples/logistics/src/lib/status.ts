/**
 * Status is data; tone and label are presentation. One map per status, so
 * every badge, dot and column for a status agrees across screens.
 */
import type { Tone } from '@jovertical/mise-design-system'

import type { Client, OrderStatus, Product, ShipmentStatus, Vehicle } from './data/types.js'

type Look = { label: string; tone: Tone }

export const ORDER_STATUS: Record<OrderStatus, Look> = {
  received: { label: 'Received', tone: 'info' },
  ready: { label: 'Ready', tone: 'success' },
  'in-fulfilment': { label: 'In fulfilment', tone: 'warning' },
  completed: { label: 'Completed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'critical' },
}

export const SHIPMENT_STATUS: Record<ShipmentStatus, Look> = {
  scheduled: { label: 'Scheduled', tone: 'neutral' },
  'in-transit': { label: 'In transit', tone: 'info' },
  'out-for-delivery': { label: 'Out for delivery', tone: 'success' },
  delivered: { label: 'Delivered', tone: 'neutral' },
  delayed: { label: 'Delayed', tone: 'critical' },
}

export const VEHICLE_STATUS: Record<Vehicle['status'], Look> = {
  'on-route': { label: 'On route', tone: 'success' },
  loading: { label: 'Loading', tone: 'info' },
  idle: { label: 'Idle', tone: 'neutral' },
  workshop: { label: 'In workshop', tone: 'critical' },
}

export const CONDITION: Record<Vehicle['condition'], Look & { note: string }> = {
  excellent: { label: 'Excellent', tone: 'success', note: 'Serviced and road-ready' },
  good: { label: 'Good', tone: 'info', note: 'Minor wear logged' },
  'service-due': { label: 'Service due', tone: 'warning', note: 'Due within 30 days' },
  overdue: { label: 'Overdue', tone: 'critical', note: 'Service date passed' },
}

export const CLIENT_STATUS: Record<Client['status'], Look> = {
  active: { label: 'Active', tone: 'success' },
  paused: { label: 'Paused', tone: 'neutral' },
}

export const SOURCE_LABEL = { api: 'API', portal: 'Portal', csv: 'CSV', manual: 'Manual' } as const

export const SERVICE_LABEL = {
  regular: 'Regular',
  express: 'Express',
  'same-day': 'Same day',
} as const

export const CATEGORY_LABEL: Record<Product['category'], string> = {
  packaging: 'Packaging',
  pallets: 'Pallets',
  labels: 'Labels',
  'cold-chain': 'Cold chain',
  safety: 'Safety',
}
