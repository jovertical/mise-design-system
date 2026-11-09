/** Every route the smoke run opens. A screen's task adds its routes here. */
export const ROUTES: string[] = [
  '/',
  '/orders',
  '/orders/OR-2041',
  '/orders?view=board',
  '/shipments',
  '/shipments/SHP-3006',
  '/fleet',
  '/fleet/TRK-212',
  '/products',
  '/products/PK-0422',
  '/warehouses',
  '/warehouses/loc-riverside',
  '/clients',
  '/clients/cli-coastal-grocers',
  '/settings/general',
]

/** Routes that must render ErrorState rather than a screen. */
export const NOT_FOUND_ROUTES: string[] = ['/orders/does-not-exist']
