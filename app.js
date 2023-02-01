const express = require('express');
const app = express();
const port = 9103;
const baseRoute = "/intelliq_api"
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'intelliQ',
  connectionLimit: 5,
  charset: 'utf8mb4',
  collation: 'utf8mb4_general_ci'
});

module.exports = pool

const questionnaire_admin = require('./routes/admin.js');

app.use(`${baseRoute}/admin/`, questionnaire_admin);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})