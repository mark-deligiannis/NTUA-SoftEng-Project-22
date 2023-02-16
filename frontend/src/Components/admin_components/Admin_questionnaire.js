import React,{useState,useEffect} from "react";
import { Link } from 'react-router-dom';
import Select from "react-select";
import { toast } from "react-toastify";
import "./Admin_questionnaire.css";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:9103/intelliq_api/fetchquestionnaires";
const KEYS_URL = "http://localhost:9103/intelliq_api/fetchkeywords";
const host = "localhost";
const port = 9103;


const exportCSV=(id)=> {

  const DownloadCSV_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}?format=csv`;

  /*
    Gets the questionnaire with wanted id in CSV format
  */
  fetch(DownloadCSV_URL, {
    headers: {
      "Accept-Charset": "utf-8",
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
  .then(response => {
    if (response.ok) {
      
      // Success message
      toast.success(`Export of Questionnaire ${id} in CSV succeeded!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000, 
        }
      )

      return response.text();
    }
    else{

      // Error message in case of failure
      toast.error(`Export of Questionnaire ${id} in CSV failed!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
        }
      )
    }
  })
  .then(text => {

    // Used to encode the CSV file, input it in a blob and create a link for the download of
    const utf8EncodedCsv = new TextEncoder("UTF-8").encode(text);
    // Sets the type of the blob using the encoding again
    const blob = new Blob([utf8EncodedCsv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    // Name of the exported file
    link.download = `Questionnaire_${id}.csv`;
    // Happens when clicked
    link.click();
    }
  )
  .catch(error => {
    
    // Error message in case of failure
    toast.error(`Export of Questionnaire ${id} in CSV failed!`, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000
      }
    );
  });
}
  
/*
  Gets the questionnaire with wanted id in JSON format
*/
const exportJSON=(id)=> {

  const DownloadJSON_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}`;

  fetch(DownloadJSON_URL, {
    headers: {
      "Accept-Charset": "utf-8",
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
  .then(response => {
    
    if (response.ok) {

      response.blob().then(blob => {

        // We directly make it into a blob cause encoding is not necessary and then
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // Name of the exported file
        a.download = `Questionnaire_${id}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        }
      );
      
      // Success message
      toast.success(`Export of Questionnaire ${id} in JSON succeeded!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        }
      )
    }
    else{

      // Error message in case of failure
      toast.error(`Export of Questionnaire ${id} in JSON failed!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
        }
      )
    }
  })
  .catch(error => {
    
    // Error message in case of failure
    toast.error(`Export of Questionnaire ${id} in JSON failed!`, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000
      }
    )
  });
};

/*
  Delete all the answers from selected questionnaire
*/
const handleDeleteAnswers=(id)=> {
  
  const ResetAnswers_URL = `http://${host}:${port}/intelliq_api/admin/resetq/${id}`;

  /*
    Sends POST message to reset all the answers for a specific questionnaire
  */
  fetch(ResetAnswers_URL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  .then(response => {

    if (response.ok) {
      
      // Shows success message
      toast.success(`All Answers of questionnaire ${id} deleted!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      })
    }
    else{

      // Error message in case of failure
      toast.error(`Failed to delete all Answers of questionnaire ${id}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,})
    }
  })
    .catch(error => {

      // Error message in case of failure
      toast.error(`Failed to delete all Answers of questionnaire ${id}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
        }
      )
    })   
}

/*
  This is the main function of the page. When the page starts,
  it fetches all questionnaires as soon as it loads, creates the
  UI of the page and helps the user choose keywords and select Questionnaire  
*/
function AdminQuestionnaire () {

  // Store all keywords contained in the database
  const [keywords, setKeywords] = useState([])

  // Store all selected keywords
  const [selectedOptions, setSelectedOptions] = useState([])

  // Store all fetched questionnaires
  const [questionnaires, setQuestionnaires] = useState([])

  // Fetch all available questionnaires and all available keywords from the database 
  useEffect(() => {
      
    var requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
    }

    /*
      Gets the questionnaires from the database. First we get the initial response,
      then we make sure the response is a JSON, then we set the Questionnaires var
      to the data of the questionnaires.
    */
    fetch(API_URL, requestOptions)
      .then(res => res.json())
        .then(data => setQuestionnaires(data))
          .catch(error => {

            // Error message in case of failure
            toast.error(`Failed to get questionnaires`, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000
              }
            )

          });

    requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
    }

    // Gets the Keys from the database
    fetch(KEYS_URL, requestOptions)
      .then(res => res.json())
        .then(data => setKeywords(data.Keywords))
          .catch(error => {

            // Error message in case of failure
            toast.error(`Failed to set keywords`, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000
              }
            )

          });
  }, [])

  
  /* 
    Creating the x-www-form-urlencoded post request to filter 
    displayed questionnaires based on user selected keywords
  */
  useEffect(() => {
      
    if (selectedOptions.length) { // if keywords are selected
      
      let payload = ''

      // forming the x-www-form-urlencoded body of the post request
      for (var i = 0; i < selectedOptions.length; i++) {
          
        payload += `keywords[${i}]=${selectedOptions[i].value}`
        if (i < selectedOptions.length-1) {
            payload += '&'
        }

      }
      
      var requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: payload
      }
    
      /* 
        Gets all questionnaires based on keywords
      */
      fetch(API_URL, requestOptions)
        .then(res => res.json())
          .then(response =>  setQuestionnaires(response))
            .catch(error => {

              // Error message in case of failure
              toast.error(`Failed to get questionnaires`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
                }
              );
            });

    }
    else { // no keyword seleced, fetch all questionnaires
      var requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
      }

      // Gets questionnaires without keywords
      fetch(API_URL, requestOptions)
        .then(res => res.json())
          .then(data => setQuestionnaires(data))
            .catch(error => {

              // Error message in case of failure
              toast.error(`Failed to get questionnaire`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
                }
              );
            });
    }
          
  }, [selectedOptions]) // method is triggered each time selectedOptions changes

  /*
    Creates the table that shows all questionnaires. For each questionnaire
    it gives the option to export in JSON, to export in CSV, to delete all
    answers or to see the graphs and statistics
  */
  var table = () => {
      
    // a new array with the size (rows) of reply array of objects size
    const data = new Array(questionnaires.length) 

    for (var i=0; i<questionnaires.length; i++) 
      data[i] = new Array(2);  // columns of it
    
    for (i=0; i<questionnaires.length; i++) {
      data[i][0] = questionnaires[i].QuestionnaireID;
      data[i][1] = questionnaires[i].QuestionnaireTitle;
    }

    return (
      <div id="table-responsive">
        <table>
          <thead id="questionnaire">
            <tr>
              <th>
                <h3><center><b>Questionnaire ID</b></center></h3>
              </th>
              <th>
                <h3><b>Title</b></h3>
              </th>
              <th>
                <h3><b>JSON</b></h3>
              </th>
              <th>
                <h3><b>CSV</b></h3>
              </th>
              <th>
                <h3><b>Delete all Answers</b></h3>
              </th>
              <th>
                <h3><b>View Statistics</b></h3>
              </th>
            </tr>
          </thead>
          <tbody id="questionnaire">
            {data.slice(0, data.length).map((item, index) => {
              return (
                <tr>
                    <td>
                      <h5>{item[0]}</h5>
                    </td>
                    <td>
                      <h5>{item[1]}</h5>
                    </td>
                    <td>
                      <button className="button blueColor" onClick={() => exportJSON(item[0])}>Export JSON</button>
                    </td>
                    <td>
                      <button className="button blueColor" onClick={() => exportCSV(item[0])}>Export CSV</button>
                    </td>
                    <td>
                      <button className="button redColor" onClick={() => handleDeleteAnswers(item[0])}>Delete all answers</button>
                    </td>
                    <td>
                      <Link to={`/Admin/Questionnaires/${item[0]}/Graphs`}>
                        <button className="button" >View Statistics</button>
                      </Link>
                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
        
  return (
    <div className="container">
      <div className="top">
        <center>
          {/* 
            In this table basic, info about the pages appear
          */}
          <table>
            <tbody>
              <tr>
                <td className="admintd">
                  <h2> Select Questionnaires </h2>
                </td>
                <td>
                  <Link to={"/Admin"}>
                    <button className="button" >Back</button>
                  </Link>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="admintd">
                  <h3> View all available questionnaires or filter by keywords </h3>
                </td>
              </tr>
            </tbody>
          </table>
        </center>
        <div className="app">
          {/*
            Used to choose keywords in a nice UI way
          */}
          <center><h2>Choose keywords</h2></center>
          <div className="dropdown-container">
              <Select
                  options={keywords.map(item => ({value: item, label: item}))}
                  placeholder="Select Keywords"
                  value={selectedOptions}
                  onChange={data => setSelectedOptions(data)}
                  isSearchable={true}
                  isMulti
              />
          </div>
        </div>
      </div>
      <header className="jumbotron" id="questionnaires">
          {questionnaires === null ? "Nothing to show" : table()}
      </header>
    </div>
  );

}
export default AdminQuestionnaire;