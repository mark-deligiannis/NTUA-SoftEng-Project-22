const json2csv = require('json2csv').Parser;

function csv_helper_b(json) {
    let final = [];
    for(let option of json["options"]) {
        let entry = {};
        entry["questionnaireID"] = json["questionnaireID"];
        entry["qID"] = json["qID"];
        entry["qtext"] = json["qtext"];
        entry["required"] = json["required"];
        entry["type"] = json["type"];
        entry["optID"] = option["optID"];
        entry["opttxt"] = option["opttxt"];
        entry["nextqID"] = option["nextqID"];
        final.push(entry);
    }
    let fields = ["questionnaireID", "qID", "qtext", "required", "type", "optID", "opttxt", "nextqID"];
    return (new json2csv({ fields }).parse(final));
}

module.exports = csv_helper_b;