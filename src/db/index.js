import Knex from 'knex';
import Bookshelf from 'bookshelf';

import * as dbConfig from '../../config/db';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_STAGING = process.env.NODE_ENV === 'staging';
const DB_TYPE = IS_PRODUCTION ? 'production'
  : (IS_STAGING ? 'staging' : 'development');

export const knex = Knex(dbConfig[DB_TYPE]);
export const bookshelf = Bookshelf(knex);
bookshelf.plugin('pagination');

export const Tag = bookshelf.Model.extend({
  tableName: 'tags',
  hasTimestamps: true,
  images() {
    return this.belongsToMany(Image).through(ImageTag);
  },
  imageTags() {
    return this.hasMany(ImageTag);
  },
  parents() {
    return this.belongsToMany(Tag, 'tags_children', 'child_id', 'parent_id');
  },
  children() {
    return this.belongsToMany(Tag, 'tags_children', 'parent_id', 'child_id');
  },
});

export const Image = bookshelf.Model.extend({
  tableName: 'images',
  hasTimestamps: true,
  tags() {
    return this.belongsToMany(Tag).through(ImageTag);
  },
  imageTags() {
    return this.hasMany(ImageTag);
  },
});

export const ImageTag = bookshelf.Model.extend({
  tableName: 'images_tags',
  tag() {
    return this.belongsTo(Tag);
  },
  image() {
    return this.belongsTo(Image);
  },
});
