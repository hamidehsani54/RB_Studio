import * as migration_20260923_111354_initial from './20260923_111354_initial';
import * as migration_20260923_120247_blob_object_key from './20260923_120247_blob_object_key';

export const migrations = [
  {
    up: migration_20260923_111354_initial.up,
    down: migration_20260923_111354_initial.down,
    name: '20260923_111354_initial',
  },
  {
    up: migration_20260923_120247_blob_object_key.up,
    down: migration_20260923_120247_blob_object_key.down,
    name: '20260923_120247_blob_object_key'
  },
];
