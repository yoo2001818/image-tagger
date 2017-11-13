import { schema } from 'normalizr';

export const tag = new schema.Entity('tag');
export const image = new schema.Entity('image', {
  imageTags: [ { tag } ],
});
