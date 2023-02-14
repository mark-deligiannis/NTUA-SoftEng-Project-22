import React,{useState,useEffect} from "react";
import { Link } from 'react-router-dom';
import Select from "react-select";
import "./Admin_questionnaire.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_URL = "http://localhost:9103/intelliq_api/fetchquestionnaires";
const KEYS_URL = "http://localhost:9103/intelliq_api/fetchkeywords";
const host = "localhost";
const port = 9103;


const exportCSV=(id)=> {
  //const id  = this.state.id;
  const DownloadCSV_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}?format=csv`;

  fetch(DownloadCSV_URL, {
    headers: {
      "Accept-Charset": "utf-8",
      //"mode": "no-cors",
      "Content-Type": "application/x-www-form-urlencoded",
    }})
  .then(response => {
    return response.text();
  })
  .then(text => {
    console.log(text);
    console.log(DownloadCSV_URL);
    const utf8EncodedCsv = new TextEncoder("UTF-8").encode(text);
    const blob = new Blob([utf8EncodedCsv], { type: 'text/csv;charset=utf-8;' });
    //var csv = new Blob([text], { type: 'text/csv;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv';
    link.click();
  })
  .catch(error => {
    console.error(error).then(
      toast.success("Export of CSV failed!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, 
      
    }))
  
  });
  }
  

  const exportJSON=(id)=> {
    //const id = this.state.id;
    const DownloadJSON_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}`;

    fetch(DownloadJSON_URL, {
      headers: {
        "Accept-Charset": "utf-8",
        //"mode": "no-cors",
        "Content-Type": "application/x-www-form-urlencoded",
      }})
    .then(response => {
      response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "data.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    })
    .catch(error => console.error(error)
    .then(
      toast.success("Export of JSON failed!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, 
      
    }))
    );
    };
    const handleDeleteAnswers=(id)=> {
      const ResetAnswers_URL = `http://${host}:${port}/intelliq_api/admin/resetq/${id}`;
      try{
      fetch(ResetAnswers_URL, {
        method: 'POST',
       // mode: 'no-cors',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then(
        toast.success(`Delete Answers for Questionnaire ${id} succeeded!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000, 
        
      }))  }
      catch(error){
        console.log(error).then(
          toast.success(`Delete Answers for Questionnaire ${id} failed!`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000, 
          
        }))
      }   
    }



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
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}

		fetch(API_URL, requestOptions)
			.then(res => res.json())
       		.then(data => setQuestionnaires(data))
            .catch(error => {console.error("Error",error)});

		requestOptions = {
			method: 'GET',
			mode: 'cors',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}
	
		fetch(KEYS_URL, requestOptions)
			.then(res => res.json())
			.then(data => setKeywords(data.Keywords))
            .catch(error => {console.error("Error",error)});

    }, [])

   
    // Creating the x-www-form-urlencoded post request to filter displayed questionnaires based on user selected keywords
    useEffect(() => {
       
        
    	if (selectedOptions.length) { // if keywords are selected
            let payload = ''

            for (var i = 0; i < selectedOptions.length; i++) { // forming the x-www-form-urlencoded body of the post request
                payload += `keywords[${i}]=${selectedOptions[i].value}`
                if (i < selectedOptions.length-1) {
                    payload += '&'
                }
            }
            
            var requestOptions = {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: payload
            }
            

            fetch(API_URL, requestOptions)
                .then(res => res.json())
                .then(response =>  setQuestionnaires(response))
                .catch(error => {console.error("Error",error)});
        }
      else { // no keyword seleced, fetch all questionnaires
        var requestOptions = {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}

		fetch(API_URL, requestOptions)
			.then(res => res.json())
       		.then(data => setQuestionnaires(data))
            .catch(error => {console.error("Error",error)});
      }
            
	}, [selectedOptions]) // method is triggered each time selectedOptions changes




    var table = () => {
        
            const data = new Array(questionnaires.length)    // a new array with the size (rows) of reply array of objects size
            for (var i=0; i<questionnaires.length; i++) data[i] = new Array(2);  // columns of it
            for (i=0; i<questionnaires.length; i++) {
                data[i][0] = questionnaires[i].QuestionnaireID;
                data[i][1] = questionnaires[i].QuestionnaireTitle;
            }
            return (
                <div id="table-responsive">
                    <table>
                        <thead id="questionnaire">
                            <tr>
                                <th><h3><center><b>Questionnaire ID</b></center></h3></th>
                                <th><h3><b>Title</b></h3></th>
                                <th><h3><b>JSON</b></h3></th>
                                <th><h3><b>CSV</b></h3></th>
                                <th><h3><b>Delete all Answers</b></h3></th>
                                <th><h3><b>View Statistics</b></h3></th>
                            </tr>
                        </thead>
                        <tbody id="questionnaire">
                            {data.slice(0, data.length).map((item, index) => {
                                return (
                                    <tr>
                                        <td><h5>{item[0]}</h5></td>
                                        <td><h5>{item[1]}</h5></td>
                                        <td><button className="button" onClick={() => exportJSON(item[0])}>Export JSON</button></td>
                                        <td><button className="button" onClick={() => exportCSV(item[0])}>Export CSV</button></td>
                                        <td><button className="button redColor" onClick={() => handleDeleteAnswers(item[0])}>Delete all answers</button></td>
                                        <td><Link to={`/Admin/Questionnaires/${item[0]}/Graphs`}> <button className="button blueColor" >View Statistics</button></Link></td>
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
          <table>
            <tbody>
            <tr>
              <td className="admintd"><h2> Select Questionnaires </h2></td>
              <td><Link to={"/Admin"}> <button className="button" >Back</button></Link></td>
            </tr>
            <tr>
              <td colSpan="2" className="admintd"><h3> View all available questionnaires or filter by keywords </h3></td>
            </tr>
            </tbody>
          </table>
        </center>
      <div className="app">
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
          {questionnaires === null ? "Hello" : table()}
      </header>
      <ToastContainer/>
  </div>
      
  );

}
export default AdminQuestionnaire;