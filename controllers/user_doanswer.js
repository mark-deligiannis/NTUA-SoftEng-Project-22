const pool = require("../app.js");
const path = require("path");

async function user_doanswer_handler(req, res) {
    const questionnaireID = req.params.questionnaireID;
    const questionID = req.params.questionID;
    const session = req.params.session;
    const optionID = req.params.optionID;
    let answer_text = req.body;

    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        // Create entry in questionnaire
        // Prepare the statement
        var stmt = await conn.prepare(`
            insert into answer values (?, ?, ?, ?, ?)
        `);
        // Execute the statement
        await stmt.execute([optionID, questionID, questionnaireID, session, answer_text]);

        res.status(200);

    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        res.status(500).sendFile(path.join(__dirname,"../templates/error_500.html"));

    } finally {
        if (conn) conn.end();
    }
}

module.exports = user_doanswer_handler;