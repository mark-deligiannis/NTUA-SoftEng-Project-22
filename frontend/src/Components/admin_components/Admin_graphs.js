import React from "react";
import { Link } from 'react-router-dom';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "./Admin_graphs.css"
const host = "localhost"
const port = 9103
var id = "QQ001";


ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  width: 350,
  height: 350,
  textColor: '#000000',
  plugins: {
    legend: {
      labels: {
        color: '#000000',
        boxWidth: 15,
        padding: 10,
        fontStyle: 'bold',
        useBorderRadius: true,
        borderRadius: '20px',
        usePointStyle: true
      }
    }
  }

};

var getPieChartData = (data) => {

  const labels = [];
    const helpData = [];
    { for (var i=0; i<data.length; i++) {
        labels[i] = data[i][0];
        helpData[i] = data[i][1];
  }}
  return {
    labels: labels,
    datasets: [
      {
        data: helpData,
        backgroundColor: [
          "#F7464A",
          "#46BFBD",
          "#FDB45C",
          "#949FB1",
          "#4D5360",
          "#AC64AD"
        ],
        hoverBackgroundColor: [
          "#FF5A5E",
          "#5AD3D1",
          "#FFC870",
          "#A8B3C5",
          "#616774",
          "#DA92DB"
        ]
      }
    ]
  };
};

export default class AdminGraphs extends React.Component {
    constructor(props) {
        super(props);
        
        this.getAnswersToQuestions = this.getAnswersToQuestions.bind(this);
        this.toggleDisplayAnswers = this.toggleDisplayAnswers.bind(this);
    
        this.state = {
            answers: [],
            displayAnswers: new Array(4)
        };
      }
    
      toggleDisplayAnswers(i) {
        this.state.displayAnswers[i] = !this.state.displayAnswers[i];
        this.setState({  displayAnswers: this.state.displayAnswers });
      };
  
      async getAnswersToQuestions(qid) {
       
        //const qid = this.state.qid;
        const Answers_URL = `http://${host}:${port}/intelliq_api/getquestionanswers/${id}/${qid}`;
    
       
        const response = await fetch(Answers_URL, {
          method: 'GET'
        }).then(res => res.json())
        .then(data => {
          if (data) {
            this.setState(prevState => {
            const answers = { ...prevState.answers };
            answers[`${qid}`] = data.answers;
             return{ answers }});
          }
        })
          .catch(error => {console.error("Error",error);
        });
        
        };
  
        componentDidMount() {
          for (var i=0; i<4; i++){
            this.state.displayAnswers[i] = false;
            
          }
          for (var i=1; i<5; i++){
            this.getAnswersToQuestions(`Q0${i}`);
          }
          
        }
        
  
        graphs(qid) {
  
          const data = new Array(this.state.answers[qid].length)    // a new array with the size (rows) of reply array of objects size
          for (var i=0; i<this.state.answers[qid].length; i++) data[i] = new Array(2);  // columns of it
          for (i=0; i<this.state.answers[qid].length; i++) {
            data[i][0] = this.state.answers[qid][i].ans;
            data[i][1] = this.state.answers[qid][i].session;
          }
          var graphAns = {};
        data.forEach((item) => {
          graphAns[item[0]] = (graphAns[item[0]] || 0) + 1;
        });
      
        graphAns= Object.entries(graphAns);
  
      
          return (
            <>
              
              {graphAns && (
              <>
                {<Pie data={getPieChartData(graphAns)} options={options} />}
              </>)}
            </>
          );
  
        };

    render() {
      const buttons = [];
    for (let i = 0; i < 4; i++) {
      buttons.push(
        <div className="col-md-6">
          <div className="text-center">
          <h1>Question</h1>
        <button
          key={i}
          className="button"
          onClick={() => {
            this.toggleDisplayAnswers(i);
          }}
        >
         Question {i+1}
        </button>
        </div>
        <div className="pie-container">
        {
        this.state.displayAnswers[i] && (
            <div key={i+1} className="chart-container">
              {this.graphs(`Q0${i+1}`)}  
            </div>
          )
        }
        </div>
        </div>
      );
    }

    return (
      <div className="container">
      <div className="row">
      {buttons}
      </div> 
      
      <br/>

      <div className="buttons">
        <Link to={`/Admin/Questionnaires`}> <button className="button" >Questionnaire</button></Link>
        <Link to={"/Admin"}> <button className="button" >Back</button></Link>
      </div>
      </div>
  );
}
}