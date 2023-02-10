import React, { Component } from "react";
import './Admin.css'
import { Link } from 'react-router-dom';
const host = "localhost"
const port = 9103
const ResetAll_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
const Upload_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;
//const { answers } = this.state;
var id = "QQ000";


class Admin extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null,

    };
  }

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload = (event) => {
    event.preventDefault();

    const { selectedFile } = this.state;
    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(Upload_URL, {
      method: "POST",
      mode: 'no-cors',
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data; boundary=${formData._boundary}",
      },
    })
  };
  
  handleDelete() {
    fetch(ResetAll_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        "Content-Type": "application/w-xxx-form-urlencoded",
      },
    })     
  };

  

  render() {

    return (
      <div>
        <form method="post" encType="multipart/form-data" onSubmit={this.onFileUpload} >
          <label htmlFor="file-input">
            <span className="custom-file-upload">Choose File</span>
          </label>
          <input type="file" id="file-input" onChange={this.onFileChange} style={{ display: "none" }} />
          <button className="button" type="submit">Upload</button>
        </form>
        <button className="button" onClick={() => this.handleDelete()}>Delete All</button>
        <br/>
        <Link to={`/Admin/Questionnaires`}> <button className="button" >Questionnaire</button></Link>
        
          
        

      </div>
    );
  }
}

export default Admin;