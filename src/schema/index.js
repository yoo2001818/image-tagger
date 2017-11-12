import schema from 'normalizr';

export const tag = new schema.Entity('tags');
export const image = new schema.Entity('images', {
  imageTags: [ { tag } ],
});
