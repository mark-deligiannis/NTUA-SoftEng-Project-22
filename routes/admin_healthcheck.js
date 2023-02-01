const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require("../app.js");
const bodyParser = require("body-parser")
const buildConnectionString = require("../helpers/buildConnectionString.js")

router.get('/', async (req, res) => {
    var stat_code, ret_file;
    let conn;
    const connection_string = buildConnectionString(pool);
    try {
        conn = await pool.getConnection();
        stat_code = 200;
        ret_file = "../templates/error_200.html";
        json_object = {"status":"OK", "dbconnection":connection_string};
    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        stat_code = 500
        ret_file = "../templates/error_500.html"
        json_object = {"status":"failed", "dbconnection":connection_string};
    } finally {
        if (conn) conn.end();
    }
    res.status(stat_code).send(json_object)
})

// Export router so that app.js can use it
module.exports = router;