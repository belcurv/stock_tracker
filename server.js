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

app.use(morgan('dev'));

// enable http request body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/auth', require('./routes/auth_routes'));
app.use('/api',  require('./routes/api_routes'));

// generic error handler
app.use(function (err, req, res, next) {
  console.log('Error: ' + err.message);

  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid or missing token');
  } else {
    res.status(500).send('Something broke');
  }

  next();

});


/* ========================== CONNECT TO DATABASE ========================== */

db.connect((err) => {
  if (err) {
    console.log('Unable to connect to MongoDB');
    process.exit(1);
  }
  
  app.listen(port, () => console.log(`Listening on port ${port}`));

});
