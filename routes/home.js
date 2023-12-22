const express = require("express");
const knex = require("knex")(require("../knexfile"));

const router = express.Router();

router.get("/", async (req, res) => {
  try {
   
    // Fetch data from the shareholder table
    const shareholders = await knex("shareholder")
      .select("shareholder.*")
      .count("share_details.id as share_details_count")
      .leftJoin(
        "share_details",
        "shareholder.id",
        "=",
        "share_details.shareholder_id"
      )
      .groupBy("shareholder.id");

    const successMessage = req.query.success; // from the add share holder screen

    // Render the home page and pass the data to the template
    res.render("home-page.html", { shareholders, successMessage });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
