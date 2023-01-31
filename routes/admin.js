const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require("../app.js");
const bodyParser = require("body-parser")

// Function to check json format. Returns false if wrong, true if correct
function json_format_ok(json) {
  // Make a list that has every question ID
  const every_question_id = json["questions"].map(q => q["qID"]);
  // Don't forget the null question
  every_question_id.push('-');

  // Questionnaire ID, Title and questions must be provided
  if (!json["questionnaireID"] || !json["questionnaireTitle"] || !json["questions"]) return false;
  // There must be at least one question and its name must be "P00"
  if (!json["questions"][0] || json["questions"][0]["qID"]!="P00") return false;
  // Scan questions for errors
  for (q of json["questions"]) {
    // Everything must be provided. Also, "required" must be either "FALSE" or "TRUE"
    if (!q["qID"] || !q["qtext"] || !q["required"] || !q["type"] || !q["options"] ||
        !(["FALSE","TRUE"].includes(q["required"]))) {
      return false;
    }
    // Scan options
    for (op of q["options"]) {
      // Options must blah blah
      if (!op["optID"] || !op["opttxt"] || !op["nextqID"] || !(every_question_id.includes(op["nextqID"]))) {
        return false;
      }
    }
  }

  // If we got to this point everything is ok
  return true;
}

router.use(bodyParser.json())

router.post('/questionnaire_upd', async (req, res) => {
  // Fetch the questionnaire (JSON)
  quest = req.body;

  // First check the format
  if (!json_format_ok(quest)) {
    return res.status(400).sendFile(path.join(__dirname,"../templates/error_400.html"));
  }
  // Get the ID (useful later on)
  questionnaireID = quest["questionnaireID"];
  
  var stat_code, ret_file;
  let conn;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();

    // Create entry in questionnaire
    // Prepare the statement
    var stmt = await conn.prepare("INSERT INTO questionnaire VALUES (?,?);");
    // Execute the statement
    await stmt.execute([questionnaireID,quest["questionnaireTitle"]]);

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
    ret_file = "../templates/insertion_success.html"
  } catch (err) {
    // Log the error message for debugging
    console.log(`The following error occured:\n\n${err.message}\n`);
    // Set the status to 500 (internal server error)
    stat_code = 500
    ret_file = "../templates/error_500.html"
  } finally {
    if (conn) conn.end();
  }

  res.status(stat_code).sendFile(path.join(__dirname,ret_file));
})

// Export router so that app.js can use it
module.exports = router;