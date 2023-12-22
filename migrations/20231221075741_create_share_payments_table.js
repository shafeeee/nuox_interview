// ./migrations/[timestamp]_create_share_payments_table.js
exports.up = function (knex) {
  return knex.schema.createTable("share_payments", function (table) {
    table.increments("id").primary();
    table
      .integer("share_id")
      .unsigned()
      .references("id")
      .inTable("share_details");
    table.date("payment_date");
    table.decimal("amount");
    table.date("paid_date").nullable(); 
    table.boolean("status").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("share_payments");
};
