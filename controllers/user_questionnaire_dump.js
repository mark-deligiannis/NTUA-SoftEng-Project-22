const pool = require("../app.js");

async function user_questionnaire_dump_handler(req, res) {
    // Get questionnaireID from request
    var questionnaireID = req.params.questionnaireID;
    // Declare response json
    var json = {};
    let conn;
    try {
        // Connect to database
        conn = await pool.getConnection();

        // Search for the questionnaire
        // Prepare the statement
        var stmt = await conn.prepare("SELECT * FROM questionnaire WHERE questionnaireID=?;");
        // Execute the statement
        var query_response = await stmt.execute([questionnaireID]);

        if (query_response[0]) {
            // Set main properties of questionnaire            
            json["questionnaireID"] = query_response[0]["QuestionnaireID"];
            json["questionnaireTitle"] = query_response[0]["QuestionnaireTitle"];

            // Get the relevant keywords
            stmt = await conn.prepare("SELECT Keyword_text FROM questionnaire_keywords WHERE questionnaireID=?;");
            query_response = await stmt.execute([questionnaireID]);

            // Set the keywords in the json (format them accordingly)
            json["keywords"] = query_response.map(x => x['Keyword_text']);

            // Get all the relevant questions
            stmt = await conn.prepare("SELECT * FROM Question WHERE questionnaireID=? AND QID!='-' ORDER BY QID ASC;");
            query_response = await stmt.execute([questionnaireID]);

            json["questions"] = [];
            jq = json["questions"];
            // fill json["questions"]
            query_response.forEach((question, index) => {
                jq[index] = {
                    qID: question["QID"],
                    qtext: question["Qtext"],
                    required: question["Required"],
                    type: question["Qtype"],
                    options: []
                }
            });

            // Get all the relevant options
            stmt = await conn.prepare("SELECT * FROM Qoption WHERE questionnaireID=? ORDER BY QID, OptID ASC;");
            query_response = await stmt.execute([questionnaireID]);

            // Scan them and fill all json
            query_response.forEach((option,index) => {
                let i = jq.findIndex(x => x["qID"]==option["QID"]);
                jq[i]["options"].push({
                    optID: option["OptID"],
                    opttxt: option["Opttxt"],
                    nextqID: option["NextQID"]
                })
            });

            res.status(200).send(json);
        }
        else {
            res.status(402).send({});
        }
    } catch (err) {
        // Log the error message for debugging
        console.log(`The following error occured:\n\n${err.message}\n`);
        res.status(500).send({});
    } finally {
        if (conn) conn.end();
    }
}

module.exports = user_questionnaire_dump_handler;