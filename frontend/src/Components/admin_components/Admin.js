import React from "react";
import './Admin.css'
const host = "localhost"
const port = 9103
const ResetAll_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
const Upload_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;
//const { answers } = this.state;

class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.exportCSV = this.exportCSV.bind(this);
    this.exportJSON = this.exportJSON.bind(this);
    this.getAnswersToQuestions = this.getAnswersToQuestions.bind(this);
    this.state = {
      selectedFile: null,
      id: '',
      qid: '',
      answers: []
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
    const id = this.state.id;
    const DownloadJSON_URL = `http://${host}:${port}/intelliq_api/questionnaire/${id}`;

    fetch(DownloadJSON_URL, {
      headers: {
        "Accept-Charset": "utf-8",
        "Content-Type": "application/w-xxx-form-urlencoded",
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
    .catch(error => console.error(error));
    };

    getAnswersToQuestions() {
      const qid = this.state.qid;
      const Answers_URL = `http://${host}:${port}/intelliq_api/getquestionanswers/QQ000/${qid}`;
  
     
        const response = fetch(Answers_URL, {
          method: 'GET'
        }).then(res => res.json())
        .then(data => (data ? this.setState({ answers: data.answers }) : {}))
         .catch(error => {console.error("Error",error);
        });
      
      
      };

      graphs() {
        const data = new Array(this.state.answers.length)    // a new array with the size (rows) of reply array of objects size
        for (var i=0; i<this.state.answers.length; i++) data[i] = new Array(2);  // columns of it
        for (i=0; i<this.state.answers.length; i++) {
          data[i][0] = this.state.answers[i].ans;
          data[i][1] = this.state.answers[i].session;
        }
        return (
          <div id="table-responsive">
            <table>
              <thead id="questionnaire">
                <th><h3><b>Answer</b></h3></th>
                <th><h3><b>Session</b></h3></th>
              </thead>
              <tbody id="questionnaire">
                {data.slice(0, data.length).map((item, index) => {
                  return (
                    <tr>
                      <td><h5>{item[0]}</h5></td>
                      <td><h5>{item[1]}</h5></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      };

  render() {
    let answers = this.state.answers;

    return (
      <div>
        <form method="post" encType="multipart/form-data" onSubmit={this.onFileUpload} >
          <input type="file" onChange={this.onFileChange} />
          <button className="button" type="submit">Upload</button>
        </form>
        <button className="button" onClick={() => this.handleDelete()}>Delete All</button>
        <br/>
        
          <input type="text" placeholder="ID" onChange={(event) => this.setState({ id: event.target.value })} />
          <button className="button" onClick={this.exportCSV}>Export CSV</button>
          <button onClick={this.exportJSON}>Export JSON</button>
        
        <br />
        <br />
        
          <input type="text" placeholder="Question ID" onChange={(event) => this.setState({ qid: event.target.value })} />
          <button className="button" onClick={this.getAnswersToQuestions}>Get answers</button>
        
        <br />
        <br />
        <div>
        {this.graphs()}  
        </div>
      </div>
    );
  }
}

export default Admin;