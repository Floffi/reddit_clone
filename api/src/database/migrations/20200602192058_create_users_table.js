
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.integer('token_version').defaultTo(0);
    table.boolean('activated').defaultTo(false);
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
