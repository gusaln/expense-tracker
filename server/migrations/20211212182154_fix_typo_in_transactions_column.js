/** @param {import('knex').Knex} knex */
exports.up = async (knex) => {
  await knex.schema.table('transactions', (table) => {
    table.renameColumn('transfered_to', 'transferred_to');

    table.foreign('transferred_to').references('id').inTable('accounts');
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async (knex) => {
  await knex.schema.table('transactions', (table) => {
    table.dropForeign('transferred_to');

    table.renameColumn('transferred_to', 'transfered_to');
  });
};
