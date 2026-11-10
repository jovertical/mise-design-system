import type { Driver } from '#modules/fleet/data/types.js'

type Row = [
  id: string,
  name: string,
  phone: string,
  vehicleId: string | null,
  licence: number,
  availability: Driver['availability'],
]

const ROWS: Row[] = [
  ['drv-reyes', 'M. Reyes', '555-0141', 'veh-van-014', 410, 'on-shift'],
  ['drv-cole', 'A. Cole', '555-0187', 'veh-trk-208', 96, 'on-shift'],
  ['drv-ibrahim', 'H. Ibrahim', '555-0122', 'veh-van-016', 220, 'on-shift'],
  ['drv-park', 'J. Park', '555-0164', 'veh-van-018', 18, 'on-shift'],
  ['drv-santos', 'R. Santos', '555-0109', 'veh-trk-210', 530, 'on-shift'],
  ['drv-walsh', 'E. Walsh', '555-0173', 'veh-van-020', 300, 'on-shift'],
  ['drv-nguyen', 'T. Nguyen', '555-0158', 'veh-trk-212', 145, 'on-shift'],
  ['drv-fischer', 'K. Fischer', '555-0136', 'veh-van-024', 640, 'on-shift'],
  ['drv-adeyemi', 'B. Adeyemi', '555-0195', null, 12, 'leave'],
  ['drv-lopez', 'C. Lopez', '555-0116', null, 380, 'off'],
]

export const DRIVERS: Driver[] = ROWS.map(
  ([id, name, phone, vehicleId, licence, availability]) => ({
    id,
    name,
    phone,
    vehicleId,
    licenceExpiryDay: licence,
    availability,
  }),
)
