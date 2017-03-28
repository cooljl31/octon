exports.up = function up(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.bigincrements('id').primary();
      table.string('avatar').notNullable();
      table.string('email').unique().notNullable();
      table.boolean('dailyNotification').defaultTo(true).notNullable();
      table.boolean('weeklyNotification').defaultTo(false).notNullable();
      table.integer('githubId').notNullable();
      table.string('githubUsername').notNullable();
      table.string('githubAccessToken').notNullable();
      table.dateTime('createdAt').notNullable();
      table.dateTime('updatedAt').notNullable();
    })
    .createTable('repositories', (table) => {
      table.bigincrements('id').primary();
      table.string('refId').notNullable();
      table.string('name').notNullable();
      table.string('avatar').notNullable();
      table.string('htmlUrl').notNullable();
      table.string('type').notNullable();
      table.dateTime('createdAt').notNullable();
      table.dateTime('updatedAt').notNullable();
    })
    .createTable('releases', (table) => {
      table.bigincrements('id').primary();
      table.string('refId').notNullable();
      table.string('name').notNullable();
      table.string('htmlUrl').notNullable();
      table.string('type').notNullable();
      table.bigInteger('repositoryId')
        .notNullable()
        .references('repositories.id');
      table.dateTime('publishedAt').notNullable();
      table.dateTime('createdAt').notNullable();
      table.dateTime('updatedAt').notNullable();
    })
    .createTable('user_repository', (table) => {
      table.bigincrements('id').primary();
      table.bigInteger('userId').notNullable();
      table.bigInteger('repositoryId').notNullable();
      table.dateTime('createdAt').notNullable();
      table.dateTime('updatedAt').notNullable();
    });
};

exports.down = function down(knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('releases')
    .dropTableIfExists('repositories')
    .dropTableIfExists('user_repository');
};
