import React, { useState, useEffect } from "react";
import { Route, Routes, useParams } from 'react-router-dom';
const QUESTIONNAIRE_URL = "http://localhost:9103/intelliq_api/questionnaire/";
const QUESTION_URL = "http://localhost:9103/intelliq_api/question/";

// GAMW THN PSYXH MOY!!!! DO SAME 

function AnswerQuestionnaire() {
  const [state, setState] = useState({
    title: '',
    nextQuestion: ''
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
  
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }

    fetch(QUESTIONNAIRE_URL + params.id, requestOptions)
      .then(res => res.json())
      //.then(res => console.log(res))
      .then(data => setState({
          title: data.questionnaireTitle,
          nextQuestion: data.questions[0].qID
        }))

    fetch(QUESTION_URL + params.id + '/' + state.nextQuestion, requestOptions)
      .then(res => res.json())
      //.then(res => console.log(res))
      .then(data => setQuestion({
          qID: data.qID,
          qtext: data.qtext,
          required: data.required,
          type: data.type,
          options: data.options
        }))
  }, [])
  
  
   const showQuestion = () => {
    const requestOptions = {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }

    fetch(QUESTION_URL + params.id + '/' + state.nextQuestion, requestOptions)
      .then(res => res.json())
      //.then(res => console.log(res))
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
    // again reset the selectedAnwerIndex, so it won't effect next question
    setSelectedAnswerIndex(null)
    setAnswer([
      ...answer,
      {
        qID: question.qID,
        optID: selectedAnswerIndex,
        ans: null
      }
    ])
    showQuestion()
  }

  return (
  <div>
    <h2> {state.title} </h2>
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
        {state.nextQuestion === '-' ? 'Finish' : 'Next'}
      </button>
    </div>
  </div>
  </div>

  )
}

export default AnswerQuestionnaire;