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
  width: 550,
  height: 550,
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
    let i = 0;
    { for (let key in data) {
        labels[i] = key;
        helpData[i] = data[key];
        i++;
  }}
  let sum = 0;
  for (i=0; i<helpData.length; i++){
    sum = sum + helpData[i];
  }
  let customeLabels = labels.map((label,index) =>`${label}: ${(100*helpData[index]/sum).toFixed(2)}%`)
  
  return {
    labels: customeLabels,
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
      var z={};
      data===null ? z[`${qid}`]=[{}]: z[`${qid}`]=data.answers;
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
  const [loading,setLoading]=useState(true)
  const [buttons,setButtons] =useState([]);
  const  graphs=(qid,opts)=> {
  if(allAnswers[qid][0] === -1){
    return <center><h1 style={{color: 'black'}}>No answers yet!</h1></center>
  }
  else if(opts[0].opttxt==="<open string>"){
    return <center><h1 style={{color: 'black'}}>Not a multiple choice question</h1></center>

  } 
    var optdict={}
    opts.forEach(entry => {
      optdict[entry.optID] = entry.opttxt;
  })

    
    const data = new Array(allAnswers[qid].length)    // a new array with the size (rows) of reply array of objects size
    for (var i=0; i<allAnswers[qid].length; i++) data[i] = new Array(2);  // columns of it
    for (i=0; i<allAnswers[qid].length; i++) {
      data[i][0] = optdict[allAnswers[qid][i].ans];
      data[i][1] = allAnswers[qid][i].session;
    }
    var replies = 0;
    var graphAns1 = {};
  data.forEach((item) => {
    graphAns1[item[0]] = (graphAns1[item[0]] || 0) + 1;
  });

    { for (let key in graphAns1) {
        replies = replies + graphAns1[key];
  }}

   return (
   
    <div id="table-responsive">
      
      {(
        <>
        {<h5 style={{width: '350px'}}>{`Total number of replies for the above question: ${replies}`}</h5>}
      <div>
        {<Pie data={getPieChartData(graphAns1)} options={options} />}
      </div>
      </>)}
    </div>
  );
}
  
  
  
  
   function toggleDisplayAnswers(i){
    var temp=[...displayAnswers];
    (displayAnswers[i]===true)?(temp[i]=false):(temp[i]=true);
    setDisplayAnswers(temp);
    return;
  }
  
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() =>{
    let questionnaire, allAnswers, count, quest = params.id;
    
    //setError(null);
    getQuestions(quest).then((response1) =>{
      questionnaire = response1;
      console.log(response1)
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

      return {c:count,q:questionnaire,a:allAnswers,d:response4};
    }).then(data => {
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
    },0)
  }, []);

  useEffect(() => {
    if (loading !== true) {
      const help = [];
      for (let i = 0; i < questionnaire[0].length; i++) {
        help.push(
          <div className="col-md-4 helpContainer">
            <div className="text-center helpCenter">
              <div>
                <button
                  key={i}
                  className="button lightBlueColor verticalMiddle"
                  onClick={() => {
                    toggleDisplayAnswers(i);
                  }}
                >
                  {questionnaire[0][i].qtext}
                </button>
              </div>
              <div className="pie-container"></div>
              {displayAnswers[i] && (
                <div key={i + 1} className="chart-container">
                  {graphs(
                    questionnaire[0][i].qID,
                    questionnaire[0][i].options
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }
      setButtons(help);
    }
  }, [displayAnswers, loading]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="welcome">
          <center>
            <h2><b>Total Number of replies:</b> { count }</h2> 
            <Link to={`/Admin/Questionnaires`}> <button className="button" >Change Questionnaire</button></Link>
          </center>
          <div className="container">
            <div className="row">
              {buttons}
            </div>
          </div>
    </div>
  )
    

  };
