const pool = require("../app.js");
const url = require("url");

async function user_fetchquestionnaires_handler(req, res) {
    // Get input
    let keywords = req.body["keywords"];
    if (keywords && !Array.isArray(keywords)) keywords = [keywords];
    var isCsv = false;
    if(url.parse(req.url, true).query.format == "csv") isCsv = true;

    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        var stmt, result;
        if (!keywords || keywords.length==0) {
            result = await conn.query("SELECT * FROM questionnaire;");
        }
        else {
            let hack = `(${'?,'.repeat(keywords.length-1)}?)`;
            // Base statement
            stmt = `SELECT DISTINCT q.QuestionnaireID as QuestionnaireID, q.QuestionnaireTitle as QuestionnaireTitle
                        FROM questionnaire as q INNER JOIN
                        (SELECT * FROM Questionnaire_Keywords WHERE Keyword_text IN ${hack}) as small_qk
                            ON q.QuestionnaireID = small_qk.QuestionnaireID`;
            stmt = await conn.prepare(stmt);
            // Execute the statement
            result = await stmt.execute(keywords);
        }

        if(isCsv){
            const json2csv = require('json2csv').Parser;
            const fields = ["QuestionnaireID", "QuestionnaireTitle"];
            res.status(200).send((new json2csv({ fields })).parse(result));
        } else
            res.status(200).send(result);

    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        res.status(500).send();
    } finally {
        if (conn) conn.end();
    }
}

module.exports = user_fetchquestionnaires_handler;