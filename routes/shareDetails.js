// shareDetails.js
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

router.get("/:id", async (req, res) => {
  const shareholderId = req.params.id;

  try {
    // Fetch shareholder details and associated share_details
    const shareholderDetails = await knex("shareholder")
      .select(
        "shareholder.name",
        "share_details.due_amount",
        "share_details.duration",
        "share_details.installment_type",
        "share_details.id as share_id"
      )
      .leftJoin(
        "share_details",
        "shareholder.id",
        "=",
        "share_details.shareholder_id"
      )
      .where("shareholder.id", shareholderId);

    if (!shareholderDetails) {
      // Handle case where shareholder is not found
      return res.status(404).send("Shareholder not found");
    }

    res.render("share-details.html", {
      shareholderDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
