/** Every route the smoke run opens. A screen's task adds its routes here. */
export const ROUTES: string[] = [
  '/',
  '/orders',
  '/orders/OR-2041',
  '/shipments',
  '/fleet',
  '/products',
  '/warehouses',
  '/clients',
  '/settings/general',
]

/** Routes that must render ErrorState rather than a screen. */
export const NOT_FOUND_ROUTES: string[] = ['/orders/does-not-exist']
