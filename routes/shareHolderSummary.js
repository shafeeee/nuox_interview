const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  try {
    // Fetch all shareholders for the dropdown
    const shareholders = await knex("shareholder").select("id", "name");

    res.render("share-holder-summary.html", { shareholders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  const selectedShareholderId = req.body.selectedShareholder;

  try {
    // Redirect to share-payment-details route with the selected shareholder's ID
    res.redirect(`/share-details/${selectedShareholderId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
