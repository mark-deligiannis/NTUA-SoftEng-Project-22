import React, { Component } from "react";
import { Link } from 'react-router-dom';
import './User.css';
const API_URL = "http://localhost:9103/intelliq_api/fetchquestionnaires";
const KEYS_URL = "http://localhost:9103/intelliq_api/fetchkeywords";


export default class User extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			keywords: [],
			content: []
		};
	}

  fetchKeywords(){
    const requestOptions = {
			method: 'GET',
			mode: 'cors',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}
	
	fetch(KEYS_URL, requestOptions)
		.then(res => res.json())
		.then(data => (data ? this.setState({ keywords: data.Keywords }) : {}))
		
  }

	componentDidMount() {

		const requestOptions = {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			//body: JSON.stringify({ keywords: [] })
		}
        //const API_URL = "//localhost:9103/intelliq_api/fetchquestionnaires"

		fetch(API_URL, requestOptions)
			.then(res => res.json())
			//.then(res => console.log(res))
       		.then(data => (data ? this.setState({ content: data }) : {}))
            .catch(error => {console.error("Error",error);});

	}


	table() {
    	//this.fetchQuestionnaire();
		const data = new Array(this.state.content.length)    // a new array with the size (rows) of reply array of objects size
		for (var i=0; i<this.state.content.length; i++) data[i] = new Array(2);  // columns of it
		for (i=0; i<this.state.content.length; i++) {
			data[i][0] = this.state.content[i].QuestionnaireID;
			data[i][1] = this.state.content[i].QuestionnaireTitle;
		}
		return (
			<div id="table-responsive">
				<table>
					<thead id="questionnaire">
						<td><h3><b>Questionnaire ID</b></h3></td>
						<td><h3><b>Title</b></h3></td>
						<td><h3><b>Answer Questionnaire</b></h3></td>
					</thead>
					<tbody id="questionnaire">
						{data.slice(0, data.length).map((item, index) => {
							return (
								<tr>
									<td><h5>{item[0]}</h5></td>
									<td><h5>{item[1]}</h5></td>
									<td><Link to={"/Answer_questionnaire"}> <button class="button" >Answer</button></Link></td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
  


  

  //<h1> {this.state.keywords} </h1>


	render() {
		//this.fetchKeywords();
		//const { keywords } = this.state.keywords;
		return (
			<div className="container">
				<div className="welcome">
					<h2> Select Questionnaires </h2>
					<p> View all available questionnaires </p>
				</div>
        			<header className="jumbotron" id="questionnaires">
						{this.table()}          
					</header>
			</div>
			
		);
	}
}