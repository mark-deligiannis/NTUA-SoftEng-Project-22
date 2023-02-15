import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import './Answer_questionnaire.css';
const QUESTIONNAIRE_URL = "http://localhost:9103/intelliq_api/questionnaire/";
const QUESTION_URL = "http://localhost:9103/intelliq_api/question/";
const ANSWER_URL = "http://localhost:9103/intelliq_api/doanswer/";




function AnswerQuestionnaire() {
  const [state, setState] = useState({    // State that holds the the next question qid
    nextQuestion: null
  })
  
  const [question, setQuestion] = useState({ // State that represents the current question object
    qID: '',
    qtext: '',
    required: '',
    type: '',
    options: []
  })

  const [answer, setAnswer] = useState([ // List where user's answers will progressively be stored
    {
      qID: '',
      optID: '',
      ansTXT: ''
    }
  ])

  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null) // Index to store the current selected option (before clicking next)
  
  const params = useParams()  // The URL parameters (Questionnaire ID)

  const [qTitle, setTitle] = useState('') // Questionnaire Title
  
  const [qStart, setStart] = useState('TRUE')  // Boolean state to indicate if the quiz is starting
  
  const [qFinish, setFinish] = useState('FALSE') // Boolean state to indicate if the quiz is to be finished (user reaches final question)

  const [inputValue, setInputValue] = useState(''); // state that holds input text for open string questions

  const [session, setSession] = useState(''); // State that holds the randomly created session number
  
  let navigate = useNavigate();
  
  useEffect(() => { // This method fetches the questionnaire, computes session number and sets first question and title
    
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
  
  
  const showQuestion = (quest) => { // This method fetches a question based on question id and updates the corresponding state
    console.log(inputValue)
    setStart('FALSE')
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }

    fetch(QUESTION_URL + params.id + '/' + quest, requestOptions)
      .then(res => res.json())
      .then(data => setQuestion({
          qID: data.qID,
          qtext: data.qtext,
          required: data.required,
          type: data.type,
          options: data.options
        }))
  }
    

  const onAnswerSelected = (option) => { // This method updates next question state after clicking the button "Next"
    setSelectedAnswerIndex(option.optID)
    setState({nextQuestion: option.nextqID})
  }

  const generateRandomString = () => { // This method creates a 4 character random string and updates session
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomStringArray = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]);
    setSession(randomStringArray.join(''));
  };


  // CREATE SESSION ANSWER
  // This method is called after clicking button "View Answers" and converts each answer into x-www-form-urlencoded form
  // Then it POSTS each answer to the database and redirects to view session pags
  async function createSessionAnswer() { 
    console.log(answer)
    console.log(session)
    
    var i = 1
    var flag = 1
    for (i = 1; i < answer.length; i++ ) {
      var ans = answer[i]
      console.log(ans)
      const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'answer='+ ans.ansTXT
      }

      await fetch(ANSWER_URL + params.id + '/' + ans.qID + '/' + session + '/' + ans.optID, requestOptions)
        .then(res => {console.log("success",res);flag++})
        .catch(error => {console.error("Error",error);});
    }
    console.log(flag)
    if (flag===answer.length){ 
      console.log(i)
      let path = session;
      navigate(path);
    }
  }
  

  const onClickNext = () => { // This method handles questionnaire behaviour after clicking next
    if (question.required === 'FALSE' && selectedAnswerIndex === null){
      console.log("Clicked next")
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
        console.log("geia")
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

  const handleInputChange = (event, option) => { //This method handles text input changes in the given field
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
              : <div>
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