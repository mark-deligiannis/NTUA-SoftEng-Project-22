const pool = require("../app.js");
const url = require("url");

async function user_fetchkeywords_handler(req, res) {
    var isCsv = false;
    if(url.parse(req.url, true).query.format == "csv") isCsv = true;

    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        var result, stat_code=200;
        result = await conn.query("SELECT DISTINCT Keyword_text as Keywords FROM questionnaire_keywords");
        
        // Delete useless metadata
        delete result.meta;

        // If result is empty then adjust the stat_code
        if (result.length==0) stat_code = 402;

        if(isCsv){
            const json2csv = require('json2csv').Parser;
            const fields = ["Keywords"];
            res.status(stat_code).send((new json2csv({ fields })).parse(result));
        } else {
            // Prettify
            result = { Keywords: result.map(x => x["Keywords"]) };
            // Send
            res.status(stat_code).send(result);
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

module.exports = user_fetchkeywords_handler;