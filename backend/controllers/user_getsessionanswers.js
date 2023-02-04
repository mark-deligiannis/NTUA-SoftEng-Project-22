const pool = require("../app.js");
const path = require('path');
const url = require('url');

async function user_getsessionanswers_handler(req, res) {
    const questionnaireID = req.params.questionnaireID;
    const sessionID = req.params.session;

    var isCsv = false;
    if(url.parse(req.url, true).query.format == "csv") isCsv = true;

    var json = {
        questionnaireID: questionnaireID,
        session: sessionID,
        answers: []
    };

    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        // Create entry in questionnaire
        // Prepare the statement
        var stmt = await conn.prepare(
            `(select ansss.QID as qID, ansss.Answer_text as ans
            from answer ansss, qoption opt 
            where ansss.OptID = opt.OptID 
            and ansss.QID = opt.QID
            and ansss.QuestionnaireID = opt.QuestionnaireID
            and (ansss.QuestionnaireID, ansss.Session_ID) = (?, ?)
            and opt.Opttxt = '<open string>')
            union
            (select ansss.QID as qID, opt.OptID as ans
            from answer ansss, qoption opt
            where ansss.OptID = opt.OptID
            and ansss.QID = opt.QID
            and ansss.QuestionnaireID = opt.QuestionnaireID
            and (ansss.QuestionnaireID, ansss.Session_ID) = (?, ?)
            and opt.Opttxt != '<open string>')`
        );
        // Execute the statement
        json["answers"] = await stmt.execute([questionnaireID, sessionID, questionnaireID, sessionID]);
        
        // Get rid of metadata returned by mariadb
        delete json["answers"].meta;

        if (json["answers"][0]) {
            if(isCsv) {
                const csv_helper_d = require('../helpers/csv_helper_d.js');
                res.status(200).send(csv_helper_d(json));
            } else
                res.status(200).send(json);
        }
        else {
            res.status(402).send();
        }
    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);

        // Set the status to 500 (internal server error)
        res.status(500).sendFile(path.join(__dirname,"../templates/error_500.html"));
    } finally {
        if (conn) conn.end();
    }
}

module.exports = user_getsessionanswers_handler;