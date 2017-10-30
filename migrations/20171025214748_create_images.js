exports.up = async knex => {
  await knex.schema.createTable('images', table => {
    table.increments('id').primary();
    table.integer('randomId').index();
    table.string('path').unique();
    table.boolean('isProcessed').index();
    table.boolean('isIgnored').index();
    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.dateTime('updatedAt').defaultTo(knex.fn.now());
    table.index(['isProcessed', 'randomId']);
  });
  await knex.schema.createTable('images_tags', table => {
    table.increments('id').primary();
    table.string('imageId').index().references('images.id')
      .onDelete('cascade').onUpdate('cascade');
    table.string('tagId').index().references('tags.id')
      .onDelete('cascade').onUpdate('cascade');
    table.integer('minX');
    table.integer('minY');
    table.integer('maxX');
    table.integer('maxY');
    table.index(['imageId', 'tagId']);
    table.index(['tagId', 'imageId']);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('images')
    .dropTable('images_tags');
};
