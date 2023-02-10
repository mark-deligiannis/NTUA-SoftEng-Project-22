import React from "react";
import { Link } from 'react-router-dom';
import Select from "react-select";
import './User.css';
const API_URL = "http://localhost:9103/intelliq_api/fetchquestionnaires";
const KEYS_URL = "http://localhost:9103/intelliq_api/fetchkeywords";


export default class User extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			keywords: [],
			content: [],
      selectedOptions: [],

		};
	}

	componentDidMount() {

		var requestOptions = {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: JSON.stringify({ keywords: this.state.selectedOptions })
		}

		fetch(API_URL, requestOptions)
			.then(res => res.json())
       		.then(data => (data ? this.setState({ content: data }) : {}))
            .catch(error => {console.error("Error",error);});

		requestOptions = {
			method: 'GET',
			mode: 'cors',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}
	
		fetch(KEYS_URL, requestOptions)
			.then(res => res.json())
			.then(data => (data ? this.setState({ keywords: data.Keywords }) : {}))

	}

	updateTable(data) {
		this.setState({selectedOptions: data});
    	
  const payload = `keywords=footbal`;
  // var parameters = new URLSearchParams();
  // parameters.append('keywords :', JSON.stringify(keywords));



		var requestOptions = {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: payload
		}
		


		fetch(API_URL, requestOptions)
			.then(res => res.json())
			.then(res => console.log(res))
			.then(response =>  this.setState({ content: response }))
			.catch(error => {console.error("Error",error);});
	}


	table() {
    console.log("hello");
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



	render() {
		let options = this.state.keywords.map(item => ({value: item, label: item}));
    
		return (
			<div className="container">
				<div className="welcome">
					<h2> Select Questionnaires </h2>
					<p> View all available questionnaires or filter by keywords </p>
				<div className="app">
					<h2>Choose keywords</h2>
					<div className="dropdown-container">
						<Select
							options={options}
							placeholder="Select Keywords"
							value={this.state.selectedOptions}
							onChange={data => this.updateTable(data)}
							isSearchable={true}
							isMulti
						/>
					</div>
				</div>
				</div>
				<header className="jumbotron" id="questionnaires">
					{this.table()}
				</header>
			</div>
			
		);
	}
}