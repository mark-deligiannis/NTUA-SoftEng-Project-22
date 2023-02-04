const pool = require("../app.js");
const url = require('url');

// handler for RESET
async function resetall_handler(req, res) {
  var conn;

  var isCsv = false;
  if(url.parse(req.url, true).query.format == "csv") isCsv = true;

  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Delete all questionnaires, questions, options and answers.
    // Due to cascading deletes we only need to do this with questionnaire.
    await conn.query("DELETE FROM questionnaire;");

    // Delete all keywords
    await conn.query("DELETE FROM questionnaire_keywords;")

    // Once everything is done set the status
    if(isCsv){
      const json2csv = require('json2csv').Parser;
      const fields = ['status'];
      res.status(200).send((new json2csv({ fields })).parse({"status":"OK"}));
    } else
      res.status(200).send({"status":"OK"});
  } catch (err) {
    // Log the error message for debugging
    console.log(`The following error occured:\n\n${err.message}\n`);
    // Set the status to 500 (internal server error)
    if(isCsv){
      const json2csv = require('json2csv').Parser;
      const fields = ['status', 'reason'];
      res.status(500).send((new json2csv({ fields })).parse({"status":"failed", "reason":err.message}));
    } else
      res.status(500).send({"status":"failed", "reason":err.message});
  } finally {
    if (conn) conn.end();
  }
}

module.exports = resetall_handler;