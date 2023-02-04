const json2csv = require('json2csv').Parser;

function csv_helper_a(json) {
    let keystring = '[' + json["keywords"].join(', ') + ']';
    let final = [];
    for(let question of json["questions"]) {
        let entry = {};
        entry["questionnaireID"] = json["questionnaireID"];
        entry["questionnaireTitle"] = json["questionnaireTitle"];
        entry["keywords"] = keystring;
        entry["qID"] = question["qID"];
        entry["qtext"] = question["qtext"];
        entry["required"] = question["required"];
        entry["type"] = question["type"];
        final.push(entry);
    }
    let fields = ["questionnaireID", "questionnaireTitle", "keywords", "qID", "qtext", "required", "type"];
    return (new json2csv({ fields }).parse(final));
}

module.exports = csv_helper_a;