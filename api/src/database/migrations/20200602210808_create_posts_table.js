exports.up = function (knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments();
    table.integer('user_id').references('id').inTable('users');
    table.integer('community_id').references('id').inTable('communities');
    table.text('title').notNullable();
    table.text('text');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('posts');
};
