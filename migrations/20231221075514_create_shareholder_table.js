// ./migrations/[timestamp]_create_shareholder_table.js
exports.up = function (knex) {
  return knex.schema.createTable("shareholder", function (table) {
    table.increments("id").primary();
    table.string("name", 255);
    table.string("mobile_number");
    table.string("country");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("shareholder");
};
