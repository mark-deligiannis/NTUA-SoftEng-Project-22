const pool = require("../app.js");

async function admin_resetq_handler(req, res) {
    const questionnaireID = req.params.questionnaireID;

    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        // Delete every answer to every question that corresponds to the given Questionnaire
        // Prepare the statement
        var stmt = await conn.prepare(`DELETE FROM Answer WHERE QuestionnaireID = ?`);
        // Execute the statement
        await stmt.execute([questionnaireID]);
        res.status(200).send({"status":"OK"});
    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        // Set the status to 500 (internal server error)
        res.status(500).send({"status":"failed", "reason":err.message});
    } finally {
        if (conn) conn.end();
    }
}

module.exports = admin_resetq_handler;