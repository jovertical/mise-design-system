/** The demo's entities. Money is integer cents; dates are offsets from DEMO_TODAY. */
export type Id = string
export type Cents = number
/** Days relative to DEMO_TODAY, plus a clock time: { day: -2, time: '09:30' }. */
export type DemoTime = { day: number; time: string }

export type Location = {
  id: Id
  name: string
  city: string
  manager: string
  capacityUnits: number
  docks: number
  zones: { name: string; used: number; capacity: number }[]
}

export type VehicleStatus = 'on-route' | 'loading' | 'idle' | 'workshop'
export type Vehicle = {
  id: Id
  code: string
  registration: string
  type: 'van' | 'truck'
  homeLocationId: Id
  driverId: Id | null
  status: VehicleStatus
  mileageKm: number
  nextServiceDay: number
  condition: 'excellent' | 'good' | 'service-due' | 'overdue'
}

export type Driver = {
  id: Id
  name: string
  phone: string
  vehicleId: Id | null
  licenceExpiryDay: number
  availability: 'on-shift' | 'off' | 'leave'
}

export type Client = {
  id: Id
  name: string
  industry: string
  contact: string
  email: string
  city: string
  manager: string
  status: 'active' | 'paused'
  lifetimeValue: Cents
}

export type Product = {
  id: Id
  sku: string
  name: string
  category: 'packaging' | 'pallets' | 'labels' | 'cold-chain' | 'safety'
  unit: string
  price: Cents
  reorderPoint: number
  stock: { locationId: Id; onHand: number; reserved: number }[]
}

export type OrderStatus = 'received' | 'ready' | 'in-fulfilment' | 'completed' | 'cancelled'
export type OrderEvent = { status: OrderStatus; at: DemoTime; note?: string }
export type Order = {
  id: Id
  number: string
  clientId: Id
  source: 'api' | 'portal' | 'csv' | 'manual'
  service: 'regular' | 'express' | 'same-day'
  originId: Id
  destination: string
  packages: { label: string; contents: string; weightKg: number }[]
  total: Cents
  status: OrderStatus
  placedAt: DemoTime
  events: OrderEvent[]
  shipmentId: Id | null
}

export type ShipmentStatus =
  | 'scheduled'
  | 'in-transit'
  | 'out-for-delivery'
  | 'delivered'
  | 'delayed'
export type Stop = { address: string; eta: DemoTime; deliveredAt: DemoTime | null }
export type Shipment = {
  id: Id
  number: string
  vehicleId: Id
  driverId: Id
  originId: Id
  orderIds: Id[]
  stops: Stop[]
  status: ShipmentStatus
}

export type Settings = {
  companyName: string
  legalName: string
  taxId: string
  supportEmail: string
  phone: string
  website: string
  address: { line1: string; line2: string; city: string; region: string; postalCode: string }
  /** A data URL: the demo has no media service, so the logo lives with the settings. */
  logo: string | null
  timezone: string
  language: 'en-US' | 'en-GB' | 'es' | 'fr'
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
  units: 'metric' | 'imperial'
  dimensionUnit: 'cm' | 'in'
  orderPrefix: string
  shipmentPrefix: string
  invoicePrefix: string
  deliveryConfirmations: boolean
  proofOfDelivery: boolean
}

export type Dataset = {
  locations: Location[]
  vehicles: Vehicle[]
  drivers: Driver[]
  clients: Client[]
  products: Product[]
  orders: Order[]
  shipments: Shipment[]
  settings: Settings
}
