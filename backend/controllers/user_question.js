const pool = require("../app.js");
const url = require('url');

async function user_question_handler(req, res) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;

    var isCsv = false;
    if(url.parse(req.url, true).query.format == "csv") isCsv = true;

    var stat_code;
    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        // Create entry in questionnaire
        // Prepare the statement
        var stmt = await conn.prepare("select * from question as q where (q.qID, q.questionnaireID) = (?, ?) and q.qID != '-';");
        // Execute the statement
        let rows = await stmt.execute([questionID, questionnaireID]);

        if(!rows.length) { stat_code = 402; }
        else {
            let qtext = rows[0].Qtext;
            let required = rows[0].Required;
            let type = rows[0].Qtype;
            
            stmt = await conn.prepare("select * from qoption as o where (o.qID, o.QuestionnaireID) = (?, ?) and o.qID != '-' order by o.optID asc;");
            let options = [];
            options = await stmt.execute([questionID, questionnaireID]);

            let result = {};

            result["questionnaireID"] = questionnaireID;
            result["qID"] = questionID;
            result["qtext"] = qtext;
            result["required"] = required;
            result["type"] = type;
            result["options"] = [];
            for(let o of options) {
                result["options"].push({"optID":o.OptID, "opttxt":o.Opttxt, "nextqID":o.NextQID});
            }

            if(isCsv) {
                const csv_helper_b = require('../helpers/csv_helper_b.js');
                res.status(200).send(csv_helper_b(result));
            } else
                res.status(200).send(result);
            if (conn) conn.end();
            return;
        }
    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        stat_code = 500;
    } finally {
        if (conn) conn.end();
    }

    res.status(stat_code).send();
}

module.exports = user_question_handler;