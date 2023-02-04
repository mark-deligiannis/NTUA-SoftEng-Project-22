const express = require('express');
const app = express();
const port = 9103;
const baseRoute = "/intelliq_api"
const mariadb = require('mariadb');

const pool_params = require('./helpers/pool_params.js');

const pool = mariadb.createPool(pool_params);

module.exports = pool

const questionnaire_admin = require('./routes/admin.js');
const questionnaire_user = require('./routes/user.js');

app.use(`${baseRoute}/admin/`, questionnaire_admin);
app.use(`${baseRoute}/`, questionnaire_user);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
