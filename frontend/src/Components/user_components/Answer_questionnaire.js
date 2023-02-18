import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './Answer_questionnaire.css';
const QUESTIONNAIRE_URL = "http://localhost:9103/intelliq_api/questionnaire/";
const QUESTION_URL = "http://localhost:9103/intelliq_api/question/";
const ANSWER_URL = "http://localhost:9103/intelliq_api/doanswer/";




function AnswerQuestionnaire() {
  // State that holds the the next question qid
  const [state, setState] = useState({
    nextQuestion: null
  })
  
  // State that represents the current question object
  const [question, setQuestion] = useState({ 
    qID: '',
    qtext: '',
    required: '',
    type: '',
    options: []
  })

  // State that represents the previous question object
  const [previousQuestion, setPreviousQuestion] = useState({ //it stores the previous question,used for replacing regular expression  
    qID: '',
    qtext: '',
    required: '',
    type: '',
    options: []
  })
  //is an array of previous questions used for passing it an an argument to view_session.js for replacing regular expressions there 
  const [prevQuestion, setPrevQuestion] = useState([{ 
    qID: '',
    qtext: '',
    required: '',
    type: '',
    options: []
  }])

  // List where user's answers will progressively be stored
  const [answer, setAnswer] = useState([ 
    {
      qID: '',
      optID: '',
      ansTXT: ''
    }
  ])

  // Index to store the current selected option (before clicking next)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null) 
  
  // The URL parameters (Questionnaire ID)
  const params = useParams()  
  
  // Questionnaire Title
  const [qTitle, setTitle] = useState('') 
  
  // Boolean state to indicate if the quiz is starting
  const [qStart, setStart] = useState('TRUE')  
  
  // Boolean state to indicate if the quiz is to be finished (user reaches final question)
  const [qFinish, setFinish] = useState('FALSE') 
  
  // state that holds input text for open string questions
  const [inputValue, setInputValue] = useState(''); 

  // State that holds the randomly created session number
  const [session, setSession] = useState(''); 

  let navigate = useNavigate();
  

  // This method fetches the questionnaire, computes session number and sets first question and title
  useEffect(() => { 
    
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }

    fetch(QUESTIONNAIRE_URL + params.id, requestOptions)
      .then(res => res.json())
      .then(data => {
        setState({nextQuestion: data.questions[0].qID})
        setTitle(data.questionnaireTitle)
      })
    
    generateRandomString()
  }, [])
  
  
  // This method fetches a question based on question id and updates the corresponding state
  const showQuestion = (quest) => { 
    
    setStart('FALSE')
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
    

    fetch(QUESTION_URL + params.id + '/' + quest, requestOptions)
      .then(res => res.json())
      .then(data =>{
        const regex = /\[\*.*?]/g;  //this regular expression matches every instance of [*"any string that dosn't contain]"] 
        /*for every match replace the match with the question text if [*] contains qid or option text if [*] contains option text*/
        var x = data.qtext.replace(regex, (match) => { 
          if(match===null) {return match;} //if there is no match nothing happens
          else if( previousQuestion.qID === match.slice(2,-1)) { //if the match contains qid replace it with the previous question's qtext
            var questtar = previousQuestion.qtext;
            //add this question to the table that will be passed to view sessions
            setPrevQuestion([...prevQuestion,{
              qID: previousQuestion.qID,
              qtext: previousQuestion.qtext,
              required: previousQuestion.required,
              type: previousQuestion.type,
              options: previousQuestion.options
            }])
            return( `"${questtar}" `) ;
          }
          else{ //else replace it with the previous question's opttxt of the option that matces the optid

            var optxtar=previousQuestion.options.find(item => item.optID ===match.slice(2,-1) ).opttxt
            
            return `"${optxtar}" `;
             }
          });
           
        setPreviousQuestion({
          qID: data.qID,
          qtext: x,
          required: data.required,
          type: data.type,
          options: data.options
        })
        
        setQuestion({
          qID: data.qID,
          qtext: x,
          required: data.required,
          type: data.type,
          options: data.options
        })})
        
  }
    
  // This method updates next question state after clicking the button "Next"
  const onAnswerSelected = (option) => {
    setSelectedAnswerIndex(option.optID)
    setState({nextQuestion: option.nextqID})
  }

  // This method creates a 4 character random string and updates session
  const generateRandomString = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomStringArray = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]);
    setSession(randomStringArray.join(''));
  };


  // CREATE SESSION ANSWER
  // This method is called after clicking button "View Answers" and converts each answer into x-www-form-urlencoded form
  // Then it POSTS each answer to the database and redirects to view session pags
  async function createSessionAnswer() { 
   
    
    var i = 1
    var flag = 1
    for (i = 1; i < answer.length; i++ ) {
      var ans = answer[i]
      
      const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'answer='+ ans.ansTXT
      }

      await fetch(ANSWER_URL + params.id + '/' + ans.qID + '/' + session + '/' + ans.optID, requestOptions)
        .then(res => {flag++})
        .catch(error => {console.error("Error",error);});
    }
    
    if (flag===answer.length){ 
      
      let path = session;
     
      navigate(`${path}`, {state: prevQuestion}); //passing prevQuestion as parameter
    }
  }
  
  // This method handles questionnaire behaviour after clicking next
  const onClickNext = () => {
    if (question.required === 'FALSE' && selectedAnswerIndex === null){
      
      setState({nextQuestion: question.options[0].nextqID})
      if (state.nextQuestion !== '-') {
        showQuestion(question.options[0].nextqID)
      }
      if (state.nextQuestion === '-') {
        setFinish('TRUE')
      }
    }
    else {
      if(question.qID !== ''){
        
        setAnswer([
            ...answer,
            {
              qID: question.qID,
              optID: selectedAnswerIndex,
              ansTXT: inputValue
            }
          ])
      }
      setInputValue('')
      setSelectedAnswerIndex(null)
      
      if (state.nextQuestion === '-') {
        setFinish('TRUE')
      }
      else {
        showQuestion(state.nextQuestion)
      }
    }
  }

  //This method handles text input changes in the given field
  const handleInputChange = (event, option) => { 
    setSelectedAnswerIndex(option.optID);
    setState({nextQuestion: option.nextqID});
    setInputValue(event.target.value);
  };


  return (
  <center>
    <h2> {qTitle} </h2>
    <div className="quiz-container">
      {qFinish !== 'TRUE' ? (
        <div>
          <h2>{question.qtext}</h2>
          <ul>
            {question.options.map((option) => (
              option.opttxt !== "<open string>" ?
              <li
                onClick={() => onAnswerSelected(option)}
                key={option.opttxt}
                className={
                  selectedAnswerIndex === option.optID ? 'selected-answer' : null
                }>
                {option.opttxt}
              </li>
              : <div key={option.optID}>
              <input type="text" value={inputValue} onChange={event => handleInputChange(event, option)} />
            </div>
            ))}
          </ul>
          <div className="flex-right">
            <button onClick={onClickNext} disabled={selectedAnswerIndex === null && question.required === 'TRUE'}>
              {qStart === 'TRUE' ? 'Start' : state.nextQuestion === '-' ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div className="result">
        <h2>Congratulations!!!</h2>
        <h3>You can now view your answer</h3>
        <div className="flex-right">
            <button onClick={createSessionAnswer}>
              {"Submit & View Answers"}
            </button>
        </div>
      </div>
    )}    
  </div>
  </center>

  )
}

export default AnswerQuestionnaire;