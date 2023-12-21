// routes/addShareholder.js
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const knex = require("knex")(require("../knexfile"));
const pino = require("pino")();
const { validateForm, validationResult } = require("../middlewares/validation.js");

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  pino.info({ message: "on the first path" });
  res.render("add-share-holder-form.html");
});

router.post("/", validateForm, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('add-share-holder-form.html', { errors: errors.array() });
  }

  const { name, mobile_number, country } = req.body;

  try {
    const [newShareholderId] = await knex("shareholder").insert({
      name,
      mobile_number,
      country,
    });
    res.redirect("/?success=Shareholder added successfully...!");
  } catch (error) {
    // Logging with pino
    pino.error({ message: "Insert failed", error });

    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/success", (req, res) => {
  res.render("add-share-holder-success.html");
});

module.exports = router;
