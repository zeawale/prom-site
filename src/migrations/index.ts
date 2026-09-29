import * as migration_20260924_143320_initial from './20260924_143320_initial'
import * as migration_20260929_150731_drop_state_labels from './20260929_150731_drop_state_labels'

export const migrations = [
  {
    up: migration_20260924_143320_initial.up,
    down: migration_20260924_143320_initial.down,
    name: '20260924_143320_initial',
  },
  {
    up: migration_20260929_150731_drop_state_labels.up,
    down: migration_20260929_150731_drop_state_labels.down,
    name: '20260929_150731_drop_state_labels',
  },
]
