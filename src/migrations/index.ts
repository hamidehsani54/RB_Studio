import * as migration_20260923_111354_initial from './20260923_111354_initial';

export const migrations = [
  {
    up: migration_20260923_111354_initial.up,
    down: migration_20260923_111354_initial.down,
    name: '20260923_111354_initial'
  },
];
