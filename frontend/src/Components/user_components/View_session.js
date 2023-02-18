import React, { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const SESSION_URL = "http://localhost:9103/intelliq_api/getsessionanswers/";
const QUESTION_URL = "http://localhost:9103/intelliq_api/question/";

function ViewSession() {
  
  const location = useLocation();
  const  previousQuestion  = location.state;

  // Store all answers retrieved from API
  const [state, setState] = useState({
    ans: [],
    index: -1
  })

  // Store each question to match IDs with text
  const [question, setQuestion] = useState([
    {
      qID: '',
      qtext: '',
      options: []
    }
  ]);
  

  // Store final answers to be displayed
  const [answer,setAnswer] = useState([]);

  // Match the parameters (id, session) from the url
  const params = useParams()

  // Fetch answers for the specific questionnaire and session using the API
  // Only runs when component mounts
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
      
    // Convert the fetched answers to JSON and the function state
    fetch(SESSION_URL + params.id + '/' + params.session, requestOptions)
      .then(res => res.json())
      .then(data => setState({ans: data.answers, index: 0}))
  }, [])

  
  // Fetch the i-th question answered (position indicated by state.index)
  // Only runs when state is updated
  useEffect(() => {
    // Only run after the first useEffect() fetches all answers
    if (state.index >= 0) {
      if(state.index < state.ans.length) {
        var quest = state.ans[state.index].qID

        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
          
        // Save only the info we need (question title, ID and available options)
        fetch(QUESTION_URL + params.id + '/' + quest, requestOptions)
          .then(res => res.json())
          .then(data => setQuestion({
              qID: data.qID,
              qtext: data.qtext,
              options: data.options
              }))
      }
    }
  }, [state])

  // Build the final answer to be displayed
  // Only runs when question is updated
  useEffect(() => {console.log(previousQuestion)
    // Only run after the first useEffect() fetches all answers
    if (state.index >= 0) {
      console.log('dddd',question.qID)
      // If answer originated from text field push question title with the original answer
      if (question.options[0].opttxt === "<open string>") {
        console.log(question.qID)
        setAnswer([
            ...answer,
            {
            qid:question.qID,
            qtext: question.qtext,
            ansTXT: state.ans[state.index].ans
            }
        ]);
      }
      // Else push question title with selected option text
      else {
        for (var j=0; j<question.options.length; j++) {
          if (question.options[j].optID === state.ans[state.index].ans) {
            const regex = /\[\*.*?]/g; 
            var x =question.qtext.replace(regex, (match) => { 
              if(match===null) {return match;} //if there is no match nothing happens
              else if( previousQuestion.some(q => q.qID === match.slice(2,-1))) {console.log('ffff')
                var questtar =(previousQuestion.find(q => q.qID === match.slice(2,-1))).qtext;
                console.log("elseif", questtar)
                return( `"${questtar}" `) ;
              }
              else{ 
    
                var optxtar=answer[state.index-1].ansTXT
                console.log("else", optxtar)
                return `"${optxtar}" `;
                 }})
            
                 console.log('33333',x)
               
            setAnswer([
              ...answer,
              { qid:question.qID,
                qtext: x,
                ansTXT: question.options[j].opttxt
              }
            ])
            console.log(question)
            console.log(answer)
            console.log(state.index)
          }
        }
      }
    }
    var s = state.ans
    setState({ans: s, index: state.index+1})
  }, [question])


  // Build table with final answers
  const table = () => {
      console.log(answer)
    const data = new Array(answer.length)    // a new array with the size (rows) of reply array of objects size
    for (var i=0; i<answer.length; i++) data[i] = new Array(2);  // columns of it
    
    for (i=0; i<answer.length; i++) {
     

      data[i][0] = answer[i].qtext;
      data[i][1] = answer[i].ansTXT;
    }
    console.log(data)
    return (
      <div id="table-responsive">
        <table>
          <thead id="session">
            <tr>
              <th><h3><b>Question</b></h3></th>
              <th><h3><b>Answer</b></h3></th>
            </tr>
          </thead>
          <tbody id="session">
            {data.slice(0, data.length).map((item, index) => {
              return (
                <tr key={index}>
                  <td><h5>{item[0]}</h5></td>
                  <td><h5>{item[1]}</h5></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="container"> 
      <div>
        <h2> Your Answers </h2>
      </div>
      <header className="jumbotron" id="session">
        {table()}
      </header>
      <div className="buttons">
        <Link to={"/User"}> <button className="button">Back to home</button></Link>
      </div>
    </div>
  )
}

export default ViewSession;