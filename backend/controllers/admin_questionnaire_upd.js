const pool = require("../app.js");

// Function to check json format. Returns false if wrong, true if correct
const json_format_ok = require('../helpers/json_format_ok.js');

// Route and handler for INSERTION OF QUESTIONNAIRE
async function admin_questionnaire_upd_handler(req, res) {
  // Fetch the questionnaire (JSON)
  const quest = JSON.parse(req.file.buffer.toString());

  // First check the format
  if (!json_format_ok(quest)) {
    return res.status(400).send();
  }
  // Get the ID (useful later on)
  questionnaireID = quest["questionnaireID"];
  
  var stat_code, rollback=false;
  let conn;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Create entry in questionnaire
    // Prepare the statement
    var stmt = await conn.prepare("INSERT INTO questionnaire VALUES (?,?);");
    // Execute the statement
    await stmt.execute([questionnaireID,quest["questionnaireTitle"]]);

    // Up until now an error doesn't leave a trace, so there is no need
    // to undo something in the database. After this point though if anything
    // goes wrong we need to delete the questionnaire. We've made sure that
    // the database uses cascading deletes, so that's all we need to do.
    rollback = true;

    // Create entries in Questionnaire_keywords
    // Prepare the statement
    stmt = await conn.prepare("INSERT INTO questionnaire_keywords VALUES (?,?);");
    for (let keyword of quest["keywords"]) {
      // Execute the statement
      await stmt.execute([questionnaireID,keyword]);
    }

    // Create entries in Question
    // Prepare the statement
    stmt = await conn.prepare("INSERT INTO question VALUES (?,?,?,?,?);");
    for (let question of quest["questions"]) {
      await stmt.execute([question["qID"],questionnaireID,question["qtext"],question["required"],question["type"]]);
    }
    // We also need to insert a null question (options of last questions reference that so that fk constraints are satisfied)
    await stmt.execute(['-',questionnaireID,"Dummy question","FALSE","dummy"]);

    // Re-loop questions and create entries in Qoption (this is done to ensure that the "nextqID" refers to an already existing entry in Question)
    // Prepare the statement
    stmt = await conn.prepare("INSERT INTO qoption VALUES (?,?,?,?,?);");
    for (let question of quest["questions"]) {
      for (let option of question["options"]) {
        await stmt.execute([option["optID"],question["qID"],questionnaireID,option["opttxt"],option["nextqID"]]);
      }
    }
    // Once everything is done set the status
    stat_code = 200
  } catch (err) {
    // Log the error message for debugging
    console.log(`The following error occured:\n\n${err.message}\n`);
    // Set the status to 500 (internal server error)
    stat_code = 500
    // If rollback is true, we need to delete the questionnaire entry
    if (rollback) {
      console.log("Invalid entries left in database. Attempting recovery...")
      try {
        // Prepare delete statement
        stmt = await conn.prepare("DELETE FROM questionnaire WHERE questionnaireID=?;");
        await stmt.execute(questionnaireID);
        // Print recovery message
        console.log(`Successfully recovered. Database is clean!`);
      }
      catch (nested_err) {
        // Nothing we can do besides notifying the admin
        console.log(
          `Recovery failed! Database has invalid entries. Error message:\n\n${nested_err.message}\n`
        );
      }
    }
  } finally {
    if (conn) conn.end();
  }

  res.status(stat_code).send();
}

// Export router so that admin.js can use it
module.exports = admin_questionnaire_upd_handler;