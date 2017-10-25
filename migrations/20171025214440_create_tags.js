exports.up = async knex => {
  await knex.schema.createTable('tags', table => {
    table.increments('id').primary();
    table.string('name').index();
    table.string('color').index();
    table.boolean('is_global').index();
  });
  await knex.schema.createTable('tags_children', table => {
    table.string('parent_id').index().references('tags.id')
      .onDelete('cascade').onUpdate('cascade');
    table.string('child_id').index().references('tags.id')
      .onDelete('cascade').onUpdate('cascade');
    table.primary(['parent_id', 'child_id']);
    table.index(['child_id', 'parent_id']);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('tags')
    .dropTable('tags_children');
};
