// ./migrations/[timestamp]_create_share_details_table.js
exports.up = function (knex) {
  return knex.schema.createTable("share_details", function (table) {
    table.increments("id").primary();
    table
      .integer("shareholder_id")
      .unsigned()
      .references("id")
      .inTable("shareholder");
    table.decimal("due_amount");
    table.integer("duration").unsigned();
    table.enum("installment_type", [
      "monthly",
      "quarterly",
      "half_yearly",
      "annually",
    ]);
    table.date("date");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("share_details");
};
