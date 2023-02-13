import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const SESSION_URL = "http://localhost:9103/intelliq_api/getsessionanswers/";
const QUESTION_URL = "http://localhost:9103/intelliq_api/question/";

function ViewSession() {
    const [state, setState] = useState({
        ans: [],
        index: -1
    })

    const [question, setQuestion] = useState([
        {
            qID: '',
            qtext: '',
            options: []
        }
    ]);

    const [answer,setAnswer] = useState([]);

    const params = useParams()

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
      
          fetch(SESSION_URL + params.id + '/' + params.session, requestOptions)
            .then(res => res.json())
            .then(data => setState({ans: data.answers, index: 0}))
          
    }, [])

    useEffect(() => {
        if (state.index >= 0) {
            console.log(state)
            if(state.index < state.ans.length) {
                var quest = state.ans[state.index].qID
                console.log(state.ans)

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
                        options: data.options
                        }))
            }
        }
    }, [state])

    useEffect(() => {
        console.log(question)
        if (state.index >= 0) {
            if (question.options[0].opttxt === "<open string>") {
                setAnswer([
                    ...answer,
                    {
                    qtext: question.qtext,
                    ansTXT: state.ans[state.index].ans
                    }
                ]);
            }
            else {
                for (var j=0; j<question.options.length; j++) {
                    if (question.options[j].optID === state.ans[state.index].ans) {
                        setAnswer([
                            ...answer,
                            {
                                qtext: question.qtext,
                                ansTXT: question.options[j].opttxt
                            }
                        ])
                    }
                }
            }
        }
        var s = state.ans
        setState({ans: s, index: state.index+1})
    }, [question])


    const table = () => {
        console.log("Building table...");
        console.log(answer);

        const data = new Array(answer.length)    // a new array with the size (rows) of reply array of objects size
        for (var i=0; i<answer.length; i++) data[i] = new Array(2);  // columns of it
        for (i=0; i<answer.length; i++) {
            
            data[i][0] = answer[i].qtext;
            data[i][1] = answer[i].ansTXT;
        }
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
                                <tr>
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
            <header className="jumbotron" id="session">
                {table()}
            </header>
            <div className="buttons">
                <Link to={"/User"}> <button className="button">Back to home</button></Link>
            </div>
            <div>
                <h2> Your Answers </h2>
            </div>
		</div>
    )
}

export default ViewSession;