import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
const QUESTIONNAIRE_URL = "http://localhost:9103/intelliq_api/questionnaire/";
const QUESTION_URL = "http://localhost:9103/intelliq_api/question/";

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
      ansTXT: null
    }
  ])

  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  
  const params = useParams()

  const [qTitle, setTitle] = useState('')
  
  const [qStart, setStart] = useState('TRUE') 
  
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

    // fetch(QUESTION_URL + params.id + '/' + state.nextQuestion, requestOptions)
    //   .then(res => res.json())
    //   .then(data => setQuestion({
    //       qID: data.qID,
    //       qtext: data.qtext,
    //       required: data.required,
    //       type: data.type,
    //       options: data.options
    //     }))
  }, [])
  
  
  const showQuestion = (quest) => {
    console.log("fuck")
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

    const onClickNext = () => {
    if (question.required === 'FALSE' && selectedAnswerIndex === null){
      console.log(question.options[0])
        setState({nextQuestion: question.options[0].nextqID})
        showQuestion(question.options[0].nextqID)
    }
    else {
      if(question.qID !== ''){
        console.log("geia")
        setAnswer([
            ...answer,
            {
              qID: question.qID,
              optID: selectedAnswerIndex,
              ans: null
            }
          ])
      }
      setSelectedAnswerIndex(null)
      showQuestion(state.nextQuestion)
    }
  }


  return (
  <div>
    <h2> {qTitle} </h2>
    <div className="quiz-container">
    <h2>{question.qtext}</h2>
    <ul>
      {question.options.map((option) => (
        <li
          onClick={() => onAnswerSelected(option)}
          key={option.opttxt}
          className={
            selectedAnswerIndex === option.optID ? 'selected-answer' : null
          }>
          {option.opttxt}
        </li>
      ))}
    </ul>
    <div className="flex-right">
      <button onClick={onClickNext} disabled={selectedAnswerIndex === null && question.required === 'TRUE'}>
        {qStart === 'TRUE' ? 'Start' : state.nextQuestion === '-' ? 'Finish' : 'Next'}
      </button>
    </div>
  </div>
  </div>

  )
}

//{state.nextQuestion === '-' ? 'Finish' : 'Next'}
export default AnswerQuestionnaire;