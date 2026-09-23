import * as migration_20260923_111354_initial from './20260923_111354_initial';
import * as migration_20260923_120247_blob_object_key from './20260923_120247_blob_object_key';
import * as migration_20260923_122605_developer_credit from './20260923_122605_developer_credit';
import * as migration_20260923_125321_bookings_step1 from './20260923_125321_bookings_step1';
import * as migration_20260923_125328_booking_emails from './20260923_125328_booking_emails';

export const migrations = [
  {
    up: migration_20260923_111354_initial.up,
    down: migration_20260923_111354_initial.down,
    name: '20260923_111354_initial',
  },
  {
    up: migration_20260923_120247_blob_object_key.up,
    down: migration_20260923_120247_blob_object_key.down,
    name: '20260923_120247_blob_object_key',
  },
  {
    up: migration_20260923_122605_developer_credit.up,
    down: migration_20260923_122605_developer_credit.down,
    name: '20260923_122605_developer_credit',
  },
  {
    up: migration_20260923_125321_bookings_step1.up,
    down: migration_20260923_125321_bookings_step1.down,
    name: '20260923_125321_bookings_step1',
  },
  {
    up: migration_20260923_125328_booking_emails.up,
    down: migration_20260923_125328_booking_emails.down,
    name: '20260923_125328_booking_emails'
  },
];
