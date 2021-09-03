/** @param {import('knex').Knex} knex */
exports.up = async (knex) => {
  if (!(await knex.schema.hasTable('accounts'))) {
    await knex.schema.createTable('accounts', (table) => {
      table.bigIncrements('id');
      table.string('name', 255).notNullable();
      table.string('icon', 50).notNullable();
      table.string('color', 7).notNullable();
      table.string('currency', 3).notNullable();
      table.decimal('current_balance', 8, 2).notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable('categories'))) {
    await knex.schema.createTable('categories', (table) => {
      table.bigIncrements('id');
      table.string('name', 255).notNullable();
      table.string('icon', 50).notNullable();
      table.string('color', 7).notNullable();
      table.boolean('for_expenses').notNullable();
    });
  }

  if (!(await knex.schema.hasTable('transactions'))) {
    await knex.schema.createTable('transactions', (table) => {
      table.bigIncrements('id');
      table.string('type', 8).notNullable();
      table.bigInteger('account_id').unsigned().notNullable();
      table.bigInteger('category_id').unsigned().nullable();
      table.string('description', 255).notNullable();
      table.decimal('amount', 8, 2).notNullable();
      table.bigInteger('transfered_to').unsigned().nullable();
      table.dateTime('date').notNullable();
      table.timestamps(false, true);

      table.foreign('account_id').references('id').inTable('accounts');
      table.foreign('category_id').references('id').inTable('categories');
    });
  }
};

/** @param {import('knex').Knex} knex */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('accounts');
};
