// monthly-summary.js
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const pino = require("pino")();
const moment = require("moment");

router.get("/", async (req, res) => {
  try {
    // Extract month and year from the query parameters
    const { monthYear } = req.query;

    // If both month and year are not provided, use the current month and year
    const currentDate = new Date();
    const selectedDate = monthYear ? new Date(monthYear) : currentDate;
    const selectedMonth = selectedDate.getMonth() + 1; // Months are zero-indexed
    const selectedYear = selectedDate.getFullYear();

    // Fetch monthly summary data based on the selected month and year
    const monthlySummary = await knex("share_payments")
      .select(
        "share_payments.id",
        "share_payments.payment_date",
        "share_payments.paid_date",
        "share_payments.amount",
        "share_payments.status",
        "shareholder.name as shareholder_name",
        "share_details.due_amount",
        "share_details.duration",
        "share_details.installment_type"
      )
      .join("share_details", "share_payments.share_id", "=", "share_details.id")
      .join(
        "shareholder",
        "share_details.shareholder_id",
        "=",
        "shareholder.id"
      )
      .whereRaw("MONTH(share_payments.payment_date) = ?", [selectedMonth])
      .whereRaw("YEAR(share_payments.payment_date) = ?", [selectedYear]);
    
    // Calculate total amounts
    const totalExpectedAmount = monthlySummary.reduce(
      (total, entry) => total + entry.due_amount,
      0
    );
    const totalMonthlyCollected = monthlySummary
      .filter((entry) => entry.status === 1)
      .reduce((total, entry) => total + entry.due_amount, 0);
    const totalDueAmount = monthlySummary
      .filter((entry) => entry.status === 0)
      .reduce((total, entry) => total + entry.due_amount, 0);

    // Get month and year from query parameters, default to current month and year if not provided
    const month = selectedMonth || moment().format("M");
    const year = selectedYear || moment().format("YYYY");

    // Format the provided or default month and year
    const formattedMonthYear = moment(`${year}-${month}`, "YYYY-M").format(
      "MMMM YYYY"
    );

    res.render("monthly-summary.html", {
      monthlySummary,
      formattedMonthYear,
      totalExpectedAmount,
      totalMonthlyCollected,
      totalDueAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
