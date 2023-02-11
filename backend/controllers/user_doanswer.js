const pool = require("../app.js");

async function user_doanswer_handler(req, res) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;
    const session = req.params.session;
    const optionID = req.params.optionID;
    let answer_text = req.body["answer"];

    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        var stmt;
        if(answer_text == null) answer_text = '';
        if(answer_text == '') {
            stmt = await conn.prepare(`insert into answer (OptID, QID, QuestionnaireID, Session_ID) values (?,?,?,?)`);
            // Execute the statement
            await stmt.execute([optionID, questionID, questionnaireID, session]);
        }
        else {
            stmt = await conn.prepare(`insert into answer values (?, ?, ?, ?, ?)`);
            // Execute the statement
            await stmt.execute([optionID, questionID, questionnaireID, session, answer_text]);
        }

        res.status(200).send();

    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        res.status(500).send();

    } finally {
        if (conn) conn.end();
    }
}

module.exports = user_doanswer_handler;