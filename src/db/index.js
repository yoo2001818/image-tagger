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
  hasTimestamps: ['createdAt', 'updatedAt'],
  images() {
    return this.belongsToMany(Image).through(ImageTag, 'tagId', 'imageId');
  },
  imageTags() {
    return this.hasMany(ImageTag, 'tagId');
  },
  parents() {
    return this.belongsToMany(Tag, 'tags_children', 'childId', 'parentId');
  },
  children() {
    return this.belongsToMany(Tag, 'tags_children', 'parentId', 'childId');
  },
});

export const Image = bookshelf.Model.extend({
  tableName: 'images',
  hasTimestamps: ['createdAt', 'updatedAt'],
  tags() {
    return this.belongsToMany(Tag).through(ImageTag, 'imageId', 'tagId');
  },
  imageTags() {
    return this.hasMany(ImageTag, 'imageId');
  },
});

export const ImageTag = bookshelf.Model.extend({
  tableName: 'images_tags',
  tag() {
    return this.belongsTo(Tag, 'tagId');
  },
  image() {
    return this.belongsTo(Image, 'imageId');
  },
});
