/** The settings module's entities. */
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
