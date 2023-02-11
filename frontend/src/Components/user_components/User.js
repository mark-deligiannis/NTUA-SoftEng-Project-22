import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Select from "react-select";
import './User.css';
const API_URL = "http://localhost:9103/intelliq_api/fetchquestionnaires";
const KEYS_URL = "http://localhost:9103/intelliq_api/fetchkeywords";


function User() {

    const [keywords, setKeywords] = useState([])
    
    const [selectedOptions, setSelectedOptions] = useState([])
    
    const [questionnaires, setQuestionnaires] = useState([])



    useEffect(() => {
        console.log("hello")
        
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

   
    useEffect(() => {
        console.log('Updating Table...')
        
    	if (selectedOptions.length) {
            let payload = ''

            for (var i = 0; i < selectedOptions.length; i++) {
                payload += `keywords[${i}]=${selectedOptions[i].value}`
                if (i < selectedOptions.length-1) {
                    payload += '&'
                }
            }
            // console.log(payload)
            // console.log(selectedOptions)
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
      else {
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
            
	}, [selectedOptions])




    var table = () => {
        console.log('Building table...');
        //console.log(selectedOptions);

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
                    <div className="welcome">
                        <h2> Select Questionnaires </h2>
                        <p> View all available questionnaires or filter by keywords </p>
                    <div className="app">
                        <h2>Choose keywords</h2>
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
                </div>
        )
}

export default User;