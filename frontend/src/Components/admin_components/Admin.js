import React from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
//import { Doughnut, Pie } from "react-chartjs-2";
import './Admin.css'
import AdminGraphs from "./Admin_graphs";
import { Routes, Route, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
const host = "localhost"
const port = 9103
const ResetAll_URL = `http://${host}:${port}/intelliq_api/admin/resetall`;
const Upload_URL = `http://${host}:${port}/intelliq_api/admin/questionnaire_upd`;
//const { answers } = this.state;
var a = 0;
var b = 10;
var c = 20;
var d = 30;

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.exportCSV = this.exportCSV.bind(this);
    this.exportJSON = this.exportJSON.bind(this);
    this.getAnswersToQuestions = this.getAnswersToQuestions.bind(this);
    this.toggleDisplayAnswers = this.toggleDisplayAnswers.bind(this);
    this.state = {
      selectedFile: null,
      id: '',
      qid: '',
      answers: [],
      displayAnswers: false,
      hasLoaded: false
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
      "mode": "no-cors",
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
        "mode": "no-cors",
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

    toggleDisplayAnswers() {
      this.setState({ displayAnswers: !this.state.displayAnswers });
    };

    getAnswersToQuestions(qid) {
     
      //const qid = this.state.qid;
      const Answers_URL = `http://${host}:${port}/intelliq_api/getquestionanswers/QQ000/${qid}`;
  
     
      const response = fetch(Answers_URL, {
        method: 'GET'
      }).then(res => res.json())
      .then(data => (data ? this.setState({ answers: data.answers }) : {}))
       .catch(error => {console.error("Error",error);
      });
      
      
      };

      PieChart(graphAns) {
        var ctx = document.getElementById("myChart").getContext("2d");

        // destroy the chart before reusing the canvas
        if (window.myChart) {
        window.myChart.destroy();
        }
        const labels = [];
        const count = [];
      
        for (let item of graphAns) {
          labels.push(item.label);
          count.push(item.count);
        }
        myChart.destroy();
        const myChart = new Chart(ctx, {
        type: 'line',
        data: {
          chartData: {
            labels: labels,
            
            
            datasets: [
              {
                label: "# of Votes",
                data: count,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)"
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)"
                ],
                borderWidth: 1
              }
            ]
          }
        }});
        
      
          return (
            <div className="pie-chart">
              <Pie
                data={myChart.data.chartData}
                options={{
                  title: {
                    display: true,
                    text: "Pie Chart Example",
                    fontSize: 25
                  },
                  legend: {
                    display: true,
                    position: "right"
                  }
                }}
              />
            </div>
          );
      };

      componentDidMount() {
        this.getAnswersToQuestions('Q01');
        console.log('This will only be printed once.');
      }
      
      componentDidUpdate(prevProps, prevState) {
        if (prevState.answers === this.state.answers) {
          return;
        }
      }
      

      graphs() {
        
        const data = new Array(this.state.answers.length)    // a new array with the size (rows) of reply array of objects size
        for (var i=0; i<this.state.answers.length; i++) data[i] = new Array(2);  // columns of it
        for (i=0; i<this.state.answers.length; i++) {
          data[i][0] = this.state.answers[i].ans;
          data[i][1] = this.state.answers[i].session;
        }
        var graphAns = {};
      data.forEach((item) => {
        graphAns[item[0]] = (graphAns[item[0]] || 0) + 1;
      });
      
      
      graphAns= Object.entries(graphAns);


        return (
          <div id="table-responsive">
            <table>
              <thead id="questionnaire">
                <tr>
                  <th><h3><b>Questionnaire ID</b></h3></th>
                  <th><h3><b>Title</b></h3></th>
                </tr>
              </thead>
              <tbody id="questionnaire">
                { graphAns.slice(0, graphAns.length).map((item, index) => {
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

        //return (
          {/*<div>
        <h1>My Pie Chart</h1>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
          </PieChart>
        </ResponsiveContainer>
            </div>*/}
        //);
      };

  render() {
    //let answers = this.state.answers;

    {console.log("I am a fucking hoe");}
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
        
          <input type="text" placeholder="ID" onChange={(event) => this.setState({ id: event.target.value })} />
          <button className="button" onClick={this.exportCSV}>Export CSV</button>
    <button className="button" onClick={this.exportJSON}>Export JSON</button>
        
        <br />
        <br />
          <button className="button" onClick={() => { this.toggleDisplayAnswers();  }}>Get answers</button>
        <br />
        <br />
        { this.state.displayAnswers && (
        <div>
          <p>hey there</p>
          {this.graphs()}  
        </div>
        )}
      <Link to={"/Admin/Graphs"}> <button className="button" >Graphs</button></Link>
        {/*<Link to={"Graphs"}> <button className="button" >Graphs</button></Link>*/}
        <Routes>
          <Route path={ "Admin/Graphs"} element={<AdminGraphs />} />
        </Routes>

      </div>
    );
  }
}

export default Admin;