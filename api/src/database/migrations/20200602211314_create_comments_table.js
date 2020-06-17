
exports.up = function(knex) {
  return knex.schema.createTable('comments', table => {
    table.increments();
    table.integer('parent_id').references('id').inTable('comments');
    table.integer('post_id').references('id').inTable('posts');
    table.integer('user_id').references('id').inTable('users');
    table.string('text');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments');
};
