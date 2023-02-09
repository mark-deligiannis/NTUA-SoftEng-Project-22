import React from "react";
const host = "localhost"
const port = 9103
const id = "QQ000"
const ResetAll_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
const Upload_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;
const DownloadCSV_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}?format=csv`;
const DownloadJSON_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}`;


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

  exportCSV() {

  /*fetch(DownloadCSV_URL)
  .then(response => {
    response.blob({ type: "text/csv;charset=UTF-8" }).then(blob => {
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "data.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  })
  .catch(error => console.error(error));*/
  fetch(DownloadCSV_URL)
  .then(response => {
    return response.text();
  })
  .then(text => {
    console.log(text);
    var csv = new Blob([text], { type: 'text/csv;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(csv);
    link.download = 'data.csv';
    link.click();
  })
  .catch(error => {
    console.error(error);
  
  });
  };

  exportJSON() {

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
          <button type="submit">Upload</button>
        </form>
        <button onClick={() => this.handleDelete()}>Delete All</button>
        <button onClick={this.exportCSV}>Export CSV</button>
        <button onClick={this.exportJSON}>Export JSON</button>
      </div>
    );
  }
}

export default Admin;