import React from "react";
import './Admin.css'
const host = "localhost"
const port = 9103
var id
const ResetAll_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
const Upload_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;
const DownloadCSV_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}?format=csv`;
var DownloadJSON_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}`;


class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.exportCSV = this.exportCSV.bind(this);
    this.exportJSON = this.exportJSON.bind(this);
    this.state = {
      selectedFile: null,
      id: ''
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

  exportCSV() {
  const id  = this.state.id;
  const DownloadCSV_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}?format=csv`;

  fetch(DownloadCSV_URL, {
    headers: {
      "Accept-Charset": "utf-8",
      "Content-Type": "application/w-xxx-form-urlencoded",
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
    console.error(error);
  
  });
  };
  

  exportJSON() {
    const { id } = this.state;
    const DownloadJSON_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}`;

    fetch(DownloadJSON_URL)
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
    .catch(error => console.error(error));
    };

  render() {
    return (
      <div>
        <form method="post" encType="multipart/form-data" onSubmit={this.onFileUpload} >
          <input type="file" onChange={this.onFileChange} />
          <button class="button" type="submit">Upload</button>
        </form>
        <button class="button" onClick={() => this.handleDelete()}>Delete All</button>
        <br/>
        <button class="button" onClick={this.exportCSV}>Export CSV</button>
        <br/>
        <button class="button" onClick={this.exportJSON}>Export JSON</button>
        <br/>
        
        <input type="text" onChange={(event) => { this.setState({id: event.target.value}) }} />
      </div>
    );
  }
}

export default Admin;