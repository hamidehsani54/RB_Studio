import * as migration_20260923_111354_initial from './20260923_111354_initial';
import * as migration_20260923_120247_blob_object_key from './20260923_120247_blob_object_key';
import * as migration_20260923_122605_developer_credit from './20260923_122605_developer_credit';

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
    name: '20260923_122605_developer_credit'
  },
];
