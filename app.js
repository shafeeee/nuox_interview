// app.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Register EJS to also handle HTML files
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

// Import route files
const addShareholderRoute = require('./routes/addShareholder');
const home = require('./routes/home');

// Use route files
app.use('/add-share-holder', addShareholderRoute);
app.use('/', home);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
