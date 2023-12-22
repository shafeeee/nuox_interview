const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const bodyParser = require("body-parser");
const pino = require("pino")();

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/:id", async (req, res) => {
  const shareId = req.params.id;

  try {
    // Fetch shareholder details
    const [shareholderDetails] = await knex("shareholder")
      .select(
        "shareholder.name",
        "share_details.due_amount",
        "share_details.duration",
        "share_details.installment_type",
        "share_details.date",
        "shareholder.id as shareholder_id",
        "share_balance.due_amount as total_due",
        "share_balance.paid_amount as total_paid"
      )
      .leftJoin(
        "share_details",
        "shareholder.id",
        "=",
        "share_details.shareholder_id"
      )
      .leftJoin(
        "share_balance",
        "share_details.id",
        "=",
        "share_balance.share_id"
      )
      .where("share_details.id", shareId);

    // Fetch payment history
    const paymentHistory = await knex("share_payments")
      .select("id", "payment_date", "amount", "status")
      .where("share_id", shareId);

    res.render("share-payment-details.html", {
      shareholderDetails,
      paymentHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/make-payment", async (req, res) => {
  const { paymentId } = req.body;

  try {
    // Fetch payment details
    const [payment] = await knex("share_payments")
      .select("share_id", "amount", "status")
      .where("id", paymentId);

    if (payment.status === 0) {
      // Update payment status to 1
      await knex("share_payments")
        .where("id", paymentId)
        .update({
          status: 1,
          paid_date: knex.raw("CURRENT_DATE"), // Use the current date as the paid_date
        });

      // Update share_balance
      const [shareBalance] = await knex("share_balance")
        .select("due_amount", "paid_amount")
        .where("share_id", payment.share_id);

      const updatedDueAmount = shareBalance.due_amount - payment.amount;
      const updatedPaidAmount = shareBalance.paid_amount + payment.amount;

      await knex("share_balance").where("share_id", payment.share_id).update({
        due_amount: updatedDueAmount,
        paid_amount: updatedPaidAmount,
      });

      pino.info({ message: "Payment successful", paymentId });
      res.redirect(
        `/share-payment-details/${payment.share_id}?success=Payment successful`
      );
    } else {
      pino.error({ message: "Payment has already been made", paymentId });
      res.redirect(
        `/share-payment-details/${payment.share_id}?error=Payment has already been made`
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
