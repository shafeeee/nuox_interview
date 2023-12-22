// app.js
const express = require('express');
const path = require('path');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Register EJS to also handle HTML files
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

// Import route files
const addShareholderRoute = require('./routes/addShareholder');
const homeRoute = require('./routes/home');
const buyShareRoute = require('./routes/buyShare');
const shareDetailsRoute = require("./routes/shareDetails");
const sharePaymentDetailsRoute = require('./routes/sharePaymentDetails');
const shareHolderSummaryRoute = require('./routes/shareHolderSummary');
const monthlySummaryRoute = require('./routes/monthlySummary');

// Use route files
app.use('/add-share-holder', addShareholderRoute);
app.use('/', homeRoute);
app.use('/buy-share', buyShareRoute);
app.use("/share-details", shareDetailsRoute);
app.use('/share-payment-details', sharePaymentDetailsRoute);
app.use('/share-holder-summary', shareHolderSummaryRoute);
app.use('/monthly-summary', monthlySummaryRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
