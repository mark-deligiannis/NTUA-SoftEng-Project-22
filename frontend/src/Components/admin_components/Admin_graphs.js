import React , {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { Pie } from "react-chartjs-2";
import { useParams } from 'react-router-dom';
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
/*This function returns Pie Chart data but replaces labels and their values with the passed arguments*/

var getPieChartData = (data) => {
  const labels = [];
    const helpData = [];
    let i = 0;
     for (let key in data) {
        labels[i] = key;
        helpData[i] = data[key];
        i++;
  }
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

 /*
     Fetches from the  API through the 'getquestionanswers/:questionnaireID/:questionID' Route 
     all answers related to a question. Transforms the output of the API (which is a JSON) 
     to an entry to a dictionary that has as key the question id and as values an array of all the option
      that have been selected for this question during all sessions 
     with the following format { 'questionID': [optionID1selected,optionID2selected,....]}
  */

async function getAnswersToQuestions(questid,qid) {
  const Answers_URL = `http://localhost:9103/intelliq_api/getquestionanswers/${questid}/${qid}`;
  
  try {
    const res = await fetch(Answers_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });;try{
      const data = await res.json();
      if (data) { //if the question has answers
        var z={};
        data===null ? z[`${qid}`]=[{}]: z[`${qid}`]=data.answers;
      return z;}
    }
      catch(error){
        /*if the question hasn't been answered the api returns an error with status 402
   however we want to create an entry for this question so we catch the error and we 
   create the entry {'questionid':[-1],so that we can handle it easier later}
*/ 
        var m={};
        m[`${qid}`]=[-1];
        return m;
      }
      
    } catch (error) {
      console.error("Error", error);
    }
} 

/*
     Fetches from the  API through the 'questionnairedump/:questionnaireID' Route 
     all the questions  and their options related to a questionnaire. 
*/

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

/*
     Fetches from the  API through the 'questionnaireanscount/:questionnaireID' Route 
     the number of the answer sessions.
*/

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
  /*
     Creating an array with length equal to the number of questions in the questonnaire and initialize it with false values everywhere 
 */

function initialiseDisplayAnswers(lim) {
  return Array.from({ length: lim }, () => false);
}


/*
  AllAnswers depends on the successful fetch of the questionnaire variable, because we fetch the answers passing as parameter questionID. 
  This returns a Promise which resolves only when every last question has its answers fetched.
*/

async function getAllAnswers(questid,question) {
  const promises = [];
  for (let i = 0; i < question.length; i++) {
    promises.push(getAnswersToQuestions(questid,question[i].qID));
    
  }
  return Promise.all(promises);
}

/*
  Count becomes a promise so that it can by used with then.
*/

async function getpcount(questid) {
  const promises3=[]; 
  promises3.push(getcount(questid));
  return Promise.all(promises3);
}

export default function AdminGraphs() {
  const params = useParams()
  const [count,setCount]=useState(0) //count of answers
  const [questionnaire,setQuestionnaire]=useState([]) //contains all the questions and their options 
  const [allAnswers,setAllAnswers]=useState({}) //contains all the questions and all the session answers 
  //controls which graphs are being shown each time (if the value is false the graph for this question is not shown)
  const [displayAnswers,setDisplayAnswers]=useState([])  
  /*this variable is false until all the above variables are initialized with the values 
  fetched from the API(fetch operations are async),until then a ui component is rendered to display the message loading*/ 
  const [loading,setLoading]=useState(true) 
  //This is the main component of the UI, contains buttons which contain the question text and when pressed reveal the graph for that question and some statistics 
  const [buttons,setButtons] =useState([]); 
  
  /*This function is used for creating the graph when the button is pressed */ 
  const  graphs=(qid,opts)=> {
    if(allAnswers[qid][0] === -1){//if we find no answers to that question
      return <center><h1 style={{color: 'black'}}>No answers yet!</h1></center>
    }
    else if(opts[0].opttxt==="<open string>"){ //if the question is not a multiple coice question (the only available option is <open string>)
      return <center><h1 style={{color: 'black'}}>Not a multiple choice question</h1></center>
    } 
    var optdict={}
    opts.forEach(entry => {
      optdict[entry.optID] = entry.opttxt;
      })
    const data = new Array(allAnswers[qid].length)   
    /* data is now a two dimensional array with rows as many as the answer to the wuestion and 2 columns*/
    for (var i=0; i<allAnswers[qid].length; i++) data[i] = new Array(2);  
    for (i=0; i<allAnswers[qid].length; i++) {
      data[i][0] = optdict[allAnswers[qid][i].ans];  //the first column of data contains the option text of the answer
      data[i][1] = allAnswers[qid][i].session; //the second column the session
    }
    var replies = 0;
    var graphAns1 = {};
    data.forEach((item) => { //parse data and find the frequencies of the options
      graphAns1[item[0]] = (graphAns1[item[0]] || 0) + 1;
    });
    for (let key in graphAns1) { //find total replies to the question
      replies = replies + graphAns1[key];
    }
    /*This returns the Pie Chart. We create the data for this Pie Chart passing as parameters 
    the options and their frequences(with graphAns1) and some other options for the graph*/
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
  
  
  /*When a button is pressed we change display value to true so that it shows the graph*/
  
   function toggleDisplayAnswers(i){
    var temp=[...displayAnswers];
    (displayAnswers[i]===true)?(temp[i]=false):(temp[i]=true);
    setDisplayAnswers(temp);
    return;
  }
  
  useEffect(() => {
    setLoading(true);
    let questionnaire, allAnswers, count, quest = params.id;//quest is the questionnaireID passed from the previous page
    getQuestionnaire(quest).then((response1) =>{ //the use of then chains the returned promises so that each step of the process is executed in order
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
  /*  Transforms the output of the API (which is a JSON) 
      to an array with entries{ 'questionID': [optionID1selected,optionID2selected,....]}
  */
      
      return getpcount(quest)
    })
    .then((response3) => {
      count = response3; 
      return initialiseDisplayAnswers(questionnaire.length);
    })
    .then((response4) =>{

      return {c:count,q:questionnaire,a:allAnswers,d:response4};
    }).then(data => {
        setCount(data.c[0]);  //initialization of all parameters
        setQuestionnaire(data.q); 
        setAllAnswers(data.a);   
        setDisplayAnswers(data.d); 
        setLoading(false); 
        
      })
      .catch(error => {
        setLoading(false);
      });
    
  }, []);

  useEffect(() => {
    /*we want this code to be executed after the first initialization. 
    Here we replace in the question text all instances of [*qid] or [*optid]*/
    if (loading !== true) { 
      const help = [];
      for (let i = 0; i < questionnaire.length; i++){
        const regex = /\[\*.*?]/g;   //this regular expression matches every instance of [*"any string that dosn't contain]"] 
        var y=questionnaire
        /*for every match replace the match with the question text if [*] contains qid or option text if [*] contains option text*/
        var x = questionnaire[i].qtext.replace(regex, (match) => { 
          if(match===null) {return match;} //if there is no match nothing happens
          else if(questionnaire.some(q => q.qID === match.slice(2,-1))) {
            var questtar=(questionnaire.find(q => q.qID === match.slice(2,-1))).qtext;
            return( `"${questtar}" `) ;
          }
          else{ 
            let que= questionnaire.find(q => q.options.some(o => o.optID ===match.slice(2,-1) ));
            var optxtar=que.options.find(item => item.optID ===match.slice(2,-1) ).opttxt
            return `"${optxtar}" `;
             }
          });
          y[i].qtext=x; //set the new question text that no longers contains [*] substrings
          setQuestionnaire(y)

      }  
      for (let i = 0; i < questionnaire.length; i++) { //we also create buttons for each question
        help.push(
          <div className="col-md-4 helpContainer">
            <div className="text-center helpCenter">
              <div>
                <button
                  key={i}
                  className="button blueColor verticalMiddle"
                  onClick={() => {
                    toggleDisplayAnswers(i); //Changes Display value (show and hide graph)
                  }}
                >
                  {questionnaire[i].qtext}
                </button>
              </div>
              <div className="pie-container"></div>
              {displayAnswers[i] && (
                <div key={i + 1} className="chart-container">
                  {graphs( //creation of graphs
                    questionnaire[i].qID,
                    questionnaire[i].options
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }
      setButtons(help);
    }
  }, [displayAnswers, loading]); /*this code is executed for the first time when loading changes from 
  true to false and after that every time a button is pressed(displayAnswers changes)*/

  if (loading) { //This shows while the pages loads(we wait for all the data to be fetched and buttons to be created)
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
