import React , {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { Pie } from "react-chartjs-2";
import { useParams, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "./Admin_graphs.css";
const host = "localhost";
const port = 9103;
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
    let i = 0;
    { for (let key in data) {
        labels[i] = key;
        helpData[i] = data[key];
        i++;
  }}
  console.log('gay',labels, helpData)
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
      //console.log(6,data)
      var z={};
      data===null ? z[`${qid}`]=[{}]: z[`${qid}`]=data.answers;
      //console.log(6,data)
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

export default function AdminGraphs() {
  const params = useParams()
  const [count,setCount]=useState(0)
  const [questionnaire,setQuestionnaire]=useState([])
  const [allAnswers,setAllAnswers]=useState({})
  const [displayAnswers,setDisplayAnswers]=useState([])
  const [LetsSeeGraphs,setLetsSeeGraphs]=useState(false)
  const [loading,setLoading]=useState(true)
  const [buttons,setButtons] =useState([]);
  const  graphs=(qid)=> {
    console.log('1', allAnswers)
    console.log(2, qid)
  if((allAnswers[qid][0] === [-1])){
    return <h1>Nothing to show</h1>
  }
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

   return (
   
    <div id="table-responsive">
      
      {(
      <div>
        {<Pie data={getPieChartData(graphAns1)} options={options} />}
      </div>)}
    </div>
  );
}
  
  
  
  
   function toggleDisplayAnswers(i){
    var temp=[...displayAnswers];
    (displayAnswers[i]===true)?(temp[i]=false):(temp[i]=true);
    setDisplayAnswers(temp);
    console.log(displayAnswers);
    return;
  }
  
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() =>{
    let questionnaire, allAnswers, count, quest = params.id;
    
    //setError(null);
    getQuestions(quest).then((response1) =>{
      questionnaire = response1;
      return getAllAnswers(quest,questionnaire)
    })
    .then((response2) =>{
      const result_dict = {};
      for (let d in response2){
        for (let key in response2[d]){
          result_dict[key] = response2[d][key]
      }}
      allAnswers = result_dict;
      return getpcount(quest)
    })
    .then((response3) => {
      count = response3; 
      return initialiseDisplayAnswers(questionnaire[0].length);
    })
    .then((response4) =>{
      console.log('donedonedone', questionnaire, allAnswers, count, response4)
      return {c:count,q:questionnaire,a:allAnswers,d:response4};
    }).then(data => {
        console.log(data)
        setCount(data.c[0]);
        setQuestionnaire(data.q);
        setAllAnswers(data.a);
        setDisplayAnswers(data.d);
        setLoading(false);
      })
      .catch(error => {
        //setError(error);
        setLoading(false);
      });
    },1000)
  }, []);

  useEffect(() =>{
    const help = [];
    for (let i = 0; i < 9; i++) {
      help.push(
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
                <p>qrite sdfsfgsg</p>
                {graphs(`Q0${i+1}`)}  
          </div>
            )
          }
          </div>
        </div>
      );}
      setButtons(help);
      console.log(buttons)
  },[displayAnswers])

  if (loading) {
    return <h1>Loading...</h1>;
  }
  
    
    function handleClick() {
      
      /*if(questionnaire !== null){
        const help = [];
    for (let i = 0; i < 1; i++) {
      help.push(
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
                <p>qrite sdfsfgsg</p>
                {graphs(`Q0${i}`)}  
          </div>
            )
          }
          </div>
        </div>
      );}
        setButtons(help);
      
      }*/
   setLetsSeeGraphs(true); }

  
  
  
  return (
    <div className="welcome">
          <p>Total Number of replies: { count }</p>
          {(!LetsSeeGraphs) ? (<button onClick={handleClick}>Let's see Graphs</button>) : (<>{buttons}</>)}
          </div>
  )
    

  };
