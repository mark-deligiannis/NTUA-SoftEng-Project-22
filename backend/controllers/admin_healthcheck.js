const pool = require("../app.js");
const buildConnectionString = require("../helpers/buildConnectionString.js");
const pool_params = require('../helpers/pool_params.js');
const url = require('url');

async function admin_healthcheck_handler(req, res) {
    var stat_code;
    let conn;
    const connection_string = buildConnectionString(pool_params);

    var isCsv = false;
    if(url.parse(req.url, true).query.format == "csv") isCsv = true;

    try {
        conn = await pool.getConnection();
        conn.query("select 1");
        stat_code = 200;
        json_object = {"status":"OK", "dbconnection":connection_string};
    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        stat_code = 500
        json_object = {"status":"failed", "dbconnection":connection_string};
    } finally {
        if (conn) conn.end();
    }
    if(isCsv) {
        const json2csv = require('json2csv').Parser;
        const fields = ['status', 'dbconnection'];
        res.status(stat_code).send((new json2csv({ fields })).parse(json_object));
    } else
        res.status(stat_code).send(json_object)
}

// Export controller so that app.js can use it
module.exports = admin_healthcheck_handler;