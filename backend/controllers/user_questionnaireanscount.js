const pool = require("../app.js");
const url = require("url");

async function user_questionnaireanscount_handler(req, res) {
    const questionnaireID = req.params.questionnaireID;

    var isCsv = false;
    if(url.parse(req.url, true).query.format == "csv") isCsv = true;

    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        var stmt, result;
        stmt = await conn.prepare("select count(distinct session_id) as Number from answer A where A.questionnaireID=?");
        result = await stmt.execute([questionnaireID]);
        // Format result
        result = { Number: Number(result[0]["Number"]) };

        if(isCsv) {
            const json2csv = require('json2csv').Parser;
            const fields = ["Number"];
            res.status(200).send((new json2csv({ fields })).parse(result));
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        res.status(500).send();
    } finally {
        if (conn) conn.end();
    }
}

module.exports = user_questionnaireanscount_handler;