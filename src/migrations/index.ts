import * as migration_20260924_143320_initial from './20260924_143320_initial';
import * as migration_20260929_150731_drop_state_labels from './20260929_150731_drop_state_labels';
import * as migration_20261001_105107_add_about_photo_caption from './20261001_105107_add_about_photo_caption';

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
  {
    up: migration_20261001_105107_add_about_photo_caption.up,
    down: migration_20261001_105107_add_about_photo_caption.down,
    name: '20261001_105107_add_about_photo_caption'
  },
];
