/** Every route the smoke run opens. A screen's task adds its routes here. */
export const ROUTES: string[] = [
  '/',
  '/orders',
  '/orders/OR-2041',
  '/orders/new',
  '/orders/OR-2041/edit',
  '/orders?view=board',
  '/shipments',
  '/shipments/SHP-3006',
  '/shipments/new',
  '/shipments/SHP-3015/edit',
  '/fleet',
  '/fleet/TRK-212',
  '/fleet/new',
  '/fleet/TRK-212/edit',
  '/products',
  '/products/PK-0422',
  '/products/new',
  '/products/PK-0422/edit',
  '/warehouses',
  '/warehouses/loc-riverside',
  '/warehouses/new',
  '/warehouses/loc-riverside/edit',
  '/clients',
  '/clients/cli-coastal-grocers',
  '/clients/new',
  '/clients/cli-coastal-grocers/edit',
  '/settings/general',
]

/** Routes that must render ErrorState rather than a screen. */
export const NOT_FOUND_ROUTES: string[] = ['/orders/does-not-exist', '/orders/does-not-exist/edit']
