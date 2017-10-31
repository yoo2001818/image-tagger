exports.up = async knex => {
  await knex.schema.createTable('tags', table => {
    table.increments('id').primary();
    table.string('name').index().required();
    table.string('color').index();
    table.boolean('isGlobal').index();
    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.dateTime('updatedAt').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('tags_children', table => {
    table.string('parentId').index().references('tags.id')
      .onDelete('cascade').onUpdate('cascade');
    table.string('childId').index().references('tags.id')
      .onDelete('cascade').onUpdate('cascade');
    table.primary(['parentId', 'childId']);
    table.index(['childId', 'parentId']);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('tags')
    .dropTable('tags_children');
};
