import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
const QUESTIONNAIRE_URL = "http://localhost:9103/intelliq_api/questionnaire/";
const QUESTION_URL = "http://localhost:9103/intelliq_api/question/";
const ANSWER_URL = "http://localhost:9103/intelliq_api/doanswer/";
const SESSION_URL = "http://localhost:9103/intelliq_api/getsessionanswers/";

// GAMW THN PSYXH MOY!!!! DO SAME 

function AnswerQuestionnaire() {
  const [state, setState] = useState({
    nextQuestion: null
  })
  
  const [question, setQuestion] = useState({
    qID: '',
    qtext: '',
    required: '',
    type: '',
    options: []
  })

  const [answer, setAnswer] = useState([
    {
      qID: '',
      optID: '',
      ansTXT: ''
    }
  ])

  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  
  const params = useParams()

  const [qTitle, setTitle] = useState('')
  
  const [qStart, setStart] = useState('TRUE') 
  
  const [qFinish, setFinish] = useState('FALSE') 

  const [inputValue, setInputValue] = useState('');

  const [session, setSession] = useState('');
  
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
  
  
  const showQuestion = (quest) => {
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
    

  const onAnswerSelected = (option) => {
    setSelectedAnswerIndex(option.optID)
    setState({nextQuestion: option.nextqID})
  }

  const generateRandomString = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomStringArray = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]);
    setSession(randomStringArray.join(''));
  };

  // CREATE SESSION ANSWER
  const createSessionAnswer = () => {
    console.log(answer)
    console.log(session)
    
    for (var i = 1; i < answer.length; i++ ) {
      var ans = answer[i]
      console.log(ans)
      const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'answer='+ ans.ansTXT
      }

      fetch(ANSWER_URL + params.id + '/' + ans.qID + '/' + session + '/' + ans.optID, requestOptions)
        .catch(error => {console.error("Error",error);});
    }

    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }

    fetch(SESSION_URL + params.id + '/' + session, requestOptions)
      .then(res => console.log(res.json()))
    
  }
  

  const onClickNext = () => {
    if (question.required === 'FALSE' && selectedAnswerIndex === null){
      console.log("question.options[0]")
      setState({nextQuestion: question.options[0].nextqID})
      if (state.nextQuestion !== '-') {
        showQuestion(question.options[0].nextqID)
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
    }
    if (state.nextQuestion === '-') {
      setFinish('TRUE')
    }
    else {
      showQuestion(state.nextQuestion)
    }
  }

  const handleInputChange = (event, option) => {
    setSelectedAnswerIndex(option.optID);
    setState({nextQuestion: option.nextqID});
    setInputValue(event.target.value);
  };


  return (
  <div>
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
              {"View Answers"}
            </button>
        </div>
      </div>
    )}    
  </div>
  </div>

  )
}

export default AnswerQuestionnaire;