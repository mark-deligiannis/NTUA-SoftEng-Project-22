import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Select from "react-select";
import './User.css';
const API_URL = "http://localhost:9103/intelliq_api/fetchquestionnaires";
const KEYS_URL = "http://localhost:9103/intelliq_api/fetchkeywords";


function User() {

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
    
    // if keywords are selected
    if (selectedOptions.length) {
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
              <th><h3><b>Questionnaire ID</b></h3></th>
              <th><h3><b>Title</b></h3></th>
              <th><h3><b>Answer Questionnaire</b></h3></th>
            </tr>
          </thead>
          <tbody id="questionnaire">
            {data.slice(0, data.length).map((item, index) => {
                return (
                    <tr>
                        <td><h5>{item[0]}</h5></td>
                        <td><h5>{item[1]}</h5></td>
                        <td><Link to={`Answer/${item[0]}`}> <button className="button" >Answer</button></Link></td>
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
                <td><Link to={"/"}> <button className="button" >Homepage</button></Link></td>
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
        {table()}
      </header>
    </div>
  )
}

export default User;