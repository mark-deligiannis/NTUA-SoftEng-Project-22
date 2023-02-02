const json2csv = require('json2csv').Parser;

function csv_helper_e(json) {
    let final = [];
    for(let answer of json["answers"]) {
        let entry = {};
        entry["questionnaireID"] = json["questionnaireID"];
        entry["questionID"] = json["questionID"];
        entry["session"] = answer["session"];
        entry["ans"] = answer["ans"];
        final.push(entry);
    }
    let fields = ["questionnaireID", "qID", "session", "ans"];
    return (new json2csv({ fields }).parse(final));
}

module.exports = csv_helper_e;