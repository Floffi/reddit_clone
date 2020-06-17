
exports.up = function(knex) {
  return knex.schema.createTable('post_votes', table => {
    table.primary(['user_id', 'post_id']);
    table.integer('user_id').references('id').inTable('users');
    table.integer('post_id').references('id').inTable('posts');
    table.boolean('direction').notNullable();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('post_votes');
};
