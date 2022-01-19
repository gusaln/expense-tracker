/** @param {import('knex').Knex} knex */
exports.up = async (knex) => {
  await knex.schema.dropTableIfExists("recurrent_transaction_definitions");

  await knex.schema.createTable("recurrent_transaction_definitions", (table) => {
    table.bigIncrements("id");
    table.string("name", 256).notNullable();
    // table.string("transaction_name_template", 256).notNullable();
    table.bigInteger("base_transaction_id").unsigned().notNullable();
    table.timestamp("last_transaction_date").nullable();
    table.timestamp("finished_at").nullable();
    table.string("recur_freq", 8).notNullable();
    table.integer("recur_interval", 2).unsigned().notNullable();
    table.string("recur_wkst", 2).nullable();
    table.string("recur_bymonth", 28).nullable();
    // does not allow the full range of values
    table.string("recur_byweekno", 128).nullable();
    // does not allow the full range of values
    table.string("recur_byyearday", 128).nullable();
    table.string("recur_bymonthday", 103).nullable();
    table.string("recur_byday", 128).nullable();
    table.string("recur_byhour", 61).nullable();
    table.string("recur_byminute", 169).nullable();
    table.string("recur_bysecond", 172).nullable();
    table.string("recur_bysetpos", 128).nullable();
    table.timestamp("recur_until").nullable();
    table.integer("recur_count", 2).unsigned().nullable();
    table.timestamps(false, true);

    table.foreign("base_transaction_id").references("id").inTable("transactions");
  });

  await knex.schema.table("transactions", (table) => {
    table.bigInteger("recurrence_id").unsigned().nullable().after("type");

    table.foreign("recurrence_id").references("id").inTable("recurrent_transaction_definitions");
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("recurrent_transaction_definitions");

  await knex.schema.table("transactions", (table) => {
    table.dropForeign("recurrence_id");
    table.dropColumn("recurrence_id");
  });
};
