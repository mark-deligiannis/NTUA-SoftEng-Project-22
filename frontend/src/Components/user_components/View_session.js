import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const SESSION_URL = "http://localhost:9103/intelliq_api/getsessionanswers/";

function ViewSession() {
    const [state, setState] = useState({
        ans: []
    })

    const params = useParams()
    //console.log(params)

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
      
          fetch(SESSION_URL + params.id + '/' + params.session, requestOptions)
            .then(res => res.json())
            //.then(res => console.log(res))
            .then(data => setState({ans: data.answers}))
          
    }, [])

    const table = () => {
        console.log("hello");
            const data = new Array(state.ans.length)    // a new array with the size (rows) of reply array of objects size
            for (var i=0; i<state.ans.length; i++) data[i] = new Array(2);  // columns of it
            for (i=0; i<state.ans.length; i++) {
                data[i][0] = state.ans[i].qID;
                data[i][1] = state.ans[i].ans;
            }
            return (
                <div id="table-responsive">
                    <table>
                        <thead id="session">
                            <tr>
                                <th><h3><b>Question ID</b></h3></th>
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

// <div>
//             <h2> Your Answers </h2>

//             <header className="jumbotron" id="questionnaires">
// 					{table()}
// 			</header>
                
//             <div className="buttons">
//                 <Link to={"/User"}> <button className="button" >Back to home</button></Link>
//             </div>
//         </div>
