import React , {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { Pie } from "react-chartjs-2";
import { useParams, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "./Admin_graphs.css";
const host = "localhost";
const port = 9103;
var id = 'QQ001';
const buttons = [];
ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  width: 100,
  height: 100
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






async function getAnswersToQuestions(questid,qid) {
  const Answers_URL = `http://localhost:9103/intelliq_api/getquestionanswers/${questid}/${qid}`;
  
  try {
    const res = await fetch(Answers_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });try{
    const data = await res.json();
    if (data) {
      console.log(6,data)
      var z={};
      data===null ? z[`${qid}`]=[{}]: z[`${qid}`]=data.answers;
      console.log(6,data)
    return z;}
  }
    catch(error){
      var z={};
      z[`${qid}`]=[-1];
      return z;
    }
    
  } catch (error) {
    console.error("Error", error);
  }
}

async function getQuestionnaire(quest) {
  const Questionnaire_URL = `http://${host}:${port}/intelliq_api/questionnairedump/${quest}`;
    
  try {
    const res = await fetch(Questionnaire_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await res.json();
    if (data) {
      return data.questions;
    }
  } catch (error) {
    console.error("Error", error);
  }
}

async function getcount(quest) {
  const Count_URL = `http://${host}:${port}/intelliq_api/questionnaireanscount/${quest}`;
    
  try {
    const res = await fetch(Count_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await res.json();
    if (data) {
      console.log(data)
      return data.Number;
    }
  } catch (error) {
    console.error("Error", error);
  }
}

function initialiseDisplayAnswers(lim) {
  return Array.from({ length: lim }, () => false);
}

async function getAllAnswers(questid,question) {
  const promises = [];
  for (let i = 0; i < question[0].length; i++) {
    promises.push(getAnswersToQuestions(questid,question[0][i].qID));
  }
  return Promise.all(promises);
}


async function getQuestions(questid) {
  const promises=[];
 
  promises.push(getQuestionnaire(questid));
  
  return Promise.all(promises);
}
async function getpcount(questid) {
  const promises3=[];
 
  promises3.push(getcount(questid));
  
  return Promise.all(promises3);
}

async function start(quest) {
  try {
    
    const questionnaire = await getQuestions(quest);
    console.log(7,questionnaire[0].length)
    const allAnswers = await getAllAnswers(quest,questionnaire);
    const count=await getpcount(quest);
    const displayAnswers = initialiseDisplayAnswers(questionnaire[0].length);
    console.log('Questionnaire:', questionnaire);
    console.log('All Answers:', allAnswers);
    console.log('Display Answers:', displayAnswers);
    return {c:count,q:questionnaire,a:allAnswers,d:displayAnswers};
  } catch (error) {
    console.error("Error", error);
  }
}

export default function AdminGraphs() {
  const params = useParams()
  const [count,setCount]=useState(0)
  const [questionnaire,setQuestionnaire]=useState([])
  const [allAnswers,setAllAnswers]=useState([])
  const [displayAnswers,setDisplayAnswers]=useState([])
  /*const [graphAns,setGraphAns]=useState([])
  const  graphs=(qid)=> {
  
    const data = new Array(allAnswers[qid].length)    // a new array with the size (rows) of reply array of objects size
    for (var i=0; i<allAnswers[qid].length; i++) data[i] = new Array(2);  // columns of it
    for (i=0; i<allAnswers[qid].length; i++) {
      data[i][0] = allAnswers[qid][i].ans;
      data[i][1] = allAnswers[qid][i].session;
    }
    var graphAns1 = {};
  data.forEach((item) => {
    graphAns1[item[0]] = (graphAns1[item[0]] || 0) + 1;
  });
  
   setGraphAns( Object.entries(graphAns1));
}
  
  
  
  
   function toggleDisplayAnswers(i){
    var temp=displayAnswers
    temp[i]=!displayAnswers[i]
    setDisplayAnswers(temp);
    return;
  }
*/
  useEffect(() => {
    var z=start(params.id);
    setQuestionnaire(z.q);
    setCount(z.c);
    setAllAnswers(z.a);
    setDisplayAnswers(z.d)
    console.log(count,questionnaire,allAnswers,displayAnswers)
    

    /*for (let i = 0; i < questionnaire.length; i++) {
      buttons.push(
        <div className="display-container">
        <button
          key={i}
          className="button"
          onClick={() => {
            
          toggleDisplayAnswers(i);
          }}
        >
         Question {i+1}
        </button>
        <div className="pie-container">
        {
        displayAnswers[i] && (
            <div key={i+1}>
              {graphs(`Q0${i+1}`)}  
            </div>
          )
        }
        </div>
        </div>
      );*/
     

  }, []);

  const handleClick = () => {
    setCount(count + 1);}

  
  
  
  return (
    <div className="welcome">
          <p> Total answers: { count } </p>
          <button onClick={handleClick}>Increment</button>
          </div>
  )
    
  
  
  
  
  
  
  
  
  
  

  };
