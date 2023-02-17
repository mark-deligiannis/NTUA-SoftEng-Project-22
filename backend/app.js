const express = require('express');
const app = express();
const port = 9103;
const frontend_server = 'http://localhost:3000';
const baseRoute = "/intelliq_api"
const mariadb = require('mariadb');

const pool_params = require('./helpers/pool_params.js');

const pool = mariadb.createPool(pool_params);

module.exports = pool

const questionnaire_admin = require('./routes/admin.js');
const questionnaire_user = require('./routes/user.js');

// Add headers before the routes are defined (FIX CORS issue)
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', frontend_server);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(`${baseRoute}/admin/`, questionnaire_admin);
app.use(`${baseRoute}/`, questionnaire_user);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
