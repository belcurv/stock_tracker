'use strict';

/* ================================= SETUP ================================= */

require('dotenv').config();
const express    = require('express');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const app        = express();
const db         = require('./db');
const port       = process.env.PORT || 3000;


/* ================================ CONFIG ================================= */

// enable logger
app.use(morgan('dev'));

// enable http request body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/auth',  require('./controllers/auth'));
app.use('/users', require('./controllers/users'));
app.use('/api',   require('./controllers/portfolios'));


/* ========================== CONNECT TO DATABASE ========================== */

db.connect('mongodb://localhost:27017/stocktracker', (err) => {
  if (err) {
    // bail
    console.log('Unable to connect to MongoDB');
    process.exit(1);
  } else {
    // start server
    app.listen(port, () => console.log(`Listening on port ${port}`));
  }

});
