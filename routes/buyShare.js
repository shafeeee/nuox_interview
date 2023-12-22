// Assuming you already have express and other required dependencies
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const bodyParser = require("body-parser");
const pino = require("pino")();
const {
  validateForm,
  validationResult,
} = require("../middlewares/buy_share_validation.js");

router.use(bodyParser.urlencoded({ extended: true }));

// Render the "buy-share" form
router.get("/:id/:name", (req, res) => {
  const { id, name } = req.params;
  res.render("buy-share-form.html", {
    shareholderId: id,
    shareholderName: name,
  });
});

// Handle the form submission
router.post("/", validateForm, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    pino.error({ message: "Validation errors", errors });
    return res.render("buy-share-form.html", { errors: errors.array() });
  }

  const {
    shareholderId,
    duration,
    installmentType,
    totalAmount,
    startDate,
  } = req.body;

  const year = duration;
  const totalAmountYear = totalAmount * year;
  // Check if startDateString is undefined or empty
  if (!startDate) {
    console.log("Start Datae" + startDate);
    pino.error({ message: "Start Date is required" });
    return res.status(400).send("Start Date is required.");
  }

  // Convert startDateString to a Date object
  const startDateString = new Date(startDate);
  pino.info({ message: "Start Date", startDate });

  try {
    // Calculate duration based on the selected installment type and year
    let duration = 0;

    if (installmentType === "monthly") {
      duration = year * 12;
    } else if (installmentType === "quarterly") {
      duration = year * 4;
    } else if (installmentType === "half-yearly") {
      duration = year * 2;
    } else if (installmentType === "annually") {
      duration = year;
    }

    // Insert into share_details table
    const [shareDetailsId] = await knex("share_details").insert({
      shareholder_id: shareholderId,
      due_amount: totalAmountYear,
      duration: year,
      installment_type: installmentType,
      date: knex.fn.now(),
    });

    // Insert into share_balance table
    await knex("share_balance").insert({
      shareholder_id: shareholderId,
      share_id: shareDetailsId,
      due_amount: totalAmountYear,
      paid_amount: 0,
    });

    // Calculate installment amount
    const installmentAmount = (totalAmountYear / duration).toFixed(2);
    pino.info({ message: "Start Date", startDate });

    // Calculate payment dates and insert into share_payments table
    for (let i = 0; i < duration; i++) {
      const paymentDate = new Date(startDate);

      if (installmentType === "monthly") {
        paymentDate.setMonth(startDateString.getMonth() + i);
      } else if (installmentType === "quarterly") {
        paymentDate.setMonth(startDateString.getMonth() + i * 3);
      } else if (installmentType === "half-yearly") {
        paymentDate.setMonth(startDateString.getMonth() + i * 6);
      } else if (installmentType === "annually") {
        paymentDate.setFullYear(startDateString.getFullYear() + i);
      }

      await knex("share_payments").insert({
        share_id: shareDetailsId,
        payment_date: paymentDate,
        amount: installmentAmount,
        status: 0, // Default status
      });
    }

    // Redirect back to the home page with a success message
    res.redirect("/?success=Share bought successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Export the router for use in your main app file
module.exports = router;
