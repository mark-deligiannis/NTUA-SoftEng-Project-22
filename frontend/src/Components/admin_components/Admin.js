import React from "react";
const host = "localhost"
const port = 9103
const Reset_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
const API_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;


class Admin extends React.Component {
  //API_URL = "localhost:9103/intelliq_api/admin/questionnaire_upd";
  
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
    const formData = new Blob([selectedFile], { type: "application/json" });

    //formData.append("file", selectedFile);

    fetch(API_URL, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  };

  handleDelete() {

    fetch(Reset_URL, {
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
        <form method="post" enctype="multipart/form-data" onSubmit={this.onFileUpload} >
          <input type="file" onChange={this.onFileChange} />
          <button type="submit">Upload</button>
        </form>
        <button onClick={() => this.handleDelete()}>Delete All</button>
      </div>
    );
  }
}

export default Admin;