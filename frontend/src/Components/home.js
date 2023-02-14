import React from "react";
import { Link } from 'react-router-dom';

/*
  Used as a Homepage, only has 2 buttons that lead
  to either the User side of the Intelliq app or the
  Administrator side.
*/
export default function Home() {
    
    return (
      <center>
        <h1>IntelliQ</h1>
        <h2>Our questions, your answers</h2>
        <h2>Log in:</h2>
        <div className="buttons">
          <Link to={"/User"}>
            <button className="button" >User</button>
          </Link>
          <Link to={"/Admin"}>
            <button className="button" >Administrator</button>
          </Link>
          
        </div>
      </center>
  );
}