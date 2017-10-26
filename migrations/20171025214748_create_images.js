exports.up = async knex => {
  await knex.schema.createTable('images', table => {
    table.increments('id').primary();
    table.integer('random_id').index();
    table.string('path').unique();
    table.boolean('is_processed').index();
    table.boolean('is_ignored').index();
    table.timestamps();
  });
  await knex.schema.createTable('images_tags', table => {
    table.increments('id').primary();
    table.string('image_id').index().references('images.id')
      .onDelete('cascade').onUpdate('cascade');
    table.string('tag_id').index().references('tags.id')
      .onDelete('cascade').onUpdate('cascade');
    table.integer('min_x');
    table.integer('min_y');
    table.integer('max_x');
    table.integer('max_y');
    table.index(['image_id', 'tag_id']);
    table.index(['tag_id', 'image_id']);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('images')
    .dropTable('images_tags');
};
