
exports.up = function(knex) {
  return knex.schema.createTable('comment_votes', table => {
    table.primary(['user_id', 'comment_id']);
    table.integer('user_id').references('id').inTable('users');
    table.integer('comment_id').references('id').inTable('comments');
    table.boolean('direction').notNullable();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comment_votes');
};
