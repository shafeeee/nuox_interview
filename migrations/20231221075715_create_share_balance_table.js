// ./migrations/[timestamp]_create_share_balance_table.js
exports.up = function (knex) {
  return knex.schema.createTable("share_balance", function (table) {
    table.increments("id").primary();
    table
      .integer("shareholder_id")
      .unsigned()
      .references("id")
      .inTable("shareholder");
    table
      .integer("share_id")
      .unsigned()
      .references("id")
      .inTable("share_details");
    table.decimal("due_amount");
    table.decimal("paid_amount");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("share_balance");
};
