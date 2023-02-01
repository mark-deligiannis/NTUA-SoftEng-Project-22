function buildGraph(json) {
    const vertices = json["questions"].map(q => q["qID"]);
    const mapping = {};
    for (let i = 0; i < vertices.length; i++) {
        mapping[vertices[i]] = i;
    }
    const graph = []
    for (q of json["questions"]) {
        graph[mapping[q["qID"]]] = [];
        for (op of q["options"]) {
            if(!op["nextqID"] == '-') {
                graph[mapping[q["qID"]]].push(mapping[op["nextqID"]]);
            }
        }
    }
    return { graph, vertices };
}

function isCyclicUtil(v, visited, recStack, graph) {
    if (!visited[v]) {
      visited[v] = true;
      recStack[v] = true;
  
      for (let i = 0; i < graph[v].length; i++) {
        let node = graph[v][i];
        if (!visited[node] && isCyclicUtil(node, visited, recStack, graph)) {
          return true;
        } else if (recStack[node]) {
          return true;
        }
      }
    }
    recStack[v] = false;
    return false;
}

// Function to check if the questionnaire has a cycle (is not DAG, not well defined). 
function notDAG(graph) {
    let V = graph.length;
    let visited = [];
    let recStack = [];

    for (let i = 0; i < V; i++) {
        visited[i] = false;
        recStack[i] = false;
    }

    for (let i = 0; i < V; i++) {
        if (!visited[i] && isCyclicUtil(i, visited, recStack, graph)) {
            return true;
        }
    }

    return false;
}

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
    
    if(notDAG(buildGraph(json))) {
        return false;
    }
    
    // If we got to this point everything is ok
    return true;
}

module.exports = json_format_ok;