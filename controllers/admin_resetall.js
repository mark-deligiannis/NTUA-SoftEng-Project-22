const pool = require("../app.js");

// handler for RESET
async function resetall_handler(req, res) {
  var conn;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Delete all questionnaires, questions, options and answers.
    // Due to cascading deletes we only need to do this with questionnaire.
    await conn.query("DELETE FROM questionnaire;");

    // Delete all keywords
    await conn.query("DELETE FROM questionnaire_keywords;")

    // Once everything is done set the status
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

module.exports = resetall_handler;