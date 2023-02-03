const json2csv = require('json2csv').Parser;

function csv_helper_d(json) {
    let final = [];
    for(let answer of json["answers"]) {
        let entry = {};
        entry["questionnaireID"] = json["questionnaireID"];
        entry["session"] = json["session"];
        entry["qID"] = answer["qID"];
        entry["ans"] = answer["ans"];
        final.push(entry);
    }
    let fields = ["questionnaireID", "session", "qID", "ans"];
    return (new json2csv({ fields }).parse(final));
}

module.exports = csv_helper_d;