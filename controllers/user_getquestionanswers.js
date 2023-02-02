const pool = require("../app.js");
const path = require("path");
const url = require('url');

async function user_getquestionanswer_handler(req, res) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;

    var isCsv = false;
    if(url.parse(req.url, true).query.format == "csv") isCsv = true;

    var stat_code, ret_file;
    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        // Create entry in questionnaire
        // Prepare the statement
        var stmt = await conn.prepare(`
            (select ans.Session_ID as Session_ID, ans.Answer_text as Answer
            from answer ans, qoption opt 
            where ans.OptID = opt.OptID 
            and ans.QID = opt.QID
            and ans.QuestionnaireID = opt.QuestionnaireID
            and (ans.QuestionnaireID, ans.QID) = (?, ?)
            and opt.Opttxt = '<open string>')
            union
            (select ans.Session_ID as Session_ID, opt.OptID as Answer
            from answer ans, qoption opt
            where ans.OptID = opt.OptID
            and ans.QID = opt.QID
            and ans.QuestionnaireID = opt.QuestionnaireID
            and (ans.QuestionnaireID, ans.QID) = (?, ?)
            and opt.Opttxt != '<open string>')
        `);
        // Execute the statement
        let rows = await stmt.execute([questionnaireID, questionID, questionnaireID, questionID]);

        if(!rows.length) {
            stat_code = 402;
        } else {
            stat_code = 200;
        }

        let result = {};

        result["questionnaireID"] = questionnaireID;
        result["qID"] = questionID;
        result["answers"] = [];
        for(let row of rows) {
            result["answers"].push({"session":row.Session_ID, "ans":row.Answer});
        }
        res.status(stat_code);
        if(stat_code == 402) {
            res.send()
        } else {
            if(isCsv) {
                const csv_helper_e = require('../helpers/csv_helper_e.js');
                res.status(200).send(csv_helper_e(result));
            } else 
                res.send(result);
        }

    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        stat_code = 500
        ret_file = "../templates/error_500.html"
        res.status(stat_code).sendFile(path.join(__dirname,ret_file));

    } finally {
        if (conn) conn.end();
    }
}

module.exports = user_getquestionanswer_handler;